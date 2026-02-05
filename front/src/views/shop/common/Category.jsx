import { Box, Button, Collapsible, Drawer, HStack, Icon, IconButton, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { LuAlignJustify, LuChevronDown, LuChevronRight } from "react-icons/lu";

function CategoryItem({ category }) {
    const { open, onToggle } = useDisclosure();
    const hasChildren = category.children && category.children.length > 0;

    return (
        <Stack gap="2">
            <HStack gap="2" width="full">
                {hasChildren ? (
                    <IconButton size="xs" variant="ghost" onClick={(e) => { e.preventDefault(); onToggle(); }}>
                        <Icon size="sm">
                            {open ? <LuChevronDown /> : <LuChevronRight />}
                        </Icon>
                    </IconButton>
                ) : (<Box width="6" />)}

                <Link href={`/categorys/${category.id}`} flex="1">
                    <Text fontSize="md" fontWeight="medium">{category.name}</Text>
                </Link>
            </HStack>

            {hasChildren && (
                <Collapsible.Root open={open}>
                    <Collapsible.Content>
                        <Stack pl="6" gap="1" borderLeft="1px solid" borderColor="gray.100" ml="3">
                            {category.children.map(child => (
                                <CategoryItem key={child.id} category={child} />
                            ))}
                        </Stack>
                    </Collapsible.Content>
                </Collapsible.Root>
            )}
        </Stack>
    );
}

function Category({ categories = [] }) {
    const headerLineStyle = { p: '15px', px: { base: '5px', md: 'layoutX' }, width: '100%', borderBottom: '1px solid #e5e5e5' };

    const buildCategoryTree = (categories) => {
        const categoryMap = {};
        const tree = [];

        categories.forEach(cat => { categoryMap[cat.id] = { ...cat, children: [] } });

        categories.forEach(cat => {
            if (cat.is_visible === 0) return;
            if (cat.parent_id === null) {
                tree.push(categoryMap[cat.id]);
            } else {
                if (categoryMap[cat.parent_id]) {
                    categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
                }
            }
        });

        return tree;
    };

    const categoryTree = buildCategoryTree(categories);

    return (
        <HStack gap="16" {...headerLineStyle} display={{ md: 'flex', base: 'none' }}>

            <Drawer.Root placement="start">
                <Drawer.Trigger asChild>
                    <IconButton variant="ghost"><LuAlignJustify /></IconButton>
                </Drawer.Trigger>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>카테고리</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <Stack gap="2">
                                {categoryTree.map(category => (
                                    <CategoryItem key={category.id} category={category} />
                                ))}
                            </Stack>
                        </Drawer.Body>
                        <Drawer.CloseTrigger />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>

            <HStack gap="12">
                {categories.filter(c => c.is_visible === 1 && c.parent_id === null).map((category) => (
                    <Link key={category.id} href={`/categorys/${category.id}`}>
                        <Text fontSize="md" fontWeight="medium">{category.name}</Text>
                    </Link>
                ))}
            </HStack>
        </HStack>
    )
}

export default Category;