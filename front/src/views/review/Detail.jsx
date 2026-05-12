import { Badge, Box, Button, Clipboard, Collapsible, DataList, Heading, HStack, Icon, IconButton, Image, Link, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { PiHeartFill, PiShareNetwork } from "react-icons/pi";
import { formatDateToMonthDay, formatNumber, getDDay } from "../../utils/simpleUtils";
import { LuChevronDown, LuImage, LuLetterText } from "react-icons/lu";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { toaster } from "../../components/ui/toaster";
import axiosInstance from "../../utils/api";

function Detail() {

    const [detailOpen, setDetailOpen] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const [reviewCampaignApplicationCode, setReviewCampaignApplicationCode] = useState(null);
    const { user } = useAuth();

    const campaignInfoStack = { direction: { base: 'column', md: "row" }, alignItems: { base: 'start', md: "center" } };
    const campaignInfoTitle = { w: { base: 'full', md: "1/6" }, size: 'md' };
    const campaignInfoText = { fontSize: { base: "xs", md: "sm" }, w: { base: 'full', md: "5/6" }, lineHeight: "1.8", whiteSpace: "pre-line" };
    const removeButton = { variant: 'ghost', textAlign: 'left', justifyContent: 'start', p: '0 10px' };

    const offeringRef = useRef(null);
    const keywordRef = useRef(null);
    const missionRef = useRef(null);
    const cautionRef = useRef(null);

    const { campaign_code } = useParams();
    const navigate = useNavigate();

    const handleApplicationClick = () => {
        if (!user) {
            toaster.create({ title: '로그인이 필요한 서비스입니다.', type: 'warning' });
            navigate('/login', { state: { redirect: `/review/application/${campaign.campaign_code}` } });
        } else if (reviewCampaignApplicationCode) {
            toaster.create({ title: '이미 신청이 완료되었습니다.', type: 'warning', action: { label: '신청내역 보기', onClick: () => navigate(`/mypage/review/${reviewCampaignApplicationCode.campaign_application_code}`) } });
        } else {
            navigate(`/review/application/${campaign.campaign_code}`);
        }
    }

    useEffect(() => {
        const fetchCampaign = async () => {
            const resource = await axiosInstance.get(`/review/campaign/${campaign_code}`);
            setCampaign(resource.data);
        };
        const fetchReviewCampaignApplication = async () => {
            const resource = await axiosInstance.get(`/review/campaign/application/${campaign_code}`);
            setReviewCampaignApplicationCode(resource.data);
        };
        fetchCampaign();
        fetchReviewCampaignApplication();
    }, [campaign_code]);

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!campaign) return;
        const calculateTimeLeft = () => {
            const targetDate = new Date(campaign.end_application_date);
            targetDate.setHours(24, 0, 0, 0);

            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [campaign]);

    const pad = (num) => String(num).padStart(2, '0');

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const relayCampaignList = [
        { id: 1, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 2, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
    ];

    if (!campaign) return null;

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} >
            <Stack direction={{ base: "column", md: "row" }} gap="6" separator={<StackSeparator borderLeftWidth={{ base: '0', md: '1px' }} borderTopWidth={{ '2xs': "0" }} />} w={{ base: "full", '2xl': "4/5" }} margin="auto" justifyContent="cetner">
                <Stack w={{ base: "full", md: "3/6" }} gap="6" separator={<StackSeparator />}>
                    <Stack gap="4">
                        <HStack justifyContent="space-between" alignItems="start">
                            <Stack>
                                <Heading>{campaign.title}</Heading>
                                <Text>{campaign.short_description}</Text>
                            </Stack>
                            <HStack>
                                <IconButton variant="ghost">
                                    <PiHeartFill />
                                </IconButton>
                                <IconButton variant="ghost">
                                    <PiShareNetwork />
                                </IconButton>
                            </HStack>
                        </HStack>
                        <HStack>
                            <Image src="../../../public/resources/img/logo/naver.svg" w="5" rounded="md" />
                            {campaign.rewards.map((reward) => (
                                reward.reward_type === 'POINT' && (
                                    <Badge key={reward.id}>{formatNumber(reward.value)}</Badge>
                                )
                            ))}
                        </HStack>
                        <HStack display={{ base: 'flex', md: 'none' }} gap="4">
                            <Box w="1/3" aspectRatio="square" rounded="md">
                                <Image src={campaign.main_image} w="full" h="full" objectFit="cover" rounded="md" />
                            </Box>
                            <DataList.Root orientation="horizontal" gap="2">
                                <DataList.Item fontSize="sm">
                                    <DataList.ItemLabel>캠페인 신청기간</DataList.ItemLabel>
                                    <DataList.ItemValue>{formatDateToMonthDay(campaign.start_application_date)} ~ {formatDateToMonthDay(campaign.end_application_date)}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item fontSize="sm">
                                    <DataList.ItemLabel>리뷰어 선정발표</DataList.ItemLabel>
                                    <DataList.ItemValue>{formatDateToMonthDay(campaign.reviewer_selection_date)}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item fontSize="sm">
                                    <DataList.ItemLabel>리뷰 작성기간</DataList.ItemLabel>
                                    <DataList.ItemValue>{formatDateToMonthDay(campaign.start_write_date)} ~ {formatDateToMonthDay(campaign.end_write_date)}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item fontSize="sm">
                                    <DataList.ItemLabel>신청</DataList.ItemLabel>
                                    <DataList.ItemValue>{campaign.application_count}/{campaign.max_applicants}명</DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                        </HStack>
                    </Stack>
                    <Collapsible.Root collapsedHeight="500px" open={detailOpen} onOpenChange={(e) => setDetailOpen(e.open)}>
                        <Collapsible.Content _closed={{ shadow: 'inset 0 -12px 12px -12px var(--shadow-color)', shadowColor: 'blackAlpha.500' }}>
                            <Stack>
                                {
                                    campaign.detail_images && JSON.parse(campaign.detail_images).map((image, index) => (
                                        <Image src={image} key={index} />
                                    ))
                                }
                            </Stack>
                        </Collapsible.Content>
                        <Collapsible.Trigger asChild mt="4">
                            <Button variant="outline" width="full">
                                {detailOpen ? '닫기' : '더보기'}
                                <Collapsible.Indicator transition="transform 0.2s" _open={{ transform: 'rotate(180deg)' }}>
                                    <LuChevronDown />
                                </Collapsible.Indicator>
                            </Button>
                        </Collapsible.Trigger>
                    </Collapsible.Root>
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>캠페인 소개</Heading>
                        <Text {...campaignInfoText}>
                            {campaign.content}
                        </Text>
                    </Stack>
                    <Stack {...campaignInfoStack} ref={offeringRef}>
                        <Heading {...campaignInfoTitle}>제공 내용</Heading>
                        <Box {...campaignInfoText}>
                            {campaign.rewards.map(reward => {
                                if (reward.reward_type === 'PRODUCT') {
                                    return (
                                        <Stack key={reward.id} gap="0">
                                            <Text fontSize="md">{reward.name} {reward.quantity}개</Text>
                                            <Text fontSize="xs" color="fg.muted">{reward.description}</Text>
                                        </Stack>
                                    )
                                }
                            })}
                        </Box>
                    </Stack>
                    <Stack {...campaignInfoStack} ref={keywordRef}>
                        <Heading {...campaignInfoTitle}>{campaign.mission.mandatory_keyword ? '키워드' : campaign.campaign_type === 'DELIVERY' ? '제품명' : '매장명'}</Heading>
                        <Box {...campaignInfoText}>
                            <Stack>
                                <Stack gap="0">
                                    {campaign.mission.mandatory_keyword && (
                                        <Text>제목 키워드 : {campaign.mission.mandatory_keyword ? campaign.mission.mandatory_keyword.split(',').map(tag => `${tag.trim()}`).join(', ') : ''}</Text>
                                    )}

                                    <Text>{campaign.campaign_type === 'DELIVERY' ? '제품명' : '매장명'} : {campaign.product_name}</Text>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>해시태그</Heading>
                        <Stack gap="2" {...campaignInfoText}>
                            <Box>
                                <Clipboard.Root value={campaign.mission.hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ')}>
                                    <Clipboard.Trigger asChild>
                                        <Button variant="surface" w="auto" fontSize="sm" minH="auto" minW="auto" h="auto" rounded="full"><Clipboard.Indicator /> 해시태그 복사</Button>
                                    </Clipboard.Trigger>
                                </Clipboard.Root>
                            </Box>
                            <Text>
                                {campaign.mission.hashtags ? campaign.mission.hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ') : ''}
                            </Text>
                        </Stack>
                    </Stack>
                    <Stack {...campaignInfoStack} ref={missionRef}>
                        <Heading {...campaignInfoTitle}>캠페인 미션</Heading>
                        <Stack {...campaignInfoText}>
                            <HStack gap="4" >
                                {campaign.mission.min_photo_count > 0 && (
                                    <Stack fontSize="xs">
                                        <Box textAlign="center"><Icon size="lg"><LuImage /></Icon></Box>
                                        <Text>이미지 {campaign.mission.min_photo_count}장 이상</Text>
                                    </Stack>
                                )}

                                {campaign.mission.min_text_length > 0 && (
                                    <Stack fontSize="xs">
                                        <Box textAlign="center"><Icon size="lg"><LuLetterText /></Icon></Box>
                                        <Text> {campaign.mission.min_text_length}자 이상</Text>
                                    </Stack>
                                )}
                            </HStack>
                            <Text>{campaign.mission.content_guide}</Text>
                        </Stack>
                    </Stack>
                    <Stack {...campaignInfoStack} ref={cautionRef}>
                        <Heading {...campaignInfoTitle}>주의사항</Heading>
                        <Text {...campaignInfoText}>
                            작성이 지연될 경우 문의사항 또는 원포 카카오톡 채널로 미리 말씀 부탁드립니다.
                        </Text>
                    </Stack>
                </Stack>
                <Box w={{ base: "full", md: "1/6" }} position="relative" display={{ base: 'none', md: 'block' }}>
                    <Stack position="sticky" top="10px" gap="4" direction="column">
                        <Box w="full" aspectRatio="square" rounded="md">
                            <Image src={campaign.main_image} w="full" h="full" objectFit="cover" rounded="md" />
                        </Box>
                        <DataList.Root orientation="horizontal" gap="2">
                            <DataList.Item fontSize="sm">
                                <DataList.ItemLabel>캠페인 신청기간</DataList.ItemLabel>
                                <DataList.ItemValue>{formatDateToMonthDay(campaign.start_application_date)} ~ {formatDateToMonthDay(campaign.end_application_date)}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item fontSize="sm">
                                <DataList.ItemLabel>리뷰어 선정발표</DataList.ItemLabel>
                                <DataList.ItemValue>{formatDateToMonthDay(campaign.reviewer_selection_date)}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item fontSize="sm">
                                <DataList.ItemLabel>리뷰 작성기간</DataList.ItemLabel>
                                <DataList.ItemValue>{formatDateToMonthDay(campaign.start_write_date)} ~ {formatDateToMonthDay(campaign.end_write_date)}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item fontSize="sm">
                                <DataList.ItemLabel>신청</DataList.ItemLabel>
                                <DataList.ItemValue>{campaign.application_count}/{campaign.max_applicants}명</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                        <Stack separator={<StackSeparator />} gap="0" w='full' direction={{ base: 'row', md: 'column' }}>
                            <Button {...removeButton} onClick={() => scrollTo(offeringRef)}>제공 내용</Button>
                            <Button {...removeButton} onClick={() => scrollTo(keywordRef)}>키워드</Button>
                            <Button {...removeButton} onClick={() => scrollTo(missionRef)}>캠페인 미션</Button>
                            <Button {...removeButton} onClick={() => scrollTo(cautionRef)}>주의사항</Button>
                        </Stack>
                        <Box bg="bg.muted" w="full" rounded="md" p="10px" textAlign="center">
                            {timeLeft.days >= 1 && `D-${pad(timeLeft.days)} `}
                            {(timeLeft.days >= 1 || timeLeft.hours >= 1) && `${pad(timeLeft.hours)}:`}
                            {pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
                        </Box>
                        <Button w="full" rounded="md" onClick={handleApplicationClick}
                            bg={reviewCampaignApplicationCode ? "bg.muted" : undefined}
                            color={reviewCampaignApplicationCode ? "fg.muted" : undefined}
                            _hover={reviewCampaignApplicationCode ? {} : undefined}
                            cursor={reviewCampaignApplicationCode ? "not-allowed" : "pointer"}
                        >
                            {reviewCampaignApplicationCode ? '신청이 완료된 캠페인입니다' : '캠페인 신청하기'}
                        </Button>
                    </Stack>
                </Box>
                <Box w={{ base: "full", md: "1/6" }} position="relative">
                    <Stack position="sticky" top="10px" gap="6">
                        <Heading>연관 캠페인</Heading>
                        <Stack separator={<StackSeparator display={{ base: "none", md: "block" }} />} gap={{ base: "15px 0", md: "4" }} direction={{ base: 'row', md: 'column' }} flexWrap="wrap">
                            {relayCampaignList.map((campaign) => (
                                <Box key={campaign.id} w={{ base: '1/2', md: "full" }}>
                                    <Stack gap="2" p="0 10px">
                                        <Link href={`/review/d/${campaign.id}`}>
                                            <Box bg="bg.emphasized" aspectRatio="square" rounded="md" w="full"></Box>
                                        </Link>
                                        <HStack>
                                            <HStack>
                                                {campaign.channel.map((channel, index) => {
                                                    if (channel === 'naver') return (<Image key={index} src="../../../public/resources/img/logo/naver.svg" w="5" rounded="md" />)
                                                })}
                                            </HStack>
                                            <Text>D-{getDDay(campaign.endDate)}</Text>
                                        </HStack>
                                        <Text>&#91;{campaign.brand}&#93; {campaign.title}</Text>
                                        <Text fontSize="xs" color="fg.muted">{campaign.offer}</Text>
                                        <Text fontSize="xs">신청 10명&#47;{campaign.targetCount}명</Text>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
            <Button position="fixed" bottom="0" left="0" right="0" w="full" h="60px" rounded="none" colorScheme="main" zIndex="100" display={{ base: 'block', md: 'none' }} onClick={handleApplicationClick}
                bg={reviewCampaignApplicationCode ? "bg.subtle" : undefined}
                color={reviewCampaignApplicationCode ? "fg.muted" : undefined}
                _hover={reviewCampaignApplicationCode ? {} : undefined}
                cursor={reviewCampaignApplicationCode ? "not-allowed" : "pointer"}
            >
                {reviewCampaignApplicationCode ? '신청이 완료된 캠페인입니다' : '캠페인 신청하기'}
            </Button>
        </Stack>
    )
}

export default Detail;