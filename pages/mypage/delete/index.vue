<template>
  <div v-if="response" class="l-container--wrap">
    <div v-if="!deleteDone">
      Delete
      <span style="font-weight: bold"
        >{{ response.details.name1 }} {{ response.details.name2 }}</span
      >. Are you sure you want to proceed?
      <button @click="deleteProfile">Proceed</button>
      <div v-if="error">{{ error }}</div>
    </div>
    <div v-if="deleteDone">Profile deletion has been completed.</div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const config = useRuntimeConfig();

const response = ref(null);
const deleteDone = ref(false);
const error = ref(null);

const getData = async () => {
  try {
    response.value = await $fetch("/rcms-api/18/member/details", {
      baseURL: config.public.apiBase,
      credentials: "include",
    });
  } catch (e) {
    error.value = e.response._data.errors[0].message;
  }
};

const deleteProfile = async () => {
  try {
    await this.$axios.$post("/rcms-api/18/member/delete", {
      baseURL: config.public.apiBase,
      credentials: "include",
      body: {},
    });
    deleteDone.value = true;
  } catch (e) {
    error.value = e.response.data.errors[0].message;
  }
};

getData();
</script>
