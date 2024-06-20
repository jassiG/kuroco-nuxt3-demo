<template>
  <div>
    <h1>News list</h1>
    <div v-for="n in response.list" :key="n.topics_id">
      <nuxt-link :to="`/news/${n.topics_id}`">
        {{ n.ymd }} {{ n.subject }}
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const response = ref({});
response.value = await fetchNews();

async function fetchNews() {
  const res = await useFetch(`/rcms-api/1/news?_lang=ja`, {
    baseURL: config.public.apiBase,
    credentials: "include",
  }).then((res) => res.data.value);
  return res;
}
</script>
