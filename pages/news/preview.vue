<template>
  <ClientOnly>
    <div v-if="response">
      <h1>{{ response.details.subject }}</h1>
      <div v-html="response.details.contents"></div>
    </div>
  </ClientOnly>
</template>

<script setup>
const config = useRuntimeConfig();

const route = useRoute();
const preview_token = route.query.preview_token;

const { data: response } = await useFetch(
  `${config.public.apiBase}/rcms-api/1/preview`,
  {
    credentials: "include",
    params: {
      preview_token,
    },
    server: false,
  }
);
</script>
