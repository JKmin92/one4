import { Image, Stack, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import { formatDateYMD, formatNumber } from "../../../../utils/simpleUtils";

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

    return (
        <Stack p="30px" px="layoutX" gap="6">
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
                    {reviewCampaignList.map((reviewCampaign) => (
                        <Table.Row key={reviewCampaign.campaign_code}>
                            <Table.Cell>{reviewCampaign.campaign_code}</Table.Cell>
                            <Table.Cell>
                                {reviewCampaign.channels.map((channel) => {
                                    const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel);
                                    return channelView ? (<Image key={channelView.id} src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />) : '';
                                })}
                            </Table.Cell>
                            <Table.Cell>{reviewCampaign.title}</Table.Cell>
                            <Table.Cell>{formatNumber(reviewCampaign.application_count) + ' / ' + formatNumber(reviewCampaign.max_applicants)}</Table.Cell>
                            <Table.Cell>{formatDateYMD(reviewCampaign.start_application_date) + ' ~ ' + formatDateYMD(reviewCampaign.end_application_date)}</Table.Cell>
                            <Table.Cell>{formatDateYMD(reviewCampaign.start_write_date) + ' ~ ' + formatDateYMD(reviewCampaign.end_write_date)}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Stack>
    )
}
export default List;