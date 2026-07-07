import { Box, Button, Flex, Image, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/api";
import { toaster } from "../../../components/ui/toaster";

function List() {
    const navigate = useNavigate();
    const [popups, setPopups] = useState([]);

    const fetchPopups = async () => {
        try {
            const res = await axiosInstance.get('/admin/popup/list');
            setPopups(res.data);
        } catch (error) {
            console.error(error);
            toaster.create({ title: '데이터를 불러오는데 실패했습니다.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchPopups();
    }, []);

    const handleDelete = async (popup_code) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await axiosInstance.delete(`/admin/popup/${popup_code}`);
            toaster.create({ title: '삭제되었습니다.', type: 'success' });
            fetchPopups();
        } catch (error) {
            console.error(error);
            toaster.create({ title: '삭제 중 오류가 발생했습니다.', type: 'error' });
        }
    };

    return (
        <Box p="6">
            <Flex justifyContent="space-between" mb="4">
                <Text fontSize="2xl" fontWeight="bold">팝업 관리</Text>
                <Button onClick={() => navigate('/admin/popup/register')}>새 팝업 등록</Button>
            </Flex>

            <Table.Root variant="outline">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader w="120px">이미지</Table.ColumnHeader>
                        <Table.ColumnHeader>제목</Table.ColumnHeader>
                        <Table.ColumnHeader>노출 위치</Table.ColumnHeader>
                        <Table.ColumnHeader>노출 상태</Table.ColumnHeader>
                        <Table.ColumnHeader>노출 기간</Table.ColumnHeader>
                        <Table.ColumnHeader w="150px">관리</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {popups.length === 0 ? (
                        <Table.Row>
                            <Table.Cell colSpan={6} textAlign="center">등록된 팝업이 없습니다.</Table.Cell>
                        </Table.Row>
                    ) : (
                        popups.map(popup => (
                            <Table.Row key={popup.popup_code}>
                                <Table.Cell>
                                    <Image src={popup.image_url} alt={popup.title} w="80px" h="80px" objectFit="cover" borderRadius="md" />
                                </Table.Cell>
                                <Table.Cell>{popup.title}</Table.Cell>
                                <Table.Cell>
                                    {popup.target_service === 'ALL' ? '전체' : popup.target_service === 'SHOP' ? '쇼핑몰' : '체험단'}
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color={popup.is_visible ? 'green.500' : 'red.500'} fontWeight="bold">
                                        {popup.is_visible ? '노출 중' : '숨김'}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell>
                                    {popup.is_always_visible ? (
                                        '상시 노출'
                                    ) : (
                                        <Text>
                                            {popup.start_time ? new Date(popup.start_time).toLocaleString() : '미지정'} <br/> 
                                            ~ {popup.end_time ? new Date(popup.end_time).toLocaleString() : '미지정'}
                                        </Text>
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <Stack direction="row" gap="2">
                                        <Button size="sm" onClick={() => navigate(`/admin/popup/update/${popup.popup_code}`)}>수정</Button>
                                        <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleDelete(popup.popup_code)}>삭제</Button>
                                    </Stack>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table.Root>
        </Box>
    );
}

export default List;
