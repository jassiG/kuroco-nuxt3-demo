<template>
  <div v-if="!signupDone">
    <p v-if="error" :style="{ color: 'red' }">
      {{ error }}
    </p>
    <form @submit.prevent="signup">
      <div>
        <label>OTP</label>
        <input v-model="otp" name="otp" type="text" placeholder="otp" />
      </div>
      <button type="submit">Sign up</button>
    </form>
    <div>
      <button @click.prevent="sendOTP">Send authentication code</button>
      <p v-if="sentOTP">One Time Password has been sent.</p>
    </div>
  </div>
  <div v-else-if="signupDone">Registration has been completed.</div>
</template>

<script setup>
const config = useRuntimeConfig();
const route = useRoute();
const signupDone = ref(false);
const sentOTP = ref(false);
const otp = ref("");
const error = ref(null);

const validate = ({ query }) => {
  return /[!-~]{32}/.test(query.key);
};

const sendOTP = async () => {
  try {
    const payload = {
      email_hash: route.query.key,
    };
    await $fetch("/rcms-api/1/set_and_send_otp", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: payload,
    });
    sentOTP.value = true;
  } catch (error) {
    error.value = error.response._data.errors[0].message;
  }
};
const signup = async () => {
  try {
    const payload = {
      email_hash: route.query.key,
      otp: otp.value,
    };
    await $fetch("/rcms-api/1/check_otp_and_regist", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: payload,
    });
    signupDone.value = true;
  } catch (error) {
    error.value = error.response._data.errors[0].message;
  }
};
</script>
