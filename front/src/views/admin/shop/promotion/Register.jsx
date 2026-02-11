import { Box, Button, Flex, Heading, HStack, Input, Stack, Text, RadioGroup, List, Badge, CloseButton, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import CategoryView from "../product/CategoryView";
import { LuSearch } from "react-icons/lu";

function Register() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState({
        name: "",
        code: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        description: "",
        isActive: true,
        targetType: "all", // all, category, product
    });

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [productSearchKeyword, setProductSearchKeyword] = useState("");
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get("/admin/shop/product/category");
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchPromotion = async () => {
                try {
                    const response = await axiosInstance.get(`/admin/shop/promotion/${id}`);
                    const data = response.data;

                    setPromotion({
                        name: data.name,
                        code: data.code,
                        discountType: data.discount_type,
                        discountValue: data.discount_value,
                        startDate: data.start_date.split('T')[0],
                        endDate: data.end_date.split('T')[0],
                        description: data.description,
                        isActive: data.is_active === 1,
                        targetType: data.targets.length > 0 ? data.targets[0].target_type : 'all',
                    });

                    if (data.targets.length > 0) {
                        const targetType = data.targets[0].target_type;
                        if (targetType === 'category') {
                            const initialCategories = data.targets.map(t => ({ id: t.target_id, name: t.category_name }));
                            setSelectedCategories(initialCategories);
                        } else if (targetType === 'product') {
                            const initialProducts = data.targets.map(t => ({
                                id: t.target_id,
                                name: t.product_name,
                                price: t.product_price,
                                images: t.product_images
                            }));
                            setSelectedProducts(initialProducts);
                        }
                    }

                } catch (error) {
                    console.error("Failed to fetch promotion", error);
                    toaster.create({ title: "프로모션 정보를 불러오는데 실패했습니다.", type: "error" });
                }
            };
            fetchPromotion();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPromotion((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
        if (promotion.targetType === 'product') {
            handleSearchProduct();
        }
    }, [promotion.targetType]);

    const handleSearchProduct = async () => {
        try {
            const response = await axiosInstance.get("/admin/shop/product", {
                params: { keyword: productSearchKeyword }
            });
            setSearchedProducts(response.data);
        } catch (error) {
            console.error("Failed to search products", error);
            toaster.create({ title: "상품 목록을 불러오는데 실패했습니다.", type: "error" });
        }
    };

    const handleAddProduct = (product) => {
        if (!selectedProducts.find(p => p.id === product.id)) {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!promotion.name.trim()) {
            toaster.create({ title: "프로모션명을 입력해주세요.", type: "warning" });
            return;
        }

        if (!promotion.discountValue) {
            toaster.create({ title: "할인 값을 입력해주세요.", type: "warning" });
            return;
        }

        if (!promotion.startDate || !promotion.endDate) {
            toaster.create({ title: "적용 기간을 선택해주세요.", type: "warning" });
            return;
        }

        if (promotion.targetType === 'category' && selectedCategories.length === 0) {
            toaster.create({ title: "적용할 카테고리를 하나 이상 선택해주세요.", type: "warning" });
            return;
        }

        if (promotion.targetType === 'product' && selectedProducts.length === 0) {
            toaster.create({ title: "적용할 상품을 하나 이상 선택해주세요.", type: "warning" });
            return;
        }

        const payload = {
            ...promotion,
            targets: promotion.targetType === 'category'
                ? selectedCategories.map(c => c.id)
                : promotion.targetType === 'product'
                    ? selectedProducts.map(p => p.id)
                    : []
        };

        try {
            await axiosInstance.post("/admin/shop/promotion", payload);
            toaster.create({ title: "프로모션이 성공적으로 등록되었습니다.", type: "success" });
            navigate("/admin/shop/promotion/list");
        } catch (error) {
            console.error(error);
            toaster.create({ title: "프로모션 등록 중 오류가 발생했습니다.", type: "error" });
        }
    };

    return (
        <Box p="30px" px="layoutX" gap="10" pb="20">
            <Flex justifyContent="space-between" alignItems="center" mb="6">
                <Heading size="lg">{id ? "프로모션 수정" : "프로모션 등록"}</Heading>
                <Button colorScheme="primary" onClick={() => navigate("/admin/shop/promotion/list")}>
                    목록으로
                </Button>
            </Flex>

            <form onSubmit={handleSubmit}>
                <Stack gap="10">
                    {/* 기본 정보 */}
                    <Stack gap="4" bg="bg.surface" p="6" rounded="lg" borderWidth="1px">
                        <Stack gap="2">
                            <Text fontWeight="medium">프로모션명</Text>
                            <Input
                                name="name"
                                value={promotion.name}
                                onChange={handleChange}
                                placeholder="프로모션 이름을 입력해주세요"
                                required
                            />
                        </Stack>
                        <Stack gap="2">
                            <Text fontWeight="medium">설명</Text>
                            <Input
                                name="description"
                                value={promotion.description}
                                onChange={handleChange}
                                placeholder="프로모션에 대한 설명을 입력해주세요 (선택사항)"
                            />
                        </Stack>
                    </Stack>

                    {/* 타겟 설정 */}
                    <Stack gap="4" bg="bg.surface" p="6" rounded="lg" borderWidth="1px">
                        <Stack gap="2">
                            <Text fontWeight="medium">적용 대상</Text>
                            <RadioGroup.Root
                                value={promotion.targetType}
                                onValueChange={(e) => setPromotion({ ...promotion, targetType: e.value })}
                            >
                                <HStack gap="6">
                                    <RadioGroup.Item value="all">
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>전체 상품</RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="category">
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>특정 카테고리</RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="product">
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>특정 상품</RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                </HStack>
                            </RadioGroup.Root>
                        </Stack>

                        {promotion.targetType === 'category' && (
                            <Stack gap="4" borderWidth="1px" p="4" rounded="md" bg="gray.50">
                                <CategoryView
                                    categories={categories}
                                    selectedCategory={selectedCategories}
                                    setSelectedCategory={setSelectedCategories}
                                />
                                <Box>
                                    <Text fontWeight="medium" mb="2">선택된 카테고리</Text>
                                    <Flex gap="2" flexWrap="wrap">
                                        {selectedCategories.map(cat => (
                                            <Badge key={cat.id} variant="solid" colorPalette="green" size="lg">
                                                {cat.name}
                                                <CloseButton size="2xs" ml="1" rounded="full" onClick={() => setSelectedCategories(prev => prev.filter(c => c.id !== cat.id))} />
                                            </Badge>
                                        ))}
                                    </Flex>
                                </Box>
                            </Stack>
                        )}

                        {promotion.targetType === 'product' && (
                            <Stack gap="4" borderWidth="1px" p="4" rounded="md" bg="gray.50">
                                <HStack>
                                    <Input
                                        placeholder="상품명 검색"
                                        value={productSearchKeyword}
                                        onChange={(e) => setProductSearchKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchProduct())}
                                    />
                                    <Button onClick={handleSearchProduct}><LuSearch /></Button>
                                </HStack>

                                {searchedProducts.length > 0 && (
                                    <Box maxHeight="200px" overflowY="auto" borderWidth="1px" rounded="md" bg="white">
                                        <List.Root variant="plain">
                                            {searchedProducts.map(product => {
                                                const mainImage = product.images && product.images.find(img => img.is_main === 1);
                                                return (
                                                    <List.Item
                                                        key={product.id}
                                                        p="2"
                                                        _hover={{ bg: "gray.100", cursor: "pointer" }}
                                                        onClick={() => handleAddProduct(product)}
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        borderBottomWidth="1px"
                                                    >
                                                        <HStack gap="3">
                                                            <Box w="10" h="10" rounded="md" overflow="hidden" bg="gray.100" flexShrink={0}>
                                                                {mainImage ? (
                                                                    <Image src={mainImage.url} w="full" h="full" objectFit="cover" />
                                                                ) : (
                                                                    <Box w="full" h="full" bg="gray.200" />
                                                                )}
                                                            </Box>
                                                            <Text truncate>{product.name}</Text>
                                                        </HStack>
                                                        <Text fontSize="sm" color="gray.500">{Number(product.price).toLocaleString()}원</Text>
                                                    </List.Item>
                                                )
                                            })}
                                        </List.Root>
                                    </Box>
                                )}

                                <Box>
                                    <Text fontWeight="medium" mb="2">선택된 상품</Text>
                                    <Stack gap="2">
                                        {selectedProducts.map(product => {
                                            const mainImage = product.images && product.images.find(img => img.is_main === 1);
                                            return (
                                                <HStack key={product.id} p="2" borderWidth="1px" rounded="md" bg="gray.50" justifyContent="space-between">
                                                    <HStack gap="3">
                                                        <Box w="10" h="10" rounded="md" overflow="hidden" bg="white" flexShrink={0} borderWidth="1px">
                                                            {mainImage ? (
                                                                <Image src={mainImage.url} w="full" h="full" objectFit="cover" />
                                                            ) : (
                                                                <Box w="full" h="full" bg="gray.100" />
                                                            )}
                                                        </Box>
                                                        <Text fontWeight="medium">{product.name}</Text>
                                                    </HStack>
                                                    <CloseButton size="sm" rounded="full" onClick={() => handleRemoveProduct(product.id)} />
                                                </HStack>
                                            )
                                        })}
                                    </Stack>
                                </Box>
                            </Stack>
                        )}
                    </Stack>

                    {/* 할인 설정 */}
                    <Stack gap="4" bg="bg.surface" p="6" rounded="lg" borderWidth="1px">
                        <Stack gap="2">
                            <Text fontWeight="medium">할인 유형</Text>
                            <HStack>
                                <Button
                                    variant={promotion.discountType === "percentage" ? "solid" : "outline"}
                                    colorScheme={promotion.discountType === "percentage" ? "primary" : "gray"}
                                    onClick={() => setPromotion({ ...promotion, discountType: "percentage" })}
                                >
                                    비율 할인
                                </Button>
                                <Button
                                    variant={promotion.discountType === "fixed" ? "solid" : "outline"}
                                    colorScheme={promotion.discountType === "fixed" ? "primary" : "gray"}
                                    onClick={() => setPromotion({ ...promotion, discountType: "fixed" })}
                                >
                                    고정 금액 할인
                                </Button>
                            </HStack>
                        </Stack>

                        <Stack gap="2">
                            <Text fontWeight="medium">할인 값</Text>
                            <Input
                                name="discountValue"
                                type="number"
                                value={promotion.discountValue}
                                onChange={handleChange}
                                placeholder={promotion.discountType === "percentage" ? "할인 비율을 입력해주세요 (예: 20)" : "개당 할인 금액을 입력해주세요 (예: 10000)"}
                                required
                            />
                        </Stack>

                        <Stack gap="2">
                            <Text fontWeight="medium">적용 기간</Text>
                            <HStack>
                                <Input
                                    name="startDate"
                                    type="date"
                                    value={promotion.startDate}
                                    onChange={handleChange}
                                    required
                                />
                                <Text>~</Text>
                                <Input
                                    name="endDate"
                                    type="date"
                                    value={promotion.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </HStack>
                        </Stack>
                    </Stack>



                    <Stack gap="4" bg="bg.surface" p="6" rounded="lg" borderWidth="1px">
                        <Stack gap="2">
                            <Text fontWeight="medium">상태</Text>
                            <HStack>
                                <Button
                                    variant={promotion.isActive ? "solid" : "outline"}
                                    colorScheme={promotion.isActive ? "primary" : "gray"}
                                    onClick={() => setPromotion({ ...promotion, isActive: true })}
                                >
                                    활성
                                </Button>
                                <Button
                                    variant={!promotion.isActive ? "solid" : "outline"}
                                    colorScheme={!promotion.isActive ? "primary" : "gray"}
                                    onClick={() => setPromotion({ ...promotion, isActive: false })}
                                >
                                    비활성
                                </Button>
                            </HStack>
                        </Stack>
                    </Stack>

                    <Flex justifyContent="flex-end" gap="3" mt="4">
                        <Button variant="outline" onClick={() => navigate("/admin/shop/promotion/list")}>
                            취소
                        </Button>
                        <Button colorScheme="primary" type="submit">
                            {id ? "수정하기" : "등록하기"}
                        </Button>
                    </Flex>
                </Stack>
            </form>
        </Box >
    );
}

export default Register;