import { Box, Button, Flex, Heading, HStack, Link, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import { formatDateYMD, formatNumber } from "../../../../utils/simpleUtils";

function List() {
    const [notices, setNotices] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchNotices = async () => {
        try {
            const res = await axiosInstance.get('/admin/review/notice');
            setNotices(res.data.notices);
            setTotal(res.data.total);
        } catch (error) {
            console.error("Failed to fetch notices", error);
            toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const deleteNotice = async (notice_code) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;
        try {
            await axiosInstance.delete(`/admin/review/notice/${notice_code}`);
            toaster.create({ title: '삭제되었습니다.', type: 'success' });
            fetchNotices();
        } catch (error) {
            console.error("Failed to delete notice", error);
            toaster.create({ title: '삭제 중 오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Flex justifyContent="space-between" alignItems="center">
                <Heading size="lg">공지사항 리스트 (총 {formatNumber(total)}건)</Heading>
                <Link href="/admin/review/notice/register">
                    <Button colorScheme="teal">공지사항 등록</Button>
                </Link>
            </Flex>

            <Table.Root variant="outline">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader w="100px" textAlign="center">상태</Table.ColumnHeader>
                        <Table.ColumnHeader>제목</Table.ColumnHeader>
                        <Table.ColumnHeader w="120px" textAlign="center">조회수</Table.ColumnHeader>
                        <Table.ColumnHeader w="150px" textAlign="center">등록일</Table.ColumnHeader>
                        <Table.ColumnHeader w="150px" textAlign="center">관리</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {notices.map((notice) => (
                        <Table.Row key={notice.notice_code}>
                            <Table.Cell textAlign="center">
                                <Text color={notice.is_active ? 'green.500' : 'gray.500'} fontWeight="bold">
                                    {notice.is_active ? '노출' : '숨김'}
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Link href={`/admin/review/notice/update/${notice.notice_code}`}>
                                    {notice.title}
                                </Link>
                            </Table.Cell>
                            <Table.Cell textAlign="center">{formatNumber(notice.view_count)}</Table.Cell>
                            <Table.Cell textAlign="center">{formatDateYMD(notice.created_at)}</Table.Cell>
                            <Table.Cell textAlign="center">
                                <HStack justifyContent="center" gap="2">
                                    <Link href={`/admin/review/notice/update/${notice.notice_code}`}>
                                        <Button size="xs" variant="outline">수정</Button>
                                    </Link>
                                    <Button size="xs" variant="outline" colorPalette="red" onClick={() => deleteNotice(notice.notice_code)}>삭제</Button>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                    {notices.length === 0 && (
                        <Table.Row>
                            <Table.Cell colSpan={5} textAlign="center" py="10">등록된 공지사항이 없습니다.</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </Stack>
    );
}

export default List;
