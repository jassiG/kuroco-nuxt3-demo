<template>
  <section v-if="response">
    <h1 class="title">My Profile</h1>
    <article>
      Name: {{ response.details.name1 }} {{ response.details.name2 }}
    </article>
    <article>Email: {{ response.details.email }}</article>
    <article>
      Notifications:
      <span v-if="response.details.email_send_ng_flg == 0">Subscribe</span>
      <span v-else>Unsubscribe</span>
    </article>
  </section>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
const config = useRuntimeConfig();
const response = ref(null);

const getResponse = async () => {
  try {
    const res = await $fetch("/rcms-api/18/member/details", {
      method: "GET",
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    response.value = res;
  } catch (e) {
    // console.log(e);
  }
};

await getResponse();
</script>
