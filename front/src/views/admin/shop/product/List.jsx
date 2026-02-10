import { Box, Button, Checkbox, HStack, Image, Input, Link, Stack, Table } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { formatNumber } from "../../../../utils/simpleUtils";
import axiosInstance from "../../../../utils/api";

function List() {
    const [selection, setSelection] = useState([]);
    const [productList, setProductList] = useState([]);
    const indeterminate = selection.length > 0 && selection.length < productList.length;

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const response = await axiosInstance.get('/admin/shop/product');
                if (response.data) {
                    setProductList(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProductList();
    }, []);

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <form>
                <HStack>
                    <Input placeholder="검색어를 입력해주세요." />
                    <Button>검색</Button>
                </HStack>
            </form>

            <Table.ScrollArea>
                <Table.Root stickyHeader>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>
                                <Checkbox.Root
                                    checked={indeterminate ? 'indeterminate' : selection.length > 0}
                                    onCheckedChange={(e) => {
                                        setSelection(e.checked ? productList.map((product) => product.id) : [])
                                    }}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                </Checkbox.Root>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>상품코드</Table.ColumnHeader>
                            <Table.ColumnHeader>판매상태</Table.ColumnHeader>
                            <Table.ColumnHeader>진열상태</Table.ColumnHeader>
                            <Table.ColumnHeader>상품명</Table.ColumnHeader>
                            <Table.ColumnHeader>판매가</Table.ColumnHeader>
                            <Table.ColumnHeader>할인가</Table.ColumnHeader>
                            <Table.ColumnHeader>바로가기</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {productList.map((product) => {
                            const mainImage = product.images && Array.isArray(product.images)
                                ? product.images.find(img => img.is_main === 1) : null;
                            const imageUrl = mainImage ? mainImage.url : '';
                            const is_sale = product.is_sale === 1 ? '판매중' : '판매중지';
                            const is_display = product.is_display === 1 ? '진열중' : '진열중지';

                            return (
                                <Table.Row key={product.id} data-selected={selection.includes(product.id) ? '' : undefined}>
                                    <Table.Cell>
                                        <Checkbox.Root
                                            checked={selection.includes(product.id)}
                                            onCheckedChange={(e) => {
                                                setSelection((prev) => e.checked ? [...prev, product.id] : selection.filter((code) => code !== product.id))
                                            }}
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                        </Checkbox.Root>
                                    </Table.Cell>
                                    <Table.Cell>{product.id}</Table.Cell>
                                    <Table.Cell>{is_sale}</Table.Cell>
                                    <Table.Cell>{is_display}</Table.Cell>
                                    <Table.Cell>
                                        <HStack>
                                            <Box width="14" aspectRatio="1" bg="bg.muted" rounded="md" overflow="hidden">
                                                {imageUrl && <Image src={imageUrl} w="full" h="full" objectFit="cover" />}
                                            </Box>
                                            <Link href={`/admin/shop/product/update/${product.id}`}>{product.name}</Link>
                                        </HStack>

                                    </Table.Cell>
                                    <Table.Cell>{formatNumber(product.price || 0)}</Table.Cell>
                                    <Table.Cell>{formatNumber(product.price || 0)}</Table.Cell>
                                    <Table.Cell><Button asChild><Link href="#">바로가기</Link></Button></Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Stack>
    )
}

export default List;