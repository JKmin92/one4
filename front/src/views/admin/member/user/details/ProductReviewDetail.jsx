import { Icon, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PiSmileySad } from "react-icons/pi";
import { toaster } from "../../../../../components/ui/toaster";
import axiosInstance from "../../../../../utils/api";

function ProductReviewDetail({ user_code }) {
    const [productReviewList, setProductReviewList] = useState([]);

    const getProductReviewList = async () => {
        try {
            const res = await axiosInstance.get(`/admin/member/user/productReviewList/${user_code}`)
            setProductReviewList(res.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '제품 리뷰 리스트 불러오는데 에러가 발생했습니다.', type: 'error' })
        }
    }

    useEffect(() => {
        getProductReviewList();
    }, [user_code]);

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader textAlign="center">별점</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">상품명</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">내용</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">작성일</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {productReviewList.length === 0 ? (
                    <Table.Row>
                        <Table.Cell colSpan="4" textAlign="center">
                            <Stack alignItems="center" py="10">
                                <Icon color="fg.muted" fontSize="7xl"><PiSmileySad /></Icon>
                                <Text>작성한 리뷰가 없습니다.</Text>
                            </Stack>
                        </Table.Cell>
                    </Table.Row>
                ) : (
                    productReviewList.map((review) => (
                        <Table.Row key={review.product_review_code}>
                            <Table.Cell textAlign="center">{review.rating}</Table.Cell>
                            <Table.Cell textAlign="center">{review.product_name}</Table.Cell>
                            <Table.Cell textAlign="center">{review.content}</Table.Cell>
                            <Table.Cell textAlign="center">{review.created_at}</Table.Cell>
                        </Table.Row>
                    ))
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default ProductReviewDetail;