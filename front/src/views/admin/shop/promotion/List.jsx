import { Box, Button, Flex, Heading, Table, Badge, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { formatDateYMD } from "../../../../utils/simpleUtils";

function List() {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axiosInstance.get("/admin/shop/promotion");
                setPromotions(response.data);
            } catch (error) {
                console.error("Failed to fetch promotions", error);
            }
        };
        fetchPromotions();
    }, []);

    return (
        <Box p="30px" px="layoutX" gap="10" pb="20">
            <Flex justifyContent="space-between" alignItems="center" mb="6">
                <Heading size="lg">프로모션 목록</Heading>
                <Button colorScheme="primary" onClick={() => navigate("/admin/shop/promotion/register")}>
                    프로모션 등록
                </Button>
            </Flex>

            <Box overflowX="auto" borderWidth="1px">
                <Table.Root size="sm" interactive>
                    <Table.Header>
                        <Table.Row bg="gray.50">
                            <Table.ColumnHeader>프로모션명</Table.ColumnHeader>
                            <Table.ColumnHeader>할인</Table.ColumnHeader>
                            <Table.ColumnHeader>기간</Table.ColumnHeader>
                            <Table.ColumnHeader>상태</Table.ColumnHeader>
                            <Table.ColumnHeader>등록일</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {promotions.map((promotion) => (
                            <Table.Row key={promotion.id}>
                                <Table.Cell fontWeight="medium">
                                    <Link href={`/admin/shop/promotion/update/${promotion.id}`}>{promotion.name}</Link>
                                </Table.Cell>
                                <Table.Cell>
                                    {promotion.discount_type === 'percentage'
                                        ? `${promotion.discount_value}%`
                                        : `${Number(promotion.discount_value).toLocaleString()}원`}
                                </Table.Cell>
                                <Table.Cell>
                                    {formatDateYMD(promotion.start_date)} ~ {formatDateYMD(promotion.end_date)}
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge colorScheme={promotion.is_active ? "green" : "gray"}>
                                        {promotion.is_active ? "활성" : "비활성"}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell color="gray.500">
                                    {formatDateYMD(promotion.created_at)}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                        {promotions.length === 0 && (
                            <Table.Row>
                                <Table.Cell colSpan={6} textAlign="center" py="10" color="gray.500">
                                    등록된 프로모션이 없습니다.
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    );
}

export default List;