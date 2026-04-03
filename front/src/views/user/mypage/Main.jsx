import { Alert, Box, Button, Heading, HStack, Image, Link, Stack, StackSeparator, Status, Text } from "@chakra-ui/react";
import { formatNumber } from "../../../utils/simpleUtils";
import { LuChevronRight } from "react-icons/lu";

function Main() {
    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Alert.Root status="error" alignItems="center">
                <Alert.Indicator />
                <Alert.Content gap="1">
                    <Alert.Title fontSize="md">와바미 뷰티 리뷰 캠페인 미작성</Alert.Title>
                    <Alert.Description fontSize="xs">3월 31일까지 작성 예정인 리뷰가 아직 미작성 상태입니다.</Alert.Description>
                </Alert.Content>
                <Link href="#">리뷰 작성하기</Link>
            </Alert.Root>
            <Link display="flex" justifyContent="space-between" p="5" bg="blue.solid" w="full" color="#fff" rounded="md">
                <HStack>
                    <Text fontSize="xs">포인트</Text>
                    <Text fontSize="lg">{formatNumber(10000)}</Text>
                    <Text fontSize="xs">p</Text>
                </HStack>
                <LuChevronRight size="20" />
            </Link>
            <Stack w="full" gap="0">
                <Heading fontSize="sm" textAlign="left">진행중인 리뷰 캠페인(2)</Heading>
                <Stack direction="row" w="full" justifyContent="space-between" alignItems="end">
                    <Stack direction="row" gap="6">
                        <Box w="100px" h="100px" bg="gray.200" rounded="md"></Box>
                        <Stack textAlign="left" fontSize="sm">
                            <Status.Root colorPalette="blue">
                                <Status.Indicator /> 캠페인 신청
                            </Status.Root>
                            <HStack>
                                <Image src={`/public/resources/img/logo/naver.svg`} w="5" rounded="md" />
                                <Text>캠페인 제목</Text>
                            </HStack>
                            <Text color="fg.muted">와바미 파데 1개 제공 · 21호</Text>
                        </Stack>
                    </Stack>
                    <Button size="xs" variant="outline">자세히 보기</Button>
                </Stack>
            </Stack>
            <Stack w="full" gap="0">
                <Heading fontSize="sm" textAlign="left">구매한 상품(2)</Heading>
                <Stack direction="row" w="full" justifyContent="space-between" alignItems="end">
                    <Stack direction="row" gap="6">
                        <Box w="100px" h="100px" bg="gray.200" rounded="md"></Box>
                        <Stack textAlign="left" fontSize="sm">
                            <Status.Root colorPalette="blue">
                                <Status.Indicator /> 결제 완료
                            </Status.Root>
                            <Text>상품 제목</Text>
                            <Text color="fg.muted">옵션 : 21호</Text>
                        </Stack>
                    </Stack>
                    <Button size="xs" variant="outline">자세히 보기</Button>
                </Stack>
            </Stack>
            <Stack separator={<StackSeparator />}>
                <Link href="#" display="flex" justifyContent="space-between" w="full">
                    <Stack>
                        <Text fontSize="sm">상품 주문 내역</Text>
                    </Stack>
                    <LuChevronRight size="18" />
                </Link>
                <Link href="#" display="flex" justifyContent="space-between" w="full">
                    <Stack>
                        <Text fontSize="sm">취소/반품/교환 내역</Text>
                    </Stack>
                    <LuChevronRight size="18" />
                </Link>
                <Link href="#" display="flex" justifyContent="space-between" w="full">
                    <Stack>
                        <Text fontSize="sm">최근 본 상품</Text>
                    </Stack>
                    <LuChevronRight size="18" />
                </Link>
                <Link href="#" display="flex" justifyContent="space-between" w="full">
                    <Stack>
                        <Text fontSize="sm">리뷰 캠페인 리스트</Text>
                    </Stack>
                    <LuChevronRight size="18" />
                </Link>
            </Stack>
        </Stack>
    )
}

export default Main;