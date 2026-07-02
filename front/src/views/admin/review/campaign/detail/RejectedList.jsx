import { Badge, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";

const formatFollowerCount = (count) => {
    if (!count) return '';
    const num = Number(count);
    if (isNaN(num)) return count;

    if (num >= 100000000) {
        return parseFloat((num / 100000000).toFixed(1)) + '억';
    } else if (num >= 10000) {
        return parseFloat((num / 10000).toFixed(1)) + '만';
    } else {
        return num.toString();
    }
};

function RejectedList({ cancelledList, reviewCampaignChannelView }) {
    return (
        <Stack>
            <Text>총 {cancelledList.length}명의 데이터가 있습니다.</Text>
            {cancelledList.map((app, index) => {
                return (
                    <Stack key={index} direction="row" border="1px solid" borderColor="gray.subtle" rounded="md" p="4" alignItems="center" justifyContent="space-between">
                        {app.channels.map((channel, index) => {
                            const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                            return (
                                <Stack key={channelView.id} direction="row" alignItems="center" gap="6">
                                    <Image src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />
                                    {channel.meta_image && (
                                        <Image src={channel.meta_image} rounded="full" w="16" />
                                    )}
                                    <Stack gap="0">
                                        <Link href={channel.channel_url} target="_blank">
                                            <Heading size="md">{channel.meta_title}</Heading>
                                        </Link>
                                        <Text fontSize="sm" color="fg.muted">{channel.channel_url}</Text>
                                        <Text fontSize="sm" color="fg.muted">
                                            {channel.follower_count ? `팔로워 : ${formatFollowerCount(channel.follower_count)}` : '최근 일방문자 : 300'}
                                        </Text>
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
                    </Stack>
                )
            })}
        </Stack>
    )
}

export default RejectedList;