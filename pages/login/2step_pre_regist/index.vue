<template>
  <div>
    <div v-if="!presignupDone">
      <form @submit.prevent="signup">
        <p v-if="error" :style="{ color: 'red' }">
          {{ error }}
        </p>

        <div>
          <label>name</label>
          <input
            v-model="user.name"
            name="name"
            type="text"
            placeholder="name"
          />
        </div>
        <div>
          <label>tel</label>
          <input v-model="user.tel" name="tel" type="text" placeholder="tel" />
        </div>
        <div>
          <label>email</label>
          <input
            v-model="email"
            name="email"
            type="email"
            placeholder="email"
          />
        </div>
        <div>
          <label>login_pwd</label>
          <input
            v-model="user.login_pwd"
            name="login_pwd"
            type="password"
            placeholder="login_pwd"
          />
        </div>

        <div>
          <button type="submit">Sign up</button>
        </div>
      </form>
    </div>
    <div v-else-if="presignupDone">
      Pre-registration is complete. Please check your email.
    </div>
  </div>
</template>
<script setup>
const config = useRuntimeConfig();
const presignupDone = ref(false);
const email = ref(null);
const user = ref({});
const error = ref(null);

const signup = async () => {
  try {
    const payload = {
      email: email.value,
      ext_info: {
        ...user.value,
      },
    };
    // post data
    // New Member Registration Request
    await $fetch("/rcms-api/1/2step_member_invite", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: payload,
    });
    presignupDone.value = true;
  } catch (e) {
    console.error(e);
    error.value = "An error has occurred.";
  }
};
</script>
