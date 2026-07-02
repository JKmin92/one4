import { Avatar, Button, Circle, CloseButton, Flex, Float, Group, HStack, Icon, Image, Input, InputGroup, Link, Menu, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuAlignJustify, LuBell, LuSearch, LuShoppingCart, LuUserRound } from "react-icons/lu";
import { useAuth } from "../../../utils/useAuth";
import axiosInstance from "../../../utils/api";
import NotificationDropdown from "../../../components/common/NotificationDropdown";

function Header() {

    const [keyword, setKeyword] = useState('');
    const headerLineStyle = { p: '15px', px: { base: '5px', md: 'layoutX' }, width: '100%', borderBottom: '1px solid #e5e5e5' };


    const keywordClearElement = keyword ? (
        <CloseButton size="xs" onClick={() => setKeyword('')} rounded="full" />
    ) : null;

    const onSearchSubmit = (e) => {
        e.preventDefault();
        console.log(keyword);
    }

    const { user, logout } = useAuth();

    const handleLogout = async () => await logout();



    return (
        <Stack gap="0">
            <Flex {...headerLineStyle} justifyContent="space-between" gap="6">
                <HStack gap="20" >
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
                        <Link href="/"><Text fontSize="lg" fontWeight="medium" color="main">SHOPPING</Text></Link>
                    </HStack>
                </HStack>
                <HStack gap={{ base: '4', md: '6' }}>
                    <form onSubmit={onSearchSubmit}>
                        <InputGroup startElement={<Icon size="md"><LuSearch /></Icon>} endElement={keywordClearElement}>
                            <Input rounded="full" width={{ base: '5', md: "auto" }} value={keyword} onChange={(e) => setKeyword(e.currentTarget.value)} />
                        </InputGroup>
                    </form>


                    {!user ? (
                        <HStack gap={{ base: '2', md: "6" }}>
                            <Link href="/login" fontSize="sm" whiteSpace="nowrap">로그인</Link>
                            <Link href="/join" fontSize="sm" whiteSpace="nowrap">회원가입</Link>
                        </HStack>
                    ) : (
                        <>
                            <Group>
                                <Link href="/cart">
                                    <Icon size="md"><LuShoppingCart /></Icon>
                                    <Float><Circle size="4" bg="red" color="white" fontSize="xs">3</Circle></Float>
                                </Link>
                            </Group>
                            <NotificationDropdown />
                            <Menu.Root>
                                <Menu.Trigger rounded="full">
                                    <Avatar.Root><LuUserRound /></Avatar.Root>
                                </Menu.Trigger>
                                <Menu.Positioner>
                                    <Menu.Content textAlign="center">
                                        <Menu.Item display="block">
                                            <Link href="#"><Text textStyle="sm">마이페이지</Text></Link>
                                        </Menu.Item>
                                        <Menu.Item display="block" onClick={handleLogout}>
                                            <Text textStyle="sm">로그아웃</Text>
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Menu.Root>
                        </>
                    )}
                </HStack>
            </Flex>
            <HStack gap="16" {...headerLineStyle} display={{ md: 'flex', base: 'none' }}>
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button variant="ghost">
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

                <HStack gap="12">
                    <Link href="/categorys/12345"><Text fontSize="md" fontWeight="medium">카테고리 1</Text></Link>
                    <Link href="/"><Text fontSize="md" fontWeight="medium">카테고리 2</Text></Link>
                    <Link href="/"><Text fontSize="md" fontWeight="medium">카테고리 3</Text></Link>
                    <Link href="/"><Text fontSize="md" fontWeight="medium">카테고리 4</Text></Link>
                </HStack>
            </HStack>
        </Stack>
    )
}

export default Header;