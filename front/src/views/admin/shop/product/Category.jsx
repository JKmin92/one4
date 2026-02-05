import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, HStack, IconButton, Stack, Text, Input, Image, Tabs, Checkbox } from "@chakra-ui/react";
import { LuPlus, LuTrash, LuChevronRight, LuChevronDown, LuArrowUp, LuArrowDown, LuFolder, LuFile, LuSave } from "react-icons/lu";
import axiosInstance from '../../../../utils/api';
import { toaster } from '../../../../components/ui/toaster';


function Category() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null); // Local state for editing

    // Helper: Build Tree from Flat List
    const buildCategoryTree = (flatList) => {
        const map = {};
        const tree = [];
        const list = flatList.map(item => ({ ...item, children: [] }));

        list.forEach((item) => {
            map[item.id] = item;
        });

        list.forEach((item) => {
            const pid = item.parent_id || item.parentId; // Check both camel and snake case
            if (pid && map[pid]) {
                map[pid].children.push(item);
            } else {
                tree.push(item);
            }
        });

        // Sort by sort_order
        const sortRecursive = (items) => {
            items.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            items.forEach(item => {
                if (item.children.length > 0) sortRecursive(item.children);
            });
        };
        sortRecursive(tree);

        return tree;
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/admin/product/category');
            if (response.data) {
                const tree = buildCategoryTree(response.data);
                setCategories(tree);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const findCategory = (items, id) => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findCategory(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // When selection changes, update editingCategory
    useEffect(() => {
        if (selectedCategoryId) {
            const category = findCategory(categories, selectedCategoryId);
            setEditingCategory(category ? { ...category } : null);
        } else {
            setEditingCategory(null);
        }
    }, [selectedCategoryId, categories]);

    const toggleOpen = (id) => {
        const toggleRecursive = (items) => {
            return items.map(item => {
                if (item.id === id) {
                    return { ...item, isOpen: !item.isOpen };
                }
                if (item.children) {
                    return { ...item, children: toggleRecursive(item.children) };
                }
                return item;
            });
        };
        setCategories(toggleRecursive(categories));
    };

    const addCategory = async (parentId = null) => {
        // Calculate Sort Order
        let siblings = categories;
        if (parentId) {
            const parent = findCategory(categories, parentId);
            siblings = parent ? (parent.children || []) : [];
        }
        const maxOrder = siblings.reduce((max, item) => Math.max(max, item.sort_order || 0), 0);
        const nextOrder = maxOrder + 1;

        const newCategoryDef = {
            name: '새 카테고리',
            is_visible: true,
            isOpen: true,
            sort_order: nextOrder,
            children: [],
            imagePc: null,
            imageTablet: null,
            imageMobile: null,
            parentId: parentId
        };

        try {
            // Server generates ID
            const response = await axiosInstance.post('/admin/product/category', newCategoryDef);
            const createdCategory = { ...newCategoryDef, ...response.data }; // Ensure ID is included

            if (parentId === null) {
                setCategories(prev => [...prev, createdCategory]);
            } else {
                const addRecursive = (items) => {
                    return items.map(item => {
                        if (item.id === parentId) {
                            return { ...item, isOpen: true, children: [...(item.children || []), createdCategory] };
                        }
                        if (item.children) {
                            return { ...item, children: addRecursive(item.children) };
                        }
                        return item;
                    });
                };
                setCategories(prev => addRecursive(prev));
            }
            // Auto-select the new category
            setSelectedCategoryId(createdCategory.id);
        } catch (error) {
            console.error("Failed to add category:", error);
            toaster.create({ title: "카테고리 추가에 실패했습니다.", type: "error" });
        }
    };

    const deleteCategory = async (id) => {
        try {
            await axiosInstance.delete(`/admin/product/category/${id}`);

            const deleteRecursive = (items) => {
                return items.filter(item => item.id !== id).map(item => {
                    if (item.children) {
                        return { ...item, children: deleteRecursive(item.children) };
                    }
                    return item;
                });
            };
            setCategories(prev => deleteRecursive(prev));
            if (selectedCategoryId === id) setSelectedCategoryId(null);
        } catch (error) {
            console.error("Failed to delete category:", error);
            toaster.create({ title: "카테고리 삭제에 실패했습니다.", type: "error" });
        }
    };

    const moveCategory = (id, direction) => {
        const moveRecursive = (items) => {
            const index = items.findIndex(item => item.id === id);
            if (index > -1) {
                if (direction === 'up' && index > 0) {
                    const newItems = [...items];
                    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
                    // Update sort_order locally for immediate feedback
                    const tempOrder = newItems[index].sort_order;
                    newItems[index].sort_order = newItems[index - 1].sort_order;
                    newItems[index - 1].sort_order = tempOrder;
                    return newItems;
                }
                if (direction === 'down' && index < items.length - 1) {
                    const newItems = [...items];
                    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                    // Update sort_order locally
                    const tempOrder = newItems[index].sort_order;
                    newItems[index].sort_order = newItems[index + 1].sort_order;
                    newItems[index + 1].sort_order = tempOrder;
                    return newItems;
                }
                return items;
            }
            return items.map(item => {
                if (item.children) {
                    return { ...item, children: moveRecursive(item.children) };
                }
                return item;
            });
        };
        const newCategories = moveRecursive(categories);
        setCategories(newCategories);
        // Note: Ordering changes are not currently saved to backend automatically. 
        // Ideally should call an API to save new orders.
    };

    // Update Local State Handler
    const handleEditChange = (updates) => {
        if (editingCategory) {
            setEditingCategory(prev => ({ ...prev, ...updates }));
        }
    };

    // Save Logic
    const handleSave = async () => {
        if (!editingCategory) return;
        console.log(editingCategory);
        try {
            await axiosInstance.put('/admin/product/category', editingCategory);

            // Update the main categories state to reflect changes
            const updateRecursive = (items) => {
                return items.map(item => {
                    if (item.id === editingCategory.id) {
                        // Merge edits, preserve children
                        return { ...item, ...editingCategory, children: item.children };
                    }
                    if (item.children) {
                        return { ...item, children: updateRecursive(item.children) };
                    }
                    return item;
                });
            };
            setCategories(prev => updateRecursive(prev));
            toaster.create({ title: "저장되었습니다.", type: 'success' });
        } catch (error) {
            console.error("Failed to update category:", error);
            toaster.create({ title: "수정에 실패했습니다.", type: 'error' });
        }
    };


    // Tree Item Component
    const CategoryItem = ({ item, depth = 0 }) => {
        const isSelected = selectedCategoryId === item.id;
        const hasChildren = item.children && item.children.length > 0;

        return (
            <Stack gap={0}>
                <HStack
                    p={2}
                    pl={depth * 4 + 2}
                    bg={isSelected ? "blue.50" : "transparent"}
                    _hover={{ bg: isSelected ? "blue.50" : "gray.50" }}
                    cursor="pointer"
                    onClick={() => setSelectedCategoryId(item.id)}
                    borderRadius="md"
                    justifyContent="space-between"
                    borderWidth="1px"
                    borderColor="transparent"
                    {...(isSelected && { borderColor: "blue.200" })}
                >
                    <HStack gap={2} flex={1}>
                        <IconButton size="xs" variant="ghost" visibility={hasChildren ? "visible" : "hidden"}
                            onClick={(e) => { e.stopPropagation(); toggleOpen(item.id); }}>
                            {item.isOpen ? <LuChevronDown /> : <LuChevronRight />}
                        </IconButton>
                        <Box color={isSelected ? "blue.500" : "gray.500"}>
                            {hasChildren ? <LuFolder /> : <LuFile />}
                        </Box>
                        <Text fontWeight={isSelected ? "bold" : "normal"}>{item.name}</Text>
                        {!item.is_visible && <Text fontSize="xs" color="red.500">(비노출)</Text>}
                    </HStack>

                    <HStack display={isSelected ? 'flex' : 'none'}>
                        <IconButton size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); addCategory(item.id); }}><LuPlus /></IconButton>
                        <IconButton size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); moveCategory(item.id, 'up'); }}><LuArrowUp /></IconButton>
                        <IconButton size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); moveCategory(item.id, 'down'); }}><LuArrowDown /></IconButton>
                        <IconButton size="xs" colorScheme="red" variant="ghost" onClick={(e) => { e.stopPropagation(); if (confirm('정말 삭제하시겠습니까?')) deleteCategory(item.id); }}><LuTrash /></IconButton>
                    </HStack>
                </HStack>

                {item.isOpen && hasChildren && (
                    <Stack gap={0} borderLeftWidth="1px" borderLeftColor="gray.100" ml={4}>
                        {item.children.map(child => (
                            <CategoryItem key={child.id} item={child} depth={depth + 1} />
                        ))}
                    </Stack>
                )}
            </Stack>
        );
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleEditChange({ [type]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const imageTypes = [
        { key: 'imagePc', label: 'PC 이미지', size: '1920x400px' },
        { key: 'imageTablet', label: '태블릿 이미지', size: '1024x300px' },
        { key: 'imageMobile', label: '모바일 이미지', size: '768x200px' },
    ];

    return (
        <Stack p="30px" px="layoutX" gap="6" height="calc(100vh - 100px)">
            <Heading size="lg">상품 분류 설정</Heading>

            <HStack alignItems="start" gap={8} h="full">
                {/* Left Panel: Tree View */}
                <Box flex={1} h="full" borderWidth="1px" borderRadius="md" overflow="hidden">
                    <Box p={4} borderBottomWidth="1px" bg="gray.50">
                        <HStack justifyContent="space-between">
                            <Heading size="sm">카테고리</Heading>
                            <Button size="xs" onClick={() => addCategory(null)}>
                                <LuPlus /> 대분류 추가
                            </Button>
                        </HStack>
                    </Box>
                    <Box overflowY="auto" p={2}>
                        <Stack gap={1}>
                            {categories.map(category => (
                                <CategoryItem key={category.id} item={category} />
                            ))}
                            {categories.length === 0 && (
                                <Text color="gray.400" textAlign="center" py={10}>
                                    카테고리가 없습니다. 대분류를 추가해주세요.
                                </Text>
                            )}
                        </Stack>
                    </Box>
                </Box>

                {/* Right Panel: Detail Editor */}
                <Box flex={1} h="full" borderWidth="1px" borderRadius="md">
                    <Box p={4} borderBottomWidth="1px" bg="gray.50">
                        <Heading size="sm">상세 설정</Heading>
                    </Box>
                    <Box p={4}>
                        {editingCategory ? (
                            <Stack gap={6} maxW="md">
                                <Box>
                                    <Text mb={2} fontWeight="medium" fontSize="sm">카테고리 명</Text>
                                    <Input
                                        value={editingCategory.name}
                                        onChange={(e) => handleEditChange({ name: e.target.value })}
                                    />
                                </Box>

                                <Box display="flex" alignItems="center">
                                    <Checkbox.Root checked={editingCategory.is_visible} onCheckedChange={(e) => handleEditChange({ is_visible: !!e.checked })}>
                                        <Checkbox.Control />
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Label>노출여부</Checkbox.Label>
                                    </Checkbox.Root>
                                </Box>

                                <Box>
                                    <Text mb={2} fontWeight="medium" fontSize="sm">카테고리 이미지</Text>
                                    <Tabs.Root defaultValue="imagePc" variant="enclosed">
                                        <Tabs.List>
                                            {imageTypes.map((type) => (
                                                <Tabs.Trigger key={type.key} value={type.key}>
                                                    {type.label}
                                                </Tabs.Trigger>
                                            ))}
                                        </Tabs.List>
                                        {imageTypes.map((type) => (
                                            <Tabs.Content key={type.key} value={type.key} p={4} borderWidth="1px" borderTopWidth="0">
                                                <Stack gap={4}>
                                                    <Box>
                                                        <Text fontSize="xs" color="gray.500" mb={2}>권장 사이즈: {type.size}</Text>
                                                        <Stack direction="row" alignItems="center" gap={4}>
                                                            {editingCategory[type.key] ? (
                                                                <Box position="relative" width="200px" height="100px" borderWidth="1px" borderRadius="md" overflow="hidden">
                                                                    <Image src={editingCategory[type.key]} alt={type.label} width="100%" height="100%" objectFit="cover" />
                                                                    <IconButton
                                                                        size="xs"
                                                                        colorScheme="red"
                                                                        position="absolute"
                                                                        top="1"
                                                                        right="1"
                                                                        icon={<LuTrash />}
                                                                        onClick={() => handleEditChange({ [type.key]: null })}
                                                                        aria-label={`Delete ${type.label}`}
                                                                    />
                                                                </Box>
                                                            ) : (
                                                                <Box width="200px" height="100px" borderWidth="1px" borderStyle="dashed" borderRadius="md" display="flex" alignItems="center" justifyContent="center" bg="gray.50" color="gray.400">
                                                                    <Text fontSize="xs">이미지 없음</Text>
                                                                </Box>
                                                            )}
                                                            <Box>
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageUpload(e, type.key)}
                                                                    p={1}
                                                                    border="none"
                                                                    fontSize="sm"
                                                                />
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            </Tabs.Content>
                                        ))}
                                    </Tabs.Root>
                                </Box>

                                <Box pt={4}>
                                    <Button colorScheme="blue" width="full" onClick={handleSave}>
                                        <LuSave /> 저장
                                    </Button>
                                </Box>

                                <Box p={4} bg="blue.50" borderRadius="md">
                                    <Text fontSize="sm" color="blue.600">
                                        💡 팁: 내용은 자동으로 저장되지 않습니다. 수정 후 반드시 [저장] 버튼을 눌러주세요.
                                    </Text>
                                </Box>
                            </Stack>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" h="full" color="gray.400">
                                <Text>왼쪽 목록에서 카테고리를 선택해주세요.</Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </HStack>
        </Stack>
    );
}

export default Category;
