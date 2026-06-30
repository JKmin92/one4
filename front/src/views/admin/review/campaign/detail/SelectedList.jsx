import { Badge, Button, Heading, HStack, Image, Input, Link, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../utils/api";
import { toaster } from "../../../../../components/ui/toaster";

function UserAddressDisplay({ applicationCode }) {
    const [addressText, setAddressText] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!applicationCode) return;
        const fetchAddress = async () => {
            try {
                const response = await axiosInstance.get(`/admin/review/campaign/userAddress/${applicationCode}`);
                if (response.data && response.data.length > 0) {
                    const addr = response.data[0];
                    setUserInfo(`${addr.name} ${addr.phone}`);
                    setAddressText(`[${addr.postcode || ''}] ${addr.address || ''} ${addr.detailAddress || ''}`);
                } else {
                    setAddressText("정보 없음");
                }
            } catch (error) {
                console.error("Failed to get user address", error);
                setAddressText("오류 발생");
            }
        };
        fetchAddress();
    }, [applicationCode]);

    //if (!addressText) return <Text fontSize="sm" color="gray.500">불러오는 중...</Text>;
    return (
        <>
            <Text fontSize="sm">{userInfo}</Text>
            <Text fontSize="sm">{addressText}</Text>
        </>

    )
}

function ApplicationDelivery({ campaign_application_code }) {
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [courier, setCourier] = useState('CJ대한통운');
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        if (!campaign_application_code) return;
        const fetchDeliveryInfo = async () => {
            try {
                const response = await axiosInstance.get(`/admin/review/campaign/delivery/${campaign_application_code}`);
                if (response.data) {
                    setDeliveryInfo(response.data);
                    setCourier(response.data.courier);
                    setTrackingNumber(response.data.tracking_number);
                }
            } catch (error) {
                console.error("Failed to get delivery info", error);
            }
        };
        fetchDeliveryInfo();
    }, [campaign_application_code]);

    const handleUpdateDelivery = async () => {
        try {
            await axiosInstance.put(`/admin/review/campaign/delivery/${deliveryInfo.campaign_application_delivery_code}`, {
                courier,
                tracking_number: trackingNumber
            });
            toaster.create({ title: "배송 정보가 수정되었습니다.", type: "success" });
        } catch (error) {
            console.error("Failed to update delivery info", error);
            toaster.create({ title: "배송 정보 수정 실패", type: "error" });
        }
    }

    const handleInsertDelivery = async () => {
        try {
            await axiosInstance.post(`/admin/review/campaign/delivery/${campaign_application_code}`, {
                courier,
                tracking_number: trackingNumber
            });
            toaster.create({ title: "배송 정보가 등록되었습니다.", type: "success" });
        } catch (error) {
            console.error("Failed to insert delivery info", error);
            toaster.create({ title: "배송 정보 등록 실패", type: "error" });
        }
    }

    return (
        <HStack>
            <NativeSelect.Root value={courier} onChange={(e) => setCourier(e.target.value)}>
                <NativeSelect.Field>
                    <option value="CJ대한통운">CJ대한통운</option>
                    <option value="한진택배">한진택배</option>
                    <option value="우체국택배">우체국택배</option>
                    <option value="롯데택배">롯데택배</option>
                    <option value="로젠택배">로젠택배</option>
                    <option value="경동택배">경동택배</option>
                    <option value="대신택배">대신택배</option>
                    <option value="천일택배">천일택배</option>
                    <option value="한의사랑택배">한의사랑택배</option>
                    <option value="우리택배">우리택배</option>
                    <option value="일양로지스">일양로지스</option>
                </NativeSelect.Field>
            </NativeSelect.Root>
            <Input placeholder="송장번호" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
            <Button onClick={deliveryInfo ? handleUpdateDelivery : handleInsertDelivery}>{deliveryInfo ? '수정' : '등록'}</Button>
        </HStack>
    )
}

function SelectedList({ selectedList, reviewCampaignChannelView, campaign, fetchReviewCampaignApplicationList }) {


    return (
        <Stack>
            <Text>총 {selectedList.length}명의 데이터가 있습니다.</Text>
            {selectedList.map((app, index) => {
                return (
                    <Stack key={index} direction="row" border="1px solid" borderColor="gray.subtle" rounded="md" p="4" alignItems="center" justifyContent="space-between">
                        {app.channels.map((channel, index) => {
                            const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                            return (
                                <Stack key={channelView.id} direction="row" alignItems="center" gap="6">
                                    <Image src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />
                                    <Image src={channel.meta_image} rounded="full" w="16" />
                                    <Stack gap="0">
                                        <Link href={channel.channel_url} target="_blank">
                                            <Heading size="md">{channel.meta_title}</Heading>
                                        </Link>
                                        <Text fontSize="sm" color="fg.muted">{channel.channel_url}</Text>
                                        <Text fontSize="sm" color="fg.muted">최근 일방문자 : 300</Text>
                                    </Stack>
                                    <Stack>
                                        <HStack>
                                            <Badge>일상</Badge>
                                            <Badge>반려동물</Badge>
                                            <Badge>리뷰</Badge>
                                        </HStack>
                                        <HStack>
                                            <Badge>남성</Badge>
                                            <Badge>30대</Badge>
                                        </HStack>
                                    </Stack>
                                </Stack>
                            )
                        })}
                        {campaign.campaign_type === 'DELIVERY' && (
                            <HStack gap="12">
                                <Stack gap="0">
                                    <Badge colorPalette="blue" w="fit-content" mb="1">배송지 정보</Badge>
                                    <UserAddressDisplay applicationCode={app.campaign_application_code} />
                                </Stack>
                                <ApplicationDelivery campaign_application_code={app.campaign_application_code} />
                            </HStack>
                        )}
                    </Stack>
                )
            })}
        </Stack>
    )

}

export default SelectedList;