import { Box, Button, Flex, Heading, HStack, Image, Stack, StackSeparator, Text, Spinner, EmptyState } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/api";
import { formatNumber } from "../../../utils/simpleUtils";
import { LuShoppingCart } from "react-icons/lu";

function RecentProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const response = await axiosInstance.get('/shop/product/recent?limit=50');
                setProducts(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, []);

    if (loading) {
        return (
            <Box p="40px" textAlign="center">
                <Spinner />
            </Box>
        );
    }

    return (
        <Stack gap="6" w="full" minW="0" rounded="md" border={{ base: 'none', md: "1px solid #eee" }} p={{ base: '0 15px', md: "20px" }} textAlign="left">
            <Heading>최근 본 상품</Heading>
            <Stack separator={<StackSeparator />} gap="4">
                {products.length === 0 ? (
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator><LuShoppingCart /></EmptyState.Indicator>
                            <VStack textAlign="center">
                                <EmptyState.Title>내역이 없습니다.</EmptyState.Title>
                                <EmptyState.Description>
                                    최근 본 상품이 없습니다.
                                </EmptyState.Description>
                            </VStack>
                        </EmptyState.Content>
                    </EmptyState.Root>
                ) : (
                    products.map((item) => (
                        <Flex key={item.product_code} justifyContent="space-between" alignItems="center">
                            <HStack gap="4">
                                <Image
                                    src={item.main_image}
                                    boxSize="80px"
                                    rounded="md"
                                    objectFit="cover"
                                    cursor="pointer"
                                    onClick={() => navigate(`/products/${item.product_code}`)}
                                />
                                <Stack gap="1">
                                    <Text fontWeight="medium" cursor="pointer" onClick={() => navigate(`/products/${item.product_code}`)} fontSize="sm">
                                        {item.product_name}
                                    </Text>
                                    <Text>{formatNumber(item.product_price)}원</Text>
                                </Stack>
                            </HStack>
                            <Button size="xs" variant="outline" onClick={() => navigate(`/products/${item.product_code}`)} display={{ base: 'none', md: 'inline-flex' }}>
                                상품 보기
                            </Button>
                        </Flex>
                    ))
                )}
            </Stack>
        </Stack>
    );
}

export default RecentProducts;
