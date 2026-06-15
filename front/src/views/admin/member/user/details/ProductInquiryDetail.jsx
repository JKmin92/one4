import { Icon, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { formatDate } from "../../../../../utils/simpleUtils";
import { PiSmileySad } from "react-icons/pi";
import { toaster } from "../../../../../components/ui/toaster";
import axiosInstance from "../../../../../utils/api";

function ProductInquiryDetail({ user_code }) {
    const [productInquiryList, setProductInquiryList] = useState([]);

    const getProductInquiryList = async () => {
        try {
            const res = await axiosInstance.get(`/admin/member/user/productInquiryList/${user_code}`)
            setProductInquiryList(res.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '제품 문의 리스트 불러오는데 에러가 발생했습니다.', type: 'error' })
        }
    }

    useEffect(() => {
        getProductInquiryList();
    }, [user_code])

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader textAlign="center">상품명</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">문의 유형</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">내용</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">문의 일시</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {productInquiryList.length === 0 ? (
                    <Table.Row>
                        <Table.Cell colSpan="4" textAlign="center">
                            <Stack alignItems="center" py="10">
                                <Icon color="fg.muted" fontSize="7xl"><PiSmileySad /></Icon>
                                <Text>문의 내역이 없습니다.</Text>
                            </Stack>
                        </Table.Cell>
                    </Table.Row>
                ) : (
                    productInquiryList.map((productInquiry) => (
                        <Table.Row key={productInquiry.product_inquiry_code}>
                            <Table.Cell textAlign="center">{productInquiry.product_name}</Table.Cell>
                            <Table.Cell textAlign="center">{productInquiry.type}</Table.Cell>
                            <Table.Cell textAlign="center">{productInquiry.content}</Table.Cell>
                            <Table.Cell textAlign="center">{formatDate(productInquiry.created_at)}</Table.Cell>
                        </Table.Row>
                    ))
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default ProductInquiryDetail;