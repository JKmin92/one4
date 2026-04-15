import { DataList, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { formatDateYMD } from "../../../../utils/simpleUtils";

function Detail() {

    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [reviewCampaignChannelView, setReviewCampaignChannelView] = useState([]);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const resource = await axiosInstance.get(`/admin/review/campaign/${id}`);
                console.log(resource.data);
                setCampaign(resource.data);
            } catch {
                console.error('오류')
            }
        }

        const fetchReviewCampaignChannelView = async () => {
            try {
                const resources = await axiosInstance.get('/admin/review/campaign/channel');
                console.log(resources.data);
                setReviewCampaignChannelView(resources.data);
            } catch (error) {
                console.error("Failed to fetch review campaign channel view", error);
                toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
            }
        };

        fetchCampaign();
        fetchReviewCampaignChannelView();
    }, [id]);

    if (!campaign) return null;

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Stack direction="row" gap="6">
                <Image src={campaign.main_image} w="32" rounded="md" />
                <Stack>
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
            </Stack>
        </Stack>
    )
}

export default Detail;