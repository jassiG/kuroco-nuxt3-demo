<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800">News list</h1>
    <div v-for="n in response.list" :key="n.topics_id" class="my-4">
      <nuxt-link
        :to="`/news/${n.topics_id}`"
        class="bg-slate-500 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded"
      >
        {{ n.ymd }} {{ n.subject }}
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { data: response } = await useFetch("/rcms-api/1/news", {
  baseURL: config.public.apiBase,
  credentials: "include",
});
</script>
