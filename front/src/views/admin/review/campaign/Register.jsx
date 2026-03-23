import { Box, Button, Checkbox, CloseButton, Field, Heading, HStack, Image, Input, RadioGroup, Stack, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuImage, LuInfo, LuPlus, LuTrash } from "react-icons/lu";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import RegisterEditor from "./RegisterEditor";
import { ToggleTip } from "../../../../components/ui/toggle-tip";

function Register() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Basic Info
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [campaignType, setCampaignType] = useState("VISIT"); // 'VISIT' or 'DELIVERY'
    const [isDisplay, setIsDisplay] = useState(1); // 1: 노출, 0: 미노출
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState([]); // review_campaign_category

    // Dates
    const [startApplicationDate, setStartApplicationDate] = useState("");
    const [endApplicationDate, setEndApplicationDate] = useState("");
    const [reviewerSelectionDate, setReviewerSelectionDate] = useState("");
    const [startWriteDate, setStartWriteDate] = useState("");
    const [endWriteDate, setEndWriteDate] = useState("");

    // Applicants
    const [maxApplicants, setMaxApplicants] = useState(0);

    // Image
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);

    // Channels (review_campaign_channel)
    const [channels, setChannels] = useState([]); // array of channel codes
    const [channelOptions, setChannelOptions] = useState([]); // from review_campaign_channel_view

    // Mission (review_campaign_mission)
    const [titleGuide, setTitleGuide] = useState("");
    const [contentGuide, setContentGuide] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [mandatoryKeyword, setMandatoryKeyword] = useState("");
    const [optionalKeyword, setOptionalKeyword] = useState("");
    const [minPhotoCount, setMinPhotoCount] = useState(10);
    const [minTextLength, setMinTextLength] = useState(1000);

    // Reward (review_campaign_reward)
    const [rewards, setRewards] = useState([
        { id: Date.now(), reward_type: "PRODUCT", name: "", description: "", value: 0, quantity: 0, has_options: false, options: [{ name: "", values: "" }] }
    ]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/admin/review/campaign/category');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        const fetchChannels = async () => {
            try {
                const response = await axiosInstance.get('/admin/review/campaign/channel');
                setChannelOptions(response.data);
            } catch (error) {
                console.error("Failed to fetch channels", error);
            }
        };

        fetchCategories();
        fetchChannels();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const response = await axiosInstance.get(`/admin/review/campaign/${id}`);
                    const data = response.data;

                    setTitle(data.title || "");
                    setCategoryId(data.campaign_category_id || "");
                    setCampaignType(data.campaign_type || "VISIT");
                    setIsDisplay(data.is_display !== undefined ? data.is_display : 1);
                    setMaxApplicants(data.max_applicants || 0);
                    setContent(data.content || "");

                    setStartApplicationDate(data.start_application_date ? data.start_application_date.substring(0, 10) : "");
                    setEndApplicationDate(data.end_application_date ? data.end_application_date.substring(0, 10) : "");
                    setReviewerSelectionDate(data.reviewer_selection_date ? data.reviewer_selection_date.substring(0, 10) : "");
                    setStartWriteDate(data.start_write_date ? data.start_write_date.substring(0, 10) : "");
                    setEndWriteDate(data.end_write_date ? data.end_write_date.substring(0, 10) : "");

                    if (data.main_image) {
                        setMainImagePreview(data.main_image);
                    }

                    if (data.channels) setChannels(data.channels.map(c => c.channel_code));

                    if (data.mission) {
                        setTitleGuide(data.mission.title_guide || "");
                        setContentGuide(data.mission.content_guide || "");
                        setHashtags(data.mission.hashtags || "");
                        setMandatoryKeyword(data.mission.mandatory_keyword || "");
                        setOptionalKeyword(data.mission.optional_keyword || "");
                        setMinPhotoCount(data.mission.min_photo_count || 0);
                        setMinTextLength(data.mission.min_text_length || 0);
                    }

                    if (data.rewards && data.rewards.length > 0) {
                        setRewards(data.rewards.map((r, index) => ({
                            id: Date.now() + index,
                            reward_type: r.reward_type || "PRODUCT",
                            name: r.name || "",
                            description: r.description || "",
                            value: r.value || 0,
                            quantity: r.quantity || 0,
                            has_options: r.has_options || false,
                            options: Array.isArray(r.options) ? r.options : (r.options ? [{ name: "옵션", values: r.options }] : [{ name: "", values: "" }])
                        })));
                    } else if (data.reward) {
                        setRewards([{
                            id: Date.now(),
                            reward_type: data.reward.reward_type || "PRODUCT",
                            name: data.reward.name || "",
                            description: data.reward.description || "",
                            value: data.reward.value || 0,
                            quantity: data.reward.quantity || 0,
                            has_options: data.reward.has_options || false,
                            options: Array.isArray(data.reward.options) ? data.reward.options : (data.reward.options ? [{ name: "옵션", values: data.reward.options }] : [{ name: "", values: "" }])
                        }]);
                    }
                } catch (error) {
                    console.error(error);
                    toaster.create({ title: '데이터를 불러오는데 실패했습니다.', type: 'error' });
                }
            }
        };
        fetchData();
    }, [id]);

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleChannelToggle = (value) => {
        setChannels(prev =>
            prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
        );
    };

    const handleAddReward = () => {
        setRewards(prev => [...prev, { id: Date.now(), reward_type: "PRODUCT", name: "", description: "", value: 0, quantity: 0, has_options: false, options: [{ name: "", values: "" }] }]);
    };

    const handleRemoveReward = (id) => {
        setRewards(prev => prev.filter(r => r.id !== id));
    };

    const handleRewardChange = (id, field, value) => {
        setRewards(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleOptionChange = (rewardId, optionIndex, field, value) => {
        setRewards(prev => prev.map(r => {
            if (r.id === rewardId) {
                const newOptions = [...r.options];
                newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
                return { ...r, options: newOptions };
            }
            return r;
        }));
    };

    const handleAddOption = (rewardId) => {
        setRewards(prev => prev.map(r => {
            if (r.id === rewardId) {
                return { ...r, options: [...r.options, { name: "", values: "" }] };
            }
            return r;
        }));
    };

    const handleRemoveOption = (rewardId, optionIndex) => {
        setRewards(prev => prev.map(r => {
            if (r.id === rewardId) {
                return { ...r, options: r.options.filter((_, idx) => idx !== optionIndex) };
            }
            return r;
        }));
    };

    const handleSubmit = async () => {
        if (!title) {
            toaster.create({ title: '캠페인 명을 입력해주세요.', type: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("campaign_category_id", categoryId);
        formData.append("campaign_type", campaignType);
        formData.append("is_display", isDisplay);
        formData.append("max_applicants", maxApplicants);
        formData.append("content", content);
        formData.append("start_application_date", startApplicationDate);
        formData.append("end_application_date", endApplicationDate);
        formData.append("reviewer_selection_date", reviewerSelectionDate);
        formData.append("start_write_date", startWriteDate);
        formData.append("end_write_date", endWriteDate);

        formData.append("channels", JSON.stringify(channels));

        const missionData = {
            title_guide: titleGuide,
            content_guide: contentGuide,
            hashtags,
            mandatory_keyword: mandatoryKeyword,
            optional_keyword: optionalKeyword,
            min_photo_count: minPhotoCount,
            min_text_length: minTextLength
        };
        formData.append("mission", JSON.stringify(missionData));

        const rewardDataForSubmit = rewards.map(r => {
            const data = {
                reward_type: r.reward_type,
                name: r.name,
                description: r.description,
                has_options: r.reward_type === "PRODUCT" ? r.has_options : false,
                options: r.reward_type === "PRODUCT" && r.has_options ? r.options : []
            };

            // POINT: 수량(quantity) 제거, 가치(value) 유지
            if (r.reward_type === "POINT") {
                data.value = r.value;
                data.quantity = 0;
            }
            // PRODUCT, COUPON: 가치(value) 제거, 수량(quantity) 유지
            else {
                data.value = 0;
                data.quantity = r.quantity;
            }
            return data;
        });

        formData.append("rewards", JSON.stringify(rewardDataForSubmit));

        if (mainImage) formData.append("mainImage", mainImage);

        try {
            if (id) {
                await axiosInstance.put(`/admin/review/campaign/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toaster.create({ title: '캠페인이 수정되었습니다.', type: 'success' });
            } else {
                await axiosInstance.post("/admin/review/campaign", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toaster.create({ title: '캠페인이 등록되었습니다.', type: 'success' });
            }
            navigate("/admin/review/campaign/list");
        } catch (error) {
            console.error(error);
            toaster.create({ title: `캠페인 ${id ? '수정' : '등록'}에 실패했습니다.`, type: 'error' });
        }
    };

    return (
        <Stack p="30px" px="layoutX" gap="10" pb="20">
            <Heading>캠페인 {id ? '수정' : '등록'}</Heading>

            {/* 1. 기본 정보 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <HStack justifyContent="space-between" alignItems="center">
                    <Heading size="md">기본 정보</Heading>


                </HStack>

                <HStack gap="6" alignItems="start" justifyContent="space-between">
                    <Field.Root w="auto" minW="150px">
                        <Field.Label mb="2">캠페인 타입</Field.Label>
                        <RadioGroup.Root
                            value={campaignType}
                            onValueChange={(e) => {
                                setCampaignType(e.value);
                                setCategoryId(""); //카테고리 초기화
                            }}
                        >
                            <HStack gap="6">
                                <RadioGroup.Item value="VISIT">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>방문 (VISIT)</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="DELIVERY">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>배송 (DELIVERY)</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </HStack>
                        </RadioGroup.Root>
                    </Field.Root>

                    <Field.Root w="auto">
                        <Field.Label mb="2">카테고리 선택</Field.Label>
                        <Box
                            as="select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            w="xs" borderWidth="1px"
                            fontSize="sm" minH="9"
                            borderRadius="md" px="3" bg="white" outline="none" borderColor="gray.300"
                        >
                            <option value="">카테고리를 선택해주세요</option>
                            {categories.filter(c => c.type === campaignType).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Box>
                        {categories.filter(c => c.type === campaignType).length === 0 && (
                            <Text fontSize="xs" color="gray.500" mt="2">해당 타입의 카테고리가 없습니다.</Text>
                        )}
                    </Field.Root>

                    <Field.Root w="auto" gap="4" minW="150px">
                        <Field.Label mb="0" whiteSpace="nowrap">노출 설정</Field.Label>
                        <RadioGroup.Root value={String(isDisplay)} onValueChange={(e) => setIsDisplay(Number(e.value))}>
                            <HStack gap="4">
                                <RadioGroup.Item value="1">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>노출</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="0">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>미노출</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </HStack>
                        </RadioGroup.Root>
                    </Field.Root>

                    <Field.Root w="150px">
                        <Field.Label mb="2">모집 인원</Field.Label>
                        <Input type="number" placeholder="모집 인원 입력" value={maxApplicants} onChange={(e) => setMaxApplicants(Number(e.target.value))} />
                    </Field.Root>
                </HStack>

                <Field.Root required>
                    <Field.Label mb="2">캠페인 명</Field.Label>
                    <Input placeholder="캠페인 명을 입력해주세요" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Field.Root>

                <Field.Root>
                    <Field.Label mb="2">캠페인 상세 설명</Field.Label>
                    <RegisterEditor content={content} setContent={setContent} />
                </Field.Root>
            </Stack>

            {/* 2. 일정 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">일정 설정</Heading>

                <HStack gap="6">
                    <Field.Root>
                        <Field.Label mb="2">모집 시작일</Field.Label>
                        <Input type="date" value={startApplicationDate} onChange={(e) => setStartApplicationDate(e.target.value)} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">모집 종료일</Field.Label>
                        <Input type="date" value={endApplicationDate} onChange={(e) => setEndApplicationDate(e.target.value)} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">발표일</Field.Label>
                        <Input type="date" value={reviewerSelectionDate} onChange={(e) => setReviewerSelectionDate(e.target.value)} />
                    </Field.Root>
                </HStack>

                <HStack gap="6">
                    <Field.Root>
                        <Field.Label mb="2">리뷰 작성 시작일</Field.Label>
                        <Input type="date" value={startWriteDate} onChange={(e) => setStartWriteDate(e.target.value)} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">리뷰 작성 종료일</Field.Label>
                        <Input type="date" value={endWriteDate} onChange={(e) => setEndWriteDate(e.target.value)} />
                    </Field.Root>
                </HStack>
            </Stack>

            {/* 3. 채널 정보 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">채널 정보</Heading>

                <Field.Root>
                    <Field.Label mb="2">모집 채널 (중복 선택 가능)</Field.Label>
                    <HStack gap="6" flexWrap="wrap">
                        {channelOptions.map(channel => (
                            <Checkbox.Root
                                key={channel.channel_code}
                                checked={channels.includes(channel.channel_code)}
                                onCheckedChange={() => handleChannelToggle(channel.channel_code)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>{channel.name}</Checkbox.Label>
                            </Checkbox.Root>
                        ))}
                    </HStack>
                </Field.Root>
            </Stack>

            {/* 4. 미션 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">미션 설정</Heading>

                <Field.Root>
                    <Field.Label mb="2">제목 가이드</Field.Label>
                    <Input placeholder="제목 작성 가이드를 입력해주세요" value={titleGuide} onChange={(e) => setTitleGuide(e.target.value)} />
                </Field.Root>

                <Field.Root>
                    <Field.Label mb="2">본문 가이드</Field.Label>
                    <Textarea
                        minH="100px"
                        placeholder="본문 작성 가이드를 입력해주세요"
                        value={contentGuide}
                        onChange={(e) => setContentGuide(e.target.value)}
                    />
                </Field.Root>

                <Field.Root>
                    <Field.Label mb="2">해시태그</Field.Label>
                    <Input placeholder="해시태그 (쉼표로 구분)" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
                </Field.Root>

                <HStack gap="6">
                    <Field.Root>
                        <Field.Label mb="2">필수 키워드</Field.Label>
                        <Input placeholder="필수 키워드" value={mandatoryKeyword} onChange={(e) => setMandatoryKeyword(e.target.value)} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">선택 키워드</Field.Label>
                        <Input placeholder="선택 키워드" value={optionalKeyword} onChange={(e) => setOptionalKeyword(e.target.value)} />
                    </Field.Root>
                </HStack>

                <HStack gap="6">
                    <Field.Root>
                        <Field.Label mb="2">최소 사진 개수</Field.Label>
                        <Input type="number" placeholder="0" value={minPhotoCount} onChange={(e) => setMinPhotoCount(Number(e.target.value))} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">최소 글자 수</Field.Label>
                        <Input type="number" placeholder="0" value={minTextLength} onChange={(e) => setMinTextLength(Number(e.target.value))} />
                    </Field.Root>
                </HStack>
            </Stack>

            {/* 5. 리워드 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <HStack justifyContent="space-between">
                    <Heading size="md">리워드 설정</Heading>
                    <Button size="sm" onClick={handleAddReward} leftIcon={<LuPlus />}>리워드 추가</Button>
                </HStack>

                {rewards.map((reward, index) => (
                    <Box key={reward.id} p="5" borderWidth="1px" borderRadius="md" bg="gray.50" position="relative">
                        {rewards.length > 1 && (
                            <CloseButton
                                size="sm"
                                position="absolute"
                                top="2"
                                right="2"
                                onClick={() => handleRemoveReward(reward.id)}
                            />
                        )}
                        <Text fontWeight="bold" mb="4" fontSize="sm">리워드 #{index + 1}</Text>

                        <Stack gap="4">
                            <HStack gap="6">
                                <Field.Root w="30%">
                                    <Field.Label mb="2">리워드 타입</Field.Label>
                                    <Box
                                        as="select"
                                        value={reward.reward_type}
                                        onChange={(e) => handleRewardChange(reward.id, 'reward_type', e.target.value)}
                                        w="full" borderWidth="1px"
                                        fontSize="sm" minH="10"
                                        borderRadius="md" px="3" bg="white" outline="none" borderColor="gray.300"
                                    >
                                        <option value="PRODUCT">제품 (PRODUCT)</option>
                                        <option value="POINT">포인트 (POINT)</option>
                                        <option value="COUPON">쿠폰 (COUPON)</option>
                                    </Box>
                                </Field.Root>

                                <Field.Root w="70%" required>
                                    <Field.Label mb="2">리워드 이름</Field.Label>
                                    <Input
                                        bg="white"
                                        placeholder="리워드 이름을 입력해주세요"
                                        value={reward.name}
                                        onChange={(e) => handleRewardChange(reward.id, 'name', e.target.value)}
                                    />
                                </Field.Root>
                            </HStack>

                            <Field.Root>
                                <Field.Label mb="2">리워드 설명</Field.Label>
                                <Textarea
                                    bg="white"
                                    placeholder="리워드 상세 설명"
                                    value={reward.description}
                                    onChange={(e) => handleRewardChange(reward.id, 'description', e.target.value)}
                                />
                            </Field.Root>

                            <HStack gap="6">
                                {reward.reward_type === 'POINT' && (
                                    <Field.Root flex="1">
                                        <Field.Label mb="2">포인트 금액 (가치)</Field.Label>
                                        <Input
                                            bg="white"
                                            type="number"
                                            placeholder="지급할 포인트를 입력하세요"
                                            value={reward.value}
                                            onChange={(e) => handleRewardChange(reward.id, 'value', Number(e.target.value))}
                                        />
                                    </Field.Root>
                                )}

                                {(reward.reward_type === 'PRODUCT' || reward.reward_type === 'COUPON') && (
                                    <Field.Root flex="1">
                                        <Field.Label mb="2">
                                            제공 수량
                                            <ToggleTip content="제품을 제공하는 수량(예. 2로 설정 시 해당 제품을 2개 제공)">
                                                <Button size="xs" variant="ghost"><LuInfo /></Button>
                                            </ToggleTip>
                                        </Field.Label>
                                        <Input
                                            bg="white"
                                            type="number"
                                            placeholder="제공할 수량을 입력하세요"
                                            value={reward.quantity}
                                            onChange={(e) => handleRewardChange(reward.id, 'quantity', Number(e.target.value))}
                                        />
                                    </Field.Root>
                                )}
                            </HStack>

                            {reward.reward_type === 'PRODUCT' && (
                                <Box bg="gray.100" p="4" borderRadius="md" mt="2">
                                    <HStack mb="4">
                                        <Checkbox.Root
                                            checked={reward.has_options}
                                            onCheckedChange={(e) => handleRewardChange(reward.id, 'has_options', !!e.checked)}
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>옵션 사용 (예: 색상, 사이즈 등)</Checkbox.Label>
                                        </Checkbox.Root>
                                    </HStack>

                                    {reward.has_options && (
                                        <Stack gap="3">
                                            {reward.options.map((opt, optIndex) => (
                                                <HStack key={optIndex} alignItems="flex-end">
                                                    <Field.Root w="30%">
                                                        <Field.Label mb="2" fontSize="xs">옵션명</Field.Label>
                                                        <Input
                                                            bg="white"
                                                            placeholder="예: 색상, 사이즈"
                                                            value={opt.name}
                                                            onChange={(e) => handleOptionChange(reward.id, optIndex, 'name', e.target.value)}
                                                        />
                                                    </Field.Root>
                                                    <Field.Root w="70%">
                                                        <Field.Label mb="2" fontSize="xs">옵션값 (쉼표로 구분)</Field.Label>
                                                        <HStack w="full">
                                                            <Input
                                                                bg="white"
                                                                placeholder="예: 빨강, 파랑, 검정"
                                                                value={opt.values}
                                                                onChange={(e) => handleOptionChange(reward.id, optIndex, 'values', e.target.value)}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                colorPalette="red"
                                                                px="2"
                                                                onClick={() => handleRemoveOption(reward.id, optIndex)}
                                                                disabled={reward.options.length === 1}
                                                            >
                                                                <LuTrash />
                                                            </Button>
                                                        </HStack>
                                                    </Field.Root>
                                                </HStack>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                w="full"
                                                mt="2"
                                                borderStyle="dashed"
                                                onClick={() => handleAddOption(reward.id)}
                                            >
                                                <LuPlus /> 옵션 추가
                                            </Button>
                                        </Stack>
                                    )}
                                </Box>
                            )}
                        </Stack>
                    </Box>
                ))}
            </Stack>

            {/* 6. 대표 이미지 등록 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">대표 이미지 등록</Heading>

                <Field.Root>
                    <Field.Label mb="2">대표 이미지</Field.Label>
                    <HStack alignItems="start">
                        <Box
                            w="150px" h="150px"
                            borderWidth="1px" borderStyle="dashed" borderRadius="md"
                            display="flex" alignItems="center" justifyContent="center"
                            bg="gray.50" overflow="hidden" position="relative"
                        >
                            {mainImagePreview ? (
                                <Image src={mainImagePreview} objectFit="cover" w="full" h="full" />
                            ) : (
                                <Stack alignItems="center" color="gray.400">
                                    <LuImage size="24" />
                                    <Text fontSize="xs">이미지 선택</Text>
                                </Stack>
                            )}
                            <Input
                                type="file"
                                position="absolute" top="0" left="0" w="full" h="full" opacity="0" cursor="pointer"
                                accept="image/*"
                                onChange={handleMainImageChange}
                            />
                        </Box>
                    </HStack>
                </Field.Root>
            </Stack>

            <HStack justifyContent="flex-end" pt="10">
                <Button variant="outline" size="lg" onClick={() => navigate(-1)}>취소</Button>
                <Button onClick={handleSubmit} size="lg" bg="black" color="white" _hover={{ bg: "gray.800" }}>캠페인 {id ? '수정' : '등록'}하기</Button>
            </HStack>
        </Stack>
    )
}

export default Register;