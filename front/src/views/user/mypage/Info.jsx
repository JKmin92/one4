import { Box, Button, Editable, Heading, HStack, IconButton, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { LuCheck, LuChevronRight, LuPencilLine, LuUserRound, LuX } from "react-icons/lu";
import { useAuth } from "../../../utils/useAuth";
import { useState } from "react";
import Delivery from "./info/Delivery";

function Info() {

    const { user } = useAuth();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [birth, setBirth] = useState();

    const [deliveryList, setDeliveryList] = useState([]);

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Stack w="2xl" margin="0 auto" gap="6">
                <HStack gap="5">
                    <Box w="100px" h="100px" rounded="full" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
                        <LuUserRound size="25" />
                    </Box>
                    <Text color="fg.muted">{user.email}</Text>
                </HStack>
                <Stack separator={<StackSeparator />}>
                    <Button variant="ghost" justifyContent="space-between">개인정보 수정<LuChevronRight /></Button>
                    <Button variant="ghost" justifyContent="space-between">비밀번호 변경<LuChevronRight /></Button>
                    <Delivery deliveryList={deliveryList} setDeliveryList={setDeliveryList} />
                    <Button variant="ghost" justifyContent="space-between">리뷰 채널 관리<LuChevronRight /></Button>
                    <Button variant="ghost" justifyContent="space-between">알림 설정<LuChevronRight /></Button>
                    <Button variant="ghost" justifyContent="space-between">환불 계좌 관리<LuChevronRight /></Button>
                    <Button variant="ghost" justifyContent="space-between">회원탈퇴<LuChevronRight /></Button>
                </Stack>

            </Stack>
        </Stack>
    )
}

export default Info;