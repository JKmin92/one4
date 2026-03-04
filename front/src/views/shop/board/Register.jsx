import { Heading, Stack, Image, Text, HStack, Box, Button, RatingGroup, Checkbox, createListCollection, Select } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/api";
import { toaster } from "../../../components/ui/toaster";
import BoardEditor from "./BoardEditor";
import { useAuth } from "../../../utils/useAuth";

function Register() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const ch = searchParams.get('ch');
    const location = useLocation();

    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState(null);
    const [is_secret, setIsSecret] = useState(false);
    const [type, setType] = useState([]);

    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        if (id === null || ch === null || ch !== 'review' && ch !== 'qna') {
            toaster.create({ title: '잘못된 접근입니다.', type: 'error' });
            navigate(-1);//이전 페이지로
            return;
        }

        const getProduct = async () => {
            try {
                let getProductUrl = `/shop/product/${id}`;
                if (location.pathname.includes('update') && ch === 'review') {
                    const response = await axiosInstance.get(`/shop/board/product/review/edit/${id}`);
                    getProductUrl = `/shop/product/${response.data.product_id}`;
                    setRating(response.data.rating);
                    setContent(response.data.content);

                    if (response.data.images) {
                        try {
                            const parsedImages = JSON.parse(response.data.images);
                            const existingImages = parsedImages.map(url => ({
                                file: null,
                                preview: url,
                                isExisting: true
                            }));
                            setImages(existingImages);
                        } catch (e) {
                            console.error("Failed to parse images", e);
                        }
                    }

                    if (response.data.user_code !== user.user_code) {
                        toaster.create({ title: '수정 권한이 없습니다.', type: 'error' });
                        navigate(`/products/${id}`);
                    }
                } else if (location.pathname.includes('update') && ch === 'qna') {
                    const response = await axiosInstance.get(`/shop/board/product/inquiry/edit/${id}`);
                    getProductUrl = `/shop/product/${response.data.product_id}`;
                    setContent(response.data.content);
                    setIsSecret(response.data.is_secret === 1 ? true : false);
                    setType([response.data.type]);

                    if (response.data.images) {
                        try {
                            const parsedImages = JSON.parse(response.data.images);
                            const existingImages = parsedImages.map(url => ({
                                file: null,
                                preview: url,
                                isExisting: true
                            }));
                            setImages(existingImages);
                        } catch (e) {
                            console.error("Failed to parse images", e);
                        }
                    }

                    if (response.data.user_id !== user.user_code) {
                        toaster.create({ title: '수정 권한이 없습니다.', type: 'error' });
                        navigate(`/products/${id}`);
                    }
                }

                const response = await axiosInstance.get(getProductUrl);
                setProduct(response.data);
            } catch (error) {
                toaster.create({ title: '상품 정보를 불러오는데 실패했습니다.', type: 'error' });
            }
        };
        if (id) getProduct();
    }, [id]);

    const saveBoard = async () => {
        const formData = new FormData();

        if (ch == 'review') {
            formData.append('rating', rating);
        } else {
            formData.append('is_secret', is_secret);
            if (type.length > 0) formData.append('type', type[0]);
            else {
                toaster.create({ title: '문의 유형을 선택해주세요.', type: 'error' });
                return;
            }
        }
        formData.append('content', content);
        formData.append('ch', ch);

        images.forEach(img => {
            if (img.file) {
                formData.append('images', img.file);
            } else if (img.isExisting) {
                formData.append('existingImages', img.preview);
            }
        });

        try {
            if (location.pathname.includes('update')) {
                if (ch === 'review') {
                    await axiosInstance.put(`/shop/board/product/review/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    await axiosInstance.put(`/shop/board/product/inquiry/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
                toaster.create({ title: '수정되었습니다.', type: 'success' });
            } else {
                if (ch === 'review') {
                    await axiosInstance.post(`/shop/board/product/review/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    await axiosInstance.post(`/shop/board/product/inquiry/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
                toaster.create({ title: '등록되었습니다.', type: 'success' });
            }

            navigate(`/products/${product.id}`);
        } catch (error) {
            console.error(error);
            if (location.pathname.includes('update')) {
                toaster.create({ title: '수정에 실패했습니다.', type: 'error' });
            } else {
                toaster.create({ title: '등록에 실패했습니다.', type: 'error' });
            }
        }
    }



    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    useEffect(() => {
        if (user === null) {
            toaster.create({ title: '로그인이 필요한 서비스입니다.', type: 'error' });
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const inquiryFrameworks = createListCollection({
        items: [
            { label: '제품 문의', value: 'PRODUCT' },
            { label: '배송 문의', value: 'DELIVERY' },
            { label: '기타 문의', value: 'ACC' }
        ]
    })

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} gap="12" width={{ base: 'full', md: "6xl" }} margin="auto">
            <Stack gap="6">
                <Heading size="lg">{ch === 'review' ? '리뷰 작성' : '문의 작성'}</Heading>
                {product && (
                    <HStack gap="4" p="4" borderWidth="1px" rounded="md">
                        <Box width="20" height="20" bg="gray.100" rounded="md" overflow="hidden">
                            {product.images && product.images.length > 0 ? (
                                <Image src={product.images[0].url} w="full" h="full" objectFit="cover" />
                            ) : (
                                <Box w="full" h="full" bg="gray.200" />
                            )}
                        </Box>
                        <Stack gap="1">
                            <Text fontWeight="medium">{product.name}</Text>
                            <Text fontSize="sm" color="fg.muted">{Number(product.price).toLocaleString()}원</Text>
                        </Stack>
                    </HStack>
                )}

                {ch === 'review' ? (
                    <HStack>
                        <Text fontWeight="medium">평점</Text>
                        <RatingGroup.Root allowHalf count={5} defaultValue={0} value={rating} onValueChange={(e) => setRating(e.value)} size="lg" colorPalette="yellow">
                            <RatingGroup.HiddenInput />
                            <RatingGroup.Control />
                        </RatingGroup.Root>
                    </HStack>
                ) : (
                    <HStack>
                        <Select.Root collection={inquiryFrameworks} size="sm" maxW="320px" value={type} onValueChange={(e) => setType(e.value)}>
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="문의 유형을 선택해주세요" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                                <Select.Content>
                                    {inquiryFrameworks.items.map((item) => (
                                        <Select.Item key={item.value} item={item}>
                                            {item.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Select.Root>
                        <Checkbox.Root checked={is_secret} onCheckedChange={(e) => setIsSecret(!!e.checked)}>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>비공개</Checkbox.Label>
                        </Checkbox.Root>
                    </HStack>
                )}


                <BoardEditor content={content} setContent={setContent} />

                <Stack direction="row" gap="2" wrap="wrap">
                    {images.map((image, index) => (
                        <Box key={index} position="relative" width="20" height="20" rounded="md" overflow="hidden" borderWidth="1px">
                            <Image src={image.preview} w="full" h="full" objectFit="cover" />
                            <Box as="button" position="absolute" top="1" right="1"
                                bg="blackAlpha.600" color="white" rounded="full" w="4" h="4" display="flex"
                                alignItems="center" cursor="pointer" justifyContent="center"
                                onClick={() => handleRemoveImage(index)}>
                                <Text fontSize="2xs">✕</Text>
                            </Box>
                        </Box>
                    ))}
                </Stack>

                <HStack justifyContent="space-between">
                    <input type="file" multiple accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />
                    <Button variant="outline" onClick={() => fileInputRef.current.click()}>이미지 업로드</Button>
                    <Button onClick={saveBoard}>등록</Button>
                </HStack>
            </Stack>
        </Stack>
    )
}

export default Register;