import { resolve } from "path";
import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  imports: {
    autoImport: true,
  },
  app: {
    head: {
      title: "Sgroup Management",
      link: [
        {
          id: "theme-css",
          rel: "stylesheet",
          type: "text/css",
          href: "/themes/lara-light-indigo/theme.css",
        },
      ],
    },
  },
  modules: [
    "nuxt-icon",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // automatically imports `defineStore`
          "defineStore", // import { defineStore } from 'pinia'
          // automatically imports `defineStore` as `definePiniaStore`
          ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
        ],
      },
    ],
    "@nuxtjs/tailwindcss",
    // [
    //     '@nuxtjs/sentry',
    //     {
    //         /*
    //          * Sentry module configuration
    //          */
    //     },
    // ],
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      ENV: process.env.ENV,
    },
    private: {},
  },
  alias: {
    "@@": resolve(__dirname, "pages"),
    "~~": resolve(__dirname, "components"),
  },
  postcss: {
    plugins: {
      tailwindcss: {
        config: resolve(__dirname, "tailwind.config.ts"),
      },
      autoprefixer: {},
    },
  },
  css: [
    "primevue/resources/themes/lara-light-indigo/theme.css", //theme
    "primevue/resources/primevue.min.css", //core css
    "primeicons/primeicons.css", //icons
    "primeicons/primeicons.css",
    "primeflex/primeflex.scss",
    "assets/styles.scss",
  ],
  build: {
    transpile: ["primevue"],
  },
});
