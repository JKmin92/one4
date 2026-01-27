import { Button, Field, Fieldset, Heading, HStack, Input, Link, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";

function Login() {

    const snsButtonStyle = {w:'40px', h:'40px', backgroundRepeat:'no-repeat', backgroundPosition:'center', rounded:'full'};
    const naver = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/naver.svg)', backgroundSize:'28px', backgroundColor:'#00c300'};
    const kakao = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/kakao.svg)', backgroundSize:'28px', backgroundColor:'#ffe600'};
    const google = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/google.svg)', backgroundSize:'25px', borderWidth:'1px', borderColor:'border.emphasized', backgroundPosition:'center 50%'};
    const apple = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/apple.svg)', backgroundSize:'25px', borderWidth:'1px', borderColor:'border.emphasized', backgroundPosition:'center calc(50% - 2px)'}

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
                    <HStack justifyContent="end">
                        <Link href="#" fontSize="sm">계정 찾기</Link>
                    </HStack>
                    <Button type="submit">로그인</Button>
                    <Stack separator={<StackSeparator />} gap="6">
                        <HStack justifyContent="space-between">
                            <Stack>
                                <Heading>SNS 간편 로그인</Heading>
                                <Text fontSize="xs" color="fg.muted">간편하게 로그인하세요.</Text>
                            </Stack>
                            <HStack justifyContent="center" gap="2">
                                <Button variant="ghost" {...naver}></Button>
                                <Button variant="ghost" {...kakao}></Button>
                                <Button variant="ghost" {...google}></Button>
                                <Button variant="ghost" {...apple}></Button>
                            </HStack>
                        </HStack>
                        <Button variant="outline" asChild><Link href="join">회원가입</Link></Button>
                    </Stack>
                </Stack>
            </Fieldset.Root>
        </Stack>
    )
}

export default Login;