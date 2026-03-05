import { Flex, Heading, Image, RatingGroup, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { formatDateYMD } from "../../../../utils/simpleUtils";

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
                } else if (id === 'faq') {
                    setTitle('FAQ 관리');
                }

                const resources = await axiosInstance.get(getBaordUrl);
                setBoardList(resources.data);
            } catch (error) {
                console.error("Failed to fetch board", error);
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
                    {(id === 'review' || id === 'product_qna') && <Table.ColumnHeader>제품</Table.ColumnHeader>}
                    {id === 'review' && <Table.ColumnHeader>별점</Table.ColumnHeader>}
                    {(id === 'review' || id === 'product_qna' || id === 'inquiry') && <Table.ColumnHeader>작성자</Table.ColumnHeader>}
                    <Table.ColumnHeader>내용</Table.ColumnHeader>
                    <Table.ColumnHeader>등록일</Table.ColumnHeader>
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
                            <Table.Cell>
                                <Text
                                    fontSize="sm"
                                    dangerouslySetInnerHTML={{ __html: board.content }}
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    textOverflow="ellipsis" />
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{formatDateYMD(board.created_at)}</Text>
                            </Table.Cell>

                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Stack>
    )
}

export default List;