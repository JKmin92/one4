import { Heading, Image, Input, InputGroup, Stack, StackSeparator } from "@chakra-ui/react";
import { LuLock, LuMail, LuSmartphone, LuUser } from "react-icons/lu";
import { PasswordInput } from "../../components/ui/password-input";


function Join() {
    return (
        <Stack padding="80px 0" px="layoutX" width="lg" margin="auto" gap="6">
            <Image src="/resources/img/logo/logo.svg" alt="logo" width="120px" margin="auto" />
            <Heading>회원가입</Heading>
            <Stack gap="6" separator={<StackSeparator />}>
                <Stack gap="2">
                    <InputGroup startAddon={<LuMail />}>
                        <Input placeholder="이메일" />
                    </InputGroup>

                    <InputGroup startAddon={<LuLock />}>
                        <PasswordInput placeholder="비밀번호" />
                    </InputGroup>

                    <InputGroup startAddon={<LuLock />}>
                        <Input type="password" placeholder="비밀번호 재확인" />
                    </InputGroup>

                    <InputGroup startAddon={<LuUser />}>
                        <Input placeholder="이름" />
                    </InputGroup>

                    <InputGroup startAddon={<LuSmartphone />}>
                        <Input placeholder="연락처" />
                    </InputGroup>
                </Stack>
                <Stack>

                </Stack>
            </Stack>
        </Stack>
    )
}

export default Join;