<template>
  <section>
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

<script>
export default {
  middleware: "auth",
  data() {
    return {
      updateProfileDone: false,
      user: {
        name1: "",
        name2: "",
        email: "",
        email_send_ng_flg: "",
      },
      error: null,
    };
  },
  async asyncData({ $axios }) {
    return {
      response: await $axios.$get(`/rcms-api/18/member/details`),
    };
  },
  created() {
    this.user.name1 = this.response.details.name1;
    this.user.name2 = this.response.details.name2;
    this.user.email = this.response.details.email;
    this.user.email_send_ng_flg = this.response.details.email_send_ng_flg;
  },
  methods: {
    async handleOnSubmit() {
      try {
        await this.$axios.$post("/rcms-api/18/member/update", { ...this.user });
        this.updateProfileDone = true;
      } catch (e) {
        console.error(e);
        this.error = e.response.data.errors[0].message;
      }
    },
  },
};
</script>
