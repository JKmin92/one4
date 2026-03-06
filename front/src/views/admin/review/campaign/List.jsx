import { Stack, Table } from "@chakra-ui/react";

function List() {

    const reviewCampaignList = [
        { title: '제품 체험단', brand: '와바미', start_date: '2026-03-06', end_date: '2026-03-24', write_start_date: '2026-03-25', write_end_date: '2026-04-02' }
    ]

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>상태</Table.ColumnHeader>
                        <Table.ColumnHeader>채널</Table.ColumnHeader>
                        <Table.ColumnHeader>제목</Table.ColumnHeader>
                        <Table.ColumnHeader>모집인원</Table.ColumnHeader>
                        <Table.ColumnHeader>모집기간</Table.ColumnHeader>
                        <Table.ColumnHeader>작성기간</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                </Table.Body>
            </Table.Root>
        </Stack>
    )
}
export default List;