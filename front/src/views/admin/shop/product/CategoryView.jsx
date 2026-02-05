import { Box, Button, HStack, IconButton, Popover, Stack, Text, Checkbox, Span } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuChevronDown, LuChevronRight, LuFile, LuFolder, LuSearch } from "react-icons/lu";

function CategoryView({ categories = [], setSelectedCategory }) {
    const [checkedIds, setCheckedIds] = useState([]);
    const [openIds, setOpenIds] = useState([]);

    const tree = useMemo(() => {
        const map = {};
        const roots = [];
        // Deep copy to avoid mutating props
        categories.forEach(cat => {
            map[cat.id] = { ...cat, children: [] };
        });
        categories.forEach(cat => {
            const node = map[cat.id];
            const pid = cat.parent_id !== undefined ? cat.parent_id : cat.parentId;

            if (pid === null || pid === undefined) {
                roots.push(node);
            } else if (map[pid]) {
                map[pid].children.push(node);
            }
        });
        return roots;
    }, [categories]);

    const toggleOpen = (id) => {
        setOpenIds(prev =>
            prev.includes(id)
                ? prev.filter(oid => oid !== id)
                : [...prev, id]
        );
    };

    const handleCheck = (e, category) => {
        e.stopPropagation(); // Stop event bubbling
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
        const isOpen = openIds.includes(item.id);

        return (
            <Stack gap={0}>
                <HStack p={1.5} pl={depth * 4 + 2} _hover={{ bg: "gray.50" }} borderRadius="md" spacing={2}>
                    <IconButton
                        size="xs"
                        variant="ghost"
                        visibility={hasChildren ? "visible" : "hidden"}
                        onClick={(e) => toggleOpen(item.id)}
                        minW="4" h="4"
                    >
                        {isOpen ? <LuChevronDown /> : <LuChevronRight />}
                    </IconButton>

                    <Box color="gray.500">{hasChildren ? <LuFolder /> : <LuFile />}</Box>

                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleCheck(e, item)}
                        style={{ cursor: 'pointer' }}
                    />

                    <Text fontSize="sm" cursor="default" onClick={() => toggleOpen(item.id)}>
                        {item.name}<Span color="red.500" fontSize='xs'>{!item.is_visible && `(미노출)`}</Span>
                    </Text>
                </HStack>

                {isOpen && hasChildren && (
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
                            {tree.map(category => (
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