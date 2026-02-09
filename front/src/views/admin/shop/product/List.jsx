import { Box, Button, Checkbox, HStack, Input, Link, Stack, Table } from "@chakra-ui/react";
import { useState } from "react";
import { formatNumber } from "../../../../utils/simpleUtils";

function List() {
    const [selection, setSelection] = useState([]);
    const [productList, setProductList] = useState([
        { code: 1, name: '상품명 1', price: 10000 },
        { code: 2, name: '상품명 2', price: 10000 },
        { code: 3, name: '상품명 3', price: 10000 },
        { code: 4, name: '상품명 4', price: 10000 },
        { code: 5, name: '상품명 5', price: 10000 },
        { code: 6, name: '상품명 6', price: 10000 },
        { code: 7, name: '상품명 7', price: 10000 },
        { code: 8, name: '상품명 8', price: 10000 },
        { code: 9, name: '상품명 9', price: 10000 },
    ]);
    const indeterminate = selection.length > 0 && selection.length < productList.length;


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
                                        setSelection(e.checked ? productList.map((product) => product.code) : [])
                                    }}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                </Checkbox.Root>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>상품코드</Table.ColumnHeader>
                            <Table.ColumnHeader>상품명</Table.ColumnHeader>
                            <Table.ColumnHeader>판매가</Table.ColumnHeader>
                            <Table.ColumnHeader>할인가</Table.ColumnHeader>
                            <Table.ColumnHeader>바로가기</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {productList.map((product) => (
                            <Table.Row key={product.code} data-selected={selection.includes(product.code) ? '' : undefined}>
                                <Table.Cell>
                                    <Checkbox.Root
                                        checked={selection.includes(product.code)}
                                        onCheckedChange={(e) => {
                                            setSelection((prev) => e.checked ? [...prev, product.code] : selection.filter((code) => code !== product.code))
                                        }}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell>{product.code}</Table.Cell>
                                <Table.Cell>
                                    <HStack>
                                        <Box width="14" aspectRatio="1" bg="bg.muted" rounded="md"></Box>
                                        <Link href="#">{product.name}</Link>
                                    </HStack>

                                </Table.Cell>
                                <Table.Cell>{formatNumber(product.price)}</Table.Cell>
                                <Table.Cell>{formatNumber(product.price)}</Table.Cell>
                                <Table.Cell><Button asChild><Link href="#">바로가기</Link></Button></Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Stack>
    )
}

export default List;