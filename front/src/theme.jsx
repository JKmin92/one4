import {createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
    ...defaultConfig,
    theme: {
        ...defaultConfig.theme,
        tokens : {
            ...defaultConfig.theme.tokens,
            colors:{
                ...defaultConfig.theme.tokens.colors,
                main: {
                    value:'#950101'
                }
            },
            spacing : {
                ...defaultConfig.theme.tokens.spacing,
                layoutX : {value:'60px'}
            }
        }
    }
    
});

export const system = createSystem(config);