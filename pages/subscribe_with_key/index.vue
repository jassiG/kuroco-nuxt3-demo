<template>
  <div>
    <form>
      <h1>Subscribe to Magazine</h1>
      <p v-if="resultMessage !== null">
        {{ resultMessage }}
      </p>
      <input
        v-model="emailEntered"
        name="email"
        type="email"
        placeholder="email"
      />
      <button v-on:click.prevent="subscribeSubmit">Subscribe</button>
    </form>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const emailEntered = ref("");
const resultMessage = ref(null);

//Subscribe
const subscribeSubmit = async () => {
  try {
    const payload = {
      email: emailEntered.value,
    };
    // post data
    const response = await $fetch(`/rcms-api/1/magazine_subscribe_with_key/1`, {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: payload,
    });
    resultMessage.value = response.messages[0];
  } catch (error) {
    resultMessage.value = error.response._data.errors[0].message;
  }
};
</script>
