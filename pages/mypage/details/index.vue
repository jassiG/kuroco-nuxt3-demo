<template>
  <section>
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

<script>
export default {
  middleware: "auth",
  async asyncData({ $axios }) {
    return {
      response: await $axios.$get(`/rcms-api/18/member/details`),
    };
  },
};
</script>
