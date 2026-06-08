import { Table } from "@chakra-ui/react";

function ReturnOrder({ returnOrderItemList = [], productOrderClaim }) {
    return (
        <Table.Root>
            <Table.Header>
                <Table.Row bg="gray.subtle">
                    <Table.ColumnHeader>요청일시</Table.ColumnHeader>
                    <Table.ColumnHeader>처리상태</Table.ColumnHeader>
                    <Table.ColumnHeader>이미지</Table.ColumnHeader>
                    <Table.ColumnHeader>상품</Table.ColumnHeader>
                    <Table.ColumnHeader>반품수량</Table.ColumnHeader>
                    <Table.ColumnHeader>반품사유</Table.ColumnHeader>
                    <Table.ColumnHeader>반품사유(상세)</Table.ColumnHeader>
                    <Table.ColumnHeader>환불수단</Table.ColumnHeader>
                    <Table.ColumnHeader>환불계좌</Table.ColumnHeader>
                    <Table.ColumnHeader>처리일시</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {returnOrderItemList.length > 0 ? (
                    <Table.Row>
                        <Table.Cell colSpan="10" textAlign="center">asdfasdf</Table.Cell>
                    </Table.Row>
                ) : (
                    <Table.Row>
                        <Table.Cell colSpan="10" textAlign="center">반품정보가 없습니다.</Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default ReturnOrder;