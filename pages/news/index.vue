<template>
  <div v-if="response">
    <LanguageSwitcher />
    <h1>News list</h1>
    <div v-for="n in response.list" :key="n.topics_id">
      <nuxt-link :to="localePath(`/news/${n.topics_id}`)">
        {{ n.ymd }} {{ n.subject }}
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const response = ref(null);
response.value = await fetchNews();
const lang = ref(useI18n().locale.value);

async function fetchNews() {
  const res = await useFetch(`/rcms-api/1/news?_lang=${lang.value}`, {
    baseURL: config.public.apiBase,
    credentials: "include",
  }).then((res) => res.data.value);
  return res;
}
</script>
