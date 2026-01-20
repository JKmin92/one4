import { Avatar, CloseButton, Flex, HStack, Icon, Image, Input, InputGroup, Link, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuAlignJustify, LuBell, LuSearch, LuUserRound } from "react-icons/lu";

function Header() {

    const [keyword, setKeyword] = useState('');
    const headerLineStyle = {padding:'15px', px:'layoutX', width:'100%', borderBottom:'1px solid #e5e5e5'};

    const keywordClearElement = keyword ? (
        <CloseButton size="xs" onClick={() => setKeyword('')} rounded="full"/>
    ) : null;

    const onSearchSubmit = (e) => {
        e.preventDefault();
        console.log(keyword);
    }

    return (
        <Stack gap="0">
            <Flex {...headerLineStyle} justifyContent="space-between">
                <HStack gap="20">
                    <Link href="/"><Image src="/resources/img/logo/logo.svg" alt="logo" width="100px" /></Link>
                    <HStack gap="12">
                        <Link href="/"><Text fontSize="lg" fontWeight="medium">REVIEW</Text></Link>
                        <Link href="/"><Text fontSize="lg" fontWeight="medium" color="main">SHOPPING</Text></Link>
                    </HStack>
                </HStack>
                <HStack gap="6">
                    <form onSubmit={onSearchSubmit}>
                        <InputGroup startElement={<Icon size="md"><LuSearch /></Icon>} endElement={keywordClearElement}>
                            <Input rounded="full" value={keyword} onChange={(e) => setKeyword(e.currentTarget.value)} />
                        </InputGroup>
                    </form>
                    
                    
                    <Icon size="md"><LuBell /></Icon>
                    <Avatar.Root>
                        <LuUserRound />
                    </Avatar.Root>
                </HStack>
            </Flex>
            <HStack gap="16" {...headerLineStyle}>
                <Icon size="lg"><LuAlignJustify /></Icon>
                <HStack gap="12">
                    <Link href="/categorys/12345"><Text fontSize="md" fontWeight="medium">카테고리 1</Text></Link>
                    <Link href="/"><Text fontSize="md" fontWeight="medium">카테고리 2</Text></Link>
                    <Link href="/"><Text fontSize="md" fontWeight="medium">카테고리 3</Text></Link>
                    <Link href="/"><Text fontSize="md" fontWeight="medium">카테고리 4</Text></Link>
                </HStack>
            </HStack>
        </Stack>
    )
}

export default Header;