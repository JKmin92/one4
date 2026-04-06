import { Outlet } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { Avatar, Box, Float, HStack, Image, Link, Stack, StackSeparator, Text } from '@chakra-ui/react';
import { useAuth } from '../../../utils/useAuth';
import { toaster } from '../../../components/ui/toaster';
import { useNavigate } from 'react-router-dom';
import { LuSettings, LuUserRound } from 'react-icons/lu';

function Layout() {

    const navigate = useNavigate();
    const { user } = useAuth();
    if (!user) {
        toaster.create({ title: '로그인 후 접근 가능합니다.', type: 'error' });
        navigate('/login');
    }

    return (
        <>
            <Header />
            <main>
                <Stack direction='row' maxW="breakpoint-2xl" w="full" margin="auto" gap="6" textAlign="center" p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }}>
                    <Box position="relative" w="1/5">
                        <Stack position="sticky" top="100px" border="1px solid #eee" rounded="lg" p="20px 0" gap="6" separator={<StackSeparator />}>
                            <Stack>
                                {
                                    user.profile
                                        ? <Image src={user.profile} w="100px" h="100px" rounded="full" />
                                        : (
                                            <Box w="85px" h="85px" rounded="full" bg="gray.200" margin="auto" position="relative" display="flex" alignItems="center" justifyContent="center">
                                                <LuUserRound size="20" />
                                                <Float offset="2" placement="bottom-end"><LuSettings size="20" /></Float>
                                            </Box>
                                        )
                                }
                                <Stack gap="0">
                                    <Text fontSize="md">{user.name}</Text>
                                    <Text color="fg.muted" fontSize="sm">{user.email}</Text>
                                </Stack>
                            </Stack>
                            <Stack gap="4" separator={<StackSeparator />}>
                                <Link href="#" fontSize="sm" px="20px">주문상품</Link>
                                <Link href="#" fontSize="sm" px="20px">리뷰 캠페인</Link>
                                <Link href="/mypage/info" fontSize="sm" px="20px">개인정보 수정</Link>
                            </Stack>
                        </Stack>
                    </Box>
                    <Outlet />
                </Stack>
            </main>
            <Footer />
        </>
    )
}

export default Layout;