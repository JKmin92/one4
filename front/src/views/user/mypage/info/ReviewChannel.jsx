import { Box, Button, CloseButton, Dialog, Field, HStack, Image, Input, InputGroup, RadioCard, Stack, Text } from "@chakra-ui/react";
import { use, useEffect, useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";

function AddReviewChannel({ reviewChannelList, setReviewChannelList, setAddReviewChannelStatus, reviewCampaignChannelViewList, user_review_channel }) {

    const [channelLink, setChannelLink] = useState('');
    const [channelIcon, setChannelIcon] = useState(null);
    const [metaData, setMetaData] = useState(null);
    const [isLoadingMeta, setIsLoadingMeta] = useState(false);


    useEffect(() => {
        if (user_review_channel) {
            setChannelLink(user_review_channel.channel_url);
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

                        // 인스타그램 유저(채널) 링크의 경우 크롤링 대신 기본값 설정
                        if (urlObj.hostname.includes('instagram.com')) {
                            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
                            const username = pathSegments.length > 0 ? pathSegments[0] : '';
                            setMetaData({
                                title: username ? `@${username}` : "Instagram 채널",
                                description: "",
                                image: ``
                            });
                            setIsLoadingMeta(false);
                            return;
                        }

                        setIsLoadingMeta(true);
                        const res = await axiosInstance.get(`/utils/metadata?url=${encodeURIComponent(targetUrl)}`);
                        if (res.data.title || res.data.description || res.data.image) {
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

    return (
        <Stack gap="4">
            <Field.Root>
                <Field.Label>채널 링크</Field.Label>
                <InputGroup startElement={channelIcon && <Image src={`/public/resources/img/logo/${channelIcon}`} rounded="md" w="5" h="5" />}>
                    <Input value={channelLink} onChange={(e) => setChannelLink(e.target.value)} placeholder="운영중인 채널 링크를 입력해주세요." />
                </InputGroup>
            </Field.Root>
            {metaData && metaData.error && (
                <Text color="red.500" fontSize="sm">{metaData.error}</Text>
            )}
            {metaData && !metaData.error && (
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
            {isLoadingMeta && !metaData?.error && (
                <Text fontSize="xs" color="gray.500" textAlign="center">링크 정보를 가져오는 중...</Text>
            )}
            <Button w="full" disabled={!channelLink || !metaData || !!metaData.error || isLoadingMeta} onClick={addChannel}>{user_review_channel ? '채널 수정' : '채널 추가'}</Button>
            {user_review_channel && (
                <Button w="full" bg={"red.500"} _hover={{ bg: "red.600" }} onClick={deleteChannel}>삭제</Button>
            )}
        </Stack>
    )
}

function ReviewChannel({ reviewChannelList, setReviewChannelList, reviewCampaignChannelViewList }) {
    const [open, setOpen] = useState(false);
    const [addReviewChannelStatus, setAddReviewChannelStatus] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);
    const [user_review_channel, setUser_review_channel] = useState(null);

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
        }
    }, [open]);

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" justifyContent="space-between">리뷰 채널 관리<LuChevronRight /></Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>리뷰 채널 관리</Dialog.Title>
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
                        {!addReviewChannelStatus && (
                            reviewChannelList.length === 0 ? (
                                <Button variant="outline" w="full" onClick={addChannel}>리뷰 채널 추가</Button>
                            ) : (
                                <Stack direction='row' w='full'>
                                    <Button variant="outline" w="1/2" onClick={addChannel}>리뷰 채널 추가</Button>
                                    <Button w="1/2" onClick={updateReviewChannel}>리뷰 채널 수정</Button>
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