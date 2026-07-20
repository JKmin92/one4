import { Box, Button, Collapsible, Drawer, HStack, Icon, IconButton, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { LuAlignJustify, LuChevronDown, LuChevronRight } from "react-icons/lu";

function CategoryItem({ category, sub = false, location = '' }) {
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
                ) : (<IconButton visibility="hidden" size="xs"><Icon size="2xs"><LuChevronDown /></Icon></IconButton>)}

                <Link href={`${location}/categorys/${category.category_code}`} flex="1">
                    <Text fontSize={!sub ? "md" : 'sm'} fontWeight="medium">{category.name}</Text>
                </Link>
            </HStack>

            {hasChildren && (
                <Collapsible.Root open={open}>
                    <Collapsible.Content >
                        <Stack gap="1" my="1" borderLeft="1px solid" borderColor="gray.100" ml="3">
                            {category.children.map(child => (
                                <CategoryItem key={child.c_num} category={child} sub={true} location={location} />
                            ))}
                        </Stack>
                    </Collapsible.Content>
                </Collapsible.Root>
            )}
        </Stack>
    );
}

function Category({ categories = [], location = '', onToggle = false }) {
    const headerLineStyle = { px: { base: '5px', md: 'layoutX' } };
    const headerLineStyle2 = !onToggle ? { p: '15px', borderBottom: '1px solid #e5e5e5', width: '100%' } : {}

    const buildCategoryTree = (categories) => {
        const categoryMap = {};
        const tree = [];

        categories.forEach(cat => { categoryMap[cat.category_code] = { ...cat, children: [] } });

        categories.forEach(cat => {
            if (cat.is_visible === 0) return;
            if (cat.parent_code === null) {
                tree.push(categoryMap[cat.category_code]);
            } else {
                if (categoryMap[cat.parent_code]) {
                    categoryMap[cat.parent_code].children.push(categoryMap[cat.category_code]);
                }
            }
        });

        return tree;
    };

    const categoryTree = buildCategoryTree(categories);
    //if (categories.length === 0) return null;

    return (
        <HStack gap="16" {...headerLineStyle} {...headerLineStyle2} display={!onToggle ? { md: 'flex', base: 'none' } : { md: 'none', base: 'flex' }}>

            <Drawer.Root placement="start">
                <Drawer.Trigger asChild>
                    <IconButton variant="ghost" rounded="full"><LuAlignJustify /></IconButton>
                </Drawer.Trigger>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title asChild>
                                <HStack gap="3" fontSize="lg">
                                    {location === '/review' ? (
                                        <>
                                            <Link href="/review" _hover={{ textDecoration: 'none' }}><Text color="main" fontWeight="bold">Review</Text></Link>
                                            <Text color="gray.300">|</Text>
                                            <Link href="/" _hover={{ textDecoration: 'none' }}><Text color="black" fontWeight="medium">Shopping</Text></Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/" _hover={{ textDecoration: 'none' }}><Text color="main" fontWeight="bold">Shopping</Text></Link>
                                            <Text color="gray.300">|</Text>
                                            <Link href="/review" _hover={{ textDecoration: 'none' }}><Text color="black" fontWeight="medium">Review</Text></Link>
                                        </>
                                    )}
                                </HStack>
                            </Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <Stack gap="2">
                                {categoryTree.map(category => (
                                    <CategoryItem key={category.c_num} category={category} location={location} />
                                ))}
                            </Stack>
                        </Drawer.Body>
                        <Drawer.CloseTrigger />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>

            {!onToggle && (
                <HStack gap="12">
                    {categories.filter(c => c.is_visible === 1 && c.parent_code === null).map((category) => (
                        <Link key={category.category_code} href={`${location}/categorys/${category.category_code}`}>
                            <Text fontSize="md" fontWeight="medium">{category.name}</Text>
                        </Link>
                    ))}
                </HStack>
            )}
        </HStack >
    )
}

export default Category;