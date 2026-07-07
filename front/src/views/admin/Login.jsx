import { Button, Field, Fieldset, Heading, Input, Stack, Box } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { toaster } from "../../components/ui/toaster";

function AdminLogin() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
        return <Navigate to="/admin/shop/order/total" replace />;
    }

    const onSubmit = async (data) => {
        try {
            const userData = await login({ email: data.email, password: data.password }, 'admin');
            if (userData) {
                const state = location.state || {};
                const redirectUrl = state.redirect || '/admin/shop/order/total';
                navigate(redirectUrl, { replace: true, state: state });
            }
        } catch (error) {
            toaster.create({ title: error.message || '로그인에 실패했습니다.', type: 'error', closable: true });
        }
    }

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
            <Stack p={{ base: '100px 0', md: "40px" }} px={{ base: '15px', md: '8' }} width={{ base: 'full', md: "lg" }} margin="auto" bg="white" rounded="xl" shadow="lg">
                <Heading textAlign="center" size="xl" mb="6">관리자 로그인</Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Fieldset.Root>
                        <Stack gap="6">
                            <Fieldset.Content>
                                <Field.Root invalid={!!errors.email}>
                                    <Input placeholder="관리자 이메일" {...register('email', { required: '이메일을 입력해주세요.' })} />
                                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root invalid={!!errors.password}>
                                    <PasswordInput placeholder="비밀번호" {...register('password', { required: '비밀번호를 입력해주세요.' })} />
                                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                                </Field.Root>
                            </Fieldset.Content>
                            
                            <Button type="submit" size="lg" colorPalette="blue" mt="4">로그인</Button>
                        </Stack>
                    </Fieldset.Root>
                </form>
            </Stack>
        </Box>
    )
}

export default AdminLogin;
