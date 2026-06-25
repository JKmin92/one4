import { Box, Button, Editable, Heading, HStack, IconButton, Image, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { LuCheck, LuChevronRight, LuPencilLine, LuUserRound, LuX } from "react-icons/lu";
import { useAuth } from "../../../utils/useAuth";
import { useEffect, useState } from "react";
import Delivery from "./info/Delivery";
import axiosInstance from "../../../utils/api";
import ReviewChannel from "./info/ReviewChannel";
import Password from "./info/Password";
import PrivateInfo from "./info/PrivateInfo";

function Info() {

    const { user } = useAuth();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [birth, setBirth] = useState();

    const [deliveryList, setDeliveryList] = useState([]);
    const [reviewChannelList, setReviewChannelList] = useState([]);
    const [reviewCampaignChannelViewList, setReviewCampaignChannelViewList] = useState([]);

    useEffect(() => {
        getUserAddressList();
        getUserReviewChannelList();
    }, []);

    const getUserAddressList = async () => {
        const res = await axiosInstance.get('/user/address');
        setDeliveryList(res.data);
    }

    const getUserReviewChannelList = async () => {
        const res = await axiosInstance.get('/user/review/channel');
        setReviewChannelList(res.data);
    }

    useEffect(() => {
        const getReviewCampaignChannelViewList = async () => {
            const response = await axiosInstance.get('/review/campaign/channel');
            // 원하는 채널 코드들을 배열로 관리
            const targetCodes = ['202603171602001', '202603171603001', '202603171603002'];
            const data = response.data.filter((channel) => {
                return targetCodes.includes(channel.channel_code);
            });
            setReviewCampaignChannelViewList(data);
        }
        getReviewCampaignChannelViewList();
    }, []);

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Stack w="2xl" margin="0 auto" gap="6">
                <HStack gap="5">
                    {user.profile ? (
                        <Image src={user.profile} w="100px" h="100px" rounded="full" />
                    ) : (
                        <Box w="100px" h="100px" rounded="full" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
                            <LuUserRound size="25" />
                        </Box>
                    )}
                    <Stack gap="0">
                        <Text fontSize="lg" fontWeight="bold">{user.name}</Text>
                        <Text color="fg.muted">{user.email}</Text>
                    </Stack>
                </HStack>
                <Stack separator={<StackSeparator />}>
                    <PrivateInfo user={user} />
                    <Password />
                    <Delivery deliveryList={deliveryList} setDeliveryList={setDeliveryList} />
                    <ReviewChannel reviewChannelList={reviewChannelList} setReviewChannelList={setReviewChannelList} reviewCampaignChannelViewList={reviewCampaignChannelViewList} />
                    <Button variant="ghost" justifyContent="space-between">알림 설정<LuChevronRight /></Button>
                    <Button variant="ghost" justifyContent="space-between">환불 계좌 관리<LuChevronRight /></Button>
                    <Button variant="ghost" justifyContent="space-between">회원탈퇴<LuChevronRight /></Button>
                </Stack>

            </Stack>
        </Stack>
    )
}

export default Info;