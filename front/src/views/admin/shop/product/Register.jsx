import { Box, Button, Checkbox, CloseButton, Field, Heading, HStack, Image, Input, List, RadioGroup, Stack, Table, Text, Textarea } from "@chakra-ui/react";
import CategoryView from "./CategoryView";
import { useEffect, useState, useRef } from "react";
import { LuImage, LuPlus, LuTrash } from "react-icons/lu";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import ProductEditor from "./ProductEditor";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate, useParams } from "react-router-dom";

function SortableImage({ id, src, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id });

    const style = { transform: CSS.Transform.toString(transform), transition, };

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners} w="100px" h="100px" borderRadius="md" overflow="hidden" position="relative" borderWidth="1px" bg="white">
            <Image src={src} objectFit="cover" w="full" h="full" />
            <CloseButton size="xs" position="absolute" top="1" right="1" bg="white" onClick={(e) => { e.stopPropagation(); onRemove(id); }} />
        </Box>
    );
}

function FastInput({ value, onChange, ...props }) {
    const [localValue, setLocalValue] = useState(value || "");
    const timeoutRef = useRef(null);

    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;
        setLocalValue(val);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            onChange({ target: { value: val } });
        }, 300);
    };

    return <Input {...props} value={localValue} onChange={handleChange} />;
}

function Register() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState(0);
    const [productDetail, setProductDetail] = useState("");
    const [isDisplay, setIsDisplay] = useState("off");
    const [isSale, setIsSale] = useState("off");

    const [hasOptions, setHasOptions] = useState("off");
    const [isUnlimitedStock, setIsUnlimitedStock] = useState(false);
    const [totalStock, setTotalStock] = useState(0);
    const [options, setOptions] = useState([]);
    const [newOption, setNewOption] = useState({ name: "", value: "", stock: 0 });

    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);

    const [subImages, setSubImages] = useState([]);

    const { id } = useParams();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResponse = await axiosInstance.get("/admin/shop/product/category");
                setCategories(categoryResponse.data);
                if (id) {
                    const productResponse = await axiosInstance.get(`/admin/shop/product/${id}`);
                    const data = productResponse.data;

                    setProductName(data.name);
                    setPrice(data.price || 0);
                    setProductDetail(data.description);
                    setIsDisplay(data.is_display ? "on" : "off");
                    setIsSale(data.is_sale ? "on" : "off");
                    setHasOptions(data.has_options ? "on" : "off");
                    setIsUnlimitedStock(!!data.is_unlimited_stock);
                    setTotalStock(data.stock);

                    // Categories
                    setSelectedCategory(data.categories || []);

                    // Options
                    if (data.options && data.options.length > 0) {
                        setOptions(data.options.map(opt => ({
                            option_num: opt.option_num,
                            name: opt.name,
                            value: opt.value,
                            stock: opt.stock
                        })));
                    }

                    // Images
                    if (data.images) {
                        const main = data.images.find(img => img.is_main === 1);
                        if (main) {
                            setMainImagePreview(main.url);
                        }

                        const subs = data.images.filter(img => img.is_main === 0);
                        setSubImages(subs.map(img => ({
                            id: img.i_num,
                            file: null,
                            preview: img.url,
                            isExisting: true
                        })));
                    }
                }
            } catch (error) {
                console.error(error);
                toaster.create({ title: '데이터를 불러오는데 실패했습니다.', type: 'error' });
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (hasOptions === "on") {
            const calculatedStock = options.reduce((sum, opt) => sum + Number(opt.stock), 0);
            setTotalStock(calculatedStock);
        }
    }, [options, hasOptions]);

    const handleAddOption = () => {
        if (!newOption.name || !newOption.value) return;

        const values = newOption.value.split(',').map(v => v.trim()).filter(v => v !== "");
        const newOptions = values.map((val, index) => ({
            id: Date.now() + index,
            name: newOption.name,
            value: val,
            stock: newOption.stock
        }));

        setOptions([...options, ...newOptions]);
        setNewOption({ name: "", value: "", stock: 0 });
    };

    const handleDeleteOption = (id) => {
        setOptions(options.filter(opt => opt.id !== id));
    };

    const handleOptionChange = (id, field, value) => {
        setOptions(options.map(opt =>
            opt.id === id ? { ...opt, [field]: value } : opt
        ));
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
            const newImages = files.map(file => ({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file: file,
                preview: URL.createObjectURL(file)
            }));
            setSubImages((prev) => [...prev, ...newImages]);
        }
    };

    const removeSubImage = (id) => {
        setSubImages((prev) => prev.filter(img => img.id !== id));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSubImages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSubmit = async () => {
        if (!productName) {
            toaster.create({ title: '상품명을 입력해주세요.', type: 'error' });
            return;
        }

        if (selectedCategory.length === 0) {
            toaster.create({ title: '카테고리를 선택해주세요.', type: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append("name", productName);
        formData.append("price", price);
        formData.append("description", productDetail);
        formData.append("is_display", isDisplay);
        formData.append("is_sale", isSale);

        formData.append("has_options", hasOptions);
        formData.append("is_unlimited_stock", isUnlimitedStock);
        formData.append("stock", totalStock);

        formData.append("category_codes", JSON.stringify(selectedCategory.map(c => c.category_code)));

        if (hasOptions === "on") formData.append("options", JSON.stringify(options));

        if (mainImage) formData.append("mainImage", mainImage);

        const existingSubImages = [];
        subImages.forEach((img) => {
            if (img.file) {
                formData.append("subImages", img.file);
            } else if (img.isExisting) {
                existingSubImages.push(img.id);
            }
        });

        if (existingSubImages.length > 0) formData.append("existing_sub_images", JSON.stringify(existingSubImages));

        try {
            if (id) {
                await axiosInstance.put(`/admin/shop/product/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toaster.create({ title: '상품이 수정되었습니다.', type: 'success' });
            } else {
                await axiosInstance.post("/admin/shop/product", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toaster.create({ title: '상품이 등록되었습니다.', type: 'success' });
            }
            navigate("/admin/shop/product/list");
        } catch (error) {
            console.error(error);
            toaster.create({ title: `상품 ${id ? '수정' : '등록'}에 실패했습니다.`, type: 'error' });
        }
    };

    return (
        <Stack p="30px" px="layoutX" gap="10" pb="20">
            <Heading>상품 {id ? '수정' : '등록'}</Heading>

            {/* 1. 노출/판매 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">노출 및 판매 설정</Heading>
                <HStack gap="12">
                    <Field.Root w="auto">
                        <Field.Label mb="2">진열 상태</Field.Label>
                        <RadioGroup.Root value={isDisplay} onValueChange={(e) => setIsDisplay(e.value)}>
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
                        <RadioGroup.Root value={isSale} onValueChange={(e) => setIsSale(e.value)}>
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
                        <CategoryView categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">선택된 카테고리</Field.Label>
                        <Box borderWidth="1px" borderRadius="md" p="4" minH="100px" w="full" maxW="lg">
                            <List.Root gap="2" listStyle="none">
                                {selectedCategory.length === 0 && <Text color="gray.400" fontSize="sm">카테고리를 선택해주세요.</Text>}
                                {selectedCategory.map((cate) => (
                                    <List.Item key={cate.category_code} position="relative" display="flex" alignItems="center" justifyContent="space-between" borderWidth="1px" p="2" borderRadius="md" bg="gray.50">
                                        <Text fontSize="sm">{cate.name}</Text>
                                        <CloseButton size="xs" onClick={() => setSelectedCategory(prev => prev.filter(i => i.category_code !== cate.category_code))} />
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
                    <FastInput placeholder="상품명을 입력해주세요" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </Field.Root>
                <Field.Root>
                    <Field.Label mb="2">상세 설명</Field.Label>
                    <ProductEditor content={productDetail} setContent={setProductDetail} />
                </Field.Root>
            </Stack>

            {/* 4. 판매가 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">판매가 설정</Heading>
                <Field.Root required>
                    <Field.Label mb="2">판매가</Field.Label>
                    <FastInput type="number" placeholder="판매가를 입력해주세요" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                </Field.Root>
            </Stack>

            {/* 5. 옵션 및 재고 */}
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
                    <Field.Root w="xs" required={!isUnlimitedStock}>
                        <HStack justify="space-between" mb="2">
                            <Field.Label css={{ mb: 0 }}>재고 수량</Field.Label>
                            <Checkbox.Root
                                checked={isUnlimitedStock}
                                onCheckedChange={(e) => setIsUnlimitedStock(!!e.checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>무제한</Checkbox.Label>
                            </Checkbox.Root>
                        </HStack>
                        <Input
                            type="number"
                            value={isUnlimitedStock ? "" : totalStock}
                            disabled={isUnlimitedStock}
                            onChange={(e) => setTotalStock(Number(e.target.value))}
                        />
                    </Field.Root>
                ) : (
                    <Stack gap="4">
                        <Box bg="gray.50" p="4" borderRadius="md">
                            <HStack alignItems="end">
                                <Field.Root>
                                    <Field.Label fontSize="sm">옵션명 (예: 색상)</Field.Label>
                                    <FastInput size="sm" bg="white" value={newOption.name} onChange={(e) => setNewOption({ ...newOption, name: e.target.value })} />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label fontSize="sm">옵션값 (예: 빨강, 파랑, 검정)</Field.Label>
                                    <FastInput size="sm" bg="white" value={newOption.value} onChange={(e) => setNewOption({ ...newOption, value: e.target.value })} placeholder="쉼표(,)로 구분" />
                                </Field.Root>
                                <Field.Root w="44">
                                    <Field.Label fontSize="sm">재고</Field.Label>
                                    <FastInput size="sm" type="number" bg="white" value={newOption.stock} onChange={(e) => setNewOption({ ...newOption, stock: Number(e.target.value) })} />
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
                                    <Table.Row key={opt.option_num}>
                                        <Table.Cell>
                                            <FastInput
                                                size="sm"
                                                variant="subtle"
                                                value={opt.name}
                                                onChange={(e) => handleOptionChange(opt.id, 'name', e.target.value)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <FastInput
                                                size="sm"
                                                variant="subtle"
                                                value={opt.value}
                                                onChange={(e) => handleOptionChange(opt.id, 'value', e.target.value)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <FastInput
                                                size="sm"
                                                variant="subtle"
                                                type="number"
                                                value={opt.stock}
                                                onChange={(e) => handleOptionChange(opt.id, 'stock', Number(e.target.value))}
                                            />
                                        </Table.Cell>
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

            {/* 6. 이미지 */}
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
                    <Field.Label mb="2">추가 이미지 (여러장 가능, 드래그하여 순서 변경)</Field.Label>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={subImages.map(img => img.id)}
                            strategy={rectSortingStrategy}
                        >
                            <HStack gap="4" flexWrap="wrap">
                                {subImages.map((img) => (
                                    <SortableImage
                                        key={img.id}
                                        id={img.id}
                                        src={img.preview}
                                        onRemove={removeSubImage}
                                    />
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
                        </SortableContext>
                    </DndContext>
                </Field.Root>
            </Stack>

            <HStack justifyContent="flex-end" pt="10">
                <Button variant="outline" size="lg">취소</Button>
                <Button onClick={handleSubmit} size="lg" bg="black" color="white" _hover={{ bg: "gray.800" }}>상품 {id ? '수정' : '등록'}하기</Button>
            </HStack>
        </Stack>
    )
}

export default Register;