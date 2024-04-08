// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    // Public keys that are exposed to the client
    public: {
      apiBase: "https://hasebetest.g.kuroco.app",
    },
  },
});
