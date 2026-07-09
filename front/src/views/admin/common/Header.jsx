import { Box, Button, Flex, HStack, Link } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/useAuth";

function Header() {
    const location = useLocation();
    const pathname = location.pathname;
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <Box position="static" top="0" zIndex="30" bg="bg">
            <Flex justifyContent="space-between" p="10px" borderBottomWidth="1px" paddingInline="8">
                <HStack gap="6">
                    <Link href="/admin/review/campaign/list" fontSize="lg" color={pathname.includes('review') ? 'main' : null}>체험단</Link>
                    <Link href="/admin/shop/product/list" fontSize="lg" color={pathname.includes('shop') ? 'main' : null}>쇼핑몰</Link>
                    <Link href="/admin/member/user/list" fontSize="lg" color={pathname.includes('member') ? 'main' : null}>회원</Link>
                    {user?.role === 'SUPER_ADMIN' && (
                        <Link href="/admin/manager/list" fontSize="lg" color={pathname.includes('manager') ? 'main' : null}>관리자</Link>
                    )}
                    <Link href="/admin/popup/list" fontSize="lg" color={pathname.includes('popup') ? 'main' : null}>팝업</Link>
                </HStack>
                <Button variant="ghost" size="sm" onClick={handleLogout}>로그아웃</Button>
            </Flex>
        </Box>
    )
}

export default Header;