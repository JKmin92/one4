import { Avatar, Button, Circle, CloseButton, Flex, Float, Group, HStack, Icon, IconButton, Image, Input, InputGroup, Link, Menu, Portal, Stack, Text } from "@chakra-ui/react";
import { LuAlignJustify, LuBell, LuEye, LuSearch, LuShoppingCart, LuUserRound } from "react-icons/lu";
import { useAuth } from "../../utils/useAuth";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/api";
import NotificationDropdown from "../../components/common/NotificationDropdown";
import Category from "./Category";
import { useLocation, useNavigate } from "react-router-dom";
import CampaignActivityPopover from "./CampaignActivityPopover";

function Header() {
    const [keyword, setKeyword] = useState('');
    const headerLineStyle = { p: '15px', px: { base: '5px', md: 'layoutX' }, width: '100%', borderBottom: '1px solid #e5e5e5' };
    const { user, logout } = useAuth();
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const [basketCount, setBasketCount] = useState(0);
    const navigate = useNavigate();

    const isUserPage = location.pathname.includes('/mypage') || location.pathname.includes('/login') || location.pathname.includes('/join');
    const categoryLocation = location.pathname.includes('/review') ? '/review' : '';

    const [isVisible, setIsVisible] = useState(true);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    if (currentScrollY < 50) {
                        setIsVisible(true);
                    } else if (currentScrollY > lastScrollY) {
                        setIsVisible(false); // 스크롤 내릴 때 숨김
                    } else {
                        setIsVisible(true);  // 스크롤 올릴 때 보임
                    }
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = location.pathname.includes('/review')
                    ? await axiosInstance.get('/review/campaign/category')
                    : await axiosInstance.get('/shop/product/category');
                setCategories(response?.data ?? []);
            } catch {
                setCategories([]);
            }
        };

        fetchCategories();
    }, [location.pathname, isUserPage]);

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

        window.addEventListener('basket_updated', getBasketCount);
        return () => window.removeEventListener('basket_updated', getBasketCount);
    }, [user]);

    useEffect(() => {
        setKeyword(!isMobileSearchOpen ? '' : keyword);
    }, [isMobileSearchOpen])

    return (
        <Stack
            gap="0"
            position="sticky"
            top="0"
            zIndex={1000}
            bg="white"
            transform={isVisible ? "translateY(0)" : "translateY(-100%)"}
            transition="transform 0.3s ease-in-out"
        >
            <Flex {...headerLineStyle} justifyContent="space-between" position="relative">
                <HStack gap="20">
                    <HStack gap="2">
                        <Category categories={categories} location={categoryLocation} onToggle={true} />
                        <Link href={location.pathname.includes('/review') ? '/review' : '/'}><Image src="/resources/img/logo/logo.svg" alt="logo" width="100px" /></Link>
                    </HStack>
                    <HStack gap="12" display={{ base: 'none', md: 'flex' }}>
                        <Link href="/review"><Text fontSize="lg" fontWeight="medium" color={!isUserPage && location.pathname.includes('/review') ? 'main' : 'black'}>REVIEW</Text></Link>
                        <Link href="/"><Text fontSize="lg" fontWeight="medium" color={location.pathname.includes('/review') || isUserPage ? 'black' : 'main'}>SHOPPING</Text></Link>
                    </HStack>
                </HStack>
                <HStack gap={{ base: '2', md: '6' }} >
                    <form onSubmit={onSearchSubmit}>
                        <InputGroup
                            startElement={
                                <Icon size="md" onClick={() => setIsMobileSearchOpen(true)} cursor="pointer">
                                    <LuSearch />
                                </Icon>
                            }
                            endElement={keywordClearElement}
                            position={{ base: isMobileSearchOpen ? 'absolute' : 'relative', md: 'relative' }}
                            left={{ base: isMobileSearchOpen ? '50%' : 'auto', md: 'auto' }}
                            top={{ base: isMobileSearchOpen ? '50%' : 'auto', md: 'auto' }}
                            w={{ base: isMobileSearchOpen ? '95%' : '40px', md: 'auto' }}
                            transform={{ base: isMobileSearchOpen ? 'translate(-50%, -50%)' : 'none', md: 'none' }}
                            zIndex="10"
                        >
                            <Input
                                rounded="full"
                                bg="white"
                                pr={{ base: isMobileSearchOpen ? '12' : '0', md: '12' }}
                                border={{ base: !isMobileSearchOpen ? 'none' : '1px solid #e5e5e5', md: '1px solid #e5e5e5' }}
                                value={keyword}
                                onChange={(e) => setKeyword(e.currentTarget.value)}
                                onFocus={() => setIsMobileSearchOpen(true)}
                                onBlur={() => {
                                    // onBlur 시 0.2초 딜레이를 주어 검색 버튼 클릭(submit)이 씹히지 않게 함
                                    setTimeout(() => setIsMobileSearchOpen(false), 200);
                                }}
                            />
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
                                {!isUserPage && location.pathname.includes('/review') && (
                                    <CampaignActivityPopover />
                                )}
                                {!location.pathname.includes('/review') && !isUserPage && (
                                    <Link href="/cart">
                                        <IconButton size="md" variant="ghost" rounded="full">
                                            <Icon size="md"><LuShoppingCart /></Icon>
                                            <Float offset="1"><Circle size="4" bg="red" color="white" fontSize="xs">{basketCount}</Circle></Float>
                                        </IconButton>
                                    </Link>
                                )}

                                <NotificationDropdown />
                            </Group>
                            <Menu.Root>
                                <Menu.Trigger rounded="full">
                                    <Avatar.Root>
                                        {user?.profile ? <Avatar.Image src={user.profile} /> : <LuUserRound />}
                                    </Avatar.Root>
                                </Menu.Trigger>
                                <Portal>
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
                                </Portal>
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