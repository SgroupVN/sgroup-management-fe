module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue',
    ],
    corePlugins: {
        preflight: false,
    },
    plugins: [],
    theme: {
        extends: {
            borderRadius: {
                '40': '40px',
            },
        },
    },
};
