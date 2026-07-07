import { Button, Field, Fieldset, Heading, Input, Stack, HStack, Box } from "@chakra-ui/react";
import { PasswordInput } from "../../../components/ui/password-input";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster";
import axiosInstance from "../../../utils/api";

function AdminRegister() {
    const { id } = useParams();
    const isUpdate = !!id;
    const navigate = useNavigate();

    // 임시 State (백엔드 연동 전)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('ADMIN');

    useEffect(() => {
        if (isUpdate) {
            getManagerData();
        }
    }, [id]);

    const formatPhone = (value) => {
        if (!value) return '';
        const onlyNums = value.replace(/[^0-9]/g, '');
        if (onlyNums.length <= 3) return onlyNums;
        if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    };

    const getManagerData = async () => {
        try {
            const response = await axiosInstance.get(`/admin/manager/${id}`);
            const data = response.data;
            if (data) {
                setEmail(data.email || '');
                setName(data.name || '');
                setPhone(formatPhone(data.phone || ''));
                setRole(data.role || 'ADMIN');
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '데이터를 불러오는 중 오류가 발생했습니다.', status: 'error' });
            navigate('/admin/manager/list');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!isUpdate && !password) {
            toaster.create({ title: '신규 등록 시 비밀번호는 필수입니다.', status: 'warning', type: 'warning' });
            return;
        }

        try {
            const payload = {
                email,
                name,
                phone,
                role,
                password
            };
            
            if (isUpdate) {
                await axiosInstance.put(`/admin/manager/${id}`, payload);
                toaster.create({ title: '관리자 정보가 수정되었습니다.', type: 'success' });
            } else {
                await axiosInstance.post('/admin/manager/register', payload);
                toaster.create({ title: '새 관리자가 등록되었습니다.', type: 'success' });
            }
            navigate('/admin/manager/list');
        } catch (error) {
            console.error(error);
            toaster.create({ 
                title: error.response?.data?.message || '저장 중 오류가 발생했습니다.', 
                status: 'error',
                type: 'error'
            });
        }
    };

    return (
        <Stack p="8" gap="6">
            <Heading size="lg">{isUpdate ? '관리자 정보 수정' : '신규 관리자 등록'}</Heading>

            <Box bg="white" p="6" rounded="lg" shadow="sm" borderWidth="1px">
                <form onSubmit={handleSave}>
                    <Fieldset.Root>
                        <Stack gap="6" maxW="lg">
                            <Field.Root required>
                                <Field.Label>이메일 (아이디)</Field.Label>
                                <Input 
                                    placeholder="admin@one4.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    disabled={isUpdate}
                                />
                            </Field.Root>

                            <Field.Root required={!isUpdate}>
                                <Field.Label>비밀번호 {isUpdate && '(변경 시에만 입력)'}</Field.Label>
                                <PasswordInput 
                                    placeholder="비밀번호" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>이름</Field.Label>
                                <Input 
                                    placeholder="이름을 입력하세요" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>연락처</Field.Label>
                                <Input 
                                    placeholder="010-1234-5678" 
                                    value={phone} 
                                    onChange={(e) => setPhone(formatPhone(e.target.value))} 
                                    maxLength={13}
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>관리자 권한</Field.Label>
                                <HStack gap="6">
                                    <label style={{display:'flex', alignItems:'center', gap:'8px', cursor:'pointer'}}>
                                        <input type="radio" name="role" value="ADMIN" checked={role === 'ADMIN'} onChange={(e) => setRole(e.target.value)} />
                                        일반 관리자 (ADMIN)
                                    </label>
                                    <label style={{display:'flex', alignItems:'center', gap:'8px', cursor:'pointer'}}>
                                        <input type="radio" name="role" value="SUPER_ADMIN" checked={role === 'SUPER_ADMIN'} onChange={(e) => setRole(e.target.value)} />
                                        최고 관리자 (SUPER_ADMIN)
                                    </label>
                                </HStack>
                            </Field.Root>
                            
                            <HStack mt="4">
                                <Button type="submit" colorPalette="blue" flex="1">
                                    {isUpdate ? '수정하기' : '등록하기'}
                                </Button>
                                <Button type="button" variant="outline" flex="1" onClick={() => navigate('/admin/manager/list')}>
                                    취소
                                </Button>
                            </HStack>
                        </Stack>
                    </Fieldset.Root>
                </form>
            </Box>
        </Stack>
    )
}

export default AdminRegister;
