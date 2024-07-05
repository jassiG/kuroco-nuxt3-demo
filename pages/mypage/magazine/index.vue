<template>
  <div v-if="response">
    <h1>Update mail magazine</h1>
    <form>
      <p v-if="resultMessage !== null" style="color: green">
        {{ resultMessage }}
      </p>

      <div v-for="magazine in magazines" :key="magazine.id">
        <h2>{{ magazine.label }}</h2>
        <input
          type="radio"
          :id="`s-${magazine.id}`"
          :value="{ status: 'subscribe', id: magazine.id }"
          v-model="submitData[magazine.key]"
          @change="handleChange(magazine.key)"
        />
        <label :for="`s-${magazine.id}`">Subscribe</label>
        <input
          type="radio"
          :id="`u-${magazine.id}`"
          :value="{ status: 'unsubscribe', id: magazine.id }"
          v-model="submitData[magazine.key]"
          @change="handleChange(magazine.key)"
        />
        <label :for="`u-${magazine.id}`">Unsbscribe</label>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const config = useRuntimeConfig();
const resultMessage = ref(null);
const submitData = ref({
  news: { status: "unsubscribe", id: 7 },
  sale: { status: "unsubscribe", id: 8 },
  event: { status: "unsubscribe", id: 9 },
});
const magazines = ref([
  { id: 7, key: "news", label: "Announcement of the Latest Release" },
  { id: 8, key: "sale", label: "Notification of Exclusive Sale" },
  { id: 9, key: "event", label: "Announcement of the Latest Release" },
]);
const response = ref(null);
const profile = ref(null);

const getData = async () => {
  try {
    const profileRes = await $fetch("/rcms-api/1/profile", {
      credentials: "include",
      baseURL: config.public.apiBase,
    });
    profile.value = profileRes;

    response.value = await $fetch("/rcms-api/18/my_magazine/info", {
      credentials: "include",
      baseURL: config.public.apiBase,
    });
  } catch (error) {
    resultMessage.value = "Error fetching data";
    console.log(error);
  }
  //Reflect Subscription Status Upon Access
  if (response.value && response.value.list) {
    response.value.list.forEach((magazineInfo) => {
      const matchingMagazine = magazines.value.find(
        (magazine) => magazine.id === magazineInfo.magazine_id
      );
      if (matchingMagazine) {
        const key = matchingMagazine.key;
        submitData.value[key] = {
          status: "subscribe",
          id: magazineInfo.magazine_id,
        };
      }
    });
  }
};

const handleChange = async (magazineKey) => {
  try {
    await $fetch(
      `/rcms-api/18/magazine/${submitData.value[magazineKey].status}/${submitData.value[magazineKey].id}`,
      {
        method: "POST",
        credentials: "include",
        baseURL: config.public.apiBase,
        body: { member_id: profile.value.member_id },
      }
    );
    resultMessage.value = "Data submitted successfully";
  } catch (error) {
    resultMessage.value = "Error submitting data";
    console.error(error);
  }
};

await getData();
</script>
