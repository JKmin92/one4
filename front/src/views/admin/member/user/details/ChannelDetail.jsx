import { Icon, Image, Link, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toaster } from "../../../../../components/ui/toaster";
import axiosInstance from "../../../../../utils/api";
import { formatDate } from "../../../../../utils/simpleUtils";
import { LuExternalLink } from "react-icons/lu";
import { PiSmileySad } from "react-icons/pi";

function ChannelDetail({ user_code }) {
    const [channelList, setChannelList] = useState([]);

    useEffect(() => {
        const getUserChannelList = async () => {
            try {
                const res = await axiosInstance.get(`/admin/member/user/reviewChannelList/${user_code}`);
                setChannelList(res.data);
            } catch (e) {
                console.error(e);
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
            }
        }
        getUserChannelList();
    }, [user_code]);

    const channels = [
        { label: "네이버 블로그", value: "https://blog.naver.com/", icon: "naver.svg" },
        { label: "유튜브", value: "https://www.youtube.com/", icon: "youtube.svg" },
        { label: "인스타그램", value: "https://www.instagram.com/", icon: "instagram.svg" },
    ];

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader textAlign="center">채널</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">채널주소</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">승인여부</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">등록일</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {channelList.length === 0 ? (
                    <Table.Row>
                        <Table.Cell colSpan="4">
                            <Stack alignItems="center" py="10">
                                <Icon color="fg.muted" fontSize="7xl"><PiSmileySad /></Icon>
                                <Text>등록된 채널이 없습니다.</Text>
                            </Stack>
                        </Table.Cell>
                    </Table.Row>
                ) : channelList.map((channel) => {
                    const matchChannel = channels.find(c => channel.channel_url.includes(c.value));
                    return (
                        <Table.Row key={channel.channel_code}>
                            <Table.Cell textAlign="center"><Image src={`/resources/img/logo/${matchChannel.icon}`} m="auto" w="5" h="5" rounded="md" /></Table.Cell>
                            <Table.Cell textAlign="center">
                                <Link href={channel.channel_url} target="_blank" color="fg.info">
                                    {channel.channel_url}
                                    <Icon size="xs"><LuExternalLink /></Icon>
                                </Link>
                            </Table.Cell>
                            <Table.Cell textAlign="center">{channel.certifed}</Table.Cell>
                            <Table.Cell textAlign="center">{formatDate(channel.created_at)}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    )
}

export default ChannelDetail;
