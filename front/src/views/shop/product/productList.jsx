import { Box, Button, Flex, Heading, HStack, RatingGroup, Stack, Text } from "@chakra-ui/react";
import { calcDiscountPercent, formatNumber } from "../../../utils/simpleUtils";

function ProductList() {

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

    return (
        <Stack padding="80px 0" px='layoutX' gap="6">
            <Box width="full" height="250px" rounded="md" bg="bg.emphasized"></Box>
            <Stack>
                <Heading>카테고리 1</Heading>
                <HStack bg="bg.muted" rounded="md">
                    <Button variant="ghost" fontSize="sm">추천순</Button>
                    <Button variant="ghost" fontSize="sm">낮은가격순</Button>
                    <Button variant="ghost" fontSize="sm">높은가격순</Button>
                    <Button variant="ghost" fontSize="sm">최신순</Button>
                </HStack>
            </Stack>
            <Flex wrap="wrap" gap="8">
                {productList.map((product) => (
                    <Stack flexBasis="15%" key={product.id}>
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
                ))}
            </Flex>
        </Stack>
    )
}

export default ProductList;