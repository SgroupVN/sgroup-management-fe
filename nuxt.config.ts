import { resolve } from 'path';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    devtools: { enabled: true },
    imports: {
        autoImport: true,
    },
    modules: [
        'nuxt-icon',
        '@vueuse/nuxt',
        [
            '@pinia/nuxt',
            {
                autoImports: [
                    // automatically imports `defineStore`
                    'defineStore', // import { defineStore } from 'pinia'
                    // automatically imports `defineStore` as `definePiniaStore`
                    ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
                ],
            },
        ],
        // [
        //     '@nuxtjs/sentry',
        //     {
        //         /*
        //          * Sentry module configuration
        //          */
        //     },
        // ],
    ],
    routeRules: {
        // Homepage pre-rendered at build time
        '/': { prerender: true },
        // Add cors headers on API routes
        '/api/**': { cors: true },
    },
    typescript: {
        strict: false,
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
            ENV: process.env.ENV,
        },
        private: {},
    },
    alias: {
        '@@': resolve(__dirname, 'pages'),
        '~~': resolve(__dirname, 'components'),
    },
    postcss: {
        plugins: {
            tailwindcss: {
                config: resolve(__dirname, 'tailwind.config.ts'),
            },
            autoprefixer: {},
        },
    },
    css: [
        'primevue/resources/themes/lara-light-blue/theme.css'
    ],
    build: {
        transpile: ['primevue'],
    },
});
