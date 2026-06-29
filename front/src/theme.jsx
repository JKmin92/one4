import {createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
    ...defaultConfig,
    theme: {
        ...defaultConfig.theme,
        breakpoints: {
            '2xs':'344px',
            xs:'430px',
            sm:'480px',
            md:'768px',
            lg:'1024px',
            xl:'1280px',
            '2xl':'1536px'
        },
        tokens : {
            ...defaultConfig.theme.tokens,
            fonts: {
                ...defaultConfig.theme.tokens?.fonts,
                heading: { value: `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif` },
                body: { value: `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif` },
            },
            colors:{
                ...defaultConfig.theme.tokens.colors,
                main: { value:'#950101' }
            },
            spacing : {
                ...defaultConfig.theme.tokens.spacing,
                layoutX : {value:'60px'}
            }
        }
    }
});

export const system = createSystem(config);