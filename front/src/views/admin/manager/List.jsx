import { Button, Heading, Stack, Table, HStack, Box, Link } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { formatDateYMD } from "../../../utils/simpleUtils";
import { toaster } from "../../../components/ui/toaster";
import axiosInstance from "../../../utils/api";

function AdminList() {
    const [adminList, setAdminList] = useState([]);

    const getAdminList = async () => {
        try {
            const response = await axiosInstance.get('/admin/manager/list');
            setAdminList(response.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    };

    useEffect(() => {
        getAdminList();
    }, []);

    const roleText = (role) => {
        if (role === 'SUPER_ADMIN') {
            return <Box bg="blue.100" color="blue.700" p="1" rounded="md" textAlign="center" fontWeight="bold">최고 관리자</Box>;
        }
        return <Box bg="gray.100" color="gray.700" p="1" rounded="md" textAlign="center">일반 관리자</Box>;
    }

    return (
        <Stack p="8" gap="6">
            <HStack justifyContent="space-between">
                <Heading size="lg">관리자 관리</Heading>
                <Button colorPalette="blue" asChild>
                    <Link href="/admin/manager/register">관리자 등록</Link>
                </Button>
            </HStack>

            <Box overflowX="auto">
                <Table.Root variant="line">
                    <Table.ColumnGroup>
                        <Table.Column width="10%" />
                        <Table.Column width="20%" />
                        <Table.Column width="15%" />
                        <Table.Column width="20%" />
                        <Table.Column width="15%" />
                        <Table.Column width="10%" />
                        <Table.Column width="10%" />
                    </Table.ColumnGroup>
                    <Table.Header bg="gray.50">
                        <Table.Row>
                            <Table.ColumnHeader textAlign="center">코드</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">이메일(아이디)</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">이름</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">연락처</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">권한</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">가입일</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">관리</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {(Array.isArray(adminList) ? adminList : []).map((admin) => (
                            <Table.Row key={admin.user_code}>
                                <Table.Cell textAlign="center">{admin.user_code}</Table.Cell>
                                <Table.Cell textAlign="center">{admin.email}</Table.Cell>
                                <Table.Cell textAlign="center">{admin.name}</Table.Cell>
                                <Table.Cell textAlign="center">{admin.phone}</Table.Cell>
                                <Table.Cell textAlign="center">{roleText(admin.role)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatDateYMD(admin.created_at)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button size="xs" colorPalette="gray" asChild>
                                        <Link href={`/admin/manager/update/${admin.user_code}`}>수정</Link>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Stack>
    )
}

export default AdminList;
