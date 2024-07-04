<template>
  <div>
    <div v-if="!presignupDone">
      <form @submit.prevent="signup">
        <div v-if="error" :style="{ color: 'red' }">
          <p v-for="(error, idx) in error" :key="idx">
            {{ error.message }}
          </p>
        </div>
        <div>
          <label>name1</label>
          <input
            v-model="user.name1"
            name="name1"
            type="text"
            placeholder="name1"
          />
        </div>
        <div>
          <label>name2</label>
          <input
            v-model="user.name2"
            name="name2"
            type="text"
            placeholder="name2"
          />
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
          <button type="submit">Sign UP</button>
        </div>
      </form>
    </div>
    <div v-else-if="presignupDone">
      Your pre-registration has been completed. Please check your e-mail.
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
    console.log(config.public.apiBase);
    await $fetch("/rcms-api/33/member_invite", {
      method: "POST",
      credentials: "include",
      baseURL: config.public.apiBase,
      body: payload,
    });
    presignupDone.value = true;
  } catch (e) {
    console.log(e.response._data);
    error.value = e.response._data.errors;
  }
};
</script>
