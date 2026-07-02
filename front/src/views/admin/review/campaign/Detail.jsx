import { Badge, Box, Button, CloseButton, DataList, Dialog, Heading, HStack, Image, Link, Stack, Status, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { formatDateYMD, getReviewCampaignState } from "../../../../utils/simpleUtils";
import { InfoTip } from "../../../../components/ui/toggle-tip";
import { Tooltip } from "../../../../components/ui/tooltip";
import { toaster } from "../../../../components/ui/toaster";
import AppliedList from "./detail/AppliedList";
import SelectedList from "./detail/SelectedList";
import CompletedList from "./detail/CompletedList";
import RejectedList from "./detail/RejectedList";

function Detail() {

    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [reviewCampaignChannelView, setReviewCampaignChannelView] = useState([]);
    const [reviewCampaignApplicationList, setReviewCampaignApplicationList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const resource = await axiosInstance.get(`/admin/review/campaign/${id}`);
                setCampaign(resource.data);
            } catch {
                console.error('오류')
            }
        }

        const fetchReviewCampaignChannelView = async () => {
            try {
                const resources = await axiosInstance.get('/admin/review/campaign/channel');
                setReviewCampaignChannelView(resources.data);
            } catch (error) {
                console.error("Failed to fetch review campaign channel view", error);
                toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
            }
        };



        fetchCampaign();
        fetchReviewCampaignChannelView();
        fetchReviewCampaignApplicationList();
    }, [id]);

    const fetchReviewCampaignApplicationList = async () => {
        try {
            const resources = await axiosInstance.get(`/admin/review/campaign/applicationList/${id}`);
            setReviewCampaignApplicationList(resources.data);
        } catch (error) {
            console.error("Failed to fetch review campaign application list", error);
            toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
        }
    };

    const lists = useMemo(() => {
        return {
            applied: reviewCampaignApplicationList.filter(app => app.status === 'APPLIED'),
            selected: reviewCampaignApplicationList.filter(app => app.status === 'SELECTED'),
            completed: reviewCampaignApplicationList.filter(app => ['SUBMITTED', 'RETURNED', 'COMPLETED'].includes(app.status)),
            cancelled: reviewCampaignApplicationList.filter(app => ['CANCELLED', 'REJECTED'].includes(app.status))
        };
    }, [reviewCampaignApplicationList]);

    if (!campaign) return null;
    const tabsStatus = (state) => {
        switch (state) {
            case 'RECRUITING':
            case 'SELECTING':
            case 'CLOSED':
                return 'APPLIED';
            case 'REVIEWING':
                return 'SELECTED';
            case 'COMPLETED':
                return 'COMPLETED';
            default:
                return 'APPLIED';
        }
    }

    const isAllCompleted = reviewCampaignApplicationList.length > 0 && reviewCampaignApplicationList.every(app => ['SUBMITTED', 'RETURNED', 'COMPLETED'].includes(app.status));
    const defaultTabsState = isAllCompleted ? 'COMPLETED' : tabsStatus(campaign.state);

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <HStack justifyContent="space-between">
                <Stack direction="row" gap="6">
                    <Image src={campaign.main_image} w="32" rounded="md" />
                    <Stack>
                        <Status.Root colorPalette={getReviewCampaignState(campaign.state).color}>
                            <Status.Indicator />
                            <Text>{getReviewCampaignState(campaign.state).value}</Text>
                        </Status.Root>
                        <HStack>
                            {campaign.channels.map((channel) => {
                                const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                                return channelView ? (<Image key={channelView.id} src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />) : '';
                            })}
                            <Text>{campaign.title}</Text>
                        </HStack>
                        <DataList.Root orientation="horizontal" gap="2">
                            <DataList.Item>
                                <DataList.ItemLabel>캠페인 모집 기간</DataList.ItemLabel>
                                <DataList.ItemValue>{formatDateYMD(campaign.start_application_date) + ' ~ ' + formatDateYMD(campaign.end_application_date)}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>리뷰어 선정일</DataList.ItemLabel>
                                <DataList.ItemValue>{formatDateYMD(campaign.reviewer_selection_date)}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>캠페인 작성 기간</DataList.ItemLabel>
                                <DataList.ItemValue>{formatDateYMD(campaign.start_write_date) + ' ~ ' + formatDateYMD(campaign.end_write_date)}</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                    </Stack>
                    <DataList.Root orientation="horizontal" gap="2">
                        <DataList.Item>
                            <DataList.ItemLabel>희망 모집인원</DataList.ItemLabel>
                            <DataList.ItemValue>{campaign.max_applicants}인(팀)</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>신청한 총 인원<InfoTip>신청자, 선정자, 미선정자 모두 포함</InfoTip></DataList.ItemLabel>
                            <DataList.ItemValue>{reviewCampaignApplicationList.length}인(팀)</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>신청 인원<InfoTip>선정되지 않은 인원</InfoTip></DataList.ItemLabel>
                            <DataList.ItemValue>{lists.applied.length}인(팀)</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>선정된 인원</DataList.ItemLabel>
                            <DataList.ItemValue>{lists.selected.length}인(팀)</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>작성된 인원</DataList.ItemLabel>
                            <DataList.ItemValue>{lists.completed.length}인(팀)</DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </Stack>
                <HStack>
                    <Button variant="outline" onClick={() => navigate(`/admin/review/campaign/update/${id}`)}>수정</Button>
                    <Button bg="red">삭제</Button>
                </HStack>
            </HStack>
            <Stack>
                <Tabs.Root defaultValue={defaultTabsState}
                    variant="plain"
                    css={{
                        "--tabs-indicator-bg": "colors.gray.subtle",
                        "--tabs-indicator-shadow": "shadows.xs",
                        "--tabs-trigger-radius": "radii.full",
                    }}
                >
                    <Tabs.List>
                        <Tabs.Trigger value="APPLIED">신청자</Tabs.Trigger>
                        <Tabs.Trigger value="SELECTED">선정자</Tabs.Trigger>
                        <Tabs.Trigger value="COMPLETED">작성 리스트</Tabs.Trigger>
                        <Tabs.Trigger value="CANCELLED">미선정 리스트</Tabs.Trigger>
                        <Tabs.Indicator />
                    </Tabs.List>
                    <Tabs.Content value="APPLIED">
                        <AppliedList appliedList={lists.applied} reviewCampaignChannelView={reviewCampaignChannelView} campaign={campaign} fetchReviewCampaignApplicationList={fetchReviewCampaignApplicationList} />
                    </Tabs.Content>
                    <Tabs.Content value="SELECTED">
                        <SelectedList selectedList={lists.selected} reviewCampaignChannelView={reviewCampaignChannelView} campaign={campaign} fetchReviewCampaignApplicationList={fetchReviewCampaignApplicationList} />
                    </Tabs.Content>
                    <Tabs.Content value="COMPLETED">
                        <CompletedList completedList={lists.completed} reviewCampaignChannelView={reviewCampaignChannelView} campaign={campaign} fetchReviewCampaignApplicationList={fetchReviewCampaignApplicationList} />
                    </Tabs.Content>
                    <Tabs.Content value="CANCELLED">
                        <RejectedList cancelledList={lists.cancelled} reviewCampaignChannelView={reviewCampaignChannelView} />
                    </Tabs.Content>
                </Tabs.Root>
            </Stack>
        </Stack>
    )
}

export default Detail;