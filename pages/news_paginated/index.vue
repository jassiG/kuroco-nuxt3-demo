<template>
  <div v-if="response">
    <h1>Paginated News list</h1>
    <div v-if="response" v-for="n in response.list" :key="n.topics_id">
      <nuxt-link :to="`/news/${n.topics_id}`">
        {{ n.ymd }} {{ n.subject }}
      </nuxt-link>
    </div>
    <Pagenator
      v-if="response"
      v-bind="{ ...response.pageInfo }"
      @page-update="updatePage"
    />
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const route = useRoute();
const currentPage = ref(route.query.page || 1);

const response = ref(null);
response.value = await fetchNews(route.query.page || 1);

async function updatePage(page) {
  currentPage.value = page;
  response.value = await fetchNews(currentPage.value);
}

async function fetchNews(page) {
  const res = await useFetch(`/rcms-api/1/news?_lang=ja&pageID=${page}`, {
    baseURL: config.public.apiBase,
    credentials: "include",
  }).then((res) => res.data.value);
  return res;
}
</script>
