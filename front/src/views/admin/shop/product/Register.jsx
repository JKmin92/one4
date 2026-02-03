import { Box, Button, CloseButton, Field, Heading, HStack, Image, Input, List, RadioGroup, Stack, Table, Text, Textarea } from "@chakra-ui/react";
import CategoryView from "./CategoryView";
import { useEffect, useState } from "react";
import { LuImage, LuPlus, LuTrash } from "react-icons/lu";

function Register() {

    const [selectedCategory, setSelectedCategory] = useState([]);

    // Basic Info
    const [productName, setProductName] = useState("");
    const [productDetail, setProductDetail] = useState("");

    // Stock & Options
    const [hasOptions, setHasOptions] = useState("off");
    const [totalStock, setTotalStock] = useState(0);
    const [options, setOptions] = useState([]);
    const [newOption, setNewOption] = useState({ name: "", value: "", stock: 0 });

    // Images
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [subImages, setSubImages] = useState([]);
    const [subImagePreviews, setSubImagePreviews] = useState([]);

    // Calculate Total Stock when options change
    useEffect(() => {
        if (hasOptions === "on") {
            const calculatedStock = options.reduce((sum, opt) => sum + Number(opt.stock), 0);
            setTotalStock(calculatedStock);
        }
    }, [options, hasOptions]);

    const handleAddOption = () => {
        if (!newOption.name || !newOption.value) return;
        setOptions([...options, { ...newOption, id: Date.now() }]);
        setNewOption({ name: "", value: "", stock: 0 });
    };

    const handleDeleteOption = (id) => {
        setOptions(options.filter(opt => opt.id !== id));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSubImages([...subImages, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setSubImagePreviews([...subImagePreviews, ...newPreviews]);
        }
    };

    const removeSubImage = (index) => {
        const newImages = [...subImages];
        newImages.splice(index, 1);
        setSubImages(newImages);

        const newPreviews = [...subImagePreviews];
        newPreviews.splice(index, 1);
        setSubImagePreviews(newPreviews);
    };

    return (
        <Stack p="30px" px="layoutX" gap="10" pb="20">
            <Heading>상품 등록</Heading>

            {/* 1. 노출/판매 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">노출 및 판매 설정</Heading>
                <HStack gap="12">
                    <Field.Root w="auto">
                        <Field.Label mb="2">진열 상태</Field.Label>
                        <RadioGroup.Root defaultValue="off">
                            <HStack gap="6">
                                <RadioGroup.Item value="on">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>진열함</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="off">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>진열 안함</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </HStack>
                        </RadioGroup.Root>
                    </Field.Root>
                    <Field.Root w="auto">
                        <Field.Label mb="2">판매 상태</Field.Label>
                        <RadioGroup.Root defaultValue="off">
                            <HStack gap="6">
                                <RadioGroup.Item value="on">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>판매함</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="off">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>판매 안함</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </HStack>
                        </RadioGroup.Root>
                    </Field.Root>
                </HStack>
            </Stack>

            {/* 2. 카테고리 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">카테고리 설정</Heading>
                <Stack direction="row" gap="12" alignItems="start">
                    <Field.Root maxW="sm">
                        <Field.Label mb="2">카테고리 선택</Field.Label>
                        <CategoryView setSelectedCategory={setSelectedCategory} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">선택된 카테고리</Field.Label>
                        <Box borderWidth="1px" borderRadius="md" p="4" minH="100px" w="full" maxW="lg">
                            <List.Root gap="2" listStyle="none">
                                {selectedCategory.length === 0 && <Text color="gray.400" fontSize="sm">카테고리를 선택해주세요.</Text>}
                                {selectedCategory.map((cate) => (
                                    <List.Item key={cate.id} position="relative" display="flex" alignItems="center" justifyContent="space-between" borderWidth="1px" p="2" borderRadius="md" bg="gray.50">
                                        <Text fontSize="sm">{cate.name}</Text>
                                        <CloseButton size="xs" onClick={() => setSelectedCategory(prev => prev.filter(i => i.id !== cate.id))} />
                                    </List.Item>
                                ))}
                            </List.Root>
                        </Box>
                    </Field.Root>
                </Stack>
            </Stack>

            {/* 3. 기본 정보 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">상품 기본 정보</Heading>
                <Field.Root required>
                    <Field.Label mb="2">상품명</Field.Label>
                    <Input placeholder="상품명을 입력해주세요" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </Field.Root>
                <Field.Root>
                    <Field.Label mb="2">상세 설명</Field.Label>
                    <Textarea placeholder="상품 상세 설명을 입력해주세요" rows={5} value={productDetail} onChange={(e) => setProductDetail(e.target.value)} />
                </Field.Root>
            </Stack>

            {/* 4. 옵션 및 재고 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">옵션 및 재고 설정</Heading>

                <Field.Root>
                    <Field.Label mb="2">옵션 사용 여부</Field.Label>
                    <RadioGroup.Root value={hasOptions} onValueChange={(e) => setHasOptions(e.value)}>
                        <HStack gap="6">
                            <RadioGroup.Item value="off">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>사용 안함 (단일 상품)</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item value="on">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>사용함</RadioGroup.ItemText>
                            </RadioGroup.Item>
                        </HStack>
                    </RadioGroup.Root>
                </Field.Root>

                {hasOptions === "off" ? (
                    <Field.Root w="xs" required>
                        <Field.Label mb="2">재고 수량</Field.Label>
                        <Input type="number" value={totalStock} onChange={(e) => setTotalStock(Number(e.target.value))} />
                    </Field.Root>
                ) : (
                    <Stack gap="4">
                        <Box bg="gray.50" p="4" borderRadius="md">
                            <HStack alignItems="end">
                                <Field.Root>
                                    <Field.Label fontSize="sm">옵션명 (예: 색상)</Field.Label>
                                    <Input size="sm" bg="white" value={newOption.name} onChange={(e) => setNewOption({ ...newOption, name: e.target.value })} />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label fontSize="sm">옵션값 (예: 빨강)</Field.Label>
                                    <Input size="sm" bg="white" value={newOption.value} onChange={(e) => setNewOption({ ...newOption, value: e.target.value })} />
                                </Field.Root>
                                <Field.Root w="20">
                                    <Field.Label fontSize="sm">재고</Field.Label>
                                    <Input size="sm" type="number" bg="white" value={newOption.stock} onChange={(e) => setNewOption({ ...newOption, stock: Number(e.target.value) })} />
                                </Field.Root>
                                <Button size="sm" onClick={handleAddOption} leftIcon={<LuPlus />}>추가</Button>
                            </HStack>
                        </Box>

                        <Table.Root size="sm" variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>옵션명</Table.ColumnHeader>
                                    <Table.ColumnHeader>옵션값</Table.ColumnHeader>
                                    <Table.ColumnHeader>재고</Table.ColumnHeader>
                                    <Table.ColumnHeader width="10"></Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {options.map((opt) => (
                                    <Table.Row key={opt.id}>
                                        <Table.Cell>{opt.name}</Table.Cell>
                                        <Table.Cell>{opt.value}</Table.Cell>
                                        <Table.Cell>{opt.stock}</Table.Cell>
                                        <Table.Cell>
                                            <CloseButton size="xs" onClick={() => handleDeleteOption(opt.id)} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {options.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={4} textAlign="center" color="gray.500">
                                            추가된 옵션이 없습니다.
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>

                        <Field.Root w="xs" readOnly>
                            <Field.Label mb="2">총 재고 (자동 계산)</Field.Label>
                            <Input value={totalStock} readOnly bg="gray.100" />
                        </Field.Root>
                    </Stack>
                )}
            </Stack>

            {/* 5. 이미지 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">이미지 등록</Heading>

                <Field.Root required>
                    <Field.Label mb="2">대표 이미지</Field.Label>
                    <HStack alignItems="start">
                        <Box
                            w="150px" h="150px"
                            borderWidth="1px" borderStyle="dashed" borderRadius="md"
                            display="flex" alignItems="center" justifyContent="center"
                            bg="gray.50" overflow="hidden" position="relative"
                        >
                            {mainImagePreview ? (
                                <Image src={mainImagePreview} objectFit="cover" w="full" h="full" />
                            ) : (
                                <Stack alignItems="center" color="gray.400">
                                    <LuImage size="24" />
                                    <Text fontSize="xs">이미지 선택</Text>
                                </Stack>
                            )}
                            <Input
                                type="file"
                                position="absolute" top="0" left="0" w="full" h="full" opacity="0" cursor="pointer"
                                accept="image/*"
                                onChange={handleMainImageChange}
                            />
                        </Box>
                    </HStack>
                </Field.Root>

                <Field.Root>
                    <Field.Label mb="2">추가 이미지 (여러장 가능)</Field.Label>
                    <HStack gap="4" flexWrap="wrap">
                        {subImagePreviews.map((src, idx) => (
                            <Box key={idx} w="100px" h="100px" uri={src} borderRadius="md" overflow="hidden" position="relative" borderWidth="1px">
                                <Image src={src} objectFit="cover" w="full" h="full" />
                                <CloseButton
                                    size="xs" position="absolute" top="1" right="1" bg="white"
                                    onClick={() => removeSubImage(idx)}
                                />
                            </Box>
                        ))}

                        <Box
                            w="100px" h="100px"
                            borderWidth="1px" borderStyle="dashed" borderRadius="md"
                            display="flex" alignItems="center" justifyContent="center"
                            bg="gray.50" overflow="hidden" position="relative"
                            cursor="pointer"
                            _hover={{ bg: "gray.100" }}
                        >
                            <Stack alignItems="center" color="gray.400">
                                <LuPlus size="20" />
                                <Text fontSize="xs">추가</Text>
                            </Stack>
                            <Input
                                type="file"
                                position="absolute" top="0" left="0" w="full" h="full" opacity="0" cursor="pointer"
                                accept="image/*"
                                multiple
                                onChange={handleSubImagesChange}
                            />
                        </Box>
                    </HStack>
                </Field.Root>
            </Stack>

            <HStack justifyContent="flex-end" pt="10">
                <Button variant="outline" size="lg">취소</Button>
                <Button colorScheme="blue" size="lg" bg="black" color="white" _hover={{ bg: "gray.800" }}>상품 등록하기</Button>
            </HStack>
        </Stack>
    )
}

export default Register;