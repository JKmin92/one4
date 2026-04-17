import { HStack, Image, Link, Stack, Table, Tabs } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import { formatDateYMD, formatNumber, getReviewCampaignState } from "../../../../utils/simpleUtils";

const CampaignTable = ({ campaigns, channelViews }) => (
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeader>상태</Table.ColumnHeader>
                <Table.ColumnHeader>채널</Table.ColumnHeader>
                <Table.ColumnHeader>제목</Table.ColumnHeader>
                <Table.ColumnHeader>모집인원</Table.ColumnHeader>
                <Table.ColumnHeader>모집기간</Table.ColumnHeader>
                <Table.ColumnHeader>작성기간</Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {campaigns.map((reviewCampaign) => (
                <Table.Row key={reviewCampaign.campaign_code}>
                    <Table.Cell>{getReviewCampaignState(reviewCampaign.state)?.value}</Table.Cell>
                    <Table.Cell>
                        <HStack>
                            {reviewCampaign.channels.map((channel, index) => {
                                const channelView = channelViews.find((view) => view.channel_code === channel);
                                return channelView ? (<Image key={index} src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />) : '';
                            })}
                        </HStack>
                    </Table.Cell>
                    <Table.Cell>
                        <Link href={`/admin/review/campaign/detail/${reviewCampaign.campaign_code}`} gap="4">
                            <Image src={reviewCampaign.main_image} w="14" rounded="md" />
                            {reviewCampaign.title}
                        </Link>
                    </Table.Cell>
                    <Table.Cell>{formatNumber(reviewCampaign.application_count) + ' / ' + formatNumber(reviewCampaign.max_applicants)}</Table.Cell>
                    <Table.Cell>{formatDateYMD(reviewCampaign.start_application_date) + ' ~ ' + formatDateYMD(reviewCampaign.end_application_date)}</Table.Cell>
                    <Table.Cell>{formatDateYMD(reviewCampaign.start_write_date) + ' ~ ' + formatDateYMD(reviewCampaign.end_write_date)}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table.Root>
);

function List() {

    const [reviewCampaignList, setReviewCampaignList] = useState([]);
    const [reviewCampaignChannelView, setReviewCampaignChannelView] = useState([]);

    useEffect(() => {
        const fetchReviewCampaignList = async () => {
            try {
                const resources = await axiosInstance.get('/admin/review/campaign');
                setReviewCampaignList(resources.data);
            } catch (error) {
                console.error("Failed to fetch review campaign list", error);
                toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
            }
        };
        const fetchReviewCampaignChannelView = async () => {
            try {
                const resources = await axiosInstance.get('/admin/review/campaign/channel');
                setReviewCampaignChannelView(resources.data);
            } catch (error) {
                console.error("Failed to fetch review campaign channel view", error);
                toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
            }
        };
        fetchReviewCampaignList();
        fetchReviewCampaignChannelView();
    }, []);

    const lists = useMemo(() => {
        return {
            scheduled: reviewCampaignList.filter(campaign => ['DRAFT', 'PENDING', 'SCHEDULED'].includes(campaign.state)),
            recruiting: reviewCampaignList.filter(campaign => campaign.state === 'RECRUITING'),
            selecting: reviewCampaignList.filter(campaign => campaign.state === 'SELECTING'),
            reviewing: reviewCampaignList.filter(campaign => campaign.state === 'REVIEWING'),
            completed: reviewCampaignList.filter(campaign => campaign.state === 'COMPLETED'),
        };
    }, [reviewCampaignList]);

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Tabs.Root defaultValue="recruiting"
                variant="plain"
                css={{
                    "--tabs-indicator-bg": "colors.gray.subtle",
                    "--tabs-indicator-shadow": "shadows.xs",
                    "--tabs-trigger-radius": "radii.full",
                }}
            >
                <Tabs.List flexWrap="wrap">
                    <Tabs.Trigger value="scheduled">준비중 ({lists.scheduled.length})</Tabs.Trigger>
                    <Tabs.Trigger value="recruiting">모집중 ({lists.recruiting.length})</Tabs.Trigger>
                    <Tabs.Trigger value="selecting">선정중 ({lists.selecting.length})</Tabs.Trigger>
                    <Tabs.Trigger value="reviewing">리뷰작성중 ({lists.reviewing.length})</Tabs.Trigger>
                    <Tabs.Trigger value="completed">종료 ({lists.completed.length})</Tabs.Trigger>
                    <Tabs.Indicator />
                </Tabs.List>

                <Tabs.Content value="scheduled">
                    <CampaignTable campaigns={lists.scheduled} channelViews={reviewCampaignChannelView} />
                </Tabs.Content>
                <Tabs.Content value="recruiting">
                    <CampaignTable campaigns={lists.recruiting} channelViews={reviewCampaignChannelView} />
                </Tabs.Content>
                <Tabs.Content value="selecting">
                    <CampaignTable campaigns={lists.selecting} channelViews={reviewCampaignChannelView} />
                </Tabs.Content>
                <Tabs.Content value="reviewing">
                    <CampaignTable campaigns={lists.reviewing} channelViews={reviewCampaignChannelView} />
                </Tabs.Content>
                <Tabs.Content value="completed">
                    <CampaignTable campaigns={lists.completed} channelViews={reviewCampaignChannelView} />
                </Tabs.Content>
            </Tabs.Root>
        </Stack>
    )
}

export default List;