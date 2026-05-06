import { Box, Button, HStack, IconButton, Popover, Stack, Text, Checkbox, Span } from "@chakra-ui/react";
import { useMemo, useState, memo } from "react";
import { LuChevronDown, LuChevronRight, LuFile, LuFolder, LuSearch } from "react-icons/lu";

function CategoryView({ categories = [], setSelectedCategory }) {
    const [checkedIds, setCheckedIds] = useState([]);
    const [openIds, setOpenIds] = useState([]);

    const tree = useMemo(() => {
        const map = {};
        const roots = [];

        categories.forEach(cat => {
            map[cat.category_code] = { ...cat, children: [] };
        });

        categories.forEach(cat => {
            const node = map[cat.category_code];
            const pid = cat.parent_code !== undefined ? cat.parent_code : null;

            if (pid === null || pid === undefined) {
                roots.push(node);
            } else if (map[pid]) {
                map[pid].children.push(node);
            }
        });
        return roots;
    }, [categories]);

    const toggleOpen = (category_code) => {
        setOpenIds(prev =>
            prev.includes(category_code)
                ? prev.filter(oid => oid !== category_code)
                : [...prev, category_code]
        );
    };

    const toggleCheck = (category) => {
        const isChecked = !checkedIds.includes(category.category_code);
        const newCheckedIds = isChecked
            ? [...checkedIds, category.category_code]
            : checkedIds.filter(category_code => category_code !== category.category_code);

        setCheckedIds(newCheckedIds);

        // Update Parent
        setSelectedCategory(prev => {
            if (isChecked) {
                // Prevent duplicates
                if (prev.some(p => p.category_code === category.category_code)) return prev;
                return [...prev, category];
            } else {
                return prev.filter(p => p.category_code !== category.category_code);
            }
        });
    };

    const CategoryTreeItem = ({ item, depth = 0 }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isChecked = checkedIds.includes(item.category_code);
        const isOpen = openIds.includes(item.category_code);

        return (
            <Stack gap={0}>
                <HStack p={1.5} pl={depth * 4 + 2} _hover={{ bg: "gray.50" }} borderRadius="md" spacing={2}>
                    <IconButton
                        size="xs"
                        variant="ghost"
                        visibility={hasChildren ? "visible" : "hidden"}
                        onClick={(e) => toggleOpen(item.category_code)}
                        minW="4" h="4"
                    >
                        {isOpen ? <LuChevronDown /> : <LuChevronRight />}
                    </IconButton>

                    <Text 
                        fontSize="sm" 
                        cursor="pointer" 
                        color={isChecked ? "blue.600" : "inherit"}
                        fontWeight={isChecked ? "bold" : "normal"}
                        onClick={() => toggleCheck(item)}
                    >
                        {item.name}<Span color="red.500" fontSize='xs'>{!item.is_visible && `(미노출)`}</Span>
                    </Text>
                </HStack>

                {isOpen && hasChildren && (
                    <Stack gap={0} borderLeftWidth="1px" borderLeftColor="gray.100" ml={4}>
                        {item.children.map(child => (
                            <CategoryTreeItem key={child.category_code} item={child} depth={depth + 1} />
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
            <Popover.Positioner>
                <Popover.Content width="300px">
                    <Popover.Arrow />
                    <Popover.Body p={0}>
                        <Box p={3} borderBottomWidth="1px" bg="gray.50">
                            <Text fontWeight="bold" fontSize="sm">카테고리 선택</Text>
                        </Box>
                        <Box maxH="300px" overflowY="auto" p={2}>
                            <Stack gap={1}>
                                {tree.map(category => (
                                    <CategoryTreeItem key={category.category_code} item={category} />
                                ))}
                            </Stack>
                        </Box>
                    </Popover.Body>
                </Popover.Content>
            </Popover.Positioner>

        </Popover.Root>
    )
}

export default memo(CategoryView);