import { Avatar, Button, Circle, CloseButton, Flex, Float, Group, HStack, Icon, Image, Input, InputGroup, Link, Menu, Stack, Text } from "@chakra-ui/react";
import { LuAlignJustify, LuBell, LuEye, LuSearch, LuShoppingCart, LuUserRound } from "react-icons/lu";
import { useAuth } from "../../utils/useAuth";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/api";
import Category from "./Category";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
    const [keyword, setKeyword] = useState('');
    const headerLineStyle = { p: '15px', px: { base: '5px', md: 'layoutX' }, width: '100%', borderBottom: '1px solid #e5e5e5' };
    const { user, logout } = useAuth();
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const [categoryLocation, setCategoryLocation] = useState('');
    const [basketCount, setBasketCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        location.pathname.includes('/review') ? setCategoryLocation('/review') : setCategoryLocation('');

        const fetchCategories = async () => {
            const response = location.pathname.includes('/review')
                ? await axiosInstance.get('/review/campaign/category')
                : location.pathname.includes('/mypage') ? null
                    : await axiosInstance.get('/shop/product/category');
            setCategories(response?.data);
        };
        fetchCategories();
    }, []);

    const keywordClearElement = keyword ? (<CloseButton size="xs" onClick={() => setKeyword('')} rounded="full" />) : null;
    const onSearchSubmit = (e) => {
        e.preventDefault();
        console.log(keyword);
    }

    useEffect(() => {
        const getBasketCount = async () => {
            if (!user) return;
            const response = await axiosInstance.get('/shop/product/basket/count');
            setBasketCount(response.data);
        }
        getBasketCount();
    }, [user]);

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
                        <Link href={location.pathname.includes('/review') ? '/review' : '/'}><Image src="/resources/img/logo/logo.svg" alt="logo" width="100px" /></Link>
                    </HStack>
                    <HStack gap="12" display={{ base: 'none', md: 'flex' }}>
                        <Link href="/review"><Text fontSize="lg" fontWeight="medium" color={location.pathname.includes('/review') ? 'main' : 'black'}>REVIEW</Text></Link>
                        <Link href="/"><Text fontSize="lg" fontWeight="medium" color={location.pathname.includes('/review') || location.pathname.includes('/mypage') ? 'black' : 'main'}>SHOPPING</Text></Link>
                    </HStack>
                </HStack>
                <HStack gap={{ base: 4, md: 6 }}>
                    <form onSubmit={onSearchSubmit}>
                        <InputGroup startElement={<Icon size="md"><LuSearch /></Icon>} endElement={keywordClearElement}>
                            <Input rounded="full" width={{ base: "5", md: 'auto' }} value={keyword} onChange={(e) => setKeyword(e.currentTarget.value)} />
                        </InputGroup>
                    </form>


                    {!user ? (
                        <HStack gap={{ base: 2, md: 6 }}>
                            <Link href="/login" fontSize="sm" whiteSpace="nowrap">로그인</Link>
                            <Link href="/join" fontSize="sm" whiteSpace="nowrap">회원가입</Link>
                        </HStack>
                    ) : (
                        <>
                            <Group>
                                {location.pathname.includes('/review') ? (
                                    <Link href="/review/viewed">
                                        <Icon size="md"><LuEye /></Icon>
                                        <Float><Circle size="4" bg="red" color="white" fontSize="xs">3</Circle></Float>
                                    </Link>
                                ) : <Link href="/cart">
                                    <Icon size="md"><LuShoppingCart /></Icon>
                                    <Float><Circle size="4" bg="red" color="white" fontSize="xs">{basketCount}</Circle></Float>
                                </Link>}
                            </Group>
                            <Icon size="md"><LuBell /></Icon>
                            <Menu.Root>
                                <Menu.Trigger>
                                    <Avatar.Root><LuUserRound /></Avatar.Root>
                                </Menu.Trigger>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item display="block" asChild>
                                            <Link href="/mypage" fontSize="sm" textAlign="center" p="10px" cursor="pointer" _hover={{ backgroundColor: 'gray.100' }}>마이페이지</Link>
                                        </Menu.Item>
                                        <Menu.Item display="block" onClick={logout} asChild>
                                            <Text fontSize="sm" textAlign="center" p="10px" cursor="pointer" _hover={{ backgroundColor: 'gray.100' }}>로그아웃</Text>
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Menu.Root>
                        </>
                    )}

                </HStack>
            </Flex>
            <Category categories={categories} location={categoryLocation} />
        </Stack>
    )
}

export default Header;