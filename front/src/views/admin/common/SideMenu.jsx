import { Box, Button, Collapsible, Image, Link, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SideMenu() {

    const hoverLinkStyle = {_hover:{bg:'gray.subtle', color:'fg'}};
    const linkStyle = {paddingInline:'3', paddingBlock:'1.5', rounded:'md', fontSize:'sm', color:'fg.muted', lineHeight:'1.25rem', ...hoverLinkStyle};
    const linkActiveStyle = {bg:'teal.subtle', color:'teal.fg', _hover:{bg:'teal.subtle', color:'teal.fg'}};
    const location = useLocation();
    const pathname = location.pathname;
    

    const shopCategory = [
        {
            path:'product', label:'상품',
            children: [
                {path:'list', label:'상품 리스트'},
                {path:'register', label:'상품 등록'},
                {path:'category', label:'카테고리'},
            ]
        }, {
            path:'order', label:'주문',
            children: [
                {path:'list',label:'주문 리스트'},
                {path:'payment_list',label:'입금전 관리'},
                {path:'ready_list',label:'상품 준비중 리스트'},
                {path:'delivery_ready_list',label:'배송 준비중 리스트'},
                {path:'delivery_list',label:'배송중 리스트'},
                {path:'complate_list',label:'배송 완료 리스트'},
                
            ]
        }, {
            path:'complain',label:'취소/교환/반품/환불',
            children: [
                {path:'auto_cancel_list',label:'입금전 취소 리스트'},
                {path:'cancel_list',label:'취소 리스트'},
                {path:'change_list',label:'교환 리스트'},
                {path:'return_list',label:'반품 리스트'},
                {path:'refund_list',label:'환불 리스트'},
            ]
        }, {
            path:'promotion', label:'프로모션',
            children : [
                {path:'list', label:'프로모션 리스트'},
                {path:'register', label:'프로모션 추가'},
            ]
        }
    ];

    const [opens, setOpens] = useState(shopCategory.map(c => pathname.includes(`/${c.path}`)));

    return (
        <Box bg="bg" position="fixed" top="0" bottom="0" zIndex="20" width="18rem" borderInlineEndWidth="1px">
            <Stack h="full" overflowY="auto" p="4" pb="10" gap="12">
                <Image src="/public/resources/img/logo/logo.svg" w="32" />
                <Stack gap="2">
                    {shopCategory.map((category, index) => (
                        <Collapsible.Root key={index} open={opens[index]} onOpenChange={(e) => setOpens(prev => prev.map((value,i ) => i === index ? e.open : value))}>
                            <Collapsible.Trigger w="full" asChild>
                                <Button w='full' justifyContent="start" marginBottom="5px">{category.label}</Button>
                            </Collapsible.Trigger>
                            <Collapsible.Content>
                                <Stack>
                                    {category.children.map((children, i) => (
                                        <Link 
                                            key={i} 
                                            href={`/admin/shop/${category.path}/${children.path}`} 
                                            {...linkStyle}
                                            {...(pathname.includes(`${category.path}/${children.path}`) ? linkActiveStyle : null)}
                                        >{children.label}</Link>
                                    ))}
                                </Stack>
                            </Collapsible.Content>
                        </Collapsible.Root>
                    ))}
                </Stack>
            </Stack>
        </Box>
    )
}

export default SideMenu;