<template>
  <div>
    <section>
      <h1 class="text-xl text-gray-800">Contact</h1>
      <form v-if="!validated" class="input">
        <div v-if="error" class="text-red-500">
          <p v-for="(err, idx) in error" :key="idx">
            {{ err }}
          </p>
        </div>
        <div>
          <dl>
            <dt>Name</dt>
            <dd>
              <input
                v-model="submitData.name"
                name="name"
                type="text"
                :disabled="validated"
                class="border border-slate-300 rounded"
              />
            </dd>
          </dl>
          <dl>
            <dt>Email</dt>
            <dd>
              <input
                v-model="submitData.email"
                name="email"
                type="text"
                :disabled="validated"
                class="border border-slate-300 rounded"
              />
            </dd>
          </dl>
          <dl>
            <dt>Message</dt>
            <dd>
              <textarea
                v-model="submitData.body"
                name="body"
                :disabled="validated"
                class="border border-slate-300 rounded"
              ></textarea>
            </dd>
          </dl>
        </div>
        <button
          @click.prevent="handleOnValidate"
          class="bg-slate-500 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded"
        >
          Confirm your entry
        </button>
      </form>
      <form v-if="validated" class="confirm">
        <div v-if="submitted">Inquiry submitted.</div>
        <div v-else>
          <div>
            <div v-for="field in ['Name', 'Email', 'Body']" class="">
              <div>{{ field }}</div>
              <div class="text-slate-600">
                {{ submitData[field.toLowerCase()] }}
              </div>
            </div>
          </div>
          <div class="my-2 space-x-4">
            <button
              @click.prevent="handleOnSubmit"
              class="bg-slate-500 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded"
            >
              Submit
            </button>
            <button
              @click.prevent="validated = false"
              class="bg-slate-500 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded"
            >
              Back
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
const submitted = ref(false);
const validated = ref(false);
const submitData = ref({});
const error = ref(null);
const config = useRuntimeConfig();

const handleOnValidate = async () => {
  //Validate the entry
  try {
    await $fetch("/rcms-api/1/form_validate", {
      method: "POST",
      body: { ...submitData.value },
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    validated.value = true;
    error.value = null;
  } catch (e) {
    error.value = e;
  }
};

const handleOnSubmit = async () => {
  //Post processing to Kuroco endpoints
  try {
    await $fetch("/rcms-api/1/form_send", {
      method: "POST",
      body: { ...submitData.value },
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    submitted.value = true;
  } catch (e) {
    error.value = e;
  }
};
</script>
