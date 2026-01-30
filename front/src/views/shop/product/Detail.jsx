import { Box, Button, ButtonGroup, Collapsible, createListCollection, DataList, Flex, Heading, HStack, IconButton, Link, RatingGroup, Select, Stack, StackSeparator, Text, Pagination, Image, Badge, Separator, Dialog, NumberInput, CloseButton, Icon } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuLock, LuMinus, LuPlus } from "react-icons/lu";
import { calcDiscountPercent, formatDate, formatNumber, scrollViewPosition } from "../../../utils/simpleUtils";
import { useState } from "react";
import { InfoTip } from '../../../components/ui/toggle-tip';
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";

function ReviewView({reviewList = []}) {
    const [reviewPage, setReviewPage] = useState(1);
    const reviewPageSize = 5;
    const reviewCount = reviewList.length;
    const startRange = (reviewPage - 1) * reviewPageSize;
    const endRange = startRange + reviewPageSize;
    const [reviewActive, setReviewActive] = useState(null);

    const reviewClick = (id) => {
        if(reviewActive === id) setReviewActive(null);
        else setReviewActive(id);
    }

    const visibleReviewItems = reviewList.slice(startRange, endRange);

    return (
        <Stack gap="6">
            <Stack separator={<StackSeparator />}>
            {visibleReviewItems.map((review) => {
                const firstImage = review.content.find((item) => item.type === 'image');
                return (
                    <Stack 
                        key={review.id} cursor="pointer" 
                        onClick={() => reviewClick(review.id)} 
                        bg={reviewActive === review.id ? 'bg.muted' : 'bg'}
                        p="5px 10px"
                    >
                        <Flex justifyContent="space-between">
                            <HStack>
                                <RatingGroup.Root readOnly allowHalf count={5} defaultValue={review.rank} size="xs" colorPalette="yellow">
                                    <RatingGroup.HiddenInput /><RatingGroup.Control />
                                </RatingGroup.Root>
                                <Text fontSize="sm" color="fg.muted">{review.name}</Text>
                            </HStack>
                            <Text fontSize="xs" color="fg.subtle">{formatDate(review.date)}</Text>
                        </Flex>
                        <Flex 
                            justifyContent={reviewActive === review.id ? 'start' : 'space-between'} 
                            flexDirection={reviewActive === review.id ? 'column' : 'row'} 
                            alignItems={reviewActive === review.id ? 'start' : 'center'}>
                                {review.content.filter((item) => item.type === 'text').map((item, index) => (
                                    <Text key={index} 
                                        whiteSpace={reviewActive === review.id ? 'pre-line' : 'nowrap'}
                                        overflow={reviewActive === review.id ? 'auto' : 'hidden'}
                                        textOverflow={reviewActive === review.id ? 'inherit' : 'ellipsis'}
                                        fontSize="sm"
                                    >{item.content}</Text>
                                ))}
                                <HStack>
                                    {review.content.filter((item) => item.type==='image').map((item, index) => (
                                        <Image key={index} 
                                            src={item.content} 
                                            display={item.id === firstImage.id || reviewActive === review.id ? 'block' : 'none'} 
                                            width={reviewActive === review.id ? 'xs' : '12'} 
                                            rounded="md" />
                                    ))}
                                </HStack>
                        </Flex>
                    </Stack>
                )
            })}
            </Stack>
            <Pagination.Root count={reviewCount} pageSize={reviewPageSize} page={reviewPage} onPageChange={(e) => setReviewPage(e.page)} margin="auto">
                <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                        <IconButton><HiChevronLeft /></IconButton>
                    </Pagination.PrevTrigger>
                    <Pagination.Items render={(page) => (
                        <IconButton variant={{base:'ghost', _selected:'outline'}}>{page.value}</IconButton>
                    )} />
                    <Pagination.NextTrigger asChild>
                        <IconButton><HiChevronRight /></IconButton>
                    </Pagination.NextTrigger>
                </ButtonGroup>
            </Pagination.Root>
        </Stack>
    )
}

function ProuctAsk({productAskList = []}) {
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const askCount = productAskList.length;
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
    const [askActive, setAskActive] = useState(null);
    const [secretDialogOpen, setSecretDialogOpen] = useState(false);

    const askClick = (id, secret, status) => {
        if(secret) {
            setSecretDialogOpen(true);
            return;
        } 
        
        if(status != 'pending') {
            if(askActive === id) setAskActive(null);
            else setAskActive(id);
        }
        
    }

    const visibleAskItems = productAskList.slice(startRange, endRange);

    return (
        <Stack gap="6">
            <Stack separator={<StackSeparator />}>
                {visibleAskItems.map((ask) => (
                    <Stack 
                        key={ask.id}
                        cursor="pointer"
                        onClick={() => askClick(ask.id, ask.secret, ask.status)}
                        bg={askActive === ask.id ? 'bg.muted' : 'bg'}
                        p="5px 10px"
                    >
                        <Flex justifyContent="space-between">
                            <Text fontSize="sm" color="fg.muted">{ask.name}</Text>
                            <Text fontSize="xs" color="fg.subtle">{formatDate(ask.date)}</Text>
                        </Flex>
                        <Stack gap="4">
                            <Flex justifyContent="space-between">
                                {ask.secret ? (<HStack><LuLock size="14" /> <Text fontSize="sm">비밀글입니다.</Text></HStack>) 
                                : (<Text fontSize="sm">{ask.askText}</Text>)}
                                <Badge colorPalette={ask.status === 'accepted' ? 'green' : ''} fontSize="2xs">
                                    {ask.status === 'accepted' ? '답변완료' : '답변대기'}
                                </Badge>
                            </Flex>
                            {ask.status === 'accepted' && !ask.secret && (
                                <Stack display={askActive === ask.id ? 'block' : 'none'}>
                                    <Separator marginBottom="4" />
                                    <Text fontSize="sm">{ask.answerText}</Text>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                ))}
            </Stack>
            <Pagination.Root count={askCount} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)} margin="auto">
                <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                        <IconButton><HiChevronLeft /></IconButton>
                    </Pagination.PrevTrigger>
                    <Pagination.Items render={(page) => (
                        <IconButton variant={{base:'ghost', _selected:'outline'}}>{page.value}</IconButton>
                    )} />
                    <Pagination.NextTrigger asChild>
                        <IconButton><HiChevronRight /></IconButton>
                    </Pagination.NextTrigger>
                </ButtonGroup>
            </Pagination.Root>
            <Dialog.Root placement="center" open={secretDialogOpen} onOpenChange={(e) => setSecretDialogOpen(e.open)}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p="15px 0">
                        <Dialog.Body textAlign="center">
                            <Heading>비밀글입니다.</Heading>
                            <Text>작성자만 확인하실 수 있습니다.</Text>
                        </Dialog.Body>
                        <Dialog.Footer justifyContent="center">
                            <Dialog.ActionTrigger asChild>
                                <Button>닫기</Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Stack>
    )
}

function PriceView({selectedOptions = [], product, discount, onRemove, onChangeQuantity}) {
    if(selectedOptions.length <= 0) return null;

    const unitPrice = product.price - discount.price;
    const totalPrice = selectedOptions.reduce(
        (sum, item) => sum + unitPrice * item.quantity, 0
    )

    return (
        <Stack gap="6">
            <Stack gap="4" separator={<StackSeparator />}>
                {selectedOptions.map((selectedOption, index) => (
                    <Flex justifyContent="space-between" align="center" key={index}>
                        <Stack gap="0">
                            <Heading size="md">{product.name}</Heading>
                            <HStack gap="2">
                                {selectedOption.options.map((selectedItem) => (
                                    <Text key={selectedItem.value} textStyle="sm" color="fg.muted">{selectedItem.label}</Text>
                                ))}
                            </HStack>
                        </Stack>
                        <HStack gap="6">
                            <NumberInput.Root min="1" unstyled spinOnPress={false} value={selectedOption.quantity} onValueChange={(e) => onChangeQuantity(index, Number(e.value))}>
                                <HStack gap="2">
                                    <NumberInput.DecrementTrigger asChild>
                                        <IconButton variant="outline" size="5" rounded="full" p="1">
                                            <Icon size="sm"><LuMinus /></Icon>
                                        </IconButton>
                                    </NumberInput.DecrementTrigger>
                                    <NumberInput.ValueText textAlign="center" />
                                    <NumberInput.IncrementTrigger asChild>
                                        <IconButton variant="outline" size="5" rounded="full" p="1">
                                            <Icon size="sm"><LuPlus /></Icon>
                                        </IconButton>
                                    </NumberInput.IncrementTrigger>
                                </HStack>
                            </NumberInput.Root>
                            <Heading>{formatNumber(unitPrice * selectedOption.quantity)}</Heading>
                            <CloseButton size="0" rounded="full" variant="solid" bg="gray.focusRing" onClick={() => onRemove(index)}><Icon size="xs"><HiX /></Icon></CloseButton>
                        </HStack>
                    </Flex>
                ))}
            </Stack>
            <Stack gap="4">
                <Separator />
                <HStack justifyContent="end" alignItems="end">
                    <Text textStyle="sm">총 상품 금액</Text>
                    <Heading size="2xl" color="main">{formatNumber(totalPrice)}원</Heading>
                </HStack>
            </Stack>
        </Stack>
    )
}

function Detail() {

    const swiperCustomButton = {position:'absolute', top:'50%', transform:'translateY(-50%)', zIndex:'2', size:'xs', rounded:'full'};
    const swiperPrev = {...swiperCustomButton, left:'30px'};
    const swiperNext = {...swiperCustomButton, right:'30px'};

    const [detailOpen, setDetailOpen] = useState(false);

    const product = {name:'상품명', price:10000};
    const discount = {price:5000};
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [optionValueList, setOptionValueList] = useState([]);
    const [options, setOptions] = useState(
        [
            {label:'컬러', id:1, items:[{label:'옐로우', value:'yellow'}, {label:'그린', value:'green'}, {label:'퍼플', value:'purple'}, {label:'블루', value:'blue'}]},
            {label:'사이즈', id:2, items:[{label:'M(medium)', value:'medium'}, {label:'L(large)', value:'large'}, {label:'XL(extra large)', value:'extraLarge'}, {label:'2XL(two extra large)', value:'twoExtraLarge'}]},
        ]
    );

    const handleSelectChange = (optionIndex, option, value) => {
        const selectedItem = option.value.items.find(
            (item) => item.value === value
        );

        if(!selectedItem) return;

        setSelectedOptions((prev) => {
            const next = [...prev];
            next[optionIndex] = {
                optionId : option.id,
                label : selectedItem.label,
                value : selectedItem.value,
            };

            if(next.length == options.length && next.every(Boolean)) {
                setOptionValueList((prevList) => {
                    const exists = prevList.some((item) =>
                        item.options.every(
                            (opt, idx) => opt.value === next[idx].value
                        )
                    );

                    if(exists) return prevList;
                    return [...prevList, {options:[...next], quantity:1}];
                })
            } 

            return next;
        })
    }

    const removeOptionValueList = (removeIndex) => {
        setOptionValueList(prev => prev.filter((_, index) => index !== removeIndex));
    };

    const updateOptionQuantity = (index, quantity) => {
        setOptionValueList(prev => 
            prev.map((item, i) => i === index ? {...item, quantity} : item)
        )
    }

    /**
     * 옵션 DB 연동
     */
    const optionList = options.map((option) => ({
        label : option.label,
        id : option.id,
        value : createListCollection({
            items : option.items
        })
    }));

    /**
     * 리뷰 DB 연동
     */
    const reviewList = [
        {id:1, name : 'amean123', date:'2026-01-21', rank:5, content: [{id:13, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {id:14, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}, {id:15, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:2, name : 'asdf', date:'2026-01-21', rank:4, content: [{id:16, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {id:17, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:3, name : '353adsf', date:'2026-01-21', rank:5, content: [{id:18, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}]},
        {id:4, name : 'a243', date:'2026-01-21', rank:5, content: [{id:19, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {id:20, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}, {id:21, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:5, name : 'asdfasd', date:'2026-01-21', rank:4.5, content: [{id:22, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {id:23, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:6, name : 'a3523', date:'2026-01-21', rank:5, content: [{id:24, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}]},
        {id:7, name : 'a235a', date:'2026-01-21', rank:3, content: [{id:25, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {id:26, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}, {id:33, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:8, name : 'adsfasdf', date:'2026-01-21', rank:2, content: [{id:27, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {id:28, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:9, name : 'asdgasd', date:'2026-01-21', rank:1, content: [{id:29, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}]},
        {id:10, name : 'zcxbzvx', date:'2026-01-21', rank:5, content: [{id:30, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {id:31, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}, {id:34, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:11, name : 'cxne', date:'2026-01-21', rank:3.5, content: [{id:35, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용\n내용이 어쩌구 저쩌구 하는 리뷰 내용\n\n내용이 어쩌구 저쩌구 하는 리뷰 내용\n내용이 어쩌구 저쩌구 하는 리뷰 내용'}, {id:36, type:'image', content:'//ecimg.cafe24img.com/pg1710b89275569084/wabami/web/product/small/20251210/4c96082cc73049b105a0bea2236b765f.png'}]},
        {id:12, name : '14adf', date:'2026-01-21', rank:4, content: [{id:37, type:'text', content:'내용이 어쩌구 저쩌구 하는 리뷰 내용'}]},
    ]

    const askList = [
        {id:1, name:'amean123', date:'2026-01-21', askText:'유통기한은 언제까지 인가요?', status:'accepted', answerText:'26년 12월 1일까지예요!', secret:false},
        {id:2, name:'afeq', date:'2026-01-21', askText:'배송 언제되요?!!', status:'pending', answerText:null, secret:false},
        {id:3, name:'avads1', date:'2026-01-21', askText:'유통기한은 언제까지 인가요?', status:'accepted', answerText:'26년 12월 1일까지예요!', secret:true},
        {id:4, name:'amean123', date:'2026-01-21', askText:'유통기한은 언제까지 인가요?', status:'accepted', answerText:'26년 12월 1일까지예요!', secret:false},
        {id:5, name:'afeq', date:'2026-01-21', askText:'배송 언제되요?!!', status:'pending', answerText:null, secret:false},
        {id:6, name:'avads1', date:'2026-01-21', askText:'유통기한은 언제까지 인가요?', status:'accepted', answerText:'26년 12월 1일까지예요!', secret:true},
        {id:7, name:'amean123', date:'2026-01-21', askText:'유통기한은 언제까지 인가요?', status:'accepted', answerText:'26년 12월 1일까지예요!', secret:false},
        {id:8, name:'afeq', date:'2026-01-21', askText:'배송 언제되요?!!', status:'pending', answerText:null, secret:false},
        {id:9, name:'avads1', date:'2026-01-21', askText:'유통기한은 언제까지 인가요?', status:'accepted', answerText:'26년 12월 1일까지예요!', secret:true},
        {id:10, name:'amean123', date:'2026-01-21', askText:'유통기한은 언제까지 인가요?', status:'accepted', answerText:'26년 12월 1일까지예요!', secret:false},
        {id:11, name:'afeq', date:'2026-01-21', askText:'배송 언제되요?!!', status:'pending', answerText:null, secret:false},
        {id:12, name:'avads1', date:'2026-01-21', askText:'유통기한은 언제까지 인가요?', status:'accepted', answerText:'26년 12월 1일까지예요!', secret:true}
    ]
    

    return (
        <Stack p={{base:'40px 0', md:"80px 0"}} px={{base:'15px', md:"layoutX"}} gap="12" width={{base:'full', md:"6xl"}} margin="auto">
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
                <Stack gap="10" direction={{base:'column', md:"row"}}>
                    <Box position="relative" width={{base:'full', md:"1/2"}} className="productImage">
                        <IconButton className="swiper_prev" {...swiperPrev}><LuChevronLeft /></IconButton>
                        <IconButton className="swiper_next" {...swiperNext}><LuChevronRight /></IconButton>
                        <Swiper slidesPerView={1} pagination={{clickable:true}} modules={[Navigation, SwiperPagination]} navigation={{prevEl:'.productImage .swiper_prev', nextEl:'.productImage .swiper_next'}}>
                            <SwiperSlide><Box width="full" bg="bg.emphasized" aspectRatio="square" rounded="md"></Box></SwiperSlide>
                            <SwiperSlide><Box width="full" bg="bg.emphasized" aspectRatio="square" rounded="md"></Box></SwiperSlide>
                            <SwiperSlide><Box width="full" bg="bg.emphasized" aspectRatio="square" rounded="md"></Box></SwiperSlide>
                        </Swiper>
                    </Box>
                    <Box width={{base:'full', md:"1/2"}}>
                        <Stack gap="6" borderTop="2px solid #000" pt="30px">
                            <Heading size="2xl">제품명</Heading>
                            <HStack gap="5">
                                <RatingGroup.Root readOnly allowHalf count={5} defaultValue={3} size="sm" colorPalette="yellow">
                                    <RatingGroup.HiddenInput />
                                    <RatingGroup.Control />
                                </RatingGroup.Root>
                                <Button variant="plain" borderBottom="1px solid #000" p="0" rounded="0" height="auto" onClick={() => scrollViewPosition('review')}>12개 리뷰 보기</Button>
                            </HStack>
                            <Stack gap="0">
                                <Text fontSize="md" textDecoration="line-through" color="fg.subtle">{formatNumber(product.price)}</Text>
                                <HStack alignItems="end">
                                    <Text fontSize="lg" fontWeight="medium">{calcDiscountPercent(product.price, discount.price)}%</Text>
                                    <Text fontWeight="medium" fontSize="2xl">{formatNumber(product.price - discount.price)}</Text>
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
                                {optionList.map((option, index) => (
                                    <Select.Root 
                                        collection={option.value} 
                                        key={option.id} 
                                        value={selectedOptions[index] ? [selectedOptions[index].value] : []}
                                        onValueChange={(e) => handleSelectChange(index, option, e.value[0])}
                                    >
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
                            <PriceView selectedOptions={optionValueList} product={product} discount={discount} onRemove={removeOptionValueList} onChangeQuantity={updateOptionQuantity} />
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
            <Stack gap="6" id="review">
                <HStack>
                    <Heading>리뷰({reviewList.length})</Heading>
                    <RatingGroup.Root readOnly allowHalf count={5} defaultValue={3} size="sm" colorPalette="yellow">
                        <RatingGroup.HiddenInput />
                        <RatingGroup.Control />
                    </RatingGroup.Root>
                </HStack>
                <ReviewView reviewList={reviewList} />
            </Stack>
            <Stack gap="6">
                <Flex justifyContent="space-between">
                    <Heading>상품 Q&A</Heading>
                    <Link href="#" fontSize="sm">Q&A 작성 <LuChevronRight /></Link>
                </Flex>
                <ProuctAsk productAskList={askList} />
            </Stack>
        </Stack>
    )
}

export default Detail;