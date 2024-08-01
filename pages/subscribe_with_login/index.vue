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
      credentials: "include",
      baseURL: config.public.apiBase,
      body: payload,
    });
    currentUser.value = {
      member_id: response.member_id,
    };
    resultMessage.value = "Successful login";
  } catch (error) {
    resultMessage.value = error.response._data.errors[0].message;
  }
};
//Subscribe
const subscribeSubmit = async () => {
  try {
    const profile = await $fetch("/rcms-api/1/profile", {
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    if (!profile.member_id) {
      resultMessage.value = "Please Login";
      password.value = "";
    } else {
      const payload = {
        member_id: profile.member_id,
      };
      // post data
      const response = await $fetch(`/rcms-api/1/magazine_subscribe/1`, {
        method: "POST",
        baseURL: config.public.apiBase,
        credentials: "include",
        body: payload,
      });
      resultMessage.value = response.messages[0];
    }
  } catch (error) {
    resultMessage.value = error.response._data.errors[0].message;
  }
};
//Unsubscribe
const unsubscribeSubmit = async () => {
  try {
    const profile = await $fetch("/rcms-api/1/profile", {
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    if (!profile.member_id) {
      resultMessage.value = "Please Login";
    } else {
      const payload = {
        member_id: profile.member_id,
      };
      // post data
      const response = await $fetch(`/rcms-api/1/magazine_unsubscribe/1`, {
        method: "POST",
        baseURL: config.public.apiBase,
        credentials: "include",
        body: payload,
      });
      resultMessage.value = response.messages[0];
    }
  } catch (error) {
    resultMessage.value = error.response._data.errors[0].message;
  }
};
</script>
