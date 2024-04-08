<template>
  <div>
    <p v-if="Status !== null" :style="{ color: resultMessageColor }">
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

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      onetime_password: "",
      Status: null,
      preloginStatus: false,
      resultMessage: null,
    };
  },
  computed: {
    resultMessageColor() {
      switch (this.Status) {
        case "success":
          return "green";
        case "failure":
          return "red";
        default:
          return "";
      }
    },
  },
  methods: {
    async login() {
      try {
        const payload = {
          email: this.email,
          password: this.password,
        };
        const response = await this.$axios.$post(
          "/rcms-api/1/2steplogin/email",
          payload
        );
        this.Status = "success";
        if (response.status === 3) {
          this.preloginStatus = true;
          this.resultMessage = response.messages;
        }
        if (response.status === 0) {
          this.resultMessage =
            "Login succeeded. Please register the second factor authentication information.";
        }
      } catch (error) {
        this.Status = "failure";
        this.resultMessage = error.response.data.errors[0].message;
      }
    },
    async second_authentication() {
      try {
        const payload = {
          email: this.email,
          onetime_password: this.onetime_password,
        };
        const response = await this.$axios.$post(
          "/rcms-api/1/2steplogin/email",
          payload
        );
        this.Status = "success";
        if (response.status === 3) {
          this.preloginStatus = true;
          this.resultMessage = response.messages;
        }
        if (response.status === 0) {
          this.resultMessage = "Login succeeded.";
        }
      } catch (error) {
        this.preloginStatus = false;
        this.Status = "failure";
        this.resultMessage = error.response.data.errors[0].message;
      }
    },
  },
};
</script>
