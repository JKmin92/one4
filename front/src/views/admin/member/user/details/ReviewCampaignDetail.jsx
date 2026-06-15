import { Button, Icon, Link, Stack, Table, Text } from "@chakra-ui/react";
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
            case 'APPLIED': return '신청완료';
            case 'SELECTED': return '선정';
            case 'SUBMITTED': return '작성완료';
            case 'RETURNED': return '수정중';
            case 'COMPLETED': return '완료';
            case 'CANCELLED': return '신청취소';
            case 'REJECTED': return '선정 거절';
            default: return '알 수 없음';
        }
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
                        return (
                            <Table.Row key={reviewCampaignApplication.campaign_application_code}>
                                <Table.Cell textAlign="center">
                                    <Link href={`/review/detail/${reviewCampaignApplication.campaign_code}`} target="_blank" color="fg.info">
                                        {reviewCampaignApplication.campaign_title}
                                        <Icon size="xs"><LuExternalLink /></Icon>
                                    </Link>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{formatDate(reviewCampaignApplication.applied_at)}</Table.Cell>
                                <Table.Cell textAlign="center">{applicationStatus(reviewCampaignApplication.status)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button>자세히 보기</Button>
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