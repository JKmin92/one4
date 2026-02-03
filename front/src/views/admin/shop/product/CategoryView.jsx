import { Box, Button, HStack, IconButton, Popover, Stack, Text, Checkbox } from "@chakra-ui/react";
import { useState } from "react";
import { LuChevronDown, LuChevronRight, LuFile, LuFolder, LuSearch } from "react-icons/lu";

// Mock Data (Matched with Category.jsx)
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

function CategoryView({ setSelectedCategory }) {
    const [categories, setCategories] = useState(initialCategories);
    const [checkedIds, setCheckedIds] = useState([]);

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

    const handleCheck = (e, category) => {
        const isChecked = e.target.checked;
        const newCheckedIds = isChecked
            ? [...checkedIds, category.id]
            : checkedIds.filter(id => id !== category.id);

        setCheckedIds(newCheckedIds);

        // Update Parent
        setSelectedCategory(prev => {
            if (isChecked) {
                // Prevent duplicates
                if (prev.some(p => p.id === category.id)) return prev;
                return [...prev, category];
            } else {
                return prev.filter(p => p.id !== category.id);
            }
        });
    };

    const CategoryTreeItem = ({ item, depth = 0 }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isChecked = checkedIds.includes(item.id);

        return (
            <Stack gap={0}>
                <HStack
                    p={1.5}
                    pl={depth * 4 + 2}
                    _hover={{ bg: "gray.50" }}
                    borderRadius="md"
                    spacing={2}
                >
                    <IconButton
                        size="xs"
                        variant="ghost"
                        visibility={hasChildren ? "visible" : "hidden"}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleOpen(item.id);
                        }}
                        aria-label="Toggle Expand"
                        minW="4" h="4"
                    >
                        {item.isOpen ? <LuChevronDown /> : <LuChevronRight />}
                    </IconButton>

                    <Box color="gray.500">
                        {hasChildren ? <LuFolder /> : <LuFile />}
                    </Box>

                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleCheck(e, item)}
                        style={{ cursor: 'pointer' }}
                    />

                    <Text fontSize="sm" cursor="default" onClick={() => toggleOpen(item.id)}>
                        {item.name}
                    </Text>
                </HStack>

                {item.isOpen && hasChildren && (
                    <Stack gap={0} borderLeftWidth="1px" borderLeftColor="gray.100" ml={4}>
                        {item.children.map(child => (
                            <CategoryTreeItem key={child.id} item={child} depth={depth + 1} />
                        ))}
                    </Stack>
                )}
            </Stack>
        );
    };

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button variant="outline" size="sm" w="full" justifyContent="flex-start" color="gray.600">
                    <LuSearch /> 카테고리 찾기
                </Button>
            </Popover.Trigger>
            <Popover.Content width="300px">
                <Popover.Arrow />
                <Popover.Body p={0}>
                    <Box p={3} borderBottomWidth="1px" bg="gray.50">
                        <Text fontWeight="bold" fontSize="sm">카테고리 선택</Text>
                    </Box>
                    <Box maxH="300px" overflowY="auto" p={2}>
                        <Stack gap={1}>
                            {categories.map(category => (
                                <CategoryTreeItem key={category.id} item={category} />
                            ))}
                        </Stack>
                    </Box>
                </Popover.Body>
            </Popover.Content>
        </Popover.Root>
    )
}

export default CategoryView;