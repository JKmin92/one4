import { Heading, Stack, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import UserDetail from "./details/UserDetail";
import OrderDetail from "./details/OrderDetail";
import ChannelDetail from "./details/ChannelDetail";
import BasketDetail from "./details/BasketDetail";
import ReviewCampaignDetail from "./details/ReviewCampaignDetail";
import ProductReviewDetail from "./details/ProductReviewDetail";
import ProductInquiryDetail from "./details/ProductInquiryDetail";
import Point from "./details/Point";

function Detail() {
    const { id } = useParams();
    const [user, setUser] = useState();

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get(`/admin/member/user/${id}`);
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (!user) return;

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading>{user.name}님 상세정보</Heading>

            <Tabs.Root defaultValue="user">
                <Tabs.List>
                    <Tabs.Trigger value="user">회원 정보</Tabs.Trigger>
                    <Tabs.Trigger value="order">주문내역</Tabs.Trigger>
                    <Tabs.Trigger value="channel">리뷰 채널</Tabs.Trigger>
                    <Tabs.Trigger value="basket">장바구니</Tabs.Trigger>
                    <Tabs.Trigger value="reviewCampaign">체험단</Tabs.Trigger>
                    <Tabs.Trigger value="review">구매리뷰내역</Tabs.Trigger>
                    <Tabs.Trigger value="inquery">문의내역</Tabs.Trigger>
                    <Tabs.Trigger value="point">포인트</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="user"><UserDetail user={user} /></Tabs.Content>
                <Tabs.Content value="order"><OrderDetail user_code={id} /></Tabs.Content>
                <Tabs.Content value="channel"><ChannelDetail user_code={id} /></Tabs.Content>
                <Tabs.Content value="basket"><BasketDetail user_code={id} /></Tabs.Content>
                <Tabs.Content value="reviewCampaign"><ReviewCampaignDetail user_code={id} /></Tabs.Content>
                <Tabs.Content value="review"><ProductReviewDetail user_code={id} /></Tabs.Content>
                <Tabs.Content value="inquery"><ProductInquiryDetail user_code={id} /></Tabs.Content>
                <Tabs.Content value="point"><Point user_code={id} name={user.name} email={user.email} phone={user.phone} /></Tabs.Content>
            </Tabs.Root>
        </Stack>
    )

}

export default Detail;