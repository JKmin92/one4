import { Heading, HStack, Input, Stack, Button, Table, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import TextAlign from "@tiptap/extension-text-align";
import { formatDate, formatDateYMD } from "../../../../utils/simpleUtils";

function List() {

    const [userList, setUserList] = useState([]);

    const getUserList = async () => {
        try {
            const response = await axiosInstance.get('/admin/member/user/list');
            setUserList(response.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', status: 'error' });
        }
    }

    useEffect(() => {
        getUserList();
    }, []);

    const marketingText = (value) => {
        const boxStyle = { p: '1', rounded: 'md', textAlign: 'center' }
        if (value) {
            return (<Box bg="bg.info" {...boxStyle}>동의</Box>)
        } else {
            return (<Box bg="bg.warning" {...boxStyle}>미동의</Box>)
        }
    }

    const statusText = (value) => {
        if (value === 'ACTIVE') {
            return '활동중';
        } else if (value === 'BLOCK') {
            return '정지';
        } else if (value === 'WITHDRAW') {
            return '탈퇴';
        } else {
            return `${value}`;
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading>회원 리스트</Heading>

            <form>
                <HStack>
                    <Input placeholder="검색어를 입력해주세요." />
                    <Button>검색</Button>
                </HStack>
            </form>

            <Table.Root>
                <Table.ColumnGroup>
                    <Table.Column w="120px" />
                    <Table.Column w="250px" />
                    <Table.Column w="120px" />
                    <Table.Column w="150px" />
                    <Table.Column w="200px" />
                    <Table.Column w="120px" />
                    <Table.Column w="120px" />
                    <Table.Column w="150px" />
                    <Table.Column w="80px" />
                </Table.ColumnGroup>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader textAlign="center">회원 코드</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">회원 이메일</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">회원 이름</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">연락처</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">채널</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">마케팅 수신 동의</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">가입일</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">상태</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">관리</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {userList.map((user) => {
                        return (
                            <Table.Row>
                                <Table.Cell textAlign="center">{user.user_code}</Table.Cell>
                                <Table.Cell textAlign="center">{user.email}</Table.Cell>
                                <Table.Cell textAlign="center">{user.name}</Table.Cell>
                                <Table.Cell textAlign="center">{user.phone}</Table.Cell>
                                <Table.Cell textAlign="center">{user.channel}</Table.Cell>
                                <Table.Cell textAlign="center">{marketingText(user.marketingAgree)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatDateYMD(user.created_at)}</Table.Cell>
                                <Table.Cell textAlign="center">{statusText(user.status)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button size="xs">상세보기</Button>
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>
        </Stack>
    )
}

export default List;