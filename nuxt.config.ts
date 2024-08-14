// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  plugins: [
    '@/plugins/vue3-google-maps.client'
  ],
  modules: [
    [
      "@nuxtjs/i18n",
      {
        strategy: "prefix_and_default",
        // Define the language options
        locales: [
          { code: "ja", file: "ja.json" },
          { code: "en", file: "en.json" },
        ],
        // Set the default language
        defaultLocale: "ja",
        vueI18nLoader: true,
        lazy: true,
        // Specify the directory for the JSON file
        langDir: "locales/",
      },
    ],
  ],
  runtimeConfig: {
    // Public keys that are exposed to the client
    public: {
      apiBase: "https://hasebetest2.g.kuroco.app",
    },
  },
});