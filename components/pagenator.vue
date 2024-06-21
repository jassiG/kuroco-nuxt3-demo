<template>
  <div>
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
      ◀️
    </button>
    <button
      v-for="page in totalPageCnt"
      :key="page"
      @click="goToPage(page)"
      :disabled="page === currentPage"
    >
      {{ page }}
    </button>
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPageCnt"
    >
      ▶️
    </button>
  </div>
</template>
<script setup>
const props = defineProps({
  pageNo: {
    required: true,
    type: Number,
  },
  totalPageCnt: {
    required: true,
    type: Number,
  },
});

const emit = defineEmits(["pageUpdate"]);
const router = useRouter();
const currentPage = ref(props.pageNo);

const goToPage = (page) => {
  if (page < 1 || page > props.totalPageCnt || page === currentPage) {
    return;
  }
  // router.push({ query: { page } });
  currentPage.value = page;
  emit("pageUpdate", currentPage.value);
};
</script>
<style scoped>
ul {
  list-style: none;
  display: flex;
}

.disabled {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  color: black;
}
</style>
