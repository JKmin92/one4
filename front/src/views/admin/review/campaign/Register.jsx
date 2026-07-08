import { Box, Button, Checkbox, CloseButton, DatePicker, Field, Heading, HStack, Image, Input, LocaleProvider, RadioGroup, Stack, TagsInput, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const LocalInput = ({ value, onChange, ...props }) => {
    const [localValue, setLocalValue] = useState(value || "");
    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);
    return (
        <Input
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={(e) => {
                if (onChange) onChange(e);
            }}
            {...props}
        />
    );
};

const LocalTextarea = ({ value, onChange, ...props }) => {
    const [localValue, setLocalValue] = useState(value || "");
    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);
    return (
        <Textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={(e) => {
                if (onChange) onChange(e);
            }}
            {...props}
        />
    );
};
import { LuCalendar, LuImage, LuInfo, LuPlus, LuTrash } from "react-icons/lu";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

const LocalDatePicker = ({ value, onChange, ...props }) => {
    return (
        <LocaleProvider locale="ko-KR">
            <DatePicker.Root 
                value={value ? [value] : []} 
                onValueChange={(e) => onChange(e.value[0] || "")}
                {...props}
            >
            <DatePicker.Control>
                <DatePicker.Input placeholder="YYYY/MM/DD" />
                <DatePicker.IndicatorGroup>
                    <DatePicker.Trigger><LuCalendar /></DatePicker.Trigger>
                </DatePicker.IndicatorGroup>
            </DatePicker.Control>
            <DatePicker.Positioner>
                <DatePicker.Content>
                    <DatePicker.View view="year">
                        <DatePicker.Header />
                        <DatePicker.YearTable />
                    </DatePicker.View>
                    <DatePicker.View view="month">
                        <DatePicker.Header />
                        <DatePicker.MonthTable />
                    </DatePicker.View>
                    <DatePicker.View view="day">
                        <DatePicker.Header />
                        <DatePicker.DayTable />
                    </DatePicker.View>
                </DatePicker.Content>
            </DatePicker.Positioner>
        </DatePicker.Root>
        </LocaleProvider>
    );
};
import RegisterEditor from "./RegisterEditor";
import { ToggleTip } from "../../../../components/ui/toggle-tip";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableImageItem({ id, item, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            w="150px" h="150px" borderRadius="md" position="relative" borderWidth="1px"
            cursor="grab"
            _active={{ cursor: 'grabbing' }}
            bg="white"
            flexShrink="0"
        >
            <Image src={item.url} objectFit="cover" w="full" h="full" borderRadius="md" />
            <CloseButton
                onPointerDown={(e) => e.stopPropagation()}
                size="sm" bg="white" position="absolute" top="1" right="1"
                onClick={onRemove}
            />
        </Box>
    );
}

function Register() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [campaignState, setCampaignState] = useState("DRAFT");

    // Basic Info
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [productName, setProductName] = useState("");
    const [hasApplications, setHasApplications] = useState(false);

    // Detail images
    const [detailImageItems, setDetailImageItems] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setDetailImageItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const [categoryCode, setCategoryCode] = useState("");
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
    const [hashtags, setHashtags] = useState([]);
    const [mandatoryKeyword, setMandatoryKeyword] = useState([]);
    const [optionalKeyword, setOptionalKeyword] = useState([]);
    const [minPhotoCount, setMinPhotoCount] = useState(10);
    const [minTextLength, setMinTextLength] = useState(1000);

    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
    const [draftButtonLoading, setDraftButtonLoading] = useState(false);

    // Reward (review_campaign_reward)
    const [rewards, setRewards] = useState([
        { id: Date.now(), reward_type: "PRODUCT", name: "", description: "", value: 0, quantity: 0, has_options: false, options: [{ option_name: "", option_value: "" }] }
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
                    setProductName(data.product_name || "");
                    setCampaignState(data.state);
                    if (data.short_description) setShortDescription(data.short_description);
                    if (data.detail_images) {
                        try {
                            const parsed = typeof data.detail_images === 'string' ? JSON.parse(data.detail_images) : data.detail_images;
                            if (Array.isArray(parsed)) {
                                setDetailImageItems(parsed.map((url, idx) => ({ id: `img-fetch-${Date.now()}-${idx}`, file: null, url })));
                            }
                        } catch (e) { console.error('detail_images parse error:', e); }
                    }
                    setCategoryCode(data.campaign_category_code || "");
                    setCampaignType(data.campaign_type || "VISIT");
                    setIsDisplay(data.is_display !== undefined ? data.is_display : 1);
                    setMaxApplicants(data.max_applicants || 0);
                    setHasApplications(data.application_count > 0);
                    setContent(data.content || "");

                    const toInputDate = (isoString) => {
                        if (!isoString) return "";
                        const date = new Date(isoString);
                        if (isNaN(date.getTime())) return "";
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, '0');
                        const dd = String(date.getDate()).padStart(2, '0');
                        return `${yyyy}-${mm}-${dd}`;
                    };

                    setStartApplicationDate(toInputDate(data.start_application_date));
                    setEndApplicationDate(toInputDate(data.end_application_date));
                    setReviewerSelectionDate(toInputDate(data.reviewer_selection_date));
                    setStartWriteDate(toInputDate(data.start_write_date));
                    setEndWriteDate(toInputDate(data.end_write_date));

                    if (data.main_image) {
                        setMainImagePreview(data.main_image);
                    }

                    if (data.channels) setChannels(data.channels.map(c => c.channel_code));

                    if (data.mission) {
                        setTitleGuide(data.mission.title_guide || "");
                        setContentGuide(data.mission.content_guide || "");
                        setHashtags(data.mission.hashtags ? data.mission.hashtags.split(',').map(k => k.trim()) : []);
                        setMandatoryKeyword(data.mission.mandatory_keyword ? data.mission.mandatory_keyword.split(',').map(k => k.trim()) : []);
                        setOptionalKeyword(data.mission.optional_keyword ? data.mission.optional_keyword.split(',').map(k => k.trim()) : []);
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
                            has_options: r.reward_options.length > 0 ? true : false,
                            options: Array.isArray(r.reward_options) ? r.reward_options : (r.reward_options ? [{ option_name: "옵션", option_value: r.option_value }] : [{ option_name: "", option_value: "" }])
                        })));
                    } else if (data.reward) {
                        setRewards([{
                            id: Date.now(),
                            reward_type: data.reward.reward_type || "PRODUCT",
                            name: data.reward.name || "",
                            description: data.reward.description || "",
                            value: data.reward.value || 0,
                            quantity: data.reward.quantity || 0,
                            has_options: data.reward.reward_options.length > 0 ? true : false,
                            options: Array.isArray(data.reward.reward_options) ? data.reward.reward_options : (data.reward.reward_options ? [{ option_name: "옵션", option_value: data.reward.option_value }] : [{ option_name: "", option_value: "" }])
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

    const fetchDrafts = async () => {
        try {
            const response = await axiosInstance.get('/admin/review/campaign/drafts');
            setDrafts(response.data);
            setIsDraftModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch drafts", error);
            toaster.create({ title: '임시저장 목록을 불러오지 못했습니다.', type: 'error' });
        }
    };

    const handleSelectDraft = (draft) => {
        setIsDraftModalOpen(false);
        navigate(`/admin/review/campaign/update/${draft.campaign_code}`);
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        const target = e.target;
        if (file) {
            const url = URL.createObjectURL(file);
            const img = new window.Image();
            img.onload = () => {
                if (img.height >= 15000) {
                    toaster.create({ title: '세로 길이가 15000px 이상인 이미지는 업로드할 수 없습니다.', type: 'error' });
                    URL.revokeObjectURL(url);
                } else {
                    setMainImage(file);
                    setMainImagePreview(url);
                }
                target.value = '';
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                target.value = '';
            };
            img.src = url;
        }
    };

    const handleDetailImagesChange = async (e) => {
        const files = Array.from(e.target.files);
        const target = e.target;

        if (files.length > 0) {
            const validFiles = [];

            for (const file of files) {
                const url = URL.createObjectURL(file);
                const isSizeValid = await new Promise((resolve) => {
                    const img = new window.Image();
                    img.onload = () => {
                        if (img.height >= 15000) {
                            toaster.create({ title: `${file.name}의 세로 길이가 15000px 이상입니다. 업로드할 수 없습니다.`, type: 'error' });
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    };
                    img.onerror = () => {
                        toaster.create({ title: `${file.name} 이미지를 읽을 수 없습니다.`, type: 'error' });
                        resolve(false);
                    };
                    img.src = url;
                });

                if (isSizeValid) {
                    validFiles.push({ file, url });
                } else {
                    URL.revokeObjectURL(url);
                }
            }

            if (validFiles.length > 0) {
                const newItems = validFiles.map((item, idx) => ({
                    id: `img-new-${Date.now()}-${idx}`,
                    file: item.file,
                    url: item.url
                }));
                setDetailImageItems(prev => [...prev, ...newItems]);
            }
        }

        target.value = '';
    };

    const handleRemoveDetailImage = (indexToRemove) => {
        setDetailImageItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleChannelToggle = (value) => {
        const targetChannel = channelOptions.find(c => c.channel_code === value);

        setChannels(prev => {
            if (prev.includes(value)) {
                return prev.filter(c => c !== value);
            } else {
                let newChannels = [...prev];

                if (targetChannel && targetChannel.unselectable_with) {
                    const exclusiveList = targetChannel.unselectable_with.split(',').map(v => String(v).trim());
                    newChannels = newChannels.filter(c => !exclusiveList.includes(String(c)));
                }

                return [...newChannels, value];
            }
        });
    };

    const handleAddReward = () => {
        setRewards(prev => [...prev, { id: Date.now(), reward_type: "PRODUCT", name: "", description: "", value: 0, quantity: 0, has_options: false, options: [{ option_name: "", option_value: "" }] }]);
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
                return { ...r, options: [...r.options, { option_name: "", option_value: "" }] };
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

    const handleSubmit = async (targetState = 'PENDING') => {
        if (targetState === 'PENDING') {
            setDraftButtonLoading(true);
        } else {
            setSubmitButtonLoading(true);
        }
        if (!title) {
            toaster.create({ title: '캠페인 명을 입력해주세요.', type: 'error' });
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("short_description", shortDescription);
        if (productName) formData.append("product_name", productName);
        else {
            toaster.create({ title: '제품명을 입력해주세요.', type: 'error' });
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
            return;
        }

        const existingUrls = [];
        const newFiles = [];
        detailImageItems.forEach((item) => {
            if (item.file) newFiles.push(item.file);
            else existingUrls.push(item.url);
        });

        if (existingUrls.length > 0) {
            formData.append("existingDetailImages", JSON.stringify(existingUrls));
        }

        newFiles.forEach((file) => {
            formData.append("detailImages", file);
        });

        if (!startApplicationDate) {
            toaster.create({ title: '모집 시작일을 입력해주세요.', type: 'error' });
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
            return;
        }
        if (!endApplicationDate) {
            toaster.create({ title: '모집 마감일을 입력해주세요.', type: 'error' });
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
            return;
        }
        if (!reviewerSelectionDate) {
            toaster.create({ title: '선정자 발표일을 입력해주세요.', type: 'error' });
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
            return;
        }
        if (!startWriteDate) {
            toaster.create({ title: '리뷰 작성 시작일을 입력해주세요.', type: 'error' });
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
            return;
        }
        if (!endWriteDate) {
            toaster.create({ title: '리뷰 작성 마감일을 입력해주세요.', type: 'error' });
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
            return;
        }

        formData.append("state", targetState);
        formData.append("campaign_category_code", categoryCode);
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
            hashtags: Array.isArray(hashtags) ? hashtags.join(',') : hashtags,
            mandatory_keyword: Array.isArray(mandatoryKeyword) ? mandatoryKeyword.join(',') : mandatoryKeyword,
            optional_keyword: Array.isArray(optionalKeyword) ? optionalKeyword.join(',') : optionalKeyword,
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
                await axiosInstance.post(`/admin/review/campaign/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toaster.create({ title: targetState === 'DRAFT' ? '임시저장 되었습니다.' : '캠페인이 수정되었습니다.', type: 'success' });

                if (targetState !== 'DRAFT') {
                    navigate("/admin/review/campaign/list");
                }
            } else {
                const response = await axiosInstance.post("/admin/review/campaign", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toaster.create({ title: targetState === 'DRAFT' ? '임시저장 되었습니다.' : '캠페인이 등록되었습니다.', type: 'success' });

                if (targetState !== 'DRAFT') {
                    navigate("/admin/review/campaign/list");
                } else if (response.data.campaign_code) {
                    navigate(`/admin/review/campaign/update/${response.data.campaign_code}`, { replace: true });
                }
            }
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
        } catch (error) {
            console.error("Submit error details:", error);
            toaster.create({ title: `캠페인 ${id ? '수정' : '등록'}에 실패했습니다.`, type: 'error' });
            setDraftButtonLoading(false);
            setSubmitButtonLoading(false);
        }
    };

    return (
        <Stack p="30px" px="layoutX" gap="10" pb="20">
            <HStack justifyContent="space-between" position="sticky" top="0" bg="white" zIndex="10" py="4" mt="-4">
                <Heading>캠페인 {id ? '수정' : '등록'}</Heading>
                {campaignState === 'DRAFT' && (
                    <HStack>
                        <Button bg="bg" variant="surface" onClick={fetchDrafts}>임시저장 목록</Button>
                        <Button bg="bg.info" loading={draftButtonLoading} variant="surface" onClick={() => handleSubmit('DRAFT')}>임시저장</Button>
                    </HStack>
                )}
            </HStack>

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
                                setCategoryCode("");
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

                    {categories.filter(c => c.type === campaignType).length > 0 && (
                        <Field.Root w="auto">
                            <Field.Label mb="2">카테고리 선택</Field.Label>
                            <Box
                                as="select"
                                value={categoryCode}
                                onChange={(e) => setCategoryCode(e.target.value)}
                                w="xs" borderWidth="1px"
                                fontSize="sm" minH="9"
                                borderRadius="md" px="3" bg="white" outline="none" borderColor="gray.300"
                            >
                                <option value="">카테고리를 선택해주세요</option>
                                {categories.filter(c => c.type === campaignType && c.parent_code != null).map(c => (
                                    <option key={c.category_code} value={c.category_code}>{c.name}</option>
                                ))}
                            </Box>
                        </Field.Root>
                    )}

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
                        <LocalInput type="number" placeholder="모집 인원 입력" value={maxApplicants} onChange={(e) => setMaxApplicants(Number(e.target.value))} />
                    </Field.Root>
                </HStack>

                <Field.Root required>
                    <Field.Label mb="2">캠페인 명</Field.Label>
                    <LocalInput placeholder="캠페인 명을 입력해주세요" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Field.Root>

                <Field.Root>
                    <Field.Label mb="2">간단 설명</Field.Label>
                    <LocalInput placeholder="캠페인에 대한 간단한 설명을 입력해주세요" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
                </Field.Root>

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

                <Field.Root>
                    <Field.Label mb="2">상세 이미지 <Text as="span" fontSize="xs" color="gray.500" fontWeight="normal">(여러 장 선택 가능, 드래그하여 순서 변경)</Text></Field.Label>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={detailImageItems.map(item => item.id)} strategy={horizontalListSortingStrategy}>
                            <HStack alignItems="start" flexWrap="wrap" gap="4">
                                {detailImageItems.map((item, index) => (
                                    <SortableImageItem
                                        key={item.id}
                                        id={item.id}
                                        item={item}
                                        onRemove={() => handleRemoveDetailImage(index)}
                                    />
                                ))}
                                <Box
                                    w="150px" h="150px"
                                    borderWidth="1px" borderStyle="dashed" borderRadius="md"
                                    display="flex" alignItems="center" justifyContent="center"
                                    bg="gray.50" overflow="hidden" position="relative"
                                >
                                    <Stack alignItems="center" color="gray.400">
                                        <LuPlus size="24" />
                                        <Text fontSize="xs">이미지 추가</Text>
                                    </Stack>
                                    <Input
                                        type="file"
                                        multiple
                                        position="absolute" top="0" left="0" w="full" h="full" opacity="0" cursor="pointer"
                                        accept="image/*"
                                        onChange={handleDetailImagesChange}
                                    />
                                </Box>
                            </HStack>
                        </SortableContext>
                    </DndContext>
                </Field.Root>

                <Field.Root>
                    <Field.Label mb="2">캠페인 상세 설명</Field.Label>
                    <LocalTextarea value={content} onChange={(e) => setContent(e.target.value)} minH="300px" />
                    {/* <RegisterEditor content={content} setContent={setContent} /> */}
                </Field.Root>
            </Stack>

            {/* 2. 일정 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">일정 설정</Heading>

                <HStack gap="6">
                    <Field.Root>
                        <Field.Label mb="2">모집 시작일</Field.Label>
                        <LocalDatePicker value={startApplicationDate} onChange={setStartApplicationDate} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">모집 종료일</Field.Label>
                        <LocalDatePicker value={endApplicationDate} onChange={setEndApplicationDate} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">발표일</Field.Label>
                        <LocalDatePicker value={reviewerSelectionDate} onChange={setReviewerSelectionDate} />
                    </Field.Root>
                </HStack>

                <HStack gap="6">
                    <Field.Root>
                        <Field.Label mb="2">리뷰 작성 시작일</Field.Label>
                        <LocalDatePicker value={startWriteDate} onChange={setStartWriteDate} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">리뷰 작성 종료일</Field.Label>
                        <LocalDatePicker value={endWriteDate} onChange={setEndWriteDate} />
                    </Field.Root>
                </HStack>
            </Stack>

            {/* 3. 채널 정보 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">채널 정보</Heading>

                <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">모집 채널 (중복 선택 가능)</Text>
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
                </Box>
            </Stack>

            {/* 4. 미션 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md">
                <Heading size="md">미션 설정</Heading>

                {channels.includes('202603171602001') && (
                    <HStack gap="6">
                        <Field.Root>
                            <Field.Label mb="2">필수 키워드</Field.Label>
                            <TagsInput.Root value={mandatoryKeyword} onValueChange={(e) => setMandatoryKeyword(e.value)}>
                                <TagsInput.Control flexWrap="wrap">
                                    {mandatoryKeyword.map((keyword, index) => (
                                        <TagsInput.Item key={index} index={index} value={keyword}>
                                            <TagsInput.ItemPreview>
                                                <TagsInput.ItemText>{keyword}</TagsInput.ItemText>
                                            </TagsInput.ItemPreview>
                                            <TagsInput.ItemInput />
                                        </TagsInput.Item>
                                    ))}
                                    <TagsInput.Input placeholder="필수 키워드 (엔터로 추가)" />
                                </TagsInput.Control>
                            </TagsInput.Root>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label mb="2">선택 키워드</Field.Label>
                            <TagsInput.Root value={optionalKeyword} onValueChange={(e) => setOptionalKeyword(e.value)}>
                                <TagsInput.Control flexWrap="wrap">
                                    {optionalKeyword.map((keyword, index) => (
                                        <TagsInput.Item key={index} index={index} value={keyword}>
                                            <TagsInput.ItemPreview>
                                                <TagsInput.ItemText>{keyword}</TagsInput.ItemText>
                                            </TagsInput.ItemPreview>
                                            <TagsInput.ItemInput />
                                        </TagsInput.Item>
                                    ))}
                                    <TagsInput.Input placeholder="선택 키워드 (엔터로 추가)" />
                                </TagsInput.Control>
                            </TagsInput.Root>
                        </Field.Root>
                    </HStack>
                )}

                <Field.Root>
                    <Field.Label mb="2">제품명(또는 매장명)</Field.Label>
                    <LocalInput placeholder="제품명(또는 매장명)을 입력해주세요" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </Field.Root>

                {channels.includes('202603171602001') && (
                    <Field.Root>
                        <Field.Label mb="2">제목 가이드</Field.Label>
                        <LocalTextarea minH="100px" placeholder="제목 작성 가이드를 입력해주세요" value={titleGuide} onChange={(e) => setTitleGuide(e.target.value)} />
                    </Field.Root>
                )}

                <Field.Root>
                    <Field.Label mb="2">본문 가이드</Field.Label>
                    <LocalTextarea
                        minH="100px"
                        placeholder="본문 작성 가이드를 입력해주세요"
                        value={contentGuide}
                        onChange={(e) => setContentGuide(e.target.value)}
                    />
                </Field.Root>

                <Field.Root>
                    <Field.Label mb="2">해시태그</Field.Label>
                    <TagsInput.Root value={hashtags} onValueChange={(e) => setHashtags(e.value)}>
                        <TagsInput.Control flexWrap="wrap">
                            {hashtags.map((keyword, index) => (
                                <TagsInput.Item key={index} index={index} value={keyword}>
                                    <TagsInput.ItemPreview>
                                        <TagsInput.ItemText>{keyword}</TagsInput.ItemText>
                                    </TagsInput.ItemPreview>
                                    <TagsInput.ItemInput />
                                </TagsInput.Item>
                            ))}
                            <TagsInput.Input placeholder="해시태그 (엔터로 추가)" />
                        </TagsInput.Control>
                    </TagsInput.Root>
                </Field.Root>



                <HStack gap="6">
                    <Field.Root>
                        <Field.Label mb="2">최소 사진 개수</Field.Label>
                        <LocalInput type="number" placeholder="0" value={minPhotoCount} onChange={(e) => setMinPhotoCount(Number(e.target.value))} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label mb="2">최소 글자 수</Field.Label>
                        <LocalInput type="number" placeholder="0" value={minTextLength} onChange={(e) => setMinTextLength(Number(e.target.value))} />
                    </Field.Root>
                </HStack>
            </Stack>

            {/* 5. 리워드 설정 */}
            <Stack gap="6" borderWidth="1px" p="6" borderRadius="md"
                opacity={hasApplications ? 0.6 : 1}
                pointerEvents={hasApplications ? "none" : "auto"}
            >
                <HStack justifyContent="space-between" flexWrap={{ base: "wrap", md: "nowrap" }}>
                    <Heading size="md">리워드 설정</Heading>
                    <HStack>
                        {hasApplications && <Text fontSize="sm" color="red.500" fontWeight="bold">신청자가 있는 캠페인은 리워드를 수정할 수 없습니다.</Text>}
                        <Button size="sm" onClick={handleAddReward} leftIcon={<LuPlus />}>리워드 추가</Button>
                    </HStack>
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
                                    <LocalInput
                                        bg="white"
                                        placeholder="리워드 이름을 입력해주세요"
                                        value={reward.name}
                                        onChange={(e) => handleRewardChange(reward.id, 'name', e.target.value)}
                                    />
                                </Field.Root>
                            </HStack>

                            <Field.Root>
                                <Field.Label mb="2">리워드 설명</Field.Label>
                                <LocalTextarea
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
                                        <LocalInput
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
                                        <LocalInput
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
                                                        <LocalInput
                                                            bg="white"
                                                            placeholder="예: 색상, 사이즈"
                                                            value={opt.option_name}
                                                            onChange={(e) => handleOptionChange(reward.id, optIndex, 'option_name', e.target.value)}
                                                        />
                                                    </Field.Root>
                                                    <Field.Root w="70%">
                                                        <Field.Label mb="2" fontSize="xs">옵션값 (쉼표로 구분)</Field.Label>
                                                        <HStack w="full">
                                                            <LocalInput
                                                                bg="white"
                                                                placeholder="예: 빨강, 파랑, 검정"
                                                                value={opt.option_value}
                                                                onChange={(e) => handleOptionChange(reward.id, optIndex, 'option_value', e.target.value)}
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

            <HStack justifyContent="flex-end" pt="10">
                <Button variant="outline" size="lg" onClick={() => navigate(-1)}>취소</Button>
                <Button onClick={() => handleSubmit('PENDING')} loading={submitButtonLoading} size="lg" bg="black" color="white" _hover={{ bg: "gray.800" }}>캠페인 {id ? '수정' : '등록'}하기</Button>
            </HStack>

            {isDraftModalOpen && (
                <Box position="fixed" top="0" left="0" w="100vw" h="100vh" bg="blackAlpha.500" zIndex="overlay" display="flex" alignItems="center" justifyContent="center">
                    <Box bg="white" p="6" borderRadius="md" w="500px" maxH="80vh" overflowY="auto" shadow="lg">
                        <HStack justifyContent="space-between" mb="4">
                            <Heading size="md">임시저장 목록</Heading>
                            <CloseButton onClick={() => setIsDraftModalOpen(false)} />
                        </HStack>
                        <Stack gap="2">
                            {drafts.length === 0 ? (
                                <Text color="gray.500" py="4" textAlign="center">임시저장된 캠페인이 없습니다.</Text>
                            ) : (
                                drafts.map(draft => (
                                    <Box key={draft.campaign_code} p="3" borderWidth="1px" borderRadius="md" cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => handleSelectDraft(draft)}>
                                        <Text fontWeight="bold">{draft.title || '제목 없음'}</Text>
                                        <Text fontSize="xs" color="gray.500">{new Date(draft.updated_at || draft.created_at).toLocaleString()}</Text>
                                    </Box>
                                ))
                            )}
                        </Stack>
                    </Box>
                </Box>
            )}
        </Stack>
    )
}

export default Register;