<template>
  <section v-if="response">
    <h1 class="title">My Profile</h1>

    <div v-if="updateProfileDone">
      Profile update has been completed.
      <button @click="updateProfileDone = false">OK</button>
    </div>

    <div v-else>
      <p v-if="error" :style="{ color: 'red' }">{{ error }}</p>
      <article>
        <label for="firstName">First Name:</label>
        <input id="firstName" v-model="user.name1" />
      </article>

      <article>
        <label for="lastName">Last Name:</label>
        <input id="lastName" v-model="user.name2" />
      </article>

      <article>
        <label for="email">Email:</label>
        <input id="email" v-model="user.email" />
      </article>

      <article>
        Notifications:
        <input
          type="radio"
          id="subscribe"
          value="0"
          v-model.number="user.email_send_ng_flg"
        />
        <label for="subscribe">Subscribe</label>
        <input
          type="radio"
          id="unsubscribe"
          value="1"
          v-model.number="user.email_send_ng_flg"
        />
        <label for="unsubscribe">Unsubscribe</label>
      </article>

      <button @click="handleOnSubmit">Submit</button>
    </div>
  </section>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const config = useRuntimeConfig();

const updateProfileDone = ref(false);
const user = ref({
  name1: "",
  name2: "",
  email: "",
  email_send_ng_flg: "",
});
const error = ref(null);
const response = ref(null);

const getData = async () => {
  console.log("getData");
  try {
    response.value = await $fetch("/rcms-api/18/member/details", {
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    user.value.name1 = response.value.details.name1;
    user.value.name2 = response.value.details.name2;
    user.value.email = response.value.details.email;
    user.value.email_send_ng_flg = response.value.details.email_send_ng_flg;
  } catch (e) {
    console.log(e);
  }
};

const handleOnSubmit = async () => {
  try {
    await $fetch("/rcms-api/18/member/update", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: {
        ...user.value,
      },
    });
    updateProfileDone.value = true;
  } catch (e) {
    console.log(e);
    error.value = e.response._data.errors[0].message;
  }
};

await getData();
</script>
