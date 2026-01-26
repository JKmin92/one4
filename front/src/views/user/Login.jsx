import { Button, Field, Fieldset, Heading, HStack, Input, Link, Stack, StackSeparator } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";

function Login() {

    const snsButtonStyle = {w:'50px', h:'50px', backgroundRepeat:'no-repeat', backgroundPosition:'center', rounded:'full'};
    const naver = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/naver.svg)', backgroundSize:'40px', backgroundColor:'#00c300'};
    const kakao = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/kakao.svg)', backgroundSize:'40px', backgroundColor:'#ffe600'};
    const google = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/google.svg)', backgroundSize:'38px', border:'1px solid #aaa', backgroundPosition:'center 50%'};
    const apple = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/apple.svg)', backgroundSize:'38px', border:'1px solid #aaa', backgroundPosition:'center calc(50% - 2px)'}

    return (
        <Stack padding="200px 0" px="layoutX" width="lg" margin="auto">
            <Heading textAlign="center">로그인</Heading>
            <Fieldset.Root>
                <Stack gap="6">
                    <Fieldset.Content>
                        <Field.Root>
                            <Input placeholder="이메일" />
                        </Field.Root>
                        <Field.Root>
                            <PasswordInput placeholder="비밀번호" />
                        </Field.Root>
                    </Fieldset.Content>
                    <HStack justifyContent="center" gap="4" separator={<StackSeparator />}>
                        <Link href="/join" fontSize="sm">회원 가입</Link>
                        <Link href="#" fontSize="sm">계정 찾기</Link>
                    </HStack>
                    <HStack justifyContent="center" gap="6">
                        <Button variant="ghost" {...naver}></Button>
                        <Button variant="ghost" {...kakao}></Button>
                        <Button variant="ghost" {...google}></Button>
                        <Button variant="ghost" {...apple}></Button>
                    </HStack>
                    <Button type="submit">로그인</Button>
                </Stack>
            </Fieldset.Root>
        </Stack>
    )
}

export default Login;