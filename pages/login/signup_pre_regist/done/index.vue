<template>
  <div>
    <div v-if="signupDone">Registration completed.</div>
    <div v-if="error_url" :style="{ color: 'red' }">
      <p v-for="(error, idx) in error_url" :key="idx">
        {{ error.message }}
      </p>
    </div>
    <div v-else-if="invitationRes">
      <form @submit.prevent="registUser">
        <div>
          <label>name1</label>
          <input
            name="name1"
            type="text"
            :value="invitationRes.data.ext_info.name1"
            disabled
          />
        </div>
        <div>
          <label>name2</label>
          <input
            name="name2"
            type="text"
            :value="invitationRes.data.ext_info.name2"
            disabled
          />
        </div>
        <div>
          <label>email</label>
          <input
            name="email"
            type="email"
            :value="invitationRes.data.email"
            disabled
          />
        </div>
        <div>
          <label>login_pwd</label>
          <input
            v-model="login_pwd"
            name="login_pwd"
            type="password"
            placeholder="login_pwd"
          />
        </div>
        <div>
          <button type="submit">Sign UP</button>
        </div>
      </form>
      <div v-if="error" :style="{ color: 'red' }">
        <p v-for="(error, idx) in error" :key="idx">
          {{ error.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const config = useRuntimeConfig();
const error_url = ref(null);
const invitationRes = ref(null);

const validate = ({ query }) => {
  // Return 404 if key is invalid
  if (/[!-~]{32}/.test(query.key)) {
    return true;
  } else {
    error_url.value = [{ message: "404 Invalid key" }];
    return false;
  }
};

const signupDone = ref(false);
const login_pwd = ref("");
const error = ref(null);

//Obtain pending  member information
const getData = async () => {
  try {
    const response = await $fetch("/rcms-api/33/member_invite", {
      baseURL: config.public.apiBase,
      method: "POST",
      credentials: "include",
      body: {
        email_hash: route.query.key,
      },
    });
    invitationRes.value = response;
  } catch (e) {
    error_url.value = e.response._data.errors;
  }
};

//Regist user
const registUser = async () => {
  try {
    const payload = {
      login_pwd: login_pwd.value,
      email: invitationRes.value.data.email,
      ...invitationRes.value.data.ext_info,
    };
    await $fetch("/rcms-api/33/member_regist", {
      baseURL: config.public.apiBase,
      method: "POST",
      credentials: "include",
      body: payload,
    });
    signupDone.value = true;
    error.value = [];
  } catch (e) {
    error.value = e.response._data.errors;
  }
};

//get Data if key is valid
if (validate(route)) {
  getData();
}
</script>
