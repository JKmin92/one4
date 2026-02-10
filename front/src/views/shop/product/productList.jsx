import { Box, Button, Flex, Heading, HStack, Link, RatingGroup, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { calcDiscountPercent, formatNumber } from "../../../utils/simpleUtils";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toaster } from "../../../components/ui/toaster";
import axiosInstance from "../../../utils/api";

function ProductList() {

    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [subCategorys, setSubCategorys] = useState([]);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const getCateogry = async () => {
            try {
                const response = await axiosInstance.get(`/shop/product/category/${id}`);
                setCategory(response.data);
            } catch {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
            }
        }
        getCateogry();

        const getSubCategorys = async () => {
            try {
                const response = await axiosInstance.get(`/shop/product/subCategory/${id}`);
                setSubCategorys(response.data);
            } catch {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
            }
        }
        getSubCategorys();

        const getProductList = async () => {
            try {
                const response = await axiosInstance.get(`/shop/product/list/${id}`);
                setProductList(response.data);
            } catch {
                toaster.create({ title: '상품 목록을 불러오는데 실패했습니다.', type: 'error' })
            }
        }
        getProductList();
    }, [id]);

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} >
            <Stack direction={{ base: 'column', md: "row" }} gap="10">
                <Stack width={{ base: 'full', md: "3xs" }} position="relative">
                    <Stack position="sticky" left="0" top="5">
                        <Heading size="2xl">{category?.name}</Heading>
                        <Stack direction={{ base: 'row', md: "column" }} marginTop="15px" gap="2" paddingTop="15px" borderTop="3px solid" borderTopColor="main" overflowX='auto'>
                            {subCategorys.map((subCategory) => (
                                <Button variant="plain" key={subCategory.id} justifyContent="start" padding="0">
                                    <Link href={`/categorys/${subCategory.id}`} width="full" fontWeight={subCategory.id == id ? 'bold' : 'normal'}>{subCategory.name}</Link>
                                </Button>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
                <Stack gap="6" width="full">
                    <Box width="full" height="250px" rounded="md" bg="bg.emphasized"></Box>
                    <Stack>
                        <HStack bg="bg.muted" rounded="md">
                            <Button variant="ghost" fontSize="sm">추천순</Button>
                            <Button variant="ghost" fontSize="sm">낮은가격순</Button>
                            <Button variant="ghost" fontSize="sm">높은가격순</Button>
                            <Button variant="ghost" fontSize="sm">최신순</Button>
                        </HStack>
                    </Stack>
                    <SimpleGrid columns={{ base: 2, md: 5 }} gap="8">
                        {productList.map((product) => {
                            const mainImage = product.images && Array.isArray(product.images)
                                ? product.images.find(img => img.is_main === 1)
                                : null;
                            const imageUrl = mainImage ? mainImage.url : '';

                            return (
                                <Link href={`/products/${product.id}`} key={product.id} alignItems="start">
                                    <Stack width="full">
                                        <Box bg="bg.emphasized" aspectRatio="square" rounded="md" overflow="hidden">
                                            {imageUrl && <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </Box>
                                        <Text fontSize="md" fontWeight="medium">{product.name}</Text>
                                        {product.discount_price ? (
                                            <Stack gap="0">
                                                <Text fontSize="xs" textDecoration="line-through">{formatNumber(product.price)}</Text>
                                                <HStack alignItems="end">
                                                    <Text fontSize="sm" fontWeight="medium">{calcDiscountPercent(product.price, product.discount_price)}%</Text>
                                                    <Text fontWeight="medium">{formatNumber(product.discount_price)}</Text>
                                                </HStack>
                                            </Stack>
                                        ) : (
                                            <Text fontWeight="medium">{formatNumber(product.price)}</Text>
                                        )}
                                        {/* Rating Mock Data - to be connected later if needed */}
                                        <RatingGroup.Root readOnly allowHalf count={5} defaultValue={5} size="sm" colorPalette="yellow">
                                            <RatingGroup.HiddenInput />
                                            <RatingGroup.Control />
                                        </RatingGroup.Root>
                                    </Stack>
                                </Link>
                            )
                        })}
                    </SimpleGrid >
                </Stack>
            </Stack>
        </Stack>
    )
}

export default ProductList;