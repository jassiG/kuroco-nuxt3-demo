<template>
  <div>
    <section>
      <h1>{{ response.details.inquiry_name }}</h1>

      <div>
        <template v-for="line in textLines2texts(response.details.inquiry_info)">
          {{ line }}<br>
        </template>
      </div>

      <div v-if="submitted">
        <template v-for="line in textLines2texts(response.details.thanks_text)">
          {{ line }}<br>
        </template>
      </div>

      <form v-else>
        <div v-if="error" class="error">
          <p v-for="(err, idx) in error" :key="idx" style="color: red">
            {{ err.message }}
          </p>
        </div>

        <div>
          <dl>
            <dt>Name</dt>
            <dd><input v-model="submitData.name" name='name' type="text"></dd>
          </dl>
          <dl>
            <dt>Email</dt>
            <dd><input v-model="submitData.from_mail" name='from_mail' type="text"></dd>
          </dl>
          <dl>
            <dt>Message</dt>
            <dd><textarea v-model="submitData.body" name='body'></textarea></dd>
          </dl>
          <dl>
            <dt>Item</dt>
            <dd>
              <select v-model="submitData.ext_01" name='ext_01'>
                <option v-for="option in response.details.cols.ext_01.options" :key="option.key" :label=option.value :value=option.key>
                  {{ option.value }}
                </option>
              </select>
            </dd>
          </dl>
        </div>

        <button @click.prevent="handleOnSubmit">Submit</button>
      </form>
    </section>
  </div>
</template>
  
<script>
const FORM_ID = 3; // Form ID

export default {
  data() {
    return {
      submitted: false,
      submitData: {},
      error: null,
    }
  },
  async asyncData({ $axios }) {
    return {
      response: await $axios.$get(`/rcms-api/8/form/${FORM_ID}`),
    };
  },
  methods: {
    textLines2texts(textLines = '') {
      return textLines.split('\r\n');
    },
    async handleOnSubmit() {
      //Post processing to Kuroco endpoints
      try {
        await this.$axios.$post('/rcms-api/8/form', { ...this.submitData });
        this.submitted = true;
        this.error = null;
      } catch (e) {
        this.error = e.response.data.errors;
      }
    }
  }
};
</script>