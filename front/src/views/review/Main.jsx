import { Bleed, Box, Flex, Heading, HStack, Icon, IconButton, Image, Link, List, Stack, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { LuBraces, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { getDDay } from "../../utils/simpleUtils";

function Main() {
    /**
     * TODO : DB연동
     */
    const mainBanner = [
        { id: 1, label: '이미지' },
        { id: 2, label: '이미지' },
        { id: 3, label: '이미지' },
        { id: 4, label: '이미지' },
        { id: 5, label: '이미지' },
        { id: 6, label: '이미지' },
        { id: 7, label: '이미지' },
    ];

    const swiperCustomButton = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: '2', size: 'xs', rounded: 'full' };
    const swiperPrev = { ...swiperCustomButton, left: '-10px' };
    const swiperNext = { ...swiperCustomButton, right: '-10px' };

    const mainBannerSwiper = {
        slidesPerView: 1,
        spaceBetween: 30,
        modules: [Navigation],
        loop: true,
        navigation: { prevEl: '.Mainbanner .swiper_prev', nextEl: '.Mainbanner .swiper_next' },
        breakpoints: {
            1024: { slidesPerView: 3 }
        }
    }

    const todayDealSwiper = {
        slidesPerView: 2,
        spaceBetween: 30,
        modules: [Navigation],
        loop: true,
        navigation: { prevEl: '.todayDeal .swiper_prev', nextEl: '.todayDeal .swiper_next' },
        breakpoints: {
            1024: { slidesPerView: 6 }
        }
    }

    const recommendSwiper = {
        slidesPerView: 1.2,
        spaceBetween: 30,
        breakpoints: {
            1024: { slidesPerView: 4 }
        }
    }

    const expectSwier = {
        slidesPerView: 2.2,
        spaceBetween: 30,
        breakpoints: {
            1024: { slidesPerView: 5 }
        }
    }

    const categoryIconButtons = [
        { id: 1, label: '카테고리', icon: <LuBraces /> },
        { id: 2, label: '카테고리', icon: <LuBraces /> },
        { id: 3, label: '카테고리', icon: <LuBraces /> },
        { id: 4, label: '카테고리', icon: <LuBraces /> },
        { id: 5, label: '카테고리', icon: <LuBraces /> },
        { id: 6, label: '카테고리', icon: <LuBraces /> },
        { id: 7, label: '카테고리', icon: <LuBraces /> },
        { id: 8, label: '카테고리', icon: <LuBraces /> },
    ];

    const categoryButton = { width: { base: '14', xs: '16' }, height: { base: '14', xs: '16' }, rounded: '2xl', aspectRatio: "1/1", margin: 'auto' };
    const categoryIcon = { width: { base: '5', xs: '8' }, height: { base: '5', xs: '8' } };

    /**
     * TODO : 캠페인 DB 연동
     */
    const campaignList = [
        { id: 1, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 2, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 3, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 4, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 5, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 6, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 7, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 8, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
    ];

    const recommendCampaign = [
        {
            id: 1, label: '추천 1',
            campaign: [
                { id: 1, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
                { id: 2, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
                { id: 3, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
            ]
        },
        {
            id: 2, label: '추천 2',
            campaign: [
                { id: 4, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
                { id: 5, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
                { id: 6, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
            ]
        },
        {
            id: 3, label: '추천 3',
            campaign: [
                { id: 7, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
                { id: 8, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
                { id: 9, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
            ]
        },
        {
            id: 4, label: '추천 4',
            campaign: [
                { id: 10, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
                { id: 11, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
                { id: 12, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
            ]
        },
    ];

    const expectCampaign = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
    ];

    const noticeList = [
        { id: 1, title: '공지사항 1', date: '2026-02-03' },
        { id: 2, title: '공지사항 2', date: '2026-02-03' },
        { id: 3, title: '공지사항 3', date: '2026-02-03' },
        { id: 4, title: '공지사항 4', date: '2026-02-03' },
        { id: 5, title: '공지사항 5', date: '2026-02-03' },
    ]

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} gap="20">
            <Stack gap="16">
                <Box position="relative" className="Mainbanner">
                    <IconButton className="swiper_prev" {...swiperPrev}><LuChevronLeft /></IconButton>
                    <IconButton className="swiper_next" {...swiperNext}><LuChevronRight /></IconButton>
                    <Swiper {...mainBannerSwiper}>
                        {mainBanner.map((banner, index) => (
                            <SwiperSlide key={index}>
                                <Flex bg="bg.emphasized" justifyContent="center" alignItems="center" height="300px" rounded="md">{banner.label} {banner.id}</Flex>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                <Box width="100%" maxWidth="1400px" margin="auto">
                    <Flex justifyContent="space-around" width="full" gap="6" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                        {categoryIconButtons.map((category) => (
                            <Stack key={category.id} justifyContent="center" textAlign="center">
                                <IconButton {...categoryButton}>
                                    <Icon {...categoryIcon}>{category.icon}</Icon>
                                </IconButton>
                                <Text fontSize="sm" textAlign="center">{category.label} {category.id}</Text>
                            </Stack>
                        ))}
                    </Flex>
                </Box>
            </Stack>
            <Stack gap="4">
                <Heading>오늘 오늘 캠페인</Heading>
                <Box className="todayDeal" position="relative">
                    <IconButton className="swiper_prev" {...swiperPrev}><LuChevronLeft /></IconButton>
                    <IconButton className="swiper_next" {...swiperNext}><LuChevronRight /></IconButton>
                    <Swiper {...todayDealSwiper}>
                        {campaignList.map((campaign, index) => (
                            <SwiperSlide key={index}>
                                <Stack gap="2">
                                    <Box bg="bg.emphasized" aspectRatio="square" rounded="md"></Box>
                                    <HStack>
                                        <HStack>
                                            {campaign.channel.map((channel, index) => {
                                                if (channel === 'naver') return (<Image key={index} src="/public/resources/img/logo/naver.svg" w="5" rounded="md" />)
                                            })}
                                        </HStack>
                                        <Text>D-{getDDay(campaign.endDate)}</Text>
                                    </HStack>
                                    <Text>&#91;{campaign.brand}&#93; {campaign.title}</Text>
                                    <Text fontSize="xs" color="fg.muted">{campaign.offer}</Text>
                                    <Text fontSize="sm">신청 10명&#47;{campaign.targetCount}명</Text>
                                </Stack>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Stack>
            <Stack gap="4">
                <Heading>추천 상품</Heading>
                <HStack gap="8" alignItems="start">
                    <Swiper {...recommendSwiper}>
                        {recommendCampaign.map((recommend) => (
                            <SwiperSlide key={recommend.id} width="full">
                                <Stack>
                                    <Box bg="bg.emphasized" width="full" aspectRatio="wide" rounded="md"></Box>
                                    <Stack gap="6">
                                        {recommend.campaign.map((campaign) => (
                                            <HStack gap="6" key={campaign.id}>
                                                <Box bg="bg.emphasized" width="24" aspectRatio="square" rounded="md"></Box>
                                                <Stack gap="1">
                                                    <HStack>
                                                        <HStack>
                                                            {campaign.channel.map((channel, index) => {
                                                                if (channel === 'naver') return (<Image key={index} src="../../../public/resources/img/logo/naver.svg" w="5" rounded="md" />)
                                                            })}
                                                        </HStack>
                                                        <Text>D-{getDDay(campaign.endDate)}</Text>
                                                    </HStack>
                                                    <Text fontSize="md">&#91;{campaign.brand}&#93; {campaign.title}</Text>
                                                    <Text fontSize="xs" color="fg.muted">{campaign.offer}</Text>
                                                    <Text fontSize="xs">신청 10명&#47;{campaign.targetCount}명</Text>
                                                </Stack>
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Stack>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </HStack>
            </Stack>
            <Stack direction="row">
                <Heading>오픈 예정 캠페인</Heading>
                <Swiper {...expectSwier} style={{ maxWidth: '80%', marginLeft: 'auto', marginRight: 0 }}>
                    {expectCampaign.map((campaign) => (
                        <SwiperSlide key={campaign.id}>
                            <Box bg="bg.emphasized" width="full" aspectRatio="square" rounded="md"></Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Stack>
            <Bleed inline={{ base: '15px', md: 'layoutX' }}>
                <Box bg="bg.emphasized" py="10" textAlign="center">광고주 문의</Box>
            </Bleed>
            <Stack direction="row" gap="6">
                <Stack w="2/5" gap="4" borderWidth="1px" p="10px" rounded="md">
                    <Heading>NOTICE</Heading>
                    <Stack gap="1">
                        {noticeList.map((notice) => (
                            <Link key={notice.id} href="#">
                                <Flex justifyContent="space-between" w="full">
                                    <Text fontSize="sm">{notice.title}</Text>
                                    <Text fontSize="sm">{notice.date}</Text>
                                </Flex>
                            </Link>
                        ))}
                    </Stack>
                </Stack>
                <HStack w="3/5">
                    <Box w="1/3" borderWidth="1px" rounded="md" textAlign="center" aspectRatio="16/9" alignItems="center">
                        <Text>이용가이드</Text>
                    </Box>
                    <Box w="1/3" borderWidth="1px" rounded="md" textAlign="center" aspectRatio="16/9" alignItems="center">
                        <Text>위젯</Text>
                    </Box>
                    <Box w="1/3" borderWidth="1px" rounded="md" textAlign="center" aspectRatio="16/9" alignItems="center">
                        <Text>회원가입</Text>
                    </Box>
                </HStack>
            </Stack>
        </Stack>
    )
}

export default Main;