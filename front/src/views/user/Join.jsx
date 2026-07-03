import { Button, Checkbox, Field, Heading, HStack, Image, Input, InputGroup, Link, Stack, StackSeparator, Steps, Table, TableColumnHeader, Text } from "@chakra-ui/react";
import { LuLock, LuMail, LuSmartphone, LuUser } from "react-icons/lu";
import { PasswordInput } from "../../components/ui/password-input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toaster } from "../../components/ui/toaster";
import axiosInstance from "../../utils/api";
import { useAuth } from "../../utils/useAuth";

function Join() {

    const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm();
    const { setUser, setAccessToken } = useAuth();
    const [step, setStep] = useState(0);

    const handlePhoneChange = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 3 && val.length <= 7) {
            val = val.slice(0, 3) + '-' + val.slice(3);
        } else if (val.length > 7) {
            val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11);
        }
        setValue('phone', val);
    };

    const agreementInitValues = [
        { label: '이용 약관에 동의 하시겠습니까?', checked: false, value: 'agree1', essential: true },
        { label: '개인정보 처리방침에 동의 하시겠습니까?', checked: false, value: 'agree2', essential: true },
        { label: '마케팅 활용에 동의 하시겠습니까?', checked: false, value: 'mkt', essential: false },
    ]

    const [agreementValues, setAgreementValues] = useState(agreementInitValues);
    const agreementAllCheck = agreementValues.every((value) => value.checked);
    const agreementIndeterminate = agreementValues.some((value) => value.checked) && !agreementAllCheck;

    const snsButtonStyle = { w: '100%', rounded: 'full', backgroundPosition: '10px center', backgroundSize: '30px', backgroundRepeat: 'no-repeat', pl: '40px', fontSize: 'xs', variant: "ghost" };
    const kakao = { ...snsButtonStyle, backgroundImage: 'url(/resources/img/logo/kakao.svg)', backgroundColor: '#ffe600', color: 'black' };
    const naver = { ...snsButtonStyle, backgroundImage: 'url(/resources/img/logo/naver.svg)', backgroundColor: '#00c300', color: 'gray.50' };
    const google = { ...snsButtonStyle, backgroundImage: 'url(/resources/img/logo/google.svg)', backgroundColor: '#fff', borderWidth: '1px', borderColor: 'border.emphasized', color: 'black' };
    const apple = { ...snsButtonStyle, backgroundImage: 'url(/resources/img/logo/apple.svg)', backgroundColor: '#fff', borderWidth: '1px', borderColor: 'border.emphasized', color: 'black' };

    const onSubmit = async (data) => {
        let checkData = true;

        if (data.email.length < 1) { setError('email', { message: '이메일을 입력해주세요.' }); checkData = false; }
        if (data.password.length < 8) { setError('password', { message: '비밀번호는 8자 이상 입력해주세요.' }); checkData = false; }
        if (data.password != data.password2) { setError('password2', { message: '비밀번호가 맞지 않습니다.' }); checkData = false; }
        if (data.name.length < 1) { setError('name', { message: '이름을 입력해주세요.' }); checkData = false; }
        if (data.phone.length < 13) { setError('phone', { message: '연락처 11자리를 정확히 입력해주세요.' }); checkData = false; }

        agreementValues.map((agreeVal) => {
            if (agreeVal.essential && !agreeVal.checked) {
                toaster.create({ title: agreeVal.value == 'agree1' ? '이용약관에 동의해주세요.' : '개인정보 처리방침에 동의해주세요.', type: 'error' });
                checkData = false;
            }
        });

        if (!checkData) return false;

        try {
            const existsEmail = await axiosInstance.get(`/user/exists/email?email=${data.email}`);
            if (existsEmail.data) {
                setError('email', { message: '이미 존재하는 이메일입니다.' });
                return false;
            }

            const marketingAgree = agreementValues.find((agree) => agree.value == 'mkt').checked;
            const userData = { email: data.email, password: data.password, name: data.name, phone: data.phone, marketingAgree: marketingAgree };
            const res = await axiosInstance.post(`/user/`, userData);

            const { accessToken, ...newUser } = res.data;
            setAccessToken(accessToken);
            setUser(newUser);

            setStep(step + 1);
        } catch {
            toaster.create({ title: '오류가 발생되었습니다. 재시도 부탁드립니다.', type: 'error' });
        }
    }

    return (
        <Stack p={{ base: '100px 0', md: "200px 0" }} px={{ base: '15px', md: 'layoutX' }} width={{ base: 'full', md: "3xl" }} margin="auto" gap="6">
            <Steps.Root defaultStep={0} step={step} onStepChange={(e) => setStep(e.stap)} count={1}>
                <Steps.Content index={0}>
                    <Stack gap="6">
                        <Image src="/resources/img/logo/logo.svg" alt="logo" width="120px" margin="auto" />
                        <Stack gap="6" direction={{ base: 'column', md: "row" }} separator={<StackSeparator order={{ base: 1, md: 0 }} />} >
                            <Stack width={{ base: 'full', md: '60%' }} order={{ base: 2, md: 0 }}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="6" separator={<StackSeparator />} w="full">
                                        <Stack gap="6">
                                            <Heading>회원가입</Heading>
                                            <Stack gap="2">
                                                <Field.Root invalid={!!errors.email}>
                                                    <InputGroup startAddon={<LuMail />}>
                                                        <Input placeholder="이메일" {...register("email", { required: "이메일을 입력해주세요." })} />
                                                    </InputGroup>
                                                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                                                </Field.Root>

                                                <Field.Root invalid={!!errors.password}>
                                                    <InputGroup startAddon={<LuLock />}>
                                                        <PasswordInput placeholder="비밀번호" {...register("password", { required: "비밀번호는 8자 이상 입력해주세요.", minLength: { value: 8, message: '8자 이상 입력해주세요.' } })} />
                                                    </InputGroup>
                                                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                                                </Field.Root>

                                                <Field.Root invalid={!!errors.password2}>
                                                    <InputGroup startAddon={<LuLock />}>
                                                        <Input type="password" placeholder="비밀번호 재확인" {...register("password2", { required: "비밀번호를 다시 입력해주세요." })} />
                                                    </InputGroup>
                                                    <Field.ErrorText>{errors.password2?.message}</Field.ErrorText>
                                                </Field.Root>

                                                <Field.Root invalid={!!errors.name}>
                                                    <InputGroup startAddon={<LuUser />}>
                                                        <Input placeholder="이름" {...register("name", { required: "이름을 입력해주세요." })} />
                                                    </InputGroup>
                                                    <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                                                </Field.Root>

                                                <Field.Root invalid={!!errors.phone}>
                                                    <InputGroup startAddon={<LuSmartphone />}>
                                                        <Input placeholder="연락처" maxLength={13} {...register("phone", { 
                                                            required: "연락처를 입력해주세요.", 
                                                            minLength: { value: 13, message: "연락처 11자리를 정확히 입력해주세요." },
                                                            onChange: handlePhoneChange 
                                                        })} />
                                                    </InputGroup>
                                                    <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                                                </Field.Root>
                                            </Stack>
                                        </Stack>
                                        <Stack gap="6">
                                            <Stack>
                                                <Checkbox.Root
                                                    checked={agreementIndeterminate ? 'indeterminate' : agreementAllCheck}
                                                    onCheckedChange={(e) => setAgreementValues((current) => current.map((value) => ({ ...value, checked: !!e.checked })))}>
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
                                                                newValues[index] = { ...newValues[index], checked: !!e.checked };
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
                                        <Button type="submit">회원 가입</Button>
                                    </Stack>
                                </form>
                            </Stack>
                            <Stack gap="6" order={{ base: 0, md: 1 }} width={{ base: 'full', md: '40%' }}>
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
                </Steps.Content>
                <Steps.CompletedContent>
                    <Stack textAlign="center" margin="auto" gap="6" w="xs" p="180px 0">
                        <Image src="/resources/img/logo/logo.svg" alt="logo" width="120px" margin="auto" />
                        <Stack>
                            <Heading>회원 가입해주셔서 감사합니다.</Heading>
                            <Text>저희 원포에 많은 활동을 부탁드립니다.</Text>
                        </Stack>
                        <Button asChild><Link href="/">홈으로</Link></Button>
                    </Stack>
                </Steps.CompletedContent>
            </Steps.Root>

        </Stack>
    )
}

export default Join;