import { Box, Button, Checkbox, Dialog, Flex, Heading, HStack, IconButton, Image, Input, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { LuArrowDown, LuArrowUp, LuPlus, LuTrash } from "react-icons/lu";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";

function MainBanner() {
    const [banners, setBanners] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editBanner, setEditBanner] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [isAlways, setIsAlways] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [imagePc, setImagePc] = useState(null);
    const [imageMobile, setImageMobile] = useState(null);
    const [imageTablet, setImageTablet] = useState(null);

    const imagePcRef = useRef();
    const imageMobileRef = useRef();
    const imageTabletRef = useRef();

    const fetchBanners = async () => {
        try {
            const res = await axiosInstance.get('/admin/review/display/banners');
            setBanners(res.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '배너 목록을 불러오지 못했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        fetchBanners();
    }, []);

    const openForm = (banner = null) => {
        setEditBanner(banner);
        if (banner) {
            setTitle(banner.title);
            setLinkUrl(banner.link_url || '');
            setIsAlways(banner.is_always === 1);
            setStartDate(banner.start_date ? banner.start_date.substring(0, 16) : '');
            setEndDate(banner.end_date ? banner.end_date.substring(0, 16) : '');
            setIsActive(banner.is_active === 1);
        } else {
            setTitle('');
            setLinkUrl('');
            setIsAlways(true);
            setStartDate('');
            setEndDate('');
            setIsActive(true);
        }
        setImagePc(null);
        setImageMobile(null);
        setImageTablet(null);
        setIsFormOpen(true);
    }

    const closeForm = () => {
        setIsFormOpen(false);
        setEditBanner(null);
    }

    const saveBanner = async () => {
        if (!title) return toaster.create({ title: '배너 제목을 입력해주세요.', type: 'warning' });
        if (!editBanner && !imagePc) return toaster.create({ title: 'PC 이미지는 필수입니다.', type: 'warning' });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('link_url', linkUrl);
        formData.append('is_always', isAlways);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('is_active', isActive);

        if (imagePc) formData.append('image_pc', imagePc);
        if (imageMobile) formData.append('image_mobile', imageMobile);
        if (imageTablet) formData.append('image_tablet', imageTablet);

        try {
            if (editBanner) {
                await axiosInstance.put(`/admin/review/display/banners/${editBanner.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toaster.create({ title: '수정되었습니다.', type: 'success' });
            } else {
                await axiosInstance.post(`/admin/review/display/banners`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toaster.create({ title: '등록되었습니다.', type: 'success' });
            }
            closeForm();
            fetchBanners();
        } catch (e) {
            console.error(e);
            toaster.create({ title: '저장에 실패했습니다.', type: 'error' });
        }
    }

    const deleteBanner = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await axiosInstance.delete(`/admin/review/display/banners/${id}`);
            toaster.create({ title: '삭제되었습니다.', type: 'success' });
            fetchBanners();
        } catch (e) {
            console.error(e);
            toaster.create({ title: '삭제에 실패했습니다.', type: 'error' });
        }
    }

    const moveBanner = async (index, direction) => {
        const newBanners = [...banners];
        if (direction === 'up' && index > 0) {
            const temp = newBanners[index - 1];
            newBanners[index - 1] = newBanners[index];
            newBanners[index] = temp;
        } else if (direction === 'down' && index < newBanners.length - 1) {
            const temp = newBanners[index + 1];
            newBanners[index + 1] = newBanners[index];
            newBanners[index] = temp;
        } else {
            return;
        }

        const updatedOrder = newBanners.map((b, i) => ({ id: b.id, sort_order: i }));
        try {
            await axiosInstance.put('/admin/review/display/banners/reorder', updatedOrder);
            setBanners(newBanners);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '순서 변경에 실패했습니다.', type: 'error' });
        }
    }

    return (
        <Stack gap="6" p="6">
            <Flex justify="space-between" align="center">
                <Heading size="lg">메인 배너 관리</Heading>
                <Button colorScheme="blue" onClick={() => openForm()}><LuPlus /> 배너 등록</Button>
            </Flex>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader w="80px">순서</Table.ColumnHeader>
                        <Table.ColumnHeader>이미지 (PC)</Table.ColumnHeader>
                        <Table.ColumnHeader>제목</Table.ColumnHeader>
                        <Table.ColumnHeader>노출상태</Table.ColumnHeader>
                        <Table.ColumnHeader>노출기간</Table.ColumnHeader>
                        <Table.ColumnHeader w="150px">관리</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {banners.map((banner, index) => (
                        <Table.Row key={banner.id}>
                            <Table.Cell>
                                <HStack gap="1">
                                    <IconButton size="xs" variant="ghost" disabled={index === 0} onClick={() => moveBanner(index, 'up')}><LuArrowUp /></IconButton>
                                    <IconButton size="xs" variant="ghost" disabled={index === banners.length - 1} onClick={() => moveBanner(index, 'down')}><LuArrowDown /></IconButton>
                                </HStack>
                            </Table.Cell>
                            <Table.Cell>
                                <Image src={banner.image_pc} w="20" h="10" objectFit="cover" rounded="md" />
                            </Table.Cell>
                            <Table.Cell>{banner.title}</Table.Cell>
                            <Table.Cell>{banner.is_active ? '노출' : '숨김'}</Table.Cell>
                            <Table.Cell>
                                {banner.is_always ? '상시 노출' : `${banner.start_date?.substring(0, 10) || ''} ~ ${banner.end_date?.substring(0, 10) || ''}`}
                            </Table.Cell>
                            <Table.Cell>
                                <HStack>
                                    <Button size="sm" onClick={() => openForm(banner)}>수정</Button>
                                    <IconButton size="sm" colorScheme="red" variant="ghost" onClick={() => deleteBanner(banner.id)}><LuTrash /></IconButton>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                    {banners.length === 0 && (
                        <Table.Row>
                            <Table.Cell colSpan={6} textAlign="center" py="10">등록된 배너가 없습니다.</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>

            {/* Form Modal */}
            <Dialog.Root open={isFormOpen} onOpenChange={(e) => { if (!e.open) closeForm(); }}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="600px">
                        <Dialog.Header>
                            <Dialog.Title>{editBanner ? '배너 수정' : '배너 등록'}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack gap="4">
                                <Box>
                                    <Text mb="1" fontWeight="bold">배너 제목</Text>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="배너 제목 입력" />
                                </Box>
                                <Box>
                                    <Text mb="1" fontWeight="bold">연결 링크 URL (선택)</Text>
                                    <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
                                </Box>
                                <Box>
                                    <Text mb="1" fontWeight="bold">이미지 등록</Text>
                                    <Stack bg="bg.muted" p="3" rounded="md" gap="3">
                                        <Box>
                                            <Text fontSize="sm" color="red.500" mb="1">PC 이미지 (필수) <Text as="span" color="gray.500" fontWeight="normal">- 권장 사이즈: 1200 x 400px</Text></Text>
                                            <Input type="file" accept="image/*" ref={imagePcRef} onChange={(e) => setImagePc(e.target.files[0])} />
                                            {editBanner && !imagePc && <Text fontSize="xs" color="gray.500">현재: {editBanner.image_pc}</Text>}
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" mb="1">Mobile 이미지 (선택, 미등록시 PC 대체) <Text as="span" color="gray.500" fontWeight="normal">- 권장 사이즈: 480 x 300px</Text></Text>
                                            <Input type="file" accept="image/*" ref={imageMobileRef} onChange={(e) => setImageMobile(e.target.files[0])} />
                                            {editBanner && editBanner.image_mobile && !imageMobile && <Text fontSize="xs" color="gray.500">현재: {editBanner.image_mobile}</Text>}
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" mb="1">Tablet 이미지 (선택, 미등록시 PC 대체) <Text as="span" color="gray.500" fontWeight="normal">- 권장 사이즈: 800 x 400px</Text></Text>
                                            <Input type="file" accept="image/*" ref={imageTabletRef} onChange={(e) => setImageTablet(e.target.files[0])} />
                                            {editBanner && editBanner.image_tablet && !imageTablet && <Text fontSize="xs" color="gray.500">현재: {editBanner.image_tablet}</Text>}
                                        </Box>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Text mb="1" fontWeight="bold">노출 설정</Text>
                                    <Stack gap="2">
                                        <Checkbox.Root checked={isActive} onCheckedChange={(e) => setIsActive(!!e.checked)}>
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>활성화 (사용함)</Checkbox.Label>
                                        </Checkbox.Root>

                                        <Checkbox.Root checked={isAlways} onCheckedChange={(e) => setIsAlways(!!e.checked)}>
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>상시 노출</Checkbox.Label>
                                        </Checkbox.Root>

                                        {!isAlways && (
                                            <HStack>
                                                <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                                <Text>~</Text>
                                                <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                            </HStack>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="ghost" onClick={closeForm}>취소</Button>
                            <Button colorScheme="blue" onClick={saveBanner}>저장</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Stack>
    )
}

export default MainBanner;
