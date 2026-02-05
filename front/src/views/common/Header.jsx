import { Avatar, Button, Circle, CloseButton, Flex, Float, Group, HStack, Icon, Image, Input, InputGroup, Link, Menu, Stack, Text } from "@chakra-ui/react";
import { LuAlignJustify, LuBell, LuSearch, LuShoppingCart, LuUserRound } from "react-icons/lu";
import { useAuth } from "../../utils/useAuth";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/api";
import Category from "../shop/common/Category";
import { useLocation } from "react-router-dom";

function Header() {
    const [keyword, setKeyword] = useState('');
    const headerLineStyle = { p: '15px', px: { base: '5px', md: 'layoutX' }, width: '100%', borderBottom: '1px solid #e5e5e5' };
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axiosInstance.get('/shop/product/category');
            setCategories(response.data);
        };
        fetchCategories();
    }, []);

    const keywordClearElement = keyword ? (<CloseButton size="xs" onClick={() => setKeyword('')} rounded="full" />) : null;
    const onSearchSubmit = (e) => {
        e.preventDefault();
        console.log(keyword);
    }

    return (
        <Stack gap="0">
            <Flex {...headerLineStyle} justifyContent="space-between">
                <HStack gap="20">
                    <HStack gap="2">
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <Button variant="ghost" display={{ base: 'block', md: 'none' }}>
                                    <Icon size="lg"><LuAlignJustify /></Icon>
                                </Button>
                            </Menu.Trigger>
                            <Menu.Positioner>
                                <Menu.Content>
                                    <Stack gap="2">
                                        <Menu.Item><Link href="/categorys/12345">카테고리 1</Link></Menu.Item>
                                        <Menu.Item>카테고리 2</Menu.Item>
                                        <Menu.Item>카테고리 3</Menu.Item>
                                        <Menu.Item>카테고리 4</Menu.Item>
                                    </Stack>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Menu.Root>
                        <Link href="/"><Image src="/resources/img/logo/logo.svg" alt="logo" width="100px" /></Link>
                    </HStack>
                    <HStack gap="12" display={{ base: 'none', md: 'flex' }}>
                        <Link href="/review"><Text fontSize="lg" fontWeight="medium">REVIEW</Text></Link>
                        <Link href="/"><Text fontSize="lg" fontWeight="medium">SHOPPING</Text></Link>
                    </HStack>
                </HStack>
                <HStack gap="6">
                    <form onSubmit={onSearchSubmit}>
                        <InputGroup startElement={<Icon size="md"><LuSearch /></Icon>} endElement={keywordClearElement}>
                            <Input rounded="full" width={{ base: "5", md: 'auto' }} value={keyword} onChange={(e) => setKeyword(e.currentTarget.value)} />
                        </InputGroup>
                    </form>
                    <Group>
                        <Link href="/cart">
                            <Icon size="md"><LuShoppingCart /></Icon>
                            <Float><Circle size="4" bg="red" color="white" fontSize="xs">3</Circle></Float>
                        </Link>
                    </Group>

                    {!user ? (
                        <HStack gap="6">
                            <Link href="/login" fontSize="sm">로그인</Link>
                            <Link href="/join" fontSize="sm">회원가입</Link>
                        </HStack>
                    ) : (
                        <>
                            <Icon size="md"><LuBell /></Icon>
                            <Avatar.Root><LuUserRound /></Avatar.Root>
                        </>
                    )}

                </HStack>
            </Flex>
            {location.pathname.includes('/') && <Category categories={categories} />}
        </Stack>
    )
}

export default Header;