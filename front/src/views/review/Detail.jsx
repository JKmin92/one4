import { Badge, Box, Button, Collapsible, DataList, Heading, HStack, IconButton, Image, Link, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { PiHeartFill, PiShareNetwork } from "react-icons/pi";
import { formatDateToMonthDay, formatNumber, getDDay } from "../../utils/simpleUtils";
import { LuChevronDown } from "react-icons/lu";
import { useRef, useState, useEffect } from "react";

function Detail() {

    const [detailOpen, setDetailOpen] = useState(false);

    const campaignInfoStack = { direction: { base: 'column', md: "row" }, alignItems: { base: 'start', md: "center" } };
    const campaignInfoTitle = { w: { base: 'full', md: "1/6" }, size: 'md' };
    const campaignInfoText = { fontSize: { base: "xs", md: "sm" }, w: { base: 'full', md: "5/6" }, lineHeight: "1.8", whiteSpace: "pre-line" };
    const removeButton = { variant: 'ghost', textAlign: 'left', justifyContent: 'start', p: '0 10px' };

    const offeringRef = useRef(null);
    const keywordRef = useRef(null);
    const missionRef = useRef(null);
    const cautionRef = useRef(null);

    const campaign = {
        id: 1,
        title: '제품명 1',
        channel: ['naver'],
        brand: '와바미',
        offer: '티모시 사료 1kg 1개',
        endDate: '2026-06-28',
        targetCount: 10,
        startDate: '2026-01-27',
        resultDate: '2026-06-29',
        reviewEndDate: '2026-07-12',
        description: '캠페인 설명',
        address: '서울특별시 송파주 백제고분로 275 배영빌딩 지하 2층',
        businessHours: '평일 06:00 ~ 24:00\n주말 및 공휴일 08:00 ~ 20:00',
        keyword: '석촌헬스. 석촌동헬스, 석촌고분역PT, 석촌PT, 석촌동헬스장, 삼전동헬스장, 삼전동PT',
        hashtag: '#석촌헬스 #석촌동헬스 #석촌고분역PT #석촌PT #선촌동PT #석동헬스장 #휴메이크 #휴메이크휘트니스 #휴메이크휘트니스_석촌점 #삼전역헬스 #삼전동_헬스장 #삼전동_pt',
        mission: '- 매장사진 포함 직접찍은 사진 10장 이상 필수 포함\n- 매장 지도 위치 필수 포함\n- 동영상 2건 이상 업로드\n- 태그키워드가 포스팅 본문에 자연스럽게 언급될 수 있도록 해주세요',
        caution: '* 본 캠페인에 진행 중 촬영된 이미지는 휴메이크 측에서 마케팅 용 등으로 사용할 수 있으며 요청 시 얼굴은 모자이크 등으로 가려 사용할 수 있습니다.\n작성이 지연될 경우 문의사항 또는 원포 카카오톡 채널로 미리 말씀 부탁드립니다.',
    }

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const targetDate = new Date(campaign.endDate);
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
    }, [campaign.endDate]);

    const pad = (num) => String(num).padStart(2, '0');

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const relayCampaignList = [
        { id: 1, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 2, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
    ];

    const campaignDataList = [
        { id: 1, label: '캠페인 신청기간', value: `${formatDateToMonthDay(campaign.startDate)} ~ ${formatDateToMonthDay(campaign.endDate)}` },
        { id: 2, label: '리뷰어 선정발표', value: formatDateToMonthDay(campaign.resultDate) },
        { id: 3, label: '리뷰 작성기간', value: formatDateToMonthDay(campaign.reviewEndDate) },
        { id: 4, label: '신청', value: `30명/${campaign.targetCount}명` },
    ]

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} >
            <Stack direction={{ base: "column", md: "row" }} gap="6" separator={<StackSeparator borderLeftWidth={{ base: '0', md: '1px' }} borderTopWidth={{ '2xs': "0" }} />} w={{ base: "full", '2xl': "4/5" }} margin="auto" justifyContent="cetner">
                <Stack w={{ base: "full", md: "3/6" }} gap="6" separator={<StackSeparator />}>
                    <Stack gap="4">
                        <HStack justifyContent="space-between" alignItems="start">
                            <Stack>
                                <Heading>캠페인명</Heading>
                                <Text>캠페인 설명</Text>
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
                            <Badge>{formatNumber(10000)}</Badge>
                        </HStack>
                        <HStack display={{ base: 'flex', md: 'none' }} gap="4">
                            <Box w="1/3" aspectRatio="square" bg="bg.emphasized" rounded="md"></Box>
                            <DataList.Root orientation="horizontal" gap="2">
                                {campaignDataList.map((dataList) => (
                                    <DataList.Item key={dataList.id} fontSize="sm">
                                        <DataList.ItemLabel>{dataList.label}</DataList.ItemLabel>
                                        <DataList.ItemValue>{dataList.value}</DataList.ItemValue>
                                    </DataList.Item>
                                ))}
                            </DataList.Root>
                        </HStack>
                    </Stack>
                    <Collapsible.Root collapsedHeight="500px" open={detailOpen} onOpenChange={(e) => setDetailOpen(e.open)}>
                        <Collapsible.Content _closed={{ shadow: 'inset 0 -12px 12px -12px var(--shadow-color)', shadowColor: 'blackAlpha.500' }}>
                            <Stack>
                                <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                                <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                                <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                                <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
                                <Box width="full" aspectRatio="square" bg="bg.emphasized"></Box>
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
                            - 석촌고분역 1분거리<br />
                            - 전문 트레이너가 제공하는 1:1 맞춤형 PT로 건강하고 재밌는 다이어트<br />
                            - 회원 한 분, 한 분께 집중하고 함께 결실을 만드는 전문 PT<br />
                            - 여름 준비, 바프 준비도 전문적, 체계적인 휴메이크에서~!<br /><br />

                            본 캠페인은 PT4회를 제공받고 포스팅 4회를 작성하는 캠페인입니다.<br /><br />

                            주소 : 서울특별시 송파주 백제고분로 275 배영빌딩 지하 2층<br />
                            평일 06:00 ~ 24:00<br />
                            주말 및 공휴일 08:00 ~ 20:00<br />
                            PT특성상 트레이너 선생님이 PT일정을 비워 진행해주시는 만큼 당일 일정변경은 최대한 자제 부탁드립니다.
                        </Text>
                    </Stack>
                    <Stack {...campaignInfoStack} ref={offeringRef}>
                        <Heading {...campaignInfoTitle}>제공 내용</Heading>
                        <Text {...campaignInfoText}>
                            1:1 개인 PT4회
                            <br />
                            원포인트 {formatNumber(10000)}P 제공
                        </Text>
                    </Stack>
                    <Stack {...campaignInfoStack} ref={keywordRef}>
                        <Heading {...campaignInfoTitle}>키워드</Heading>
                        <Text {...campaignInfoText}>
                            제목 키워드 : 석촌헬스. 석촌동헬스, 석촌고분역PT, 석촌PT, 석촌동헬스장, 삼전동헬스장, 삼전동PT<br />
                            매장명 : 휴메이크 휘트니스 석촌점<br /><br />

                            블로그 포스팅 작성 시 제목키워드와 매장명을 포함하여 작성해주세요.<br />
                            예) 석촌동 헬스장, 휴메이크 휘트니스 석촌점에서 운동했어요! 등등
                        </Text>
                    </Stack>
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>해시태그</Heading>
                        <Stack gap="2" {...campaignInfoText}>
                            <Box>
                                <Button variant="surface" w="auto" fontSize="sm" minH="auto" minW="auto" h="auto" rounded="full">해시태그 복사</Button>
                            </Box>
                            <Text >
                                #석촌헬스 #석촌동헬스 #석촌고분역PT #석촌PT #선촌동PT #석동헬스장 #휴메이크 #휴메이크휘트니스 #휴메이크휘트니스_석촌점 #삼전역헬스 #삼전동_헬스장 #삼전동_pt<br />
                                위 해시태그 모두 포함 부탁드립니다.
                            </Text>
                        </Stack>
                    </Stack>
                    <Stack {...campaignInfoStack} ref={missionRef}>
                        <Heading {...campaignInfoTitle}>캠페인 미션</Heading>
                        <Text {...campaignInfoText}>
                            - 매장사진 포함 직접찍은 사진 10장 이상 필수 포함<br />
                            - 매장 지도 위치 필수 포함<br />
                            - 동영상 2건 이상 업로드<br />
                            - 태그키워드가 포스팅 본문에 자연스럽게 언급될 수 있도록 해주세요
                        </Text>
                    </Stack>
                    <Stack {...campaignInfoStack} ref={cautionRef}>
                        <Heading {...campaignInfoTitle}>주의사항</Heading>
                        <Text {...campaignInfoText}>
                            * 본 캠페인에 진행 중 촬영된 이미지는 휴메이크 측에서 마케팅 용 등으로 사용할 수 있으며 요청 시 얼굴은 모자이크 등으로 가려 사용할 수 있습니다.<br />
                            작성이 지연될 경우 문의사항 또는 원포 카카오톡 채널로 미리 말씀 부탁드립니다.
                        </Text>
                    </Stack>
                </Stack>
                <Box w={{ base: "full", md: "1/6" }} position="relative" display={{ base: 'none', md: 'block' }}>
                    <Stack position="sticky" top="10px" gap="4" direction="column">
                        <Box w="full" aspectRatio="square" bg="bg.emphasized" rounded="md"></Box>
                        <DataList.Root orientation="horizontal">
                            {campaignDataList.map((dataList) => (
                                <DataList.Item key={dataList.id}>
                                    <DataList.ItemLabel>{dataList.label}</DataList.ItemLabel>
                                    <DataList.ItemValue>{dataList.value}</DataList.ItemValue>
                                </DataList.Item>
                            ))}
                        </DataList.Root>
                        <Stack separator={<StackSeparator />} gap="0" w='full' direction={{ base: 'row', md: 'column' }}>
                            <Button {...removeButton} onClick={() => scrollTo(offeringRef)}>제공 내용</Button>
                            <Button {...removeButton} onClick={() => scrollTo(keywordRef)}>키워드</Button>
                            <Button {...removeButton} onClick={() => scrollTo(missionRef)}>캠페인 미션</Button>
                            <Button {...removeButton} onClick={() => scrollTo(cautionRef)}>주의사항</Button>
                        </Stack>
                        <Box bg="bg.muted" w="full" rounded="md" p="10px" textAlign="center">
                            D-{pad(timeLeft.days)} {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
                        </Box>
                        <Button w="full" rounded="md">캠페인 신청하기</Button>
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
            <Button position="fixed" bottom="0" left="0" right="0" w="full" h="60px" rounded="none" colorScheme="main" zIndex="100" display={{ base: 'block', md: 'none' }}>캠페인 신청하기</Button>
        </Stack>
    )
}

export default Detail;