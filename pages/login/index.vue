<template>
  <form @submit.prevent="login">
    <p v-if="loginStatus !== null" :style="{ color: resultMessageColor }">
      {{ resultMessage }}
    </p>

    <input v-model="email" name="email" type="email" placeholder="email" />
    <input
      v-model="password"
      name="password"
      type="password"
      placeholder="password"
    />
    <button type="submit">Login</button>
    <div>
      <nuxt-link to="/news"> News list page </nuxt-link>
      <br />
      <nuxt-link to="/news/test_with_comment"> Test with comment </nuxt-link>
    </div>
  </form>
</template>

<script setup>
const config = useRuntimeConfig();

const email = ref("");
const password = ref("");
const loginStatus = ref(null);
const resultMessage = ref(null);

let resultMessageColor = computed(() => {
  switch (loginStatus.value) {
    case "success":
      return "green";
    case "failure":
      return "red";
    default:
      return "";
  }
});

async function login() {
  try {
    await useFetch("/rcms-api/13/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        login_save: 1,
      }),
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    loginStatus.value = "success";
    resultMessage.value = "Login successful";
  } catch (e) {
    loginStatus.value = "failure";
    resultMessage.value = "Login failed";
  }
}
</script>
