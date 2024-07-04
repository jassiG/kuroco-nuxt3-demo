<template>
  <div class="l-container--wrap">
    <div v-if="!deleteDone">
      Delete
      <span style="font-weight: bold"
        >{{ response.details.name1 }} {{ response.details.name2 }}</span
      >. Are you sure you want to proceed?
      <button @click="deleteProfile">Proceed</button>
      <div v-if="error">{{ error }}</div>
    </div>
    <div v-if="deleteDone">Profile deletion has been completed.</div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data() {
    return {
      deleteDone: false,
      error: null,
    };
  },
  async asyncData({ $axios }) {
    return {
      response: await $axios.$get(`/rcms-api/18/member/details`),
    };
  },
  methods: {
    async deleteProfile() {
      try {
        await this.$axios.$post("/rcms-api/18/member/delete", {});
        this.deleteDone = true;
      } catch (e) {
        console.error(e);
        this.error = e.response.data.errors[0].message;
      }
    },
  },
};
</script>
