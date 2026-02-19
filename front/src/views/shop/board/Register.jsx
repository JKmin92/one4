import { Heading, Stack, Image, Text, HStack, Box, Button, RatingGroup } from "@chakra-ui/react";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/api";
import { toaster } from "../../../components/ui/toaster";
import BoardEditor from "./BoardEditor";

function Register() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const ch = searchParams.get('ch');

    const [product, setProduct] = useState(null);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axiosInstance.get(`/shop/product/${id}`);
                setProduct(response.data);
            } catch (error) {
                toaster.create({ title: '상품 정보를 불러오는데 실패했습니다.', type: 'error' });
            }
        };
        if (id) getProduct();
    }, [id]);

    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

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

                <HStack>
                    <Text fontWeight="medium">평점</Text>
                    <RatingGroup.Root allowHalf count={5} defaultValue={0} size="lg" colorPalette="yellow">
                        <RatingGroup.HiddenInput />
                        <RatingGroup.Control />
                    </RatingGroup.Root>
                </HStack>

                <BoardEditor />

                <Stack direction="row" gap="2" wrap="wrap">
                    {images.map((image, index) => (
                        <Box key={index} position="relative" width="20" height="20" rounded="md" overflow="hidden" borderWidth="1px">
                            <Image src={image.preview} w="full" h="full" objectFit="cover" />
                            <Box
                                as="button"
                                position="absolute"
                                top="1"
                                right="1"
                                bg="blackAlpha.600"
                                color="white"
                                rounded="full"
                                w="4"
                                h="4"
                                display="flex"
                                alignItems="center"
                                cursor="pointer"
                                justifyContent="center"
                                onClick={() => handleRemoveImage(index)}
                            >
                                <Text fontSize="xs">✕</Text>
                            </Box>
                        </Box>
                    ))}
                </Stack>

                <HStack justifyContent="space-between">
                    <input type="file" multiple accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />
                    <Button variant="outline" onClick={() => fileInputRef.current.click()}>이미지 업로드</Button>
                    <Button>등록</Button>
                </HStack>
            </Stack>
        </Stack>
    )
}

export default Register;