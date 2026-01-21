import { Box, Button, Collapsible, createListCollection, DataList, Flex, Heading, HStack, IconButton, Link, RatingGroup, Select, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { LuChevronDown, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { calcDiscountPercent, formatDate, formatNumber } from "../../../utils/simpleUtils";
import { useState } from "react";
import { InfoTip } from '../../../components/ui/toggle-tip';

function Detail() {

    const swiperCustomButton = {position:'absolute', top:'50%', transform:'translateY(-50%)', zIndex:'2', size:'xs', rounded:'full'};
    const swiperPrev = {...swiperCustomButton, left:'30px'};
    const swiperNext = {...swiperCustomButton, right:'30px'};

    const [detailOpen, setDetailOpen] = useState(false);

    /**
     * 옵션 DB 연동
     */
    const optionList = [
        {
            label : '컬러',
            id : 1,
            value : createListCollection({
                items : [
                    {label:'옐로우', value:'yellow'},
                    {label:'그린', value:'green'},
                    {label:'퍼플', value:'purple'},
                    {label:'블루', value:'blue'},
                ]
            })
        },
        {
            label : '사이즈',
            id : 2,
            value : createListCollection({
                items : [
                    {label:'M(medium)', value:'medium'},
                    {label:'L(large)', value:'large'},
                    {label:'XL(extra large)', value:'extraLarge'},
                    {label:'2XL(two extra large', value:'twoExtraLarge'},
                ]
            })
        }
    ];

    /**
     * 리뷰 DB 연동
     */
    const reviewList = [
        {id:1, name : 'amean123', date:'2026-01-21', rank:5, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:2, name : 'asdf', date:'2026-01-21', rank:4, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:3, name : '353adsf', date:'2026-01-21', rank:5, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}]},
        {id:4, name : 'a243', date:'2026-01-21', rank:5, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:5, name : 'asdfasd', date:'2026-01-21', rank:4.5, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:6, name : 'a3523', date:'2026-01-21', rank:5, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}]},
        {id:7, name : 'a235a', date:'2026-01-21', rank:3, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:8, name : 'adsfasdf', date:'2026-01-21', rank:2, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:9, name : 'asdgasd', date:'2026-01-21', rank:1, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}]},
        {id:10, name : 'zcxbzvx', date:'2026-01-21', rank:5, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:11, name : 'cxne', date:'2026-01-21', rank:3.5, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:12, name : '14adf', date:'2026-01-21', rank:4, content: [{type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}]},
    ]

    return (
        <Stack padding="80px 0" px="layoutX" gap="6" width="6xl" margin="auto">
            <Stack gap="6">
                <Flex className="brandIntro" justifyContent="space-between">
                    <HStack gap="6" alignItems="center">
                        <Box width="16" bg="bg.emphasized" aspectRatio="square" rounded="md"></Box>
                        <Stack>
                            <Text fontWeight="medium" fontSize="xl">브랜드 이름</Text>
                            <Text fontSize="sm">브랜드 소개</Text>
                        </Stack>
                    </HStack>
                    <Button variant="outline"><Link href="">BRAND HOME</Link></Button>
                </Flex>
                <Stack gap="10" direction="row">
                    <Box position="relative" width="1/2" className="productImage">
                        <IconButton className="swiper_prev" {...swiperPrev}><LuChevronLeft /></IconButton>
                        <IconButton className="swiper_next" {...swiperNext}><LuChevronRight /></IconButton>
                        <Swiper slidesPerView={1} pagination={{clickable:true}} modules={[Navigation, Pagination]} navigation={{prevEl:'.productImage .swiper_prev', nextEl:'.productImage .swiper_next'}}>
                            <SwiperSlide><Box width="full" bg="bg.emphasized" aspectRatio="square" rounded="md"></Box></SwiperSlide>
                            <SwiperSlide><Box width="full" bg="bg.emphasized" aspectRatio="square" rounded="md"></Box></SwiperSlide>
                            <SwiperSlide><Box width="full" bg="bg.emphasized" aspectRatio="square" rounded="md"></Box></SwiperSlide>
                        </Swiper>
                    </Box>
                    <Box width="1/2">
                        <Stack gap="6" borderTop="2px solid #000" pt="30px">
                            <Heading size="2xl">제품명</Heading>
                            <HStack gap="5">
                                <RatingGroup.Root readOnly allowHalf count={5} defaultValue={3} size="sm" colorPalette="yellow">
                                    <RatingGroup.HiddenInput />
                                    <RatingGroup.Control />
                                </RatingGroup.Root>
                                <Button variant="plain" borderBottom="1px solid #000" p="0" rounded="0" minH="auto" height="auto">12개 리뷰 보기</Button>
                            </HStack>
                            <Stack gap="0">
                                <Text fontSize="md" textDecoration="line-through" color="fg.subtle">{formatNumber(10000)}</Text>
                                <HStack alignItems="end">
                                    <Text fontSize="lg" fontWeight="medium">{calcDiscountPercent(10000, 5000)}%</Text>
                                    <Text fontWeight="medium" fontSize="2xl">{formatNumber(5000)}</Text>
                                </HStack>
                            </Stack>
                            <DataList.Root orientation="horizontal" fontSize="sm" color="fg.muted" alignItems="start">
                                <DataList.Item>
                                    <DataList.ItemLabel>구매 적립금</DataList.ItemLabel>
                                    <DataList.ItemValue>최대 {formatNumber(500)}원</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel>배송정보<InfoTip>주말, 공휴일 등으로 발송이 지연될 수 있습니다.</InfoTip ></DataList.ItemLabel>
                                    <DataList.ItemValue>1일 이내 배송 시작</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel>배송비</DataList.ItemLabel>
                                    <DataList.ItemValue>
                                        <Stack gap="0">
                                            <Text>{formatNumber(3000)}원</Text>
                                            <Text>{formatNumber(50000)}원 이상 구매시 무료배송</Text>
                                            <Text>제주/도서산간 {formatNumber(3000)}원 추가</Text>
                                        </Stack>
                                    </DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                            
                            <Stack>
                                {optionList.map((option) => (
                                    <Select.Root collection={option.value} key={option.id}>
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Select.ValueText placeholder={option.label} />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup><Select.Indicator /></Select.IndicatorGroup>
                                        </Select.Control>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {option.value.items.map((item) => (
                                                    <Select.Item item={item} key={item.value}>
                                                        {item.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Select.Root>
                                ))}
                            </Stack>
                            <HStack>
                                <Button variant="outline" width="1/2">장바구니 담기</Button>
                                <Button width="1/2">바로 구매하기</Button>
                            </HStack>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
            <Stack gap="6">
                <Heading>상품 설명</Heading>
                <Collapsible.Root collapsedHeight="500px" open={detailOpen} onOpenChange={(e) => setDetailOpen(e.open)}>
                    <Collapsible.Content _closed={{shadow:'inset 0 -12px 12px -12px var(--shadow-color)', shadowColor:'blackAlpha.500'}}>
                        <Stack>
                            <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                            <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                            <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                            <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                            <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                        </Stack>
                    </Collapsible.Content>
                    <Collapsible.Trigger asChild mt="4">
                        <Button variant="outline" width="full">
                            {detailOpen ? '닫기' : '더보기'}
                            <Collapsible.Indicator transition="transform 0.2s" _open={{transform:'rotate(180deg)'}}>
                                <LuChevronDown />
                            </Collapsible.Indicator>
                        </Button>
                    </Collapsible.Trigger>
                </Collapsible.Root>
            </Stack>
            <Stack gap="6">
                <HStack>
                    <Heading>리뷰(12)</Heading>
                    <RatingGroup.Root readOnly allowHalf count={5} defaultValue={3} size="sm" colorPalette="yellow">
                        <RatingGroup.HiddenInput />
                        <RatingGroup.Control />
                    </RatingGroup.Root>
                </HStack>
                <Stack separator={<StackSeparator />}>
                    {reviewList.map((review) => (
                        <Stack key={review.id}>
                            <Flex justifyContent="space-between">
                                <HStack>
                                    <RatingGroup.Root readOnly allowHalf count={5} defaultValue={review.rank} size="xs" colorPalette="yellow">
                                        <RatingGroup.HiddenInput />
                                        <RatingGroup.Control />
                                    </RatingGroup.Root>
                                    <Text fontSize="sm" color="fg.muted">{review.name}</Text>
                                </HStack>
                                <Text fontSize="sm" color="fg.subtle">{formatDate(review.date)}</Text>
                            </Flex>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}

export default Detail;