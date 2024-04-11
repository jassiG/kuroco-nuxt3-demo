<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800">Paginated News list</h1>
    <div v-if="response" v-for="n in response.list" :key="n.topics_id" class="my-4">
      <nuxt-link
        :to="`/news/${n.topics_id}`"
        class="bg-slate-500 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded"
      >
        {{ n.ymd }} {{ n.subject }}
      </nuxt-link>
    </div>
    <Pagenator v-if="response" v-bind="{ ...response.pageInfo }" @page-update="updatePage"/>
  </div>
</template>

<script setup>
import pagenator from '~/components/pagenator.vue';

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const page = ref(route.query.page || 1);

const { data: response } = await useFetch(`/rcms-api/1/news?pageID=${page.value}`, {
  baseURL: config.public.apiBase,
  credentials: "include",
});

async function updatePage(page) {
  // page.value = page;
  router.push({ query: { page } });
  page.value = page;
  // fetch new data
  response.value = await useFetch(`/rcms-api/1/news?pageID=${page.value}`, {
    baseURL: config.public.apiBase,
    credentials: "include",
  }).then(res => res.data.value);
}


</script>
