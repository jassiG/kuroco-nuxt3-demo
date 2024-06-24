<template>
  <div>
    <form>
      <h1>Subscribe to Magazine</h1>
      <p v-if="resultMessage !== null">
        {{ resultMessage }}
      </p>
      <form @submit.prevent="login">
        <input v-model="email" name="email" type="email" placeholder="email" />
        <input
          v-model="password"
          name="password"
          type="password"
          placeholder="password"
        />
        <button type="submit">Login</button>
      </form>
      <button v-on:click.prevent="subscribeSubmit">Subscribe</button>
      <button v-on:click.prevent="unsubscribeSubmit">Unsubscribe</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      resultMessage: null,
    };
  },
  methods: {
    //Login
    async login() {
      try {
        const payload = {
          email: this.email,
          password: this.password,
        };
        await this.$axios.$post("/rcms-api/1/login", payload);
        this.resultMessage = "Successful login";
      } catch (error) {
        this.resultMessage = error.response.data.errors[0].message;
      }
    },
    //Subscribe
    async subscribeSubmit() {
      try {
        const payload = {
          email: this.email,
        };
        // post data
        const response = await this.$axios.$post(
          `/rcms-api/1/magazine_subscribe/1`,
          payload
        );
        this.resultMessage = response.messages[0];
      } catch (error) {
        this.resultMessage = error.response.data.errors[0].message;
      }
    },
    //Unsubscribe
    async unsubscribeSubmit() {
      try {
        // post data
        const response = await this.$axios.$post(
          `/rcms-api/1/magazine_unsubscribe/1`,
          {}
        );
        this.resultMessage = response.messages[0];
      } catch (error) {
        this.resultMessage = error.response.data.errors[0].message;
      }
    },
  },
};
</script>
