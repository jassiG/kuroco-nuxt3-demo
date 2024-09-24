<template>
  <div>
    <section>
      <h1>{{ response.details.inquiry_name }}</h1>

      <div>
        <template
          v-for="line in textLines2texts(response.details.inquiry_info)"
        >
          {{ line }}<br />
        </template>
      </div>

      <div v-if="submitted">
        <template v-for="line in textLines2texts(response.details.thanks_text)">
          {{ line }}<br />
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
            <dd><input v-model="submitData.name" name="name" type="text" /></dd>
          </dl>
          <dl>
            <dt>Email</dt>
            <dd>
              <input
                v-model="submitData.from_mail"
                name="from_mail"
                type="text"
              />
            </dd>
          </dl>
          <dl>
            <dt>Message</dt>
            <dd><textarea v-model="submitData.body" name="body"></textarea></dd>
          </dl>
        </div>

        <button @click.prevent="handleOnSubmit">Submit</button>
      </form>
    </section>
  </div>
</template>

<script setup>
const FORM_ID = 21; // Form ID
const submitted = ref(false);
const submitData = ref({});
const error = ref(null);
const response = ref({ details: {} });
const config = useRuntimeConfig();

const getForm = async () => {
  const formData = await $fetch(`/rcms-api/22/form/${FORM_ID}`, {
    method: "GET",
    baseURL: config.public.apiBase,
    credentials: "include",
  });
  console.log(formData);
  response.value = formData;
};

const textLines2texts = (textLines = "") => {
  return textLines.split("\r\n");
};

const handleOnSubmit = async () => {
  //Post processing to Kuroco endpoints
  try {
    await $fetch("/rcms-api/22/form", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: submitData.value || {},
    });
    submitted.value = true;
    error.value = null;
  } catch (e) {
    console.log({ e });
    error.value = e.response._data.errors;
  }
};

await getForm();
</script>
