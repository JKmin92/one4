import { Box, Button, Field, Fieldset, Heading, HStack, Input, Stack, Text, Image, Checkbox, RadioGroup, DatePicker } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster";
import axiosInstance from "../../../utils/api";

function PopupRegister() {
    const { id } = useParams();
    const isUpdate = !!id;
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [isNewTab, setIsNewTab] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isAlwaysVisible, setIsAlwaysVisible] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [targetService, setTargetService] = useState('ALL');

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isUpdate) {
            getPopupData();
        }
    }, [id]);

    const getPopupData = async () => {
        try {
            const res = await axiosInstance.get(`/admin/popup/${id}`);
            const data = res.data;
            if (data) {
                setTitle(data.title || '');
                setLinkUrl(data.link_url || '');
                setIsNewTab(!!data.is_new_tab);
                setIsVisible(!!data.is_visible);
                setIsAlwaysVisible(!!data.is_always_visible);
                if (data.start_time) setStartTime(new Date(data.start_time));
                if (data.end_time) setEndTime(new Date(data.end_time));
                setTargetService(data.target_service || 'ALL');
                setPreviewUrl(data.image_url || '');
            }
        } catch (error) {
            console.error(error);
            toaster.create({ title: '데이터를 불러오는 중 오류가 발생했습니다.', type: 'error' });
            navigate('/admin/popup/list');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // 프론트엔드단 정사각형 검증
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(selectedFile);
        img.onload = () => {
            if (img.width !== img.height) {
                toaster.create({ title: '정사각형(1:1 비율) 이미지만 업로드 가능합니다.', type: 'warning' });
                setFile(null);
                setPreviewUrl('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                URL.revokeObjectURL(objectUrl);
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(objectUrl);
        };
        img.src = objectUrl;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!isUpdate && !file) {
            toaster.create({ title: '이미지를 업로드해주세요.', type: 'warning' });
            return;
        }

        if (!isAlwaysVisible && (!startTime || !endTime)) {
            toaster.create({ title: '노출 기간을 정확히 설정해주세요.', type: 'warning' });
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('link_url', linkUrl);
        formData.append('is_new_tab', isNewTab);
        formData.append('is_visible', isVisible);
        formData.append('is_always_visible', isAlwaysVisible);
        formData.append('target_service', targetService);

        if (!isAlwaysVisible) {
            formData.append('start_time', startTime ? startTime.toISOString() : '');
            formData.append('end_time', endTime ? endTime.toISOString() : '');
        }

        if (file) {
            formData.append('image', file);
        }

        try {
            if (isUpdate) {
                await axiosInstance.put(`/admin/popup/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toaster.create({ title: '팝업이 수정되었습니다.', type: 'success' });
            } else {
                await axiosInstance.post('/admin/popup/register', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toaster.create({ title: '새 팝업이 등록되었습니다.', type: 'success' });
            }
            navigate('/admin/popup/list');
        } catch (error) {
            console.error(error);
            toaster.create({
                title: error.response?.data?.message || '저장 중 오류가 발생했습니다.',
                type: 'error'
            });
        }
    };

    return (
        <Stack p="8" gap="6">
            <Heading size="lg">{isUpdate ? '팝업 수정' : '새 팝업 등록'}</Heading>

            <Box bg="white" p="6" rounded="lg" shadow="sm" borderWidth="1px">
                <form onSubmit={handleSave}>
                    <Fieldset.Root>
                        <Stack gap="6" maxW="lg">
                            <Field.Root required>
                                <Field.Label>팝업 제목 (관리용)</Field.Label>
                                <Input
                                    placeholder="예: 여름 정기 세일 팝업"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Field.Root>

                            <Field.Root required={!isUpdate}>
                                <Field.Label>팝업 이미지 (정사각형 1:1 필수)</Field.Label>
                                <Box display="none">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                    />
                                </Box>
                                <HStack gap="4" alignItems="center">
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        이미지 업로드
                                    </Button>
                                    <Text fontSize="sm" color="gray.600">
                                        {file ? file.name : (isUpdate && previewUrl ? '기존 이미지가 등록되어 있습니다.' : '선택된 파일 없음')}
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.500" mt="2">
                                    업로드 시 1000px을 초과하는 이미지는 1000px로 자동 리사이징 되며 Webp 포맷으로 최적화됩니다.
                                </Text>
                                {previewUrl && (
                                    <Box mt="4" borderWidth="1px" p="2" rounded="md" display="inline-block">
                                        <Image src={previewUrl} maxW="200px" maxH="200px" objectFit="contain" />
                                    </Box>
                                )}
                            </Field.Root>

                            <Stack gap="2">
                                <Field.Root>
                                    <Field.Label>링크 URL (선택)</Field.Label>
                                    <Input
                                        placeholder="클릭 시 이동할 전체 주소 (예: https://one4.com/...)"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                    />
                                </Field.Root>
                                <Checkbox.Root checked={isNewTab} onCheckedChange={(e) => setIsNewTab(e.checked)} mt="1">
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>클릭 시 새 창(새 탭)에서 열기</Checkbox.Label>
                                </Checkbox.Root>
                            </Stack>

                            <Stack gap="1.5">
                                <Text fontSize="sm" fontWeight="medium">노출 위치</Text>
                                <RadioGroup.Root value={targetService} onValueChange={(e) => setTargetService(e.value)}>
                                    <HStack gap="6">
                                        <RadioGroup.Item value="ALL">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemControl />
                                            <RadioGroup.ItemText>모든 페이지 (전체)</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                        <RadioGroup.Item value="SHOP">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemControl />
                                            <RadioGroup.ItemText>쇼핑몰 전용</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                        <RadioGroup.Item value="REVIEW">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemControl />
                                            <RadioGroup.ItemText>체험단 전용</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                    </HStack>
                                </RadioGroup.Root>
                            </Stack>

                            <Stack gap="1.5">
                                <Text fontSize="sm" fontWeight="medium">상태 및 기간 설정</Text>
                                <Box p="4" bg="gray.50" rounded="md" w="full">
                                    <Checkbox.Root checked={isVisible} onCheckedChange={(e) => setIsVisible(e.checked)} mb="4" colorPalette={isVisible ? 'blue' : 'gray'}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label fontWeight="bold" color={isVisible ? 'blue.500' : 'gray.500'}>
                                            {isVisible ? '사용함 (사이트에 노출됩니다)' : '사용 안함 (숨김)'}
                                        </Checkbox.Label>
                                    </Checkbox.Root>

                                    <Box mb="4">
                                        <Checkbox.Root checked={isAlwaysVisible} onCheckedChange={(e) => setIsAlwaysVisible(e.checked)}>
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>항상 노출 (체크 해제 시 노출 기간 설정)</Checkbox.Label>
                                        </Checkbox.Root>
                                    </Box>

                                    {!isAlwaysVisible && (
                                        <HStack gap="4">
                                            <Box flex="1">
                                                <Text fontSize="sm" mb="1">시작 시간</Text>
                                                <DatePicker
                                                    selected={startTime}
                                                    onChange={(date) => setStartTime(date)}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    timeCaption="시간"
                                                    dateFormat="yyyy년 MM월 dd일 HH:mm"
                                                    locale={ko}
                                                    customInput={<Input />}
                                                />
                                            </Box>
                                            <Text mt="6">~</Text>
                                            <Box flex="1">
                                                <Text fontSize="sm" mb="1">종료 시간</Text>
                                                <DatePicker
                                                    selected={endTime}
                                                    onChange={(date) => setEndTime(date)}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    timeCaption="시간"
                                                    dateFormat="yyyy년 MM월 dd일 HH:mm"
                                                    locale={ko}
                                                    customInput={<Input />}
                                                />
                                            </Box>
                                        </HStack>
                                    )}
                                </Box>
                            </Stack>

                            <HStack mt="4">
                                <Button type="submit" colorPalette="blue" flex="1">
                                    {isUpdate ? '수정하기' : '등록하기'}
                                </Button>
                                <Button type="button" variant="outline" flex="1" onClick={() => navigate('/admin/popup/list')}>
                                    목록으로
                                </Button>
                            </HStack>
                        </Stack>
                    </Fieldset.Root>
                </form>
            </Box>
        </Stack>
    );
}

export default PopupRegister;
