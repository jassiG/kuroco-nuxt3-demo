<template>
  <div v-if="response">
    <h1>
      {{ response.details.subject }}
    </h1>
    <div v-html="response.details.contents"></div>
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const lang = ref(useI18n().locale.value);

const { data: response } = await useFetch(
  `${config.public.apiBase}/rcms-api/1/newsdetail/${route.params.id}?_lang=${lang.value}`,
  {
    credentials: "include",
  }
);
</script>
