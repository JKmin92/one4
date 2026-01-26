import { Avatar, Circle, Flex, Float, Group, HStack, Icon, Image, Link, Text } from "@chakra-ui/react";
import { LuBell, LuShoppingCart, LuUserRound } from "react-icons/lu";

function Header() {
    const headerLineStyle = {padding:'15px', px:'layoutX', width:'100%', borderBottom:'1px solid #e5e5e5'};
    const user = null;

    return (
        <Flex {...headerLineStyle} justifyContent="space-between">
            <HStack gap="20">
                <Link href="/"><Image src="/resources/img/logo/logo.svg" alt="logo" width="100px" /></Link>
                <HStack gap="12">
                    <Link href="/"><Text fontSize="lg" fontWeight="medium">REVIEW</Text></Link>
                    <Link href="/"><Text fontSize="lg" fontWeight="medium">SHOPPING</Text></Link>
                </HStack>
            </HStack>
            <HStack gap="6">
                <Group>
                    <Link href="/cart">
                        <Icon size="md"><LuShoppingCart /></Icon>
                        <Float><Circle size="4" bg="red" color="white" fontSize="xs">3</Circle></Float>
                     </Link>
                </Group>
                <Icon size="md"><LuBell /></Icon>
                {!user ? (
                    <HStack gap="6">
                        <Link href="/login" fontSize="sm">로그인</Link>
                        <Link href="/join" fontSize="sm">회원가입</Link>
                    </HStack>
                ) : (
                    <Avatar.Root><LuUserRound /></Avatar.Root>
                )}
                
            </HStack>
        </Flex>
    )
}

export default Header;