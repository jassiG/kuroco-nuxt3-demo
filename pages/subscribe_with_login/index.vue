<template>
  <div>
    <h1>Subscribe to Magazine</h1>
    <p v-if="resultMessage !== null">
      {{ resultMessage }}
    </p>
    <form @submit.prevent="login">
      <input v-model="email" name="email" type="email" placeholder="email" />
      <input
        v-model="password"
        name="password"
        type="password"
        placeholder="password"
      />
      <button type="submit">Login</button>
    </form>
    <button v-on:click.prevent="subscribeSubmit">Subscribe</button>
    <button v-on:click.prevent="unsubscribeSubmit">Unsubscribe</button>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const email = ref("");
const password = ref("");
const resultMessage = ref(null);
const currentUser = ref({});

//Login
const login = async () => {
  try {
    const payload = {
      email: email.value,
      password: password.value,
    };
    const response = await $fetch("/rcms-api/1/login", {
      method: "POST",
      baseURL: config.public.apiBase,
      body: payload,
    });
    console.log(response, "in login");
    currentUser.value = {
      member_id: response.member_id,
    };
    resultMessage.value = "Successful login";
  } catch (error) {
    console.log(error.response._data, "in login");
    resultMessage.value = error.response._data.errors[0].message;
  }
};
//Subscribe
const subscribeSubmit = async () => {
  try {
    const payload = {
      member_id: currentUser.value.member_id,
    };
    // post data
    const response = await $fetch(`/rcms-api/1/magazine_subscribe/1`, {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: payload,
    });
    resultMessage.value = response.messages[0];
  } catch (error) {
    console.log(error.response._data, "in subscribeSubmit");
    resultMessage.value = error.response._data.errors[0].message;
  }
};
//Unsubscribe
const unsubscribeSubmit = async () => {
  try {
    const payload = {
      member_id: currentUser.value.member_id,
    }
    // post data
    const response = await $fetch(`/rcms-api/1/magazine_unsubscribe/1`, {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: payload,
    });
    resultMessage.value = response.messages[0];
  } catch (error) {
    console.log(error.response._data, "in unsubscribeSubmit");
    resultMessage.value = error.response._data.errors[0].message;
  }
};
</script>
