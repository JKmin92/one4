import { Box, Flex, Heading, Image, Link, RatingGroup, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { formatDateYMD } from "../../../../utils/simpleUtils";
import { toaster } from "../../../../components/ui/toaster";

function List() {

    const type = useParams();
    const [title, setTitle] = useState('');
    const [boardList, setBoardList] = useState([]);
    const id = type.type;


    useEffect(() => {
        const fetchBoard = async () => {
            try {
                let getBaordUrl = '';
                if (id === 'review') {
                    setTitle('리뷰 관리');
                    getBaordUrl = '/admin/shop/board/product/review';
                } else if (id === 'product_qna') {
                    setTitle('상품 문의');
                    getBaordUrl = '/admin/shop/board/product/inquiry';
                } else if (id === 'faq') {
                    setTitle('FAQ 관리');
                }

                if (getBaordUrl !== '') {
                    const resources = await axiosInstance.get(getBaordUrl);
                    setBoardList(resources.data);
                }
            } catch (error) {
                console.error("Failed to fetch board", error);
                toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
            }
        };
        fetchBoard();
    }, [type]);

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Flex>
                <Heading>{title}</Heading>
            </Flex>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        {(id === 'review' || id === 'product_qna') && <Table.ColumnHeader>제품</Table.ColumnHeader>}
                        {id === 'review' && <Table.ColumnHeader>별점</Table.ColumnHeader>}
                        {(id === 'review' || id === 'product_qna' || id === 'inquiry') && <Table.ColumnHeader>작성자</Table.ColumnHeader>}
                        <Table.ColumnHeader>내용</Table.ColumnHeader>
                        <Table.ColumnHeader>등록일</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {boardList.map((board, index) => (
                        <Table.Row key={board.id}>
                            {(id === 'review' || id === 'product_qna') && (
                                <Table.Cell>
                                    <Image src={board.product_image} width="12" />
                                </Table.Cell>
                            )}
                            {id === 'review' && (
                                <Table.Cell>
                                    <RatingGroup.Root readOnly allowHalf count={5} defaultValue={board.rating} size="xs" colorPalette="yellow">
                                        <RatingGroup.HiddenInput /><RatingGroup.Control />
                                    </RatingGroup.Root>
                                </Table.Cell>
                            )}
                            {(id === 'review' || id === 'product_qna' || id === 'inquiry') && (
                                <Table.Cell>
                                    <Text>{board.user_name ? board.user_name : '익명'}</Text>
                                </Table.Cell>
                            )}
                            <Table.Cell w="500px">
                                <Link href={`/admin/shop/board/${id}/${id === 'review' ? board.review_code : board.product_inquiry_code}`}>
                                    <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                        {board.content?.replace(/<[^>]+>/g, ' ').replace(/\&nbsp;/g, ' ')}
                                    </Text>
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{formatDateYMD(board.created_at)}</Text>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            {boardList.length === 0 && (
                <Flex justify="center" py="20">
                    <Text color="fg.muted">등록된 게시글이 없습니다.</Text>
                </Flex>
            )}
        </Stack>
    )
}

export default List;