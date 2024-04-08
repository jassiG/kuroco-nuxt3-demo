<template>
  <div>
    <h1 class="title text-lg font-semibold text-gray-800">
      {{ response.details.subject }}
    </h1>
    <div class="post" v-html="response.details.contents"></div>
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const { data: response } = await useFetch(
  `${config.public.apiBase}/rcms-api/1/newsdetail/${route.params.id}`,
  {
    credentials: "include",
  }
);
</script>
