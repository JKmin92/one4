import { Box, Button, Flex, Heading, HStack, Image, RatingGroup, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";

function Detail() {

    const { type, id } = useParams();
    const [board, setBoard] = useState(null);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const getBoard = async () => {
            let url = '';
            if (type === 'review') {
                setTitle('리뷰 상세');
                url = `/admin/shop/board/product/review/${id}`;
            } else if (type === 'product_qna') {
                setTitle('상품 문의 상세');
                url = `/admin/shop/board/product/inquiry/${id}`;
            } else if (type === 'faq') {
                setTitle('FAQ 상세');
                url = `/admin/shop/board/faq/${id}`;
            }

            try {
                const resources = await axiosInstance.get(url);
                console.log(resources.data);
                setBoard(resources.data);
            } catch (error) {
                console.error(error);
                toaster.create({ title: '게시글을 불러오는데 실패했습니다.', type: 'error' });
            }
        }
        getBoard();
    }, [id, type])

    if (board === null) return;

    const typeList = [
        { label: '제품 문의', value: 'PRODUCT' },
        { label: '배송 문의', value: 'DELIVERY' },
        { label: '기타 문의', value: 'ACC' }
    ];

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading>{title}</Heading>

            {board.product_name !== null && (
                <HStack gap="4" p="4" borderWidth="1px" rounded="md">
                    <Box width="20" height="20" bg="gray.100" rounded="md" overflow="hidden">
                        {board.product_image ? (
                            <Image src={board.product_image} w="full" h="full" objectFit="cover" />
                        ) : (
                            <Box w="full" h="full" bg="gray.200" />
                        )}
                    </Box>
                    <Stack gap="1">
                        <Text fontWeight="medium">{board.product_name}</Text>
                        <Text>작성자 : {board.user_name}</Text>
                    </Stack>
                </HStack>
            )}

            {type === 'review' ? (
                <HStack>
                    <Text>평점</Text>
                    <RatingGroup.Root readOnly allowHalf count={5} defaultValue={0} value={board.rating} size="lg" colorPalette="yellow">
                        <RatingGroup.HiddenInput />
                        <RatingGroup.Control />
                    </RatingGroup.Root>
                </HStack>
            ) : type === 'product_qna' ? (
                <HStack>
                    <Text>문의 유형</Text>
                    <Text borderWidth="1px" borderColor="border" rounded="md" px="4">{typeList.find(t => t.value === board.type)?.label}</Text>
                </HStack>
            ) : null}

            <Stack borderWidth="1px" borderColor="border" rounded="md" p="4" h="500px" overflowY="auto">
                <Text dangerouslySetInnerHTML={{ __html: board.content }} />
            </Stack>

            <Flex justify="flex-end" gap="2">
                {type === 'product_qna' && (
                    <Button variant="outline" onClick={() => navigate(`/admin/shop/board/${type}`)}>답변하기</Button>
                )}
                <Button variant="outline" onClick={() => navigate(`/admin/shop/board/${type}`)}>목록으로</Button>
            </Flex>
        </Stack>
    )

}

export default Detail;