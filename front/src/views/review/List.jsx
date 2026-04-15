import { Box, Flex, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getDDay } from "../../utils/simpleUtils";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/api";

function List() {

    const { id } = useParams();
    const menuStyle = { rounded: 'none', p: "8px 20px", fontSize: 'sm', _hover: { fontWeight: 'medium' } };
    const menuActiveStyle = { borderBottomWidth: '2px', borderColor: 'main', fontWeight: 'medium' };

    const [categorys, setCategorys] = useState([]);
    const [rootCategoryId, setRootCategoryId] = useState(null);
    const [reviewCampaignChannelView, setReviewCampaignChannelView] = useState([]);

    const metchTitle = (id) => {
        switch (id) {
            case 'DELIVERY': return '제품';
            case 'VISIT': return '방문';
            case 'REPORTER': return '기자단';
            case 'PURCHASE': return '구매평';
            default: return '';
        }
    }
    const [title, setTitle] = useState('');
    const [campaignList, setCampaignList] = useState([]);

    useEffect(() => {
        const fetchCategorys = async () => {
            const response = await axiosInstance.get('/review/campaign/category');
            const data = response.data;
            setCategorys(data);

            const currentCategory = data.find(c => String(c.id) === String(id));
            if (currentCategory) {
                if (!currentCategory.parent_id) {
                    setRootCategoryId(currentCategory.id);
                } else {
                    setRootCategoryId(currentCategory.parent_id);
                }
                setTitle(metchTitle(currentCategory.type));
            }
        };

        const fetchCampaignList = async () => {
            const response = await axiosInstance.get(`/review/campaign/list/${id}`);
            const data = response.data;
            setCampaignList(data);
        };

        const fetchReviewCampaignChannelView = async () => {
            try {
                const resources = await axiosInstance.get('/review/campaign/channel');
                setReviewCampaignChannelView(resources.data);
            } catch (error) {
                console.error("Failed to fetch review campaign channel view", error);
                toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
            }
        };

        fetchCategorys();
        fetchCampaignList();
        fetchReviewCampaignChannelView();
    }, [id]);

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} gap="6">
            <Heading>{title} 캠페인</Heading>
            <Stack direction="row" borderBottomWidth="1px">
                <HStack gap="2">
                    <Link href={`/review/categorys/${rootCategoryId}`} {...menuStyle} {...(rootCategoryId === id ? menuActiveStyle : {})}>전체</Link>
                    {categorys.filter(c => c.parent_id == rootCategoryId).map((category) => (
                        <Link href={`/review/categorys/${category.id}`} key={category.id} {...menuStyle} {...(category.id === id ? menuActiveStyle : {})}>{category.name}</Link>
                    ))}
                </HStack>
            </Stack>

            <Flex gap="30px 0" flexWrap="wrap">
                {campaignList.map((campaign) => (
                    <Box key={campaign.id} w="1/6">
                        <Stack gap="2" p="0 10px">
                            <Link href={`/review/detail/${campaign.campaign_code}`}>
                                <Image src={campaign.main_image} aspectRatio="square" rounded="md" w="full" />
                            </Link>
                            <HStack>
                                <HStack>
                                    {campaign.channels.map((channel, index) => {
                                        const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                                        return channelView ? (<Image key={channelView.id} src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />) : '';
                                    })}
                                </HStack>
                                <Text>D-{getDDay(campaign.end_application_date)}</Text>
                            </HStack>
                            <Text>{campaign.title}</Text>
                            <Text fontSize="xs" color="fg.muted">{campaign.offer}</Text>
                            <Text fontSize="xs">신청 {campaign.application_count}명&#47;{campaign.max_applicants}명</Text>
                        </Stack>
                    </Box>
                ))}
            </Flex>
        </Stack>
    )
}

export default List;