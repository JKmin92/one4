import { Box, Button, Checkbox, CheckboxGroup, CloseButton, DataList, Dialog, Field, Flex, Heading, HStack, Icon, Image, Input, RadioGroup, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/api";
import { formatDateToMonthDay } from "../../utils/simpleUtils";
import { useAuth } from "../../utils/useAuth";
import { LuSearch } from "react-icons/lu";

function Application() {

    const { campaign_code } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [allChecked, setAllChecked] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [detailAddress, setDetailAddress] = useState('');

    const [selectedOptions, setSelectedOptions] = useState({});
    const { user } = useAuth();

    const [isDaumLoaded, setIsDaumLoaded] = useState(false);
    const [postcode, setPostcode] = useState(null);
    const [address, setAddress] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const searchAddressRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => setIsDaumLoaded(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const fetchCampaign = async () => {
            const resource = await axiosInstance.get(`/review/campaign/${campaign_code}`);
            setCampaign(resource.data);
            setRewards(resource.data.rewards);
            if (user) {
                const profile = await axiosInstance.get('/user/profile');
                setName(profile.data.name);
                setPhone(profile.data.phone);
                setEmail(profile.data.email);
            }
        };
        fetchCampaign();
    }, [campaign_code]);

    useEffect(() => {
        if (!campaign) return;

        const requiredTerms = ['privacy', 'period', 'guide', 'penalty'];
        if (campaign.campaign_type === 'DELIVERY' || campaign.campaign_type === 'VISIT') {
            requiredTerms.push('conditional');
        }

        const safeCheckedList = Array.isArray(checkedList) ? checkedList : [];
        const isAllChecked = requiredTerms.every((term) => safeCheckedList.includes(term));

        let isFormValid = name && phone && email;
        if (campaign.campaign_type === 'DELIVERY' || campaign.campaign_type === 'VISIT') {
            isFormValid = isFormValid && address && detailAddress;
        }

        let reward_options_selected = true;
        rewards.forEach((reward) => {
            if (reward.reward_options) {
                reward.reward_options.forEach((option) => {
                    if (!selectedOptions[option.id]) {
                        reward_options_selected = false;
                    }
                });
            }
        });

        const isSubmitEnabled = isAllChecked && isFormValid && reward_options_selected;

        setAllChecked(isSubmitEnabled);
    }, [checkedList, campaign, name, phone, email, address, detailAddress, rewards, selectedOptions]);

    const openPostcode = () => {
        if (!isDaumLoaded) return;
        setIsSearch(true);

        setTimeout(() => {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    let addr = '', extraAddr = '';

                    if (data?.userSelectedType === 'R') addr = data?.roadAddress;
                    else addr = data?.jibunAddress;

                    if (data.userSelectedType === 'R') {
                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
                        if (data.buildingName !== "") extraAddr += extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
                        if (extraAddr !== "") extraAddr = `(${extraAddr})`;
                    }

                    setPostcode(data.zonecode);
                    setAddress(addr + extraAddr);
                    setIsSearch(false);
                }, onresize: (size) => {
                    if (searchAddressRef.current) searchAddressRef.current.style.height = size.height + 'px'
                }, width: '100%', height: '100%',
            }).embed(searchAddressRef.current);
        }, 0);
    }

    const rewardsSection = useMemo(() => {
        return rewards.map((reward, rewardIndex) => {
            if (!reward.reward_options || reward.reward_options.length === 0) return null;
            return (
                <Stack w="full" direction="row" key={rewardIndex}>
                    <Stack w="2/6">
                        <Heading>옵션 선택</Heading>
                        <Text fontSize="xs" color="fg.muted">{reward.description}</Text>
                    </Stack>
                    <Stack w="4/6" gap="4">
                        {reward.reward_options.map((option, index) => (
                            <Field.Root key={index}>
                                <Field.Label>{option.option_name}</Field.Label>
                                <RadioGroup.Root
                                    value={selectedOptions[option.id] || ""}
                                    onValueChange={(e) => setSelectedOptions(prev => ({ ...prev, [option.id]: e.value }))}
                                >
                                    <HStack gap="4" flexWrap="wrap">
                                        {option.option_value && option.option_value.split(',').map((val, idx) => {
                                            const trimmedVal = val.trim();
                                            return (
                                                <RadioGroup.Item key={idx} value={trimmedVal}>
                                                    <RadioGroup.ItemHiddenInput />
                                                    <RadioGroup.ItemIndicator />
                                                    <RadioGroup.ItemText>{trimmedVal}</RadioGroup.ItemText>
                                                </RadioGroup.Item>
                                            );
                                        })}
                                    </HStack>
                                </RadioGroup.Root>
                            </Field.Root>
                        ))}
                    </Stack>
                </Stack>
            );
        });
    }, [rewards, selectedOptions]);

    const termsSection = useMemo(() => {
        return (
            <Stack direction="row">
                <Heading w="2/6">유의사항</Heading>
                <CheckboxGroup w="4/6" name="terms" value={Array.isArray(checkedList) ? checkedList : []} onValueChange={(e) => {
                    const val = e && e.value !== undefined ? e.value : e;
                    setCheckedList(Array.isArray(val) ? val : []);
                }}>
                    <Stack separator={<StackSeparator />} gap="4">
                        <Field.Root>
                            <Field.Label fontSize="md">개인정보 수집 및 이용 동의</Field.Label>
                            <Stack gap="4">
                                <Text fontSize="sm" wordBreak="keep-all">제품 발송을 위해 입력하신 개인정보를 받고 있으며 해당 정보는 제품 발송하는 업체에게 제공됩니다.</Text>
                                <Checkbox.Root value="privacy">
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>동의합니다</Checkbox.Label>
                                </Checkbox.Root>
                            </Stack>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label fontSize="md">리뷰어 작성 기간 준수</Field.Label>
                            <Stack gap="4">
                                <Text fontSize="sm" wordBreak="keep-all">리뷰 작성 기간은 {formatDateToMonthDay(campaign?.start_write_date)} ~ {formatDateToMonthDay(campaign?.end_write_date)} 입니다. 작성이 {campaign?.campaign_type === 'VISIT' && ('예약이 늦어지는 등의 사유로')} 지연되는경우 메일, 카카오톡 등으로 저희 원포측에 문의 부탁드리며 사전 협의 또는 연락 없이 리뷰 작성이 지연된다면 추후 리뷰 캠페인 진행 시 불이익을 받을 수 있습니다.</Text>
                                <Checkbox.Root value="period">
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>동의합니다</Checkbox.Label>
                                </Checkbox.Root>
                            </Stack>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label fontSize="md">리뷰 작성 가이드</Field.Label>
                            <Stack gap="4">
                                <Text fontSize="sm" wordBreak="keep-all">제공되는 제품(또는 서비스)를 사용하신 후 안내드린 리뷰 작성 가이드에 맞게 작성해주세요. 안내드린 가이드에 미준수, 누락될 경우 수정 요청드릴 수 있으며 요청 사항이 지속적으로 미준수 시 추후 리뷰 캠페인에 불이익을 받을 수 있습니다.</Text>
                                <Checkbox.Root value="guide">
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>동의합니다</Checkbox.Label>
                                </Checkbox.Root>
                            </Stack>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label fontSize="md">리뷰 미작성 시 불이익</Field.Label>
                            <Stack gap="4">
                                <Text fontSize="sm" wordBreak="keep-all">제공되는 제품(또는 서비스)를 이용하시고 리뷰를 작성하지 않는다면 해당 제품(또는 서비스)의 비용을 청구드릴 수 있습니다. 추후 리뷰 캠페인 진행 시 불이익을 받으실 수 있습니다.</Text>
                                <Checkbox.Root value="penalty">
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>동의합니다</Checkbox.Label>
                                </Checkbox.Root>
                            </Stack>
                        </Field.Root>
                        {campaign?.campaign_type === 'DELIVERY' && (
                            <Field.Root>
                                <Field.Label fontSize="md">제품 수령지 입력</Field.Label>
                                <Stack gap="4">
                                    <Text fontSize="sm" wordBreak="keep-all">위 입력사항 중 배송지는 제품을 수령받으실 주소를 입력하는 항목입니다. 해당 항목에 잘못 입력하여 제품이 반송 되는경우 그에 대한 배송비를 청구드릴 수 있으니 배송지를 정확히 확인해주세요.</Text>
                                    <Checkbox.Root value="conditional">
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>배송지를 정확히 확인했습니다.</Checkbox.Label>
                                    </Checkbox.Root>
                                </Stack>
                            </Field.Root>
                        )}
                        {campaign?.campaign_type === 'VISIT' && (
                            <Field.Root>
                                <Field.Label fontSize="md">예약 방문 시 노쇼 안내</Field.Label>
                                <Stack gap="4">
                                    <Text fontSize="sm" wordBreak="keep-all">예약 방문 캠페인의 경우, 예약 후 방문하지 않는 노쇼(No-show)가 발생할 경우 추후 리뷰 캠페인 진행 시 불이익을 받을 수 있습니다. 예약 후 방문이 어려우신 경우 반드시 업체측에 사전에 연락 부탁드립니다.</Text>
                                    <Checkbox.Root value="conditional">
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>예약 방문 시 노쇼 안내를 확인했습니다.</Checkbox.Label>
                                    </Checkbox.Root>
                                </Stack>
                            </Field.Root>
                        )}
                    </Stack>
                </CheckboxGroup>
            </Stack>
        );
    }, [checkedList, campaign]);

    const channelSection = useMemo(() => {
        return (
            <Stack direction="row">
                <Heading w="2/6">채널</Heading>
                <Stack w="4/6" gap="4">
                    asd
                </Stack>
            </Stack>
        )
    })

    if (!campaign || !rewards) return null;

    return (
        <>
            <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} justifyContent="center" direction={{ base: "column", md: "row" }} gap="6" separator={<StackSeparator borderLeftWidth={{ base: '0', md: '1px' }} borderTopWidth={{ '2xs': "0" }} />}>
                <Stack w={{ base: "full", md: "3/6" }} gap="6" separator={<StackSeparator />}>
                    <Stack w="full" direction="row">
                        <Heading w="2/6">신청자 정보</Heading>
                        <Stack w="4/6" gap="4">
                            <Field.Root>
                                <Field.Label>신청자</Field.Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="성함을 입력해주세요." />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>연락처</Field.Label>
                                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="연락처를 입력해주세요." />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>이메일</Field.Label>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해주세요." />
                            </Field.Root>
                            {campaign.campaign_type === 'DELIVERY' && (
                                <Field.Root>
                                    <Field.Label>배송지</Field.Label>
                                    <Button variant="ghost" w="100%" p="0" onClick={openPostcode}>
                                        <Flex justifyContent="space-between" w="100%" borderColor="bg.emphasized" borderWidth="1px" p="10px" rounded="sm">
                                            <Text whiteSpace="pre-line" textAlign="left" pr="10px">{postcode ? `[${postcode}] ${address}` : '주소검색'}</Text>
                                            <Icon size="md"><LuSearch /></Icon>
                                        </Flex>
                                    </Button>
                                    <Input value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} w="full" placeholder="상세주소를 입력해주세요." />
                                </Field.Root>
                            )}
                        </Stack>
                    </Stack>
                    {rewardsSection}
                    {channelSection}
                    {termsSection}

                </Stack>
                <Box w={{ bbase: 'full', md: '1/6' }} position="relative">
                    <Stack position="sticky" top="10px" gap="4" direction="column">
                        <Box w="full" aspectRatio="square" rounded="md">
                            <Image src={campaign.main_image} w="full" h="full" objectFit="cover" rounded="md" />
                        </Box>
                        <DataList.Root orientation="horizontal" gap="2">
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
                        <Button w="full" rounded="md" disabled={!allChecked}>캠페인 신청하기</Button>
                    </Stack>
                </Box>
            </Stack>
            <Dialog.Root open={isSearch} onOpenChange={(e) => setIsSearch(e.open)}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header><Dialog.Title>주소검색</Dialog.Title></Dialog.Header>
                        <Dialog.Body p="0" m="0">
                            <Box ref={searchAddressRef} w="full"></Box>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}

export default Application;