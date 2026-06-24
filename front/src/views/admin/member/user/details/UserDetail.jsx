import { Badge, Heading, HStack, Stack, StackSeparator, Table, Text } from "@chakra-ui/react";
import { formatDate, formatDateYMD, formatNumber } from "../../../../../utils/simpleUtils";
import { useEffect, useState } from "react";
import { toaster } from "../../../../../components/ui/toaster";
import axiosInstance from "../../../../../utils/api";

function UserDetail({ user }) {

    const [orderTotalPrice, setOrderTotalPrice] = useState(0);
    const [addressList, setAddressList] = useState([]);

    useEffect(() => {
        getAddressList();
        getOrderTotalPrice();
    }, [user.user_code]);

    const getAddressList = async () => {
        try {
            const res = await axiosInstance.get(`/admin/member/user/addressList/${user.user_code}`);
            setAddressList(res.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '주소 가져오기 에러가 발생했습니다.', type: 'error' });
        }
    }

    const getOrderTotalPrice = async () => {
        try {
            const res = await axiosInstance.get(`/admin/member/user/orderTotalPrice/${user.user_code}`);
            setOrderTotalPrice(res.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '주문금액 가져오기 에러가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack>
            <Stack>
                <Heading size="sm">기본 정보</Heading>
                <Table.Root>
                    <Table.ColumnGroup>
                        <Table.Column w="15%" />
                        <Table.Column w="35%" />
                        <Table.Column w="15%" />
                        <Table.Column w="35%" />
                    </Table.ColumnGroup>
                    <Table.Body>
                        <Table.Row>
                            <Table.ColumnHeader>아이디</Table.ColumnHeader>
                            <Table.Cell colSpan="3">{user.email}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeader>성함</Table.ColumnHeader>
                            <Table.Cell>{user.name}</Table.Cell>
                            <Table.ColumnHeader>연락처</Table.ColumnHeader>
                            <Table.Cell>{user.phone}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeader>회원가입일</Table.ColumnHeader>
                            <Table.Cell>{formatDateYMD(user.created_at)}</Table.Cell>
                            <Table.ColumnHeader>최근방문일</Table.ColumnHeader>
                            <Table.Cell>{formatDate(user.last_login_at)}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeader>주문금액</Table.ColumnHeader>
                            <Table.Cell colSpan="3">{formatNumber(orderTotalPrice)}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeader>주소</Table.ColumnHeader>
                            <Table.Cell colSpan="3">
                                {addressList.length > 0 ? (
                                    <Stack borderWidth="1px" rounded="md" p="2" separator={<StackSeparator />}>
                                        {addressList.map((address) => (
                                            <HStack key={address.address_code} alignItems="center">
                                                {address.isDefault && (
                                                    <Badge colorPalette="green">기본 주소</Badge>
                                                )}
                                                <Stack>
                                                    <HStack>
                                                        <Text>{address.name}</Text>
                                                        <Text>({address.phone})</Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Text>[{address.postcode}]</Text>
                                                        <Text>{address.address}</Text>
                                                        <Text>{address.detailAddress}</Text>
                                                    </HStack>
                                                </Stack>
                                            </HStack>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Text>등록된 주소가 없습니다.</Text>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Stack>
        </Stack>
    )

}

export default UserDetail;