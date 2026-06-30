import { Box, Flex, Heading, Stack, Text, Button } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../utils/api";
import { formatDateYMD } from "../../../utils/simpleUtils";
import { toaster } from "../../../components/ui/toaster";

function Detail() {
    const { notice_code } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchNotice = async () => {
            try {
                const res = await axiosInstance.get(`/review/notice/${notice_code}`);
                setNotice(res.data);
            } catch (error) {
                console.error("Failed to load notice", error);
                toaster.create({ title: '공지사항을 불러오는 중 오류가 발생했습니다.', type: 'error' });
                navigate('/review');
            }
        };
        fetchNotice();
    }, [notice_code, navigate]);

    if (!notice) return <Box p="10" textAlign="center">Loading...</Box>;

    return (
        <Stack p={{ base: '40px 15px', md: "80px layoutX" }} gap="6" maxW="1200px" mx="auto" w="full">
            <Heading size="xl" textAlign="center">공지사항</Heading>

            <Stack borderWidth="1px" rounded="md" bg="bg">
                <Box p="6" borderBottomWidth="1px">
                    <Heading size="lg" mb="4">{notice.title}</Heading>
                    <Flex justifyContent="flex-end" gap="4" color="fg.muted" fontSize="sm">
                        <Text>작성일: {formatDateYMD(notice.created_at)}</Text>
                        <Text>조회수: {notice.view_count}</Text>
                    </Flex>
                </Box>

                <Box p="6" minH="300px" className="tiptap" dangerouslySetInnerHTML={{ __html: notice.content }} />
            </Stack>

            <Flex justifyContent="center" mt="4">
                <Button variant="outline" onClick={() => navigate('/review')}>목록으로</Button>
            </Flex>
        </Stack>
    );
}

export default Detail;
