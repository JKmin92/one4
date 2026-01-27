import { Button, Checkbox, Heading, HStack, Image, Input, InputGroup, Stack, StackSeparator, Table, TableColumnHeader } from "@chakra-ui/react";
import { LuLock, LuMail, LuSmartphone, LuUser } from "react-icons/lu";
import { PasswordInput } from "../../components/ui/password-input";
import { useState } from "react";


function Join() {

    const agreementInitValues = [
        {label : '이용 약관에 동의 하시겠습니까?', checked:false, value:'agree1', essential:true},
        {label : '개인정보 처리방침에 동의 하시겠습니까?', checked:false, value:'agree2', essential:true},
        {label : '마케팅 활용에 동의 하시겠습니까?', checked:false, value:'mkt', essential:false},
    ]

    const [agreementValues, setAgreementValues] = useState(agreementInitValues);
    const agreementAllCheck = agreementValues.every((value) => value.checked);
    const agreementIndeterminate = agreementValues.some((value) => value.checked) && !agreementAllCheck;

    const snsButtonStyle = {w:'100%', rounded:'full', backgroundPosition:'10px center', backgroundSize:'30px', backgroundRepeat:'no-repeat', pl:'40px', fontSize:'xs', variant:"ghost"};
    const kakao = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/kakao.svg)', backgroundColor:'#ffe600', color:'black'};
    const naver = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/naver.svg)', backgroundColor:'#00c300', color:'gray.50'};
    const google = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/google.svg)', backgroundColor:'#fff', borderWidth:'1px', borderColor:'border.emphasized', color:'black'};
    const apple = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/apple.svg)', backgroundColor:'#fff', borderWidth:'1px', borderColor:'border.emphasized', color:'black'};

    return (
        <Stack padding="80px 0" px="layoutX" width="4xl" margin="auto" gap="6">
            <Image src="/resources/img/logo/logo.svg" alt="logo" width="120px" margin="auto" />
            <Stack direction="row" gap="6" separator={<StackSeparator />}>
                <Stack gap="6" separator={<StackSeparator />} w="3/5">
                    <Stack gap="6">
                        <Heading>회원가입</Heading>
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
                    </Stack>
                    <Stack gap="6">
                        <Stack>
                            <Checkbox.Root 
                                checked={agreementIndeterminate ? 'indeterminate' : agreementAllCheck} 
                                onCheckedChange={(e) => setAgreementValues((current) => current.map((value) => ({...value, checked:!!e.checked})))}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <Checkbox.Label>전체동의</Checkbox.Label>
                            </Checkbox.Root>
                            {agreementValues.map((item, index) => (
                                <Checkbox.Root 
                                    key={item.value}
                                    checked={item.checked}
                                    onCheckedChange={(e) => {
                                        setAgreementValues((current) => {
                                            const newValues = [...current];
                                            newValues[index] = {...newValues[index], checked:!!e.checked};
                                            return newValues;
                                        })
                                    }}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>{item.label} {item.essential ? '(필수)' : '(선택)'}</Checkbox.Label>
                                </Checkbox.Root>
                            ))}
                        </Stack>
                        <Table.Root fontSize="xs" variant="outline" size="sm">
                            <Table.Header>
                                <Table.Row>
                                    <TableColumnHeader textAlign="center">목적</TableColumnHeader>
                                    <TableColumnHeader textAlign="center">항목</TableColumnHeader>
                                    <TableColumnHeader textAlign="center">보유 및 이용기간</TableColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell textAlign="center">이용자 식별 및<br></br>본인여부 확인</Table.Cell>
                                    <Table.Cell textAlign="center">이메일, 성함, 생년월일<br />비밀번호, 연락처</Table.Cell>
                                    <Table.Cell textAlign="center">회원탈퇴시까지</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Stack>
                    <Button>회원 가입</Button>
                </Stack>
                <Stack gap="6">
                    <Heading>SNS 계정으로 회원가입</Heading>
                    <Stack gap="4">
                        <Button {...kakao}>카카오톡으로 회원가입</Button>
                        <Button {...naver}>네이버로 회원가입</Button>
                        <Button {...google}>구글로 회원가입</Button>
                        <Button {...apple}>애플로 회원가입</Button>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default Join;