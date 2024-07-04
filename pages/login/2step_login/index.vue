<template>
  <div>
    <p v-if="Status !== null" :style="{ color: resultMessageColor() }">
      {{ resultMessage }}
    </p>
    <form v-if="preloginStatus === false" @submit.prevent="login">
      <input v-model="email" name="email" type="email" placeholder="email" />
      <input
        v-model="password"
        name="password"
        type="password"
        placeholder="password"
      />
      <button type="submit">Login</button>
    </form>
    <form
      v-if="preloginStatus === true"
      @submit.prevent="second_authentication"
    >
      <input
        v-model="onetime_password"
        name="onetime_password"
        type="onetime_password"
        placeholder="onetime_password"
      />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const email = ref("");
const password = ref("");
const onetime_password = ref("");
const Status = ref(null);
const preloginStatus = ref(false);
const resultMessage = ref(null);

const resultMessageColor = () => {
  switch (Status.value) {
    case "success":
      return "green";
    case "failure":
      return "red";
    default:
      return "";
  }
};

const login = async () => {
  try {
    const payload = {
      email: email.value,
      password: password.value,
    };
    const response = await $fetch("/rcms-api/1/2steplogin/email", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: payload,
    });
    Status.value = "success";
    if (response.status === 3) {
      preloginStatus.value = true;
      resultMessage.value = response.messages;
    }
    if (response.status === 0) {
      resultMessage.value =
        "Login succeeded. Please register the second factor authentication information.";
    }
  } catch (error) {
    Status.value = "failure";
    resultMessage.value = error.response._data.errors[0].message;
  }
};

const second_authentication = async () => {
  try {
    const payload = {
      email: email.value,
      onetime_password: onetime_password.value,
    };
    const response = await $fetch("/rcms-api/1/2steplogin/email", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: payload,
    });
    Status.value = "success";
    if (response.status === 3) {
      preloginStatus.value = true;
      resultMessage.value = response.messages;
    }
    if (response.status === 0) {
      resultMessage.value = "Login succeeded.";
    }
  } catch (error) {
    preloginStatus.value = false;
    Status.value = "failure";
    resultMessage.value = error.response._data.errors[0].message;
  }
};
</script>
