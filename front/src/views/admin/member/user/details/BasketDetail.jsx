import { Icon, Image, Link, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toaster } from "../../../../../components/ui/toaster";
import axiosInstance from "../../../../../utils/api";
import { formatNumber } from "../../../../../utils/simpleUtils";
import { PiSmileySad } from "react-icons/pi";
import { LuExternalLink } from "react-icons/lu";

function BasketDetail({ user_code }) {
    const [orderBasketList, setOrderBasketList] = useState([]);

    useEffect(() => {
        const getOrderBasketList = async () => {
            try {
                const res = await axiosInstance.get(`/admin/member/user/orderBasketList/${user_code}`);
                setOrderBasketList(res.data);
            } catch (e) {
                console.error(e);
                toaster.create({ title: '장바구니 불러오는데 에러가 발생했습니다.', type: 'error' })
            }
        }
        getOrderBasketList();
    }, [user_code]);

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader textAlign="center">이미지</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">상품명</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">옵션</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">가격</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">수량</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {orderBasketList.length === 0 ? (
                    <Table.Row>
                        <Table.Cell colSpan="5" textAlign="center">
                            <Stack alignItems="center" py="10">
                                <Icon fontSize="7xl"><PiSmileySad /></Icon>
                                <Text>장바구니가 비어있습니다.</Text>
                            </Stack>
                        </Table.Cell>
                    </Table.Row>
                ) : (
                    orderBasketList.map((basket) => (
                        <Table.Row key={basket.order_basket_code}>
                            <Table.Cell textAlign="center"><Image src={basket.product_image_url} w="16" rounded="md" m="auto" /></Table.Cell>
                            <Table.Cell textAlign="center">
                                <Link href={`/products/${basket.product_code}`} target="_blank" color="fg.info" >
                                    {basket.product_name}
                                    <Icon size="xs"><LuExternalLink /></Icon>
                                </Link>
                            </Table.Cell>
                            <Table.Cell textAlign="center">{basket.option_name ? `[${basket.option_name}] : ${basket.option_value}` : '-'}</Table.Cell>
                            <Table.Cell textAlign="center">{formatNumber(basket.product_price)}</Table.Cell>
                            <Table.Cell textAlign="center">{basket.quantity}</Table.Cell>
                        </Table.Row>
                    ))
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default BasketDetail;