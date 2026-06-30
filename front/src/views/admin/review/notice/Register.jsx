import { Box, Button, Flex, Heading, HStack, Input, Stack, Switch, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NoticeEditor from "./NoticeEditor";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";

function Register() {
    const navigate = useNavigate();
    const { id } = useParams(); // id is notice_code
    const isEdit = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (isEdit) {
            fetchNotice();
        }
    }, [id]);

    const fetchNotice = async () => {
        try {
            const res = await axiosInstance.get(`/admin/review/notice/${id}`);
            setTitle(res.data.title);
            setContent(res.data.content);
            setIsActive(res.data.is_active === 1);
        } catch (error) {
            console.error(error);
            toaster.create({ title: '공지사항을 불러오는 중 오류가 발생했습니다.', type: 'error' });
        }
    }

    const handleSave = async () => {
        if (!title.trim()) return toaster.create({ title: '제목을 입력해주세요.', type: 'error' });
        if (!content.trim() || content === '<p></p>') return toaster.create({ title: '내용을 입력해주세요.', type: 'error' });

        const data = { title, content, is_active: isActive ? 1 : 0 };

        try {
            if (isEdit) {
                await axiosInstance.put(`/admin/review/notice/${id}`, data);
                toaster.create({ title: '수정되었습니다.', type: 'success' });
            } else {
                await axiosInstance.post(`/admin/review/notice`, data);
                toaster.create({ title: '등록되었습니다.', type: 'success' });
            }
            navigate('/admin/review/notice/list');
        } catch (error) {
            console.error(error);
            toaster.create({ title: '저장 중 오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Flex justifyContent="space-between" alignItems="center">
                <Heading size="lg">공지사항 {isEdit ? '수정' : '등록'}</Heading>
                <HStack gap="4">
                    <Button variant="outline" onClick={() => navigate('/admin/review/notice/list')}>취소</Button>
                    <Button colorScheme="teal" onClick={handleSave}>저장</Button>
                </HStack>
            </Flex>

            <Stack gap="4" borderWidth="1px" p="6" rounded="md" bg="bg">
                <Box>
                    <Text mb="2" fontWeight="bold">제목</Text>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력해주세요."
                    />
                </Box>
                <Box>
                    <Text mb="2" fontWeight="bold">노출 상태</Text>
                    <Switch.Root
                        checked={isActive}
                        onCheckedChange={(e) => setIsActive(e.checked)}
                        colorPalette="teal"
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>{isActive ? '노출' : '숨김'}</Switch.Label>
                    </Switch.Root>
                </Box>
                <Box>
                    <Text mb="2" fontWeight="bold">내용</Text>
                    <Box borderWidth="1px" rounded="md" p="2">
                        <NoticeEditor content={content} setContent={setContent} />
                    </Box>
                </Box>
            </Stack>
        </Stack>
    );
}

export default Register;
