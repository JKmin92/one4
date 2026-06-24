import { Badge, Box, Button, CloseButton, Dialog, Heading, HStack, Icon, Image, Link, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PiSmileySad } from "react-icons/pi";
import { toaster } from "../../../../../components/ui/toaster";
import axiosInstance from "../../../../../utils/api";
import { formatDate } from "../../../../../utils/simpleUtils";
import { LuExternalLink } from "react-icons/lu";

function ReviewCampaignDetail({ user_code }) {

    const [reviewCampaignApplicationList, setReviewCampaignApplicationList] = useState([]);

    const getReviewCampaignApplicationList = async () => {
        try {
            const res = await axiosInstance.get(`/admin/member/user/reviewCampaignList/${user_code}`);
            setReviewCampaignApplicationList(res.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '캠페인 리스트 불러오는데 에러가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        getReviewCampaignApplicationList();
    }, [user_code]);

    const applicationStatus = (status) => {
        switch (status) {
            case 'APPLIED': return { label: '신청', color: 'blue' };
            case 'SELECTED': return { label: '선정', color: 'green' };
            case 'SUBMITTED': return { label: '작성완료', color: 'green' };
            case 'RETURNED': return { label: '수정중', color: 'yellow' };
            case 'COMPLETED': return { label: '완료', color: 'green' };
            case 'CANCELLED': return { label: '신청취소', color: 'red' };
            case 'REJECTED': return { label: '선정 거절', color: 'red' };
            default: return { label: '알 수 없음', color: 'red' };
        }
    }

    const CampaignDetailDialog = ({ reviewCampaignApplication }) => {

        const { label, color } = applicationStatus(reviewCampaignApplication.status);
        const [applicationChannelList, setApplicationChannelList] = useState([]);
        const [applicationAddress, setApplicationAddress] = useState();

        const getApplicationChannelList = async () => {
            try {
                const res = await axiosInstance.get(`/admin/member/user/reviewCampaignApplicationChannelList/${reviewCampaignApplication.campaign_application_code}`);
                setApplicationChannelList(res.data);
            } catch (e) {
                console.error(e);
                toaster.create({ title: '캠페인 채널 불러오는데 에러가 발생했습니다.', type: 'error' });
            }
        }

        const getApplicationAddress = async () => {
            try {
                const res = await axiosInstance.get(`/admin/member/user/address/${reviewCampaignApplication.address_code}`);
                setApplicationAddress(res.data);
            } catch (e) {
                console.error(e);
                toaster.create({ title: '주소 불러오는데 에러가 발생했습니다.', type: 'error' });
            }
        }

        useEffect(() => {
            getApplicationChannelList();
            getApplicationAddress();
        }, [reviewCampaignApplication.campaign_application_code]);


        return (
            <Dialog.Root>
                <Dialog.Trigger asChild><Button size="xs">자세히 보기</Button></Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>체험단 신청 내역</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack gap="4">
                                <HStack alignItems="start" textAlign="left">
                                    <Badge colorPalette={color}>{label}</Badge>
                                    <Link href={`/admin/review/campaign/detail/${reviewCampaignApplication.campaign_code}`} target="_blank">
                                        <Heading size="md">
                                            <HStack>
                                                {reviewCampaignApplication.campaign_title}
                                                <LuExternalLink />
                                            </HStack>
                                        </Heading>
                                    </Link>
                                </HStack>
                                <Stack>
                                    {applicationChannelList.map((channel) => (
                                        <Link href={channel.channel_url} target="_blank" display="inline-flex" key={channel.user_review_channel_code}>
                                            <Stack direction="row" border="1px solid" borderColor="gray.200" alignItems="center" px="4" py="2" gap="4" rounded="md" w="full" >
                                                {channel.meta_image && (<Image src={channel.meta_image} w="16" rounded="md" />)}
                                                <Stack gap="0" textAlign="left">
                                                    <Text fontSize="sm" fontWeight="bold">{channel.meta_title}</Text>
                                                    <Text fontSize="xs" color="gray.500">{channel.meta_description}</Text>
                                                </Stack>
                                            </Stack>
                                        </Link>
                                    ))}
                                </Stack>
                                {applicationAddress && (
                                    <Stack gap="3" textAlign="left" p="3" borderWidth="1px" rounded="md">
                                        <Text fontSize="sm" fontWeight="bold">배송지</Text>
                                        <Stack gap="1">
                                            <Text fontsize="sm">{applicationAddress.name}</Text>
                                            <Text fontsize="sm">{applicationAddress.phone}</Text>
                                            <Text fontsize="sm" color="gray.500">[{applicationAddress.postcode}] {applicationAddress.address} {applicationAddress.detailAddress}</Text>
                                        </Stack>
                                    </Stack>
                                )}
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton />
                            </Dialog.CloseTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        )
    }

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader textAlign="center">체험단 이름</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">체험단 신청일시</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">상태</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">상세확인</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {reviewCampaignApplicationList.length === 0 ? (
                    <Table.Row>
                        <Table.Cell colSpan="4" textAlign="center">
                            <Stack alignItems="center" py="10">
                                <Icon color="fg.muted" fontSize="7xl"><PiSmileySad /></Icon>
                                <Text>신청한 체험단이 없습니다.</Text>
                            </Stack>
                        </Table.Cell>
                    </Table.Row>
                ) : (
                    reviewCampaignApplicationList.map((reviewCampaignApplication) => {
                        const { label, color } = applicationStatus(reviewCampaignApplication.status);
                        return (
                            <Table.Row key={reviewCampaignApplication.campaign_application_code}>
                                <Table.Cell textAlign="center">
                                    <Link href={`/review/detail/${reviewCampaignApplication.campaign_code}`} target="_blank" color="fg.info">
                                        {reviewCampaignApplication.campaign_title}
                                        <Icon size="xs"><LuExternalLink /></Icon>
                                    </Link>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{formatDate(reviewCampaignApplication.applied_at)}</Table.Cell>
                                <Table.Cell textAlign="center"><Badge colorPalette={color}>{label}</Badge></Table.Cell>
                                <Table.Cell textAlign="center">
                                    <CampaignDetailDialog reviewCampaignApplication={reviewCampaignApplication} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })
                )}
            </Table.Body>
        </Table.Root>
    );
}

export default ReviewCampaignDetail;