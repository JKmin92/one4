import { Box, Button, ButtonGroup, Collapsible, createListCollection, DataList, Flex, Heading, HStack, IconButton, Link, RatingGroup, Select, Stack, StackSeparator, Text, Pagination, Image, Badge, Separator, Dialog, NumberInput, CloseButton, Icon, Spinner } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuLock, LuMinus, LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { calcDiscountPercent, formatDate, formatNumber, scrollViewPosition } from "../../../utils/simpleUtils";
import { useEffect, useState } from "react";
import { InfoTip } from '../../../components/ui/toggle-tip';
import { toaster } from "../../../components/ui/toaster";
import axiosInstance from "../../../utils/api";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../utils/useAuth";

function ReviewView({ reviewList = [] }) {
    const [reviewPage, setReviewPage] = useState(1);
    const reviewPageSize = 5;
    const reviewCount = reviewList.length;
    const startRange = (reviewPage - 1) * reviewPageSize;
    const endRange = startRange + reviewPageSize;
    const [reviewActive, setReviewActive] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const reviewClick = (id) => {
        if (reviewActive === id) setReviewActive(null);
        else setReviewActive(id);
    }

    const visibleReviewItems = reviewList.slice(startRange, endRange);

    const deleteReview = async (id) => {
        await axiosInstance.delete(`/shop/board/product/review/${id}`)
            .then(() => {
                toaster.create({ title: '삭제되었습니다.', type: 'success' });
                navigate(0, { replace: true }); //새로고침
            })
            .catch((error) => {
                toaster.create({ title: '삭제에 실패했습니다.', type: 'error' });
            });
    }

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
                                <HStack gap="2">
                                    {user != null && user.user_code === review.user_code && (
                                        <HStack gap="0">
                                            <IconButton size="xs" variant="ghost" rounded="full" onClick={() => navigate(`/board/update/review/${review.review_code}`)}>
                                                <LuPencil />
                                            </IconButton>
                                            <Dialog.Root>
                                                <Dialog.Trigger asChild>
                                                    <IconButton size="xs" variant="ghost" rounded="full"><LuTrash /></IconButton>
                                                </Dialog.Trigger>
                                                <Dialog.Backdrop />
                                                <Dialog.Positioner>
                                                    <Dialog.Content>
                                                        <Dialog.Header>
                                                            <Dialog.Title>댓글 삭제</Dialog.Title>
                                                        </Dialog.Header>
                                                        <Dialog.Body>
                                                            작성하신 댓글을 정말 삭제하시겠습니까?
                                                        </Dialog.Body>
                                                        <Dialog.Footer>
                                                            <Dialog.ActionTrigger asChild>
                                                                <Button variant="outline">취소</Button>
                                                            </Dialog.ActionTrigger>
                                                            <Button colorPalette="red" onClick={() => deleteReview(review.review_code)}>삭제</Button>
                                                        </Dialog.Footer>
                                                    </Dialog.Content>
                                                </Dialog.Positioner>
                                            </Dialog.Root>
                                        </HStack>
                                    )}
                                    <Text fontSize="xs" color="fg.subtle">{formatDate(review.date)}</Text>
                                </HStack>
                            </Flex>
                            <Flex
                                justifyContent={reviewActive === review.id ? 'start' : 'space-between'}
                                flexDirection={reviewActive === review.id ? 'column' : 'row'}
                                alignItems={reviewActive === review.id ? 'start' : 'center'}>
                                {review.content.filter((item) => item.type === 'text').map((item, index) => (
                                    <Box key={index}
                                        whiteSpace={reviewActive === review.id ? 'normal' : 'nowrap'}
                                        overflow={reviewActive === review.id ? 'visible' : 'hidden'}
                                        textOverflow={reviewActive === review.id ? 'clip' : 'ellipsis'}
                                        fontSize="sm"
                                        dangerouslySetInnerHTML={{ __html: item.content }}
                                        css={reviewActive !== review.id ? { "& *": { display: "inline", margin: 0, padding: 0 } } : {}}
                                    />
                                ))}
                                <HStack>
                                    {review.content.filter((item) => item.type === 'image').map((item, index) => (
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
            {visibleReviewItems.length <= 0 && (
                <Box textAlign="center" color="fg.muted" fontSize="sm">상품 리뷰를 작성해주세요.</Box>
            )}
            <Pagination.Root display={visibleReviewItems.length <= 0 ? 'none' : 'block'} count={reviewCount} pageSize={reviewPageSize} page={reviewPage} onPageChange={(e) => setReviewPage(e.page)} margin="auto">
                <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                        <IconButton><HiChevronLeft /></IconButton>
                    </Pagination.PrevTrigger>
                    <Pagination.Items render={(page) => (
                        <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>{page.value}</IconButton>
                    )} />
                    <Pagination.NextTrigger asChild>
                        <IconButton><HiChevronRight /></IconButton>
                    </Pagination.NextTrigger>
                </ButtonGroup>
            </Pagination.Root>
        </Stack>
    )
}

function ProuctAsk({ productAskList = [] }) {
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const askCount = productAskList.length;
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
    const [askActive, setAskActive] = useState(null);
    const [secretDialogOpen, setSecretDialogOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const askClick = (id, is_secret, status, user_code) => {
        if (is_secret && user.user_code !== user_code) {
            setSecretDialogOpen(true);
            return;
        }

        if (status != 'pending') {
            if (askActive === id) setAskActive(null);
            else setAskActive(id);
        }

    }

    const visibleAskItems = productAskList.slice(startRange, endRange);

    const deleteInquiry = async (id) => {
        await axiosInstance.delete(`/shop/board/product/inquiry/${id}`)
            .then(() => {
                toaster.create({ title: '삭제되었습니다.', type: 'success' });
                navigate(0, { replace: true }); //새로고침
            })
            .catch((error) => {
                toaster.create({ title: '삭제에 실패했습니다.', type: 'error' });
            });
    }

    return (
        <Stack gap="6">
            <Stack separator={<StackSeparator />}>
                {visibleAskItems.map((ask) => (
                    <Stack
                        key={ask.id}
                        cursor="pointer"
                        onClick={() => askClick(ask.id, ask.is_secret, ask.status, ask.user_code)}
                        bg={askActive === ask.id ? 'bg.muted' : 'bg'}
                        p="5px 10px"
                    >
                        <Flex justifyContent="space-between">
                            <Text fontSize="sm" color="fg.muted">{ask.name}</Text>
                            <HStack>
                                {user != null && user.user_code === ask.user_code && (
                                    <HStack gap="0">
                                        <IconButton size="xs" variant="ghost" rounded="full" onClick={() => navigate(`/board/update/${ask.id}?ch=qna`)}>
                                            <LuPencil />
                                        </IconButton>
                                        <Dialog.Root>
                                            <Dialog.Trigger asChild>
                                                <IconButton size="xs" variant="ghost" rounded="full"><LuTrash /></IconButton>
                                            </Dialog.Trigger>
                                            <Dialog.Backdrop />
                                            <Dialog.Positioner>
                                                <Dialog.Content>
                                                    <Dialog.Header>
                                                        <Dialog.Title>문의 삭제</Dialog.Title>
                                                    </Dialog.Header>
                                                    <Dialog.Body>
                                                        작성하신 문의를 정말 삭제하시겠습니까?
                                                    </Dialog.Body>
                                                    <Dialog.Footer>
                                                        <Dialog.ActionTrigger asChild>
                                                            <Button variant="outline">취소</Button>
                                                        </Dialog.ActionTrigger>
                                                        <Button colorPalette="red" onClick={() => deleteInquiry(ask.id)}>삭제</Button>
                                                    </Dialog.Footer>
                                                </Dialog.Content>
                                            </Dialog.Positioner>
                                        </Dialog.Root>
                                    </HStack>
                                )}
                                <Text fontSize="xs" color="fg.subtle">{formatDate(ask.date)}</Text>
                            </HStack>
                        </Flex>
                        <Stack gap="4">
                            <Flex justifyContent="space-between" alignItems="start">
                                <Stack>
                                    {!user && ask.is_secret && user.user_code !== ask.user_code ? (<HStack><LuLock size="14" /> <Text fontSize="sm">비밀글입니다.</Text></HStack>)
                                        : ask.content.filter((item) => item.type === 'text').map((item, index) => (
                                            <Box key={index}
                                                whiteSpace={askActive === ask.id ? 'normal' : 'nowrap'}
                                                overflow={askActive === ask.id ? 'visible' : 'hidden'}
                                                textOverflow={askActive === ask.id ? 'clip' : 'ellipsis'}
                                                fontSize="sm"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                                css={askActive !== ask.id ? { "& *": { display: "inline", margin: 0, padding: 0 } } : {}}
                                            />
                                        ))
                                    }
                                    <HStack display={askActive === ask.id ? 'block' : 'none'}>
                                        {ask.content.filter((item) => item.type === 'image').map((item, index) => (
                                            <Image key={index}
                                                src={item.content}
                                                width={askActive === ask.id ? 'xs' : '12'}
                                                rounded="md" />
                                        ))}
                                    </HStack>
                                </Stack>
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
            {visibleAskItems.length <= 0 && (
                <Box textAlign="center" color="fg.muted" fontSize="sm">상품 관련 문의가 있다면 작성해주세요.</Box>
            )}
            <Pagination.Root display={visibleAskItems.length <= 0 ? 'none' : 'block'} count={askCount} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)} margin="auto">
                <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                        <IconButton><HiChevronLeft /></IconButton>
                    </Pagination.PrevTrigger>
                    <Pagination.Items render={(page) => (
                        <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>{page.value}</IconButton>
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

function PriceView({ selectedOptions = [], product, discount, onRemove, onChangeQuantity }) {
    if (selectedOptions.length <= 0) return null;

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
                            <NumberInput.Root min={1} max={selectedOption.stock} unstyled spinOnPress={false} value={selectedOption.quantity} onValueChange={(e) => onChangeQuantity(index, Number(e.value))}>
                                <HStack gap="2">
                                    <NumberInput.DecrementTrigger asChild>
                                        <IconButton variant="outline" size="5" rounded="full" p="1" disabled={selectedOption.quantity <= 1}>
                                            <Icon size="sm"><LuMinus /></Icon>
                                        </IconButton>
                                    </NumberInput.DecrementTrigger>
                                    <NumberInput.ValueText textAlign="center" />
                                    <NumberInput.IncrementTrigger asChild>
                                        <IconButton variant="outline" size="5" rounded="full" p="1" disabled={selectedOption.quantity >= selectedOption.stock}>
                                            <Icon size="sm"><LuPlus /></Icon>
                                        </IconButton>
                                    </NumberInput.IncrementTrigger>
                                </HStack>
                            </NumberInput.Root>
                            <Heading>{formatNumber(unitPrice * selectedOption.quantity)}</Heading>
                            {!selectedOption.unique && (
                                <CloseButton size="0" rounded="full" variant="solid" bg="gray.focusRing" onClick={() => onRemove(index)}><Icon size="xs"><HiX /></Icon></CloseButton>
                            )}
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

    const { id } = useParams();
    const navigate = useNavigate();
    const swiperCustomButton = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: '2', size: 'xs', rounded: 'full' };
    const swiperPrev = { ...swiperCustomButton, left: '30px' };
    const swiperNext = { ...swiperCustomButton, right: '30px' };

    const [detailOpen, setDetailOpen] = useState(false);

    const [product, setProduct] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [optionValueList, setOptionValueList] = useState([]);

    const [reviewList, setReviewList] = useState([]);
    const [reviewScore, setReviewScore] = useState(0);
    const [inquiryList, setInquiryList] = useState([]);

    const { user } = useAuth();

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axiosInstance.get(`/shop/product/${id}`);
                const data = response.data;

                if (!data.is_display) {
                    if (user == null || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                        toaster.create({ title: '잘못된 접근입니다.', type: 'error' });
                        navigate(-1); //뒤로 가기
                        return;
                    }
                }
                setProduct(data);

                if (data.options && Array.isArray(data.options) && data.options.length > 0) {
                    setOptions(data.options);
                } else {
                    const singleOption = {
                        optionId: `unique`,
                        label: data.name,
                        value: data.name,
                        stock: data.is_unlimited_stock ? 9999999999 : data.stock,
                    }

                    setOptionValueList([{ options: [singleOption], unique: true, quantity: 1, stock: data.is_unlimited_stock ? 9999999999 : data.stock }]);
                }

                let score = 0;

                // Fetch reviews
                const reviewsResponse = await axiosInstance.get(`/shop/board/product/review/${id}`);
                const formattedReviews = reviewsResponse.data.map(review => {
                    const contentItems = [];
                    contentItems.push({ id: `text_${review.id}`, type: 'text', content: review.content });

                    if (review.images) {
                        try {
                            const imagesArray = JSON.parse(review.images);
                            if (Array.isArray(imagesArray)) {
                                imagesArray.forEach((img, idx) => {
                                    contentItems.push({ id: `img_${review.id}_${idx}`, type: 'image', content: img });
                                });
                            }
                        } catch (e) {
                            console.error("Failed to parse review images", e);
                        }
                    }

                    score += review.rating;

                    return {
                        id: review.id,
                        name: review.user_name || '익명',
                        date: review.created_at || new Date().toISOString().split('T')[0],
                        user_code: review.user_code,
                        review_code: review.review_code,
                        rank: review.rating,
                        content: contentItems
                    };
                });

                const inquiryResponse = await axiosInstance.get(`/shop/board/product/inquiry/${id}`);
                const formattedInquirys = inquiryResponse.data.map(inquiry => {
                    const contentItems = [];
                    contentItems.push({ id: `text_${inquiry.id}`, type: 'text', content: inquiry.content });

                    if (inquiry.images) {
                        try {
                            const imagesArray = JSON.parse(inquiry.images);
                            if (Array.isArray(imagesArray)) {
                                imagesArray.forEach((img, idx) => {
                                    contentItems.push({ id: `img_${inquiry.id}_${idx}`, type: 'image', content: img })
                                });
                            }
                        } catch (e) {
                            console.error("Failed to parse inquiry images", e);
                        }
                    }

                    return {
                        id: inquiry.id,
                        name: inquiry.user_name || '익명',
                        date: inquiry.created_at || new Date().toISOString().split('T')[0],
                        user_code: inquiry.user_code,
                        is_secret: inquiry.is_secret,
                        content: contentItems
                    }
                })

                setReviewList(formattedReviews);
                const avgScore = formattedReviews.length > 0 ? score / formattedReviews.length : 0;
                setReviewScore(Math.round(avgScore * 2) / 2);
                setInquiryList(formattedInquirys);

            } catch (error) {
                toaster.create({ title: '상품 정보를 불러오는데 실패했습니다.', type: 'error' });
                console.error(error);
            }
        };


        getProduct();
    }, [id]);

    if (!product) {
        return (
            <Box p="80px" textAlign="center" minH="100vh" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" />
            </Box>
        )
    }

    const discount = { price: product.discount_price ? product.price - product.discount_price : 0 };

    const handleSelectChange = (optionIndex, option, value) => {
        const selectedItem = option.value.items.find(
            (item) => item.value === value
        );

        if (!selectedItem) return;

        setSelectedOptions((prev) => {
            const next = [...prev];
            next[optionIndex] = {
                optionId: option.id,
                label: selectedItem.label,
                value: selectedItem.value,
                stock: selectedItem.stock
            };

            if (next.length == options.length && next.every(Boolean)) {
                setOptionValueList((prevList) => {
                    const exists = prevList.some((item) =>
                        item.options.every(
                            (opt, idx) => opt.value === next[idx].value
                        )
                    );

                    if (exists) return prevList;

                    // Calculate max quantity based on the minimum stock of selected options
                    const minStock = Math.min(...next.map(opt => opt.stock));

                    return [...prevList, { options: [...next], quantity: 1, stock: minStock }];
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
            prev.map((item, i) => {
                if (i === index) {
                    const maxStock = item.stock;
                    const newQuantity = Math.min(quantity, maxStock);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        )
    }

    /**
     * 옵션 DB 연동
     */
    const optionList = options.map((option) => ({
        label: option.label,
        id: option.id,
        value: createListCollection({
            items: option.items
        })
    }));

    const submitOrder = () => {
        console.log(optionValueList);
    }


    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} gap="12" width={{ base: 'full', md: "6xl" }} margin="auto">
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
                <Stack gap="10" direction={{ base: 'column', md: "row" }} alignItems="start">
                    <Box position="relative" width={{ base: 'full', md: "1/2" }} className="productImage">
                        <IconButton className="swiper_prev" {...swiperPrev}><LuChevronLeft /></IconButton>
                        <IconButton className="swiper_next" {...swiperNext}><LuChevronRight /></IconButton>
                        <Swiper slidesPerView={1} pagination={{ clickable: true }} modules={[Navigation, SwiperPagination]} navigation={{ prevEl: '.productImage .swiper_prev', nextEl: '.productImage .swiper_next' }}>
                            {product.images && product.images.length > 0 ? (
                                product.images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <Image src={img.url} width="full" aspectRatio="square" rounded="md" objectFit="cover" />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide><Box width="full" bg="bg.emphasized" aspectRatio="square" rounded="md"></Box></SwiperSlide>
                            )}
                        </Swiper>
                    </Box>
                    <Box width={{ base: 'full', md: "1/2" }}>
                        <Stack gap="6" borderTop="2px solid #000" pt="30px">
                            <Heading size="2xl">{product.name}</Heading>
                            <HStack gap="5">
                                <RatingGroup.Root readOnly allowHalf count={5} defaultValue={0} size="sm" value={reviewScore} colorPalette="yellow">
                                    <RatingGroup.HiddenInput />
                                    <RatingGroup.Control />
                                </RatingGroup.Root>
                                {reviewList.length > 0 && <Button variant="plain" borderBottom="1px solid #000" p="0" rounded="0" height="auto" onClick={() => scrollViewPosition('review')}>{reviewList.length}개 리뷰 보기</Button>}
                            </HStack>
                            <Stack gap="0">
                                {discount.price > 0 && <Text fontSize="md" textDecoration="line-through" color="fg.subtle">{formatNumber(product.price)}</Text>}
                                <HStack alignItems="end">
                                    {discount.price > 0 && <Text fontSize="lg" fontWeight="medium">{calcDiscountPercent(product.price, product.price - discount.price)}%</Text>}
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
                            {product.is_sale ? (
                                <HStack>
                                    <Button variant="outline" width="1/2">장바구니 담기</Button>
                                    <Button width="1/2" onClick={() => submitOrder()}>바로 구매하기</Button>
                                </HStack>
                            ) : (
                                <Button disabled={true}>구매 불가</Button>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
            <Stack gap="6">
                <Heading>상품 설명</Heading>
                <Collapsible.Root collapsedHeight="500px" open={detailOpen} onOpenChange={(e) => setDetailOpen(e.open)}>
                    <Collapsible.Content _closed={{ shadow: 'inset 0 -12px 12px -12px var(--shadow-color)', shadowColor: 'blackAlpha.500' }}>
                        <Stack>
                            <Box dangerouslySetInnerHTML={{ __html: product.description }} />
                        </Stack>
                    </Collapsible.Content>
                    <Collapsible.Trigger asChild mt="4">
                        <Button variant="outline" width="full">
                            {detailOpen ? '닫기' : '더보기'}
                            <Collapsible.Indicator transition="transform 0.2s" _open={{ transform: 'rotate(180deg)' }}>
                                <LuChevronDown />
                            </Collapsible.Indicator>
                        </Button>
                    </Collapsible.Trigger>
                </Collapsible.Root>
            </Stack>
            <Stack gap="6" id="review">
                <Flex justifyContent="space-between">
                    <HStack>
                        <Heading>리뷰({reviewList.length})</Heading>
                        <RatingGroup.Root readOnly allowHalf count={5} defaultValue={0} value={reviewScore} size="sm" colorPalette="yellow">
                            <RatingGroup.HiddenInput />
                            <RatingGroup.Control />
                        </RatingGroup.Root>
                    </HStack>
                    <Link href={`/board/register/review/${id}`} fontSize="sm">리뷰 작성 <LuChevronRight /></Link>
                </Flex>
                <ReviewView reviewList={reviewList} />
            </Stack>
            <Stack gap="6">
                <Flex justifyContent="space-between">
                    <Heading>상품 Q&A</Heading>
                    <Link href={`/board/register/qna/${id}`} fontSize="sm">Q&A 작성 <LuChevronRight /></Link>
                </Flex>
                <ProuctAsk productAskList={inquiryList} />
            </Stack>
        </Stack>
    )
}

export default Detail;