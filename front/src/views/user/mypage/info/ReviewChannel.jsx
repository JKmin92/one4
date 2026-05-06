import { Box, Button, Checkbox, CloseButton, Dialog, Field, Group, HStack, IconButton, Image, Input, InputGroup, List, NativeSelect, Portal, RadioCard, Select, Stack, Text, createListCollection } from "@chakra-ui/react";
import { use, useEffect, useState } from "react";
import { LuArrowLeft, LuChevronRight, LuCircle } from "react-icons/lu";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";

const channels = createListCollection({
    items: [
        { label: "네이버 블로그", value: "https://blog.naver.com/", icon: "naver.svg" },
        { label: "유튜브", value: "https://www.youtube.com/", icon: "youtube.svg" },
        { label: "인스타그램", value: "https://www.instagram.com/", icon: "instagram.svg" },
    ],
})

function ChannelSelect({ value, onValueChange }) {
    return (
        <Select.Root collection={channels} value={value ? [value] : []} variant="outline" width="56" onValueChange={(e) => onValueChange(e.value[0])}>
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="채널 선택">
                        <Select.Context>
                            {(select) => {
                                const items = select.selectedItems;
                                if (!items || items.length === 0) return "채널 선택";
                                return (
                                    <HStack gap="2">
                                        <Image src={`/resources/img/logo/${items[0].icon}`} w="5" h="5" rounded="md" />
                                        <Text fontSize="xs">{items[0].label}</Text>
                                    </HStack>
                                );
                            }}
                        </Select.Context>
                    </Select.ValueText>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner zIndex="1500">
                    <Select.Content bg="white" shadow="md" rounded="md" borderWidth="1px" minW="160px" p="1">
                        {channels.items.map((item) => (
                            <Select.Item item={item} key={item.value} p="2" cursor="pointer" rounded="sm" _hover={{ bg: "gray.100" }}>
                                <HStack gap="2">
                                    <Image src={`/resources/img/logo/${item.icon}`} w="5" h="5" rounded="full" />
                                    <Text fontSize="xs">{item.label}</Text>
                                </HStack>
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}

function AddReviewChannel({ reviewChannelList, setReviewChannelList, setAddReviewChannelStatus, reviewCampaignChannelViewList, user_review_channel }) {

    const [selectedChannelPrefix, setSelectedChannelPrefix] = useState('');
    const [channelId, setChannelId] = useState('');
    const channelLink = selectedChannelPrefix && channelId ? selectedChannelPrefix + channelId : '';
    const [channelIcon, setChannelIcon] = useState(null);
    const [metaData, setMetaData] = useState(null);
    const [isLoadingMeta, setIsLoadingMeta] = useState(false);


    useEffect(() => {
        if (user_review_channel) {
            const url = user_review_channel.channel_url;
            const match = channels.items.find(item => url.startsWith(item.value));
            if (match) {
                setSelectedChannelPrefix(match.value);
                setChannelId(url.slice(match.value.length));
            } else {
                setChannelId(url);
            }
            setChannelIcon(reviewCampaignChannelViewList.find(c => c.channel_code === user_review_channel.channel_code).icon);
        }
    }, [user_review_channel, reviewCampaignChannelViewList]);


    useEffect(() => {
        let channel = null;
        if (channelLink.includes('naver')) {
            channel = reviewCampaignChannelViewList.find(c => c.channel_code === '202603171602001');
        } else if (channelLink.includes('instagram')) {
            channel = reviewCampaignChannelViewList.find(c => c.channel_code === '202603171603001');
        } else if (channelLink.includes('youtube')) {
            channel = reviewCampaignChannelViewList.find(c => c.channel_code === '202603171603002');
        } else {
            setChannelIcon(null);
        }

        let timeoutId;

        if (channel) {
            setChannelIcon(channel.icon);

            timeoutId = setTimeout(async () => {
                try {
                    let targetUrl = channelLink;
                    if (!targetUrl.startsWith('http')) {
                        targetUrl = 'https://' + targetUrl;
                    }
                    if (targetUrl.length > 10 && targetUrl.includes('.')) {
                        let isInvalidLink = false;
                        let urlObj;

                        try {
                            urlObj = new URL(targetUrl);
                        } catch (e) {
                            setMetaData({ error: "잘못된 형식의 링크입니다." });
                            setIsLoadingMeta(false);
                            return;
                        }

                        // 채널 링크 검증 로직
                        if (urlObj.hostname.includes('instagram.com')) {
                            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
                            if (pathSegments.length === 0) {
                                isInvalidLink = true;
                            } else {
                                const firstSegment = pathSegments[0].toLowerCase();
                                const reserved = ['p', 'reel', 'reels', 'tv', 'stories', 'explore', 'direct'];
                                if (reserved.includes(firstSegment)) {
                                    isInvalidLink = true;
                                }
                            }
                        } else if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
                            if (pathSegments.length === 0) {
                                isInvalidLink = true;
                            } else if (urlObj.pathname.includes('/watch') || urlObj.hostname.includes('youtu.be') || urlObj.pathname.includes('/shorts')) {
                                isInvalidLink = true;
                            }
                        } else if (urlObj.hostname.includes('blog.naver.com') || urlObj.hostname.includes('m.blog.naver.com')) {
                            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
                            if (pathSegments.length === 0) {
                                isInvalidLink = true;
                            } else if (pathSegments.length > 1 && !urlObj.pathname.includes('Profile')) {
                                isInvalidLink = true;
                            }
                        } else {
                            isInvalidLink = true;
                        }

                        if (isInvalidLink) {
                            setMetaData({ error: "게시물 링크가 아닌 채널(프로필) 홈 링크를 입력해 주세요." });
                            setIsLoadingMeta(false);
                            return;
                        }



                        setIsLoadingMeta(true);
                        const res = await axiosInstance.get(`/utils/metadata?url=${encodeURIComponent(targetUrl)}`);

                        if (res.data.title || res.data.description || res.data.image || res.data.followerCount) {
                            setMetaData(res.data);
                        } else {
                            setMetaData({ error: "존재하지 않거나 접근할 수 없는 채널입니다." });
                        }
                    } else {
                        setMetaData(null);
                    }
                } catch (error) {
                    setMetaData({ error: "존재하지 않거나 접근할 수 없는 채널입니다." });
                } finally {
                    setIsLoadingMeta(false);
                }
            }, 800);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [channelLink, reviewCampaignChannelViewList]);

    const addChannel = async () => {
        if (!channelLink) {
            toaster.create({ title: '채널 링크를 입력해주세요.', type: 'error' });
            return;
        }
        if (!metaData || metaData.error) {
            toaster.create({ title: '유효하지 않은 채널 링크입니다.', type: 'error' });
            return;
        }

        if (user_review_channel) {
            const res = await axiosInstance.put('/user/review/channel', {
                channel_url: channelLink,
                review_channel_code: user_review_channel.review_channel_code,
                metaData: metaData
            });
            if (res.status === 200) {
                toaster.create({ title: '채널이 수정되었습니다.', type: 'success' });
                setReviewChannelList(prev => prev.map(channel => channel.review_channel_code === res.data.review_channel_code ? res.data : channel));
                setAddReviewChannelStatus(false);
            }
        } else {
            const res = await axiosInstance.post('/user/review/channel', { channel_url: channelLink, metaData: metaData });
            if (res.status === 200) {
                toaster.create({ title: '채널이 추가되었습니다.', type: 'success' });
                setReviewChannelList(prev => [...prev, res.data]);
                setAddReviewChannelStatus(false);
            }
        }
    }

    const deleteChannel = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            const res = await axiosInstance.delete(`/user/review/channel/${user_review_channel.review_channel_code}`);
            if (res.status === 200) {
                toaster.create({ title: '채널이 삭제되었습니다.', type: 'success' });
                setReviewChannelList(prev => prev.filter(channel => channel.review_channel_code !== user_review_channel.review_channel_code));
                setAddReviewChannelStatus(false);
            }
        }
    }


    const isDuplicate = reviewChannelList.some(channel => 
        channel.channel_url === channelLink && 
        channel.review_channel_code !== user_review_channel?.review_channel_code
    );

    return (
        <Stack gap="4">
            <Field.Root>
                <Field.Label>채널 링크</Field.Label>
                <Group attached w="full">
                    <ChannelSelect value={selectedChannelPrefix} onValueChange={(val) => setSelectedChannelPrefix(val)} />
                    <Input
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        placeholder={selectedChannelPrefix ? "아이디를 입력해주세요" : "채널을 선택해주세요"}
                        disabled={!selectedChannelPrefix}
                    />
                </Group>
            </Field.Root>
            {isDuplicate && (
                <Text color="red.500" fontSize="sm">이미 등록된 채널입니다.</Text>
            )}
            {metaData && metaData.error && !isDuplicate && (
                <Text color="red.500" fontSize="sm">{metaData.error}</Text>
            )}
            {metaData && !metaData.error && !isDuplicate && (
                <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" p="3" bg="white">
                    <HStack alignItems="flex-start" gap="3">
                        {metaData.image && (
                            <Image src={metaData.image} alt="Thumbnail" boxSize="60px" objectFit="cover" borderRadius="sm" />
                        )}
                        <Stack gap="1" flex="1">
                            {metaData.title && <Text fontWeight="bold" fontSize="sm" lineClamp={1}>{metaData.title}</Text>}
                            {metaData.description && <Text fontSize="xs" color="gray.600" lineClamp={2}>{metaData.description}</Text>}
                        </Stack>
                    </HStack>
                </Box>
            )}
            {isLoadingMeta && !metaData?.error && !isDuplicate && (
                <Text fontSize="xs" color="gray.500" textAlign="center">링크 정보를 가져오는 중...</Text>
            )}
            <Button w="full" disabled={!channelLink || !metaData || !!metaData.error || isLoadingMeta || isDuplicate} onClick={addChannel}>{user_review_channel ? '채널 수정' : '채널 추가'}</Button>
            {user_review_channel && (
                <Button w="full" bg={"red.500"} _hover={{ bg: "red.600" }} onClick={deleteChannel}>삭제</Button>
            )}
        </Stack>
    )
}

function DeleteReviewChannel({ reviewChannel, setReviewChannelList, selectedCode, setOpen, setSelectedCode, deletedAgreeCheck, setDeletedAgreeCheck }) {



    return (
        <Stack gap="4">
            <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" p="3" bg="white">
                <HStack alignItems="flex-start" gap="3">
                    {reviewChannel.meta_image && (
                        <Image src={reviewChannel.meta_image} alt="Thumbnail" boxSize="60px" objectFit="cover" borderRadius="sm" />
                    )}
                    <Stack gap="1" flex="1">
                        {reviewChannel.meta_title && <Text fontWeight="bold" fontSize="sm" lineClamp={1}>{reviewChannel.meta_title}</Text>}
                        {reviewChannel.meta_description && <Text fontSize="xs" color="gray.600" lineClamp={2}>{reviewChannel.meta_description}</Text>}
                    </Stack>
                </HStack>
            </Box>
            <Stack>
                <Text fontSize="md" fontWeight="bold" color="fg.error">채널 삭제 시 주의사항</Text>
                <List.Root ps="15px" gap="1">
                    <List.Item>
                        <Text fontSize="sm">채널 삭제 시, 채널에 등록된 캠페인 신청건은 모두 신청취소 됩니다.</Text>
                    </List.Item>
                    <List.Item>
                        <Text fontSize="sm">단, 이미 선정된 캠페인은 채널 삭제하시더라도 취소되지 않습니다.</Text>
                    </List.Item>
                    <List.Item>
                        <Text fontSize="sm">만약 선정된 캠페인에 취소를 원하신다면 별도 문의 부탁드립니다.</Text>
                    </List.Item>
                    <List.Item>
                        <Text fontSize="sm">채널을 삭제하시더라도 리뷰 내역에는 계속 노출 됩니다.</Text>
                    </List.Item>
                </List.Root>
            </Stack>
            <Checkbox.Root checked={deletedAgreeCheck} onCheckedChange={(e) => setDeletedAgreeCheck(e.checked)}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>위 주의사항을 모두 확인하였으며, 동의합니다.</Checkbox.Label>
            </Checkbox.Root>

        </Stack>
    )
}

function ReviewChannel({ reviewChannelList, setReviewChannelList, reviewCampaignChannelViewList }) {
    const [open, setOpen] = useState(false);
    const [addReviewChannelStatus, setAddReviewChannelStatus] = useState(false);
    const [deleteReviewChannelStatus, setDeleteReviewChannelStatus] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);
    const [user_review_channel, setUser_review_channel] = useState(null);
    const [deletedAgreeCheck, setDeletedAgreeCheck] = useState(false);

    const addChannel = () => {
        setAddReviewChannelStatus(true);
    }

    const updateReviewChannel = () => {
        if (!selectedCode) {
            toaster.create({ title: '채널을 선택해주세요.', type: 'error' });
            return;
        }
        setUser_review_channel(reviewChannelList.find(c => c.review_channel_code === selectedCode));
        setAddReviewChannelStatus(true);
    }

    useEffect(() => {
        if (!open) {
            setAddReviewChannelStatus(false);
            setDeleteReviewChannelStatus(false);
            setSelectedCode(null);
            setUser_review_channel(null);
            setDeletedAgreeCheck(false);
        }
    }, [open]);

    const deleteReviewChannel = () => {
        if (!selectedCode) {
            toaster.create({ title: '채널을 선택해주세요.', type: 'error' });
            return;
        }

        setDeleteReviewChannelStatus(true);
    }

    const deleteReviewChannelExec = async () => {
        if (!selectedCode) {
            toaster.create({ title: '채널을 선택해주세요.', type: 'error' });
            return;
        }

        if (window.confirm("정말 삭제하시겠습니까?")) {
            const res = await axiosInstance.delete(`/user/review/channel/${selectedCode}`);
            if (res.status === 200) {
                toaster.create({ title: '채널이 삭제되었습니다.', type: 'success' });
                setReviewChannelList(prev => prev.filter(channel => channel.review_channel_code !== selectedCode));
                setSelectedCode(null);
                setDeleteReviewChannelStatus(false);
                setUser_review_channel(null);
                setDeletedAgreeCheck(false);
            }
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" justifyContent="space-between">리뷰 채널 관리<LuChevronRight /></Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>
                            <HStack gap="0">
                                {(addReviewChannelStatus || deleteReviewChannelStatus) && (
                                    <IconButton
                                        variant="ghost"
                                        onClick={() => {
                                            setAddReviewChannelStatus(false);
                                            setDeleteReviewChannelStatus(false);
                                        }}
                                    >
                                        <LuArrowLeft />
                                    </IconButton>

                                )}
                                <Text>{addReviewChannelStatus ? '채널 추가' : deleteReviewChannelStatus ? '채널 삭제' : '리뷰 채널 관리'}</Text>
                            </HStack>
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {addReviewChannelStatus ? (
                            <AddReviewChannel
                                reviewChannelList={reviewChannelList}
                                reviewCampaignChannelViewList={reviewCampaignChannelViewList}
                                setReviewChannelList={setReviewChannelList}
                                setAddReviewChannelStatus={setAddReviewChannelStatus}
                                user_review_channel={user_review_channel}
                            />
                        ) : deleteReviewChannelStatus ? (
                            <DeleteReviewChannel
                                reviewChannel={reviewChannelList.find(c => c.review_channel_code === selectedCode)}
                                setReviewChannelList={setReviewChannelList}
                                setSelectedCode={setSelectedCode}
                                setOpen={setOpen}
                                setDeleteReviewChannelStatus={setDeleteReviewChannelStatus}
                                deletedAgreeCheck={deletedAgreeCheck}
                                setDeletedAgreeCheck={setDeletedAgreeCheck}
                            />
                        ) : (
                            reviewChannelList.length === 0 ? (
                                <Text textAlign="center">등록된 리뷰 채널이 없습니다.</Text>
                            ) : (
                                <RadioCard.Root value={selectedCode} onValueChange={(e) => setSelectedCode(e.value)}>
                                    <Stack>
                                        {reviewChannelList.map((reviewChannel) => {
                                            const channel = reviewCampaignChannelViewList.find(c => c.channel_code === reviewChannel.channel_code);
                                            const certifedStatus = reviewChannel.certifed === 'UNAPPROVED' ? '미인증'
                                                : reviewChannel.certifed === 'REVIEWING' ? '검토중'
                                                    : reviewChannel.certifed === 'REJECTED' ? '반려' : '';
                                            const certifedStatusColor = reviewChannel.certifed === 'UNAPPROVED' ? 'red'
                                                : reviewChannel.certifed === 'REVIEWING' ? 'fg.muted'
                                                    : reviewChannel.certifed === 'REJECTED' ? 'red' : 'green';
                                            return (
                                                <RadioCard.Item key={reviewChannel.id} value={reviewChannel.review_channel_code}>
                                                    <RadioCard.ItemHiddenInput />
                                                    <RadioCard.ItemControl>
                                                        <RadioCard.ItemIndicator />
                                                        <RadioCard.ItemContent>
                                                            <RadioCard.ItemText>
                                                                <HStack>
                                                                    <Image src={`/public/resources/img/logo/${channel.icon}`} rounded="md" w="5" h="5" />
                                                                    <Text>{channel.name}</Text>
                                                                </HStack>
                                                            </RadioCard.ItemText>
                                                            <RadioCard.ItemDescription>
                                                                <Stack gap="0">
                                                                    <Text>{reviewChannel.channel_url}</Text>
                                                                </Stack>
                                                            </RadioCard.ItemDescription>
                                                        </RadioCard.ItemContent>
                                                        {/* 추후 채널에 대한 인증 방법을 찾을 시 주석 해제
                                                        <RadioCard.ItemAddon borderTopWidth="0" color={certifedStatusColor}>
                                                            {certifedStatus}
                                                        </RadioCard.ItemAddon>
                                                        */}
                                                    </RadioCard.ItemControl>


                                                </RadioCard.Item>
                                            );
                                        })}
                                    </Stack>
                                </RadioCard.Root>
                            )
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        {deleteReviewChannelStatus ? (
                            <Button w="full" onClick={deleteReviewChannelExec} disabled={!deletedAgreeCheck} bg="red.solid">리뷰 채널 삭제</Button>
                        ) : !addReviewChannelStatus && (
                            reviewChannelList.length === 0 ? (
                                <Button variant="outline" w="full" onClick={addChannel}>리뷰 채널 추가</Button>
                            ) : (
                                <Stack direction='row' w='full'>
                                    <Button variant="outline" w="1/2" onClick={addChannel}>리뷰 채널 추가</Button>
                                    <Button w="1/2" bg="red.solid" onClick={deleteReviewChannel}>리뷰 채널 삭제</Button>
                                </Stack>
                            )
                        )}
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default ReviewChannel;