<template>
  <div>
    <h1>Unsubscribe to Magazine</h1>
    <div>Email: {{ $route.query.email }}</div>
    <p v-if="resultMessage !== null">
      {{ resultMessage }}
    </p>
  </div>
</template>
<script setup>
const config = useRuntimeConfig();
const route = useRoute();
const resultMessage = ref(null);

function validate({ query }) {
  console.log(query);
  return /[!-~]{32}/.test(query.key);
}

onMounted(() => {
  if (validate(route)) {
    unsubscribeSubmit();
  } else {
    resultMessage.value = "Invalid Unsubscribe key";
  }
});

async function unsubscribeSubmit() {
  try {
    const payload = {
      email: route.query.email,
      key: route.query.key,
    };
    const response = await $fetch(
      `/rcms-api/1/magazine_unsubscribe_with_key/1`,
      {
        method: "POST",
        baseURL: config.public.apiBase,
        credentials: "include",
        body: payload,
      }
    );
    resultMessage.value = response.messages[0];
  } catch (error) {
    resultMessage.value = error.response._data.errors[0].message;
  }
}
</script>
