import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <Box position="static" top="0" zIndex="30" bg="bg">
            <Flex justifyContent="space-between" p="10px" borderBottomWidth="1px" paddingInline="8">
                <HStack gap="6">
                    <Link href="/admin/review/campaign/list" fontSize="lg" color={pathname.includes('review') ? 'main' : null}>체험단</Link>
                    <Link href="/admin/shop/product/list" fontSize="lg" color={pathname.includes('shop') ? 'main' : null}>쇼핑몰</Link>
                    <Link href="/admin/member/user/list" fontSize="lg" color={pathname.includes('member') ? 'main' : null}>회원</Link>
                </HStack>
            </Flex>
        </Box>
    )
}

export default Header;