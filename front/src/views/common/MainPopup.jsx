import React, { useState, useEffect } from 'react';
import { Box, Flex, HStack, Button, Image, Link, Text, Container } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function MainPopup({ popupList }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // 쿠키 확인: 'hide_main_popup=true'가 존재하지 않으면 팝업 오픈
        if (popupList && popupList.length > 0) {
            const hasCookie = document.cookie.includes('hide_main_popup=true');
            if (!hasCookie) {
                setIsOpen(true);
            }
        }
    }, [popupList]);

    if (!isOpen || !popupList || popupList.length === 0) return null;

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCloseToday = () => {
        // 자정까지 유효한 쿠키 설정
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        document.cookie = `hide_main_popup=true; expires=${tomorrow.toUTCString()}; path=/`;
        setIsOpen(false);
    };

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="blackAlpha.700"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={4}
        >
            <Container maxW="5xl" p={0} w="auto">
                {popupList.length === 1 ? (
                    // 팝업이 1개일 때
                    <Flex justify="center" w="100%">
                        <Box w={{ base: "100%", md: "400px" }} maxW="100%">
                            <PopupItem popup={popupList[0]} />
                        </Box>
                    </Flex>
                ) : (
                    // 팝업이 2개 이상일 때 Swiper 사용
                    <Box w="100%">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={20}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                768: { slidesPerView: Math.min(3, popupList.length) }
                            }}
                        >
                            {popupList.map((popup) => (
                                <SwiperSlide key={popup.popup_id}>
                                    <PopupItem popup={popup} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>
                )}

                {/* 하단 버튼 영역 */}
                <Flex justify="space-between" w="100%" mt={4} gap={4}>
                    <Button variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }} onClick={handleCloseToday}>
                        오늘 하루 보지 않기
                    </Button>
                    <Button variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }} onClick={handleClose}>
                        닫기
                    </Button>
                </Flex>
            </Container>
        </Box>
    );
}

// 개별 팝업 아이템 렌더링 컴포넌트
function PopupItem({ popup }) {
    const content = (
        <Box
            w="100%"
            aspectRatio="1 / 1"
            bg="gray.100"
            borderRadius="md"
            overflow="hidden"
            boxShadow="lg"
            position="relative"
        >
            <Image
                src={`http://localhost:5000${popup.image_url}`}
                alt={popup.title || 'Popup Image'}
                w="100%"
                h="100%"
                objectFit="cover"
            />
        </Box>
    );

    if (popup.link_url) {
        return (
            <Link
                href={popup.link_url}
                target={popup.is_new_tab ? '_blank' : '_self'}
                rel={popup.is_new_tab ? 'noopener noreferrer' : undefined}
                display="block"
                _hover={{ opacity: 0.9 }}
            >
                {content}
            </Link>
        );
    }

    return content;
}

export default MainPopup;