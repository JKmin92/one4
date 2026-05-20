import { Box, Button, Collapsible, Image, Link, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SideMenu() {

    const hoverLinkStyle = { _hover: { bg: 'gray.subtle', color: 'fg' } };
    const linkStyle = { paddingInline: '3', paddingBlock: '1.5', rounded: 'md', fontSize: 'sm', color: 'fg.muted', lineHeight: '1.25rem', ...hoverLinkStyle };
    const linkActiveStyle = { bg: 'teal.subtle', color: 'teal.fg', _hover: { bg: 'teal.subtle', color: 'teal.fg' } };
    const location = useLocation();
    const pathname = location.pathname;

    const shopCategory = [
        {
            path: 'product', label: '상품',
            children: [
                { path: ['list'], label: '상품 리스트' },
                { path: ['register', 'update'], label: '상품 등록' },
                { path: ['category'], label: '카테고리' },
            ]
        }, {
            path: 'order', label: '주문',
            children: [
                { path: ['total'], label: '주문 리스트' },
                { path: ['unpaid'], label: '입금전 관리' },
                { path: ['paid'], label: '결제 완료 리스트' },
                { path: ['delivery_ready_list'], label: '배송 준비중 리스트' },
                { path: ['delivery_list'], label: '배송중 리스트' },
                { path: ['delivered_list'], label: '배송 완료 리스트' },
                { path: ['complete_list'], label: '구매 확정 리스트' },
            ]
        }, {
            path: 'complain', label: '취소/교환/반품/환불',
            children: [
                { path: ['auto_cancel_list'], label: '입금전 취소 리스트' },
                { path: ['cancel_list'], label: '취소 리스트' },
                { path: ['change_list'], label: '교환 리스트' },
                { path: ['return_list'], label: '반품 리스트' },
                { path: ['refund_list'], label: '환불 리스트' },
            ]
        }, {
            path: 'promotion', label: '프로모션',
            children: [
                { path: ['list'], label: '프로모션 리스트' },
                { path: ['register', 'update'], label: '프로모션 추가' },
            ]
        }, {
            path: 'board', label: '게시판',
            children: [
                { path: ['list/review', 'review'], label: '리뷰' },
                { path: ['list/product_qna', 'product_qna'], label: '상품 문의' },
                { path: ['list/inquiry'], label: '1:1 문의' },
                { path: ['list/notice'], label: '공지사항' },
                { path: ['list/faq'], label: 'FAQ' },
            ]
        }
    ];

    const reviewCategory = [
        {
            path: 'campaign', label: '리뷰 캠페인',
            children: [
                { path: ['list'], label: '캠페인 리스트' },
                { path: ['register', 'update'], label: '캠페인 등록' },
            ]
        },
    ];

    const [opens, setOpens] = useState([]);

    useEffect(() => {

        if (pathname.includes('/admin/shop')) {
            setOpens(shopCategory.map(c => pathname.includes(`/${c.path}`)))
        } else if (pathname.includes('/admin/review')) {
            setOpens(reviewCategory.map(c => pathname.includes(`/${c.path}`)))
        }
    }, [pathname]);

    return (
        <Box bg="bg" position="fixed" top="0" bottom="0" zIndex="20" width="18rem" borderInlineEndWidth="1px">
            <Stack h="full" overflowY="auto" p="4" pb="10" gap="12">
                <Image src="/public/resources/img/logo/logo.svg" w="32" />
                <Stack gap="2">
                    {pathname.includes('/admin/shop') ? shopCategory.map((category, index) => (
                        <Collapsible.Root key={index} open={opens[index]} onOpenChange={(e) => setOpens(prev => prev.map((value, i) => i === index ? e.open : value))}>
                            <Collapsible.Trigger w="full" asChild>
                                <Button w='full' justifyContent="start" marginBottom="5px">{category.label}</Button>
                            </Collapsible.Trigger>
                            <Collapsible.Content>
                                <Stack>
                                    {category.children.map((children, i) => {
                                        const paths = Array.isArray(children.path) ? children.path : [children.path];
                                        const isActive = paths.some(p => pathname.includes(`${category.path}/${p}`));
                                        return (
                                            <Link
                                                key={i}
                                                href={`/admin/shop/${category.path}/${paths[0]}`}
                                                {...linkStyle}
                                                {...(isActive ? linkActiveStyle : null)}
                                            >
                                                {children.label}
                                            </Link>
                                        );
                                    })}
                                </Stack>
                            </Collapsible.Content>
                        </Collapsible.Root>
                    )) : pathname.includes('/admin/review') ? reviewCategory.map((category, index) => (
                        <Collapsible.Root key={index} open={opens[index]} onOpenChange={(e) => setOpens(prev => prev.map((value, i) => i === index ? e.open : value))}>
                            <Collapsible.Trigger w="full" asChild>
                                <Button w='full' justifyContent="start" marginBottom="5px">{category.label}</Button>
                            </Collapsible.Trigger>
                            <Collapsible.Content>
                                <Stack>
                                    {category.children.map((children, i) => {
                                        const paths = Array.isArray(children.path) ? children.path : [children.path];
                                        const isActive = paths.some(p => pathname.includes(`${category.path}/${p}`));
                                        return (
                                            <Link
                                                key={i}
                                                href={`/admin/review/${category.path}/${paths[0]}`}
                                                {...linkStyle}
                                                {...(isActive ? linkActiveStyle : null)}
                                            >
                                                {children.label}
                                            </Link>
                                        );
                                    })}
                                </Stack>
                            </Collapsible.Content>
                        </Collapsible.Root>
                    )) : null}
                </Stack>
            </Stack>
        </Box>
    )
}

export default SideMenu;