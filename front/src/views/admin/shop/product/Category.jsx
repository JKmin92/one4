import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, HStack, IconButton, Stack, Text, Input } from "@chakra-ui/react";
import { LuPlus, LuTrash, LuChevronRight, LuChevronDown, LuArrowUp, LuArrowDown, LuFolder, LuFile } from "react-icons/lu";

// Mock Data
const initialCategories = [
    {
        id: '1',
        name: '의류',
        isVisible: true,
        isOpen: true,
        children: [
            { id: '1-1', name: '남성', isVisible: true, isOpen: false, children: [] },
            { id: '1-2', name: '여성', isVisible: true, isOpen: false, children: [] },
        ]
    },
    {
        id: '2',
        name: '전자제품',
        isVisible: true,
        isOpen: false,
        children: []
    }
];

function Category() {
    const [categories, setCategories] = useState(initialCategories);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

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

    const selectedCategory = selectedCategoryId ? findCategory(categories, selectedCategoryId) : null;

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

    const addCategory = (parentId = null) => {
        const newCategory = {
            id: Date.now().toString(),
            name: '새 카테고리',
            isVisible: true,
            isOpen: true,
            children: []
        };

        if (parentId === null) {
            setCategories([...categories, newCategory]);
        } else {
            const addRecursive = (items) => {
                return items.map(item => {
                    if (item.id === parentId) {
                        return { ...item, isOpen: true, children: [...item.children, newCategory] };
                    }
                    if (item.children) {
                        return { ...item, children: addRecursive(item.children) };
                    }
                    return item;
                });
            };
            setCategories(addRecursive(categories));
        }
    };

    // Delete Category
    const deleteCategory = (id) => {
        const deleteRecursive = (items) => {
            return items.filter(item => item.id !== id).map(item => {
                if (item.children) {
                    return { ...item, children: deleteRecursive(item.children) };
                }
                return item;
            });
        };
        setCategories(deleteRecursive(categories));
        if (selectedCategoryId === id) setSelectedCategoryId(null);
    };

    // Move Category Up/Down
    const moveCategory = (id, direction) => {
        const moveRecursive = (items) => {
            const index = items.findIndex(item => item.id === id);
            if (index > -1) {
                if (direction === 'up' && index > 0) {
                    const newItems = [...items];
                    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
                    return newItems;
                }
                if (direction === 'down' && index < items.length - 1) {
                    const newItems = [...items];
                    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
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
        setCategories(moveRecursive(categories));
    };

    const updateCategory = (id, updates) => {
        const updateRecursive = (items) => {
            return items.map(item => {
                if (item.id === id) {
                    return { ...item, ...updates };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };
        setCategories(updateRecursive(categories));
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
                        {!item.isVisible && <Text fontSize="xs" color="red.500">(비노출)</Text>}
                    </HStack>

                    <HStack opacity={isSelected ? 1 : 0} _groupHover={{ opacity: 1 }}>
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
                        {selectedCategory ? (
                            <Stack gap={6} maxW="md">
                                <Box>
                                    <Text mb={2} fontWeight="medium" fontSize="sm">카테고리 명</Text>
                                    <Input
                                        value={selectedCategory.name}
                                        onChange={(e) => updateCategory(selectedCategory.id, { name: e.target.value })}
                                    />
                                </Box>

                                <Box display="flex" alignItems="center">
                                    <Text mb={0} mr={3} fontWeight="medium" fontSize="sm">
                                        노출 여부
                                    </Text>
                                    <input
                                        type="checkbox"
                                        id="is-visible"
                                        checked={selectedCategory.isVisible}
                                        onChange={(e) => updateCategory(selectedCategory.id, { isVisible: e.target.checked })}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                </Box>

                                <Box p={4} bg="blue.50" borderRadius="md">
                                    <Text fontSize="sm" color="blue.600">
                                        💡 팁: 드래그 앤 드롭 대신 화살표 버튼을 사용하여 순서를 변경할 수 있습니다.
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