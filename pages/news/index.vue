<template>
  <div v-if="response">
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

async function fetchNews() {
  const lang = useI18n().locale.value;
  const res = await useFetch(`/rcms-api/1/news?_lang=${lang}`, {
    baseURL: config.public.apiBase,
    credentials: "include",
  }).then((res) => res.data.value);
  return res;
}
</script>
