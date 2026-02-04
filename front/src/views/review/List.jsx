import { Box, Flex, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getDDay } from "../../utils/simpleUtils";

function List() {

    const { id } = useParams();
    const menuStyle = { rounded: 'none', p: "8px 20px", fontSize: 'sm', _hover: { fontWeight: 'medium' } };
    const menuActiveStyle = { borderBottomWidth: '2px', borderColor: 'main', fontWeight: 'medium' };
    const menuList = [
        { id: 'all', label: '전체' },
        { id: 'beauty', label: '뷰티' },
        { id: 'food', label: '식품' },
        { id: 'home', label: '생활용품' },
        { id: 'baby', label: '육아' },
        { id: 'car', label: '차량·캠핑' },
        { id: 'pet', label: '반려동물' },
        { id: 'it', label: 'IT·가전제품' },
        { id: 'etc', label: '기타' }
    ];

    const campaignList = [
        { id: 1, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 2, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 3, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 4, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 5, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 6, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 7, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
        { id: 8, title: '제품명 1', channel: ['naver'], brand: '와바미', offer: '티모시 사료 1kg 1개', endDate: '2026-02-28', targetCount: 10 },
    ];

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} gap="6">
            <Heading>제품 캠페인</Heading>
            <Stack direction="row" borderBottomWidth="1px">
                <HStack gap="2">
                    {menuList.map((menu) => (
                        <Link href={`/review/list/${menu.id}`} key={menu.id} {...menuStyle} {...(menu.id === id ? menuActiveStyle : {})}>{menu.label}</Link>
                    ))}
                </HStack>
            </Stack>

            <Flex gap="30px 0" flexWrap="wrap">
                {campaignList.map((campaign) => (
                    <Box key={campaign.id} w="1/6">
                        <Stack gap="2" p="0 10px">
                            <Link href={`/review/d/${campaign.id}`}>
                                <Box bg="bg.emphasized" aspectRatio="square" rounded="md" w="full"></Box>
                            </Link>
                            <HStack>
                                <HStack>
                                    {campaign.channel.map((channel, index) => {
                                        if (channel === 'naver') return (<Image key={index} src="../../../public/resources/img/logo/naver.svg" w="5" rounded="md" />)
                                    })}
                                </HStack>
                                <Text>D-{getDDay(campaign.endDate)}</Text>
                            </HStack>
                            <Text>&#91;{campaign.brand}&#93; {campaign.title}</Text>
                            <Text fontSize="xs" color="fg.muted">{campaign.offer}</Text>
                            <Text fontSize="xs">신청 10명&#47;{campaign.targetCount}명</Text>
                        </Stack>
                    </Box>
                ))}
            </Flex>
        </Stack>
    )
}

export default List;