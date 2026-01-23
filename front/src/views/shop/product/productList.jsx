import { Box, Button, Flex, Heading, HStack, Link, RatingGroup, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { calcDiscountPercent, formatNumber } from "../../../utils/simpleUtils";
import { useParams } from "react-router-dom";

function ProductList() {

    const {id} = useParams();

    /**
     * TODO : 제품, 할인, 리뷰 DB 연동
     */
    const productList = [
        {id:1, title:'제품명 1', regular_price:10000, discount_price:7000, review_scoure : 5, review_count:210},
        {id:2, title:'제품명 2', regular_price:20000, discount_price:14000, review_scoure : 1, review_count:110},
        {id:3, title:'제품명 3', regular_price:17450, discount_price:16980, review_scoure : 5, review_count:30},
        {id:4, title:'제품명 4', regular_price:25000, discount_price:13000, review_scoure : 3, review_count:20},
        {id:5, title:'제품명 5', regular_price:27500, discount_price:20000, review_scoure : 2.5, review_count:11},
        {id:6, title:'제품명 6', regular_price:12500, discount_price:9500, review_scoure : 4.5, review_count:1540},
        {id:7, title:'제품명 7', regular_price:5000, review_scoure : 5, review_count:100},
        {id:8, title:'제품명 8', regular_price:15000, discount_price:10000, review_scoure : 2, review_count:354},
        {id:9, title:'제품명 9', regular_price:10000, discount_price:9800, review_scoure : 1, review_count:20},
        {id:10, title:'제품명 10', regular_price:154000, discount_price:99000, review_scoure : 4.5, review_count:430},
        {id:11, title:'제품명 11', regular_price:10000, discount_price:7000, review_scoure : 5, review_count:210},
        {id:12, title:'제품명 12', regular_price:20000, discount_price:14000, review_scoure : 1, review_count:110},
    ];

    /**
     * 카테고리 DB 연결
     */
    const subCategorys = [
        {id:12345, title:'전체'},
        {id:1, title:'서브 카테고리 1'},
        {id:2, title:'서브 카테고리 4'},
        {id:3, title:'서브 카테고리 5'},
        {id:4, title:'서브 카테고리 6'},
        {id:5, title:'서브 카테고리 7'},
    ]

    return (
        <Stack p="80px 0" px='layoutX' >
            <Stack direction="row" gap="10">
                <Stack width="3xs" position="relative">
                    <Stack position="sticky" left="0" top="5">
                        <Heading>카테고리 1</Heading>
                        <Stack marginTop="15px" paddingTop="15px" borderTop="3px solid" borderTopColor="main">
                            {subCategorys.map((subCategory) => (
                                <Button variant="plain" key={subCategory.id} justifyContent="start" padding="0">
                                    <Link href={`/categorys/${subCategory.id}`} width="full" fontWeight={subCategory.id == id ? 'bold' : 'normal'}>{subCategory.title}</Link>
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
                    <SimpleGrid columns={5} gap="8">
                        {productList.map((product) => (
                            <Link href={`/products/${product.id}`} key={product.id}>
                                <Stack width="full">
                                    <Box bg="bg.emphasized" aspectRatio="square" rounded="md"></Box>
                                    <Text fontSize="md" fontWeight="medium">{product.title}</Text>
                                    {product.discount_price ? (
                                        <Stack gap="0">
                                            <Text fontSize="xs" textDecoration="line-through">{formatNumber(product.regular_price)}</Text>
                                            <HStack alignItems="end">
                                                <Text fontSize="sm" fontWeight="medium">{calcDiscountPercent(product.regular_price, product.discount_price)}%</Text>
                                                <Text fontWeight="medium">{formatNumber(product.discount_price)}</Text>
                                            </HStack>
                                        </Stack>
                                    ) : (
                                        <Text fontWeight="medium">{product.regular_price}</Text>
                                    )}
                                    <RatingGroup.Root readOnly allowHalf count={5} defaultValue={product.review_scoure} size="sm" colorPalette="yellow">
                                        <RatingGroup.HiddenInput />
                                        <RatingGroup.Control />
                                    </RatingGroup.Root>
                                </Stack>
                            </Link>
                        ))}
                    </SimpleGrid >
                </Stack>
            </Stack>
        </Stack>
    )
}

export default ProductList;