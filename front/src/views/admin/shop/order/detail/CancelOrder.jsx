import { Table } from "@chakra-ui/react";

function CancelOrder({ cancelOrderItemList = [], productOrderClaim }) {
    return (
        <Table.Root>
            <Table.Header>
                <Table.Row bg="gray.subtle">
                    <Table.ColumnHeader>요청일시</Table.ColumnHeader>
                    <Table.ColumnHeader>처리상태</Table.ColumnHeader>
                    <Table.ColumnHeader>이미지</Table.ColumnHeader>
                    <Table.ColumnHeader>상품</Table.ColumnHeader>
                    <Table.ColumnHeader>취소수량</Table.ColumnHeader>
                    <Table.ColumnHeader>취소사유</Table.ColumnHeader>
                    <Table.ColumnHeader>취소사유(상세)</Table.ColumnHeader>
                    <Table.ColumnHeader>처리일시</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {cancelOrderItemList.length > 0 ? (
                    <Table.Row>
                        <Table.Cell>asdfd</Table.Cell>
                    </Table.Row>
                ) : (
                    <Table.Row>
                        <Table.Cell colSpan="8" textAlign="center">취소정보가 없습니다.</Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default CancelOrder;