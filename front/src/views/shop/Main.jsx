import { Box, Flex, Heading, HStack, Icon, IconButton, RatingGroup, Stack, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { LuBraces, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import 'swiper/css';
import 'swiper/css/navigation';
import { calcDiscountPercent, formatNumber } from "../../utils/simpleUtils";

import { useEffect, useState } from "react";
import axiosInstance from "../../utils/api";
import MainPopup from "../common/MainPopup";

function Main() {
    const [popups, setPopups] = useState([]);

    const fetchPopups = async () => {
        try {
            const res = await axiosInstance.get('/popup/shop');
            setPopups(res.data);
        } catch (e) {
            console.error("Failed to load shop popups:", e);
        }
    };

    useEffect(() => {
        fetchPopups();
    }, []);

    /**
     * TODO : DB연동
     */
    const mainBanner = [
        {id:1, label:'이미지'},
        {id:2, label:'이미지'},
        {id:3, label:'이미지'},
        {id:4, label:'이미지'},
        {id:5, label:'이미지'},
        {id:6, label:'이미지'},
        {id:7, label:'이미지'},
    ];

    const swiperCustomButton = {position:'absolute', top:'50%', transform:'translateY(-50%)', zIndex:'2', size:'xs', rounded:'full'};
    const swiperPrev = {...swiperCustomButton, left:'-10px'};
    const swiperNext = {...swiperCustomButton, right:'-10px'};

    const mainBannerSwiper = {
        slidesPerView:1,
        spaceBetween:30,
        modules:[Navigation],
        loop:true,
        navigation:{prevEl:'.Mainbanner .swiper_prev', nextEl:'.Mainbanner .swiper_next'},
        breakpoints:{
            1024:{slidesPerView:3}
        }
    }

    const todayDealSwiper = {
        slidesPerView:2, 
        spaceBetween:30,
        modules:[Navigation],
        loop:true,
        navigation:{prevEl:'.todayDeal .swiper_prev', nextEl:'.todayDeal .swiper_next'},
        breakpoints:{
            1024 : {slidesPerView:6}
        }
    }

    const recommendSwiper = {
        slidesPerView : 1.2,
        spaceBetween : 30,
        breakpoints:{
            1024:{slidesPerView:4}
        }
    }

    /**
     * TODO : DB연동
     */
    const categoryIconButtons = [
        {id:1, label:'카테고리', icon : <LuBraces  />},
        {id:2, label:'카테고리', icon : <LuBraces  />},
        {id:3, label:'카테고리', icon : <LuBraces  />},
        {id:4, label:'카테고리', icon : <LuBraces  />},
        {id:5, label:'카테고리', icon : <LuBraces  />},
        {id:6, label:'카테고리', icon : <LuBraces  />},
        {id:7, label:'카테고리', icon : <LuBraces  />},
        {id:8, label:'카테고리', icon : <LuBraces  />},
    ]
    const categoryButton = {width:{base:'14', xs:'16'}, height:{base:'14', xs:'16'}, rounded:'2xl', aspectRatio:"1/1", margin:'auto'};
    const categoryIcon = {width:{base:'5', xs:'8'}, height:{base:'5', xs:'8'}};

    /**
     * TODO : 제품, 할인, 리뷰 DB 연동
     */
    const productList = [
        {id:1, title:'제품명 1', regular_price:10000, discount_price:7000, review_scoure : 5, review_count:210},
        {id:2, title:'제품명 2', regular_price:20000, discount_price:14000, review_scoure : 1, review_count:110},
        {id:3, title:'제품명 3', regular_price:17450, discount_price:16980, review_scoure : 5, review_count:30},
        {id:4, title:'제품명 4', regular_price:25000, discount_price:13000, review_scoure : 3, review_count:20},
        {id:5, title:'제품명 5', regular_price:27500, discount_price:20000, review_scoure : 2.5, review_count:11},
        {id:6, title:'제품명 6', regular_price:12500, discount_price:9500, review_scoure : 4.5, review_count:1540},
        {id:7, title:'제품명 7', regular_price:5000, review_scoure : 5, review_count:100},
        {id:8, title:'제품명 8', regular_price:15000, discount_price:10000, review_scoure : 2, review_count:354},
        {id:9, title:'제품명 9', regular_price:10000, discount_price:9800, review_scoure : 1, review_count:20},
        {id:10, title:'제품명 10', regular_price:154000, discount_price:99000, review_scoure : 4.5, review_count:430},
        {id:11, title:'제품명 11', regular_price:10000, discount_price:7000, review_scoure : 5, review_count:210},
        {id:12, title:'제품명 12', regular_price:20000, discount_price:14000, review_scoure : 1, review_count:110},
    ];

    /**
     * TODO : 추천 상품 DB 연동
     */
    const recommendProductList = [
        {id:1, label:'추천 1', 
            product: [
                {id:1, title:'제품명 1', regular_price:10000, discount_price:7000, review_scoure : 5, review_count:210},
                {id:2, title:'제품명 2', regular_price:20000, discount_price:14000, review_scoure : 1, review_count:110},
                {id:3, title:'제품명 3', regular_price:17450, discount_price:16980, review_scoure : 5, review_count:30},
            ]
        },
        {id:2, label:'추천 2', 
            product: [
                {id:4, title:'제품명 4', regular_price:25000, discount_price:13000, review_scoure : 3, review_count:20},
                {id:5, title:'제품명 5', regular_price:27500, discount_price:20000, review_scoure : 2.5, review_count:11},
                {id:6, title:'제품명 6', regular_price:12500, discount_price:9500, review_scoure : 4.5, review_count:1540},
            ]
        },
        {id:3, label:'추천 3', 
            product: [
                {id:7, title:'제품명 7', regular_price:5000, review_scoure : 5, review_count:100},
                {id:8, title:'제품명 8', regular_price:15000, discount_price:10000, review_scoure : 2, review_count:354},
                {id:9, title:'제품명 9', regular_price:10000, discount_price:9800, review_scoure : 1, review_count:20},
            ]
        },
        {id:4, label:'추천 4', 
            product: [
                {id:10, title:'제품명 10', regular_price:154000, discount_price:99000, review_scoure : 4.5, review_count:430},
                {id:11, title:'제품명 1', regular_price:10000, discount_price:7000, review_scoure : 5, review_count:210},
                {id:12, title:'제품명 12', regular_price:20000, discount_price:14000, review_scoure : 1, review_count:110},
            ]
        },
    ]

    return (
        <Stack p={{base:'40px 0', md:"80px 0"}} px={{base:'15px', md:"layoutX"}} gap="20">
            <MainPopup popupList={popups} />

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
                    <Flex justifyContent="space-around" width="full" gap="6" flexWrap={{base:'wrap', md:'nowrap'}}>
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
                <Heading>오늘의 딜</Heading>
                <Box className="todayDeal" position="relative">
                    <IconButton className="swiper_prev" {...swiperPrev}><LuChevronLeft /></IconButton>
                    <IconButton className="swiper_next" {...swiperNext}><LuChevronRight /></IconButton>
                    <Swiper {...todayDealSwiper}>
                        {productList.map((product, index) => (
                            <SwiperSlide key={index}>
                                <Stack gap="2">
                                    <Box bg="bg.emphasized" aspectRatio="square" rounded="md"></Box>
                                    <Text fontSize="md" fontWeight="medium">{product.title}</Text>
                                    {product.discount_price ? (
                                        <Stack gap="0">
                                            <Text fontSize="xs" textDecoration="line-through">{formatNumber(product.regular_price)}</Text>
                                            <HStack alignItems="end">
                                                <Text fontSize="sm" fontWeight="medium">{calcDiscountPercent(product.regular_price, product.discount_price)}%</Text>
                                                <Text fontWeight="medium">{formatNumber(product.discount_price)}</Text>
                                            </HStack>
                                        </Stack>
                                    ) : (
                                        <Text fontWeight="medium">{product.regular_price}</Text>
                                    )}
                                    <RatingGroup.Root readOnly allowHalf count={5} defaultValue={product.review_scoure} size="sm" colorPalette="yellow">
                                        <RatingGroup.HiddenInput />
                                        <RatingGroup.Control />
                                    </RatingGroup.Root>
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
                    {recommendProductList.map((recommend) => (
                        <SwiperSlide key={recommend.id} width="full">
                            <Stack>
                                <Box bg="bg.emphasized" width="full" aspectRatio="wide" rounded="md"></Box>
                                <Stack gap="4">
                                    {recommend.product.map((product) => (
                                        <HStack gap="6" key={product.id}>
                                            <Box bg="bg.emphasized" width="20" aspectRatio="square" rounded="md"></Box>
                                            <Stack>
                                                <Text>{product.title}</Text>
                                                {product.discount_price ? (
                                                    <Stack gap="0">
                                                        <Text fontSize="xs" textDecoration="line-through">{formatNumber(product.regular_price)}</Text>
                                                        <HStack alignItems="end">
                                                            <Text fontSize="sm" fontWeight="medium">{calcDiscountPercent(product.regular_price, product.discount_price)}%</Text>
                                                            <Text fontWeight="medium">{formatNumber(product.discount_price)}</Text>
                                                        </HStack>
                                                    </Stack>
                                                ) : (
                                                    <Text fontWeight="medium">{product.regular_price}</Text>
                                                )}
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
        </Stack>
    )
}

export default Main;