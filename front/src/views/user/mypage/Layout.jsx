import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { Avatar, Box, Float, HStack, Image, Link, Stack, StackSeparator, Text } from '@chakra-ui/react';
import { useAuth } from '../../../utils/useAuth';
import { toaster } from '../../../components/ui/toaster';
import { LuSettings, LuUserRound } from 'react-icons/lu';

function Layout() {

    const navigate = useNavigate();
    const { user } = useAuth();
    
    useEffect(() => {
        if (!user) {
            toaster.create({ title: '로그인 후 접근 가능합니다.', type: 'error' });
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

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
                                        ? <Image src={user.profile} w="85px" h="85px" rounded="full" m="auto" />
                                        : (
                                            <Box w="85px" h="85px" rounded="full" bg="gray.200" margin="auto" position="relative" display="flex" alignItems="center" justifyContent="center">
                                                <LuUserRound size="20" />
                                            </Box>
                                        )
                                }
                                <Stack gap="0">
                                    <Text fontSize="md">{user.name}</Text>
                                    <Text color="fg.muted" fontSize="sm">{user.email}</Text>
                                </Stack>
                            </Stack>
                            <Stack gap="4" separator={<StackSeparator />}>
                                <Link href="/mypage/order" fontSize="sm" px="20px">주문내역</Link>
                                <Link href="/mypage/review" fontSize="sm" px="20px">리뷰 캠페인</Link>
                                <Link href="/mypage/info" fontSize="sm" px="20px">개인정보 수정</Link>
                                <Link href="/mypage/point" fontSize="sm" px="20px">포인트</Link>
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