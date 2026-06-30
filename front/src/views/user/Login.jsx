import { Button, Field, Fieldset, Heading, HStack, Input, Link, Stack, StackSeparator, Text, Box, Switch } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toaster } from "../../components/ui/toaster";
import axiosInstance from "../../utils/api";
import { getLocalRecentProducts, clearLocalRecentProducts } from "../../utils/recentProducts";

function Login() {

    const snsButtonStyle = {w:'40px', h:'40px', backgroundRepeat:'no-repeat', backgroundPosition:'center', rounded:'full'};
    const naver = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/naver.svg)', backgroundSize:'28px', backgroundColor:'#00c300'};
    const kakao = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/kakao.svg)', backgroundSize:'28px', backgroundColor:'#ffe600'};
    const google = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/google.svg)', backgroundSize:'25px', borderWidth:'1px', borderColor:'border.emphasized', backgroundPosition:'center 50%'};
    const apple = {...snsButtonStyle, backgroundImage:'url(/resources/img/logo/apple.svg)', backgroundSize:'25px', borderWidth:'1px', borderColor:'border.emphasized', backgroundPosition:'center calc(50% - 2px)'}

    const { register, handleSubmit, formState: {errors}} = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (data) => {
        try {
            const userData = await login({email:data.email, password:data.password, autoLogin: data.autoLogin});
            if(userData) {
                const localRecentList = getLocalRecentProducts();
                if (localRecentList.length > 0) {
                    axiosInstance.post('/shop/product/recent/sync', { list: localRecentList })
                        .then(() => {
                            clearLocalRecentProducts();
                        })
                        .catch(() => {});
                }

                const state = location.state || {};
                
                if (state.action === 'add_basket' && state.basketData) {
                    try {
                        const response = await axiosInstance.post('/shop/product/basket', state.basketData);
                        window.dispatchEvent(new Event('basket_updated'));
                        if (response.data.code === '201') {
                            toaster.create({ title: '이미 장바구니에 담겨 있습니다.', type: 'warning' });
                        } else {
                            toaster.create({ title: '장바구니에 추가되었습니다.', type: 'success' });
                        }
                    } catch (error) {
                        toaster.create({ title: '장바구니에 추가 실패했습니다.', type: 'error' });
                    }
                }

                const redirectUrl = state.redirect || '/';
                navigate(redirectUrl, { replace: true, state: state });
            }
        } catch {
            toaster.create({title:'로그인에 실패했습니다.', type:'error', closable:true});
        }
    }

    return (
        <Stack p={{base:'100px 0', md:"200px 0"}} px={{base:'15px', md:'layoutX'}} width={{base:'full', md:"lg"}} margin="auto">
            <Heading textAlign="center">로그인</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset.Root>
                    <Stack gap="6">
                        <Fieldset.Content>
                            <Field.Root invalid={!!errors.email}>
                                <Input placeholder="이메일" {...register('email', {required:'이메일을 입력해주세요.'})} />
                                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={!!errors.password}>
                                <PasswordInput placeholder="비밀번호" {...register('password', {required:'비밀번호를 입력해주세요.'})} />
                                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                            </Field.Root>
                        </Fieldset.Content>
                        <HStack justifyContent="space-between">
                            <Switch.Root colorPalette="blue" size="sm">
                                <Switch.HiddenInput {...register('autoLogin')} />
                                <Switch.Control />
                                <Switch.Label fontSize="sm" cursor="pointer">자동 로그인</Switch.Label>
                            </Switch.Root>
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
            </form>
        </Stack>
    )
}

export default Login;