import { Flex, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";

function Footer() {

    const footerLineStyle = {px:{base:'15px', md:'layoutX'}, borderTop:'1px solid #e5e5e5', width:'full'};
    return (
        <Stack>
            <Flex p="40px 0" {...footerLineStyle} justifyContent="space-between" direction={{base:'column', md:'row'}} gap="6">
                <Stack gap="4">
                    <Image src="/resources/img/logo/logo.svg" alt="logo" width="100px" />
                    <Stack fontSize="sm" gap="0">
                        <Stack direction={{base:'column', md:'row'}} gap={{base:'0', md:"2"}}>
                            <Text>에이민</Text>
                            <Text>대표이사 : 이한희</Text>
                            <Text>사업자 등록번호 : 507-06-50814</Text>
                        </Stack>
                        <Text>주소 : 인천광역시 계양구 오조산로 57번길 15, 명동빌딩 721호</Text>
                        <Stack direction={{base:'column', md:'row'}} gap={{base:'0', md:"2"}}>
                            <Text>개인정보 책임관리자 : 민정기</Text>
                            <Text>통신판매업번호 : 2019-인천계양-0667</Text>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack>
                    <Heading fontSize="2xl">070-5147-1560</Heading>
                    <Stack fontSize="sm" gap="0">
                        <Text>평일 10:00 - 18:00(주말, 공휴일 휴무)</Text>
                        <Text>MAIL : ameanbiz@naver.com</Text>
                    </Stack>
                </Stack>
            </Flex>
            <HStack padding="20px 0" {...footerLineStyle} gap="4" justifyContent={{base:'space-between', md:"start"}}>
                <Link href="/"><Text fontSize={{base:'xs', xs:"sm"}}>회사소개</Text></Link>
                <Link href="/"><Text fontSize={{base:'xs', xs:"sm"}}>이용약관</Text></Link>
                <Link href="/"><Text fontSize={{base:'xs', xs:"sm"}}>개인정보처리방침</Text></Link>
                <Link href="/"><Text fontSize={{base:'xs', xs:"sm"}}>운영정책</Text></Link>
                <Link href="/"><Text fontSize={{base:'xs', xs:"sm"}}>이용가이드</Text></Link>
            </HStack>
        </Stack>
    )
}

export default Footer;