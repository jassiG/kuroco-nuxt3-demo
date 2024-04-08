<template>
  <div class="pagenator">
    <button class="btn" @click="goToPage(pageNo-1)" :disabled="pageNo === 1"><</button>
    <button v-for="page in totalPageCnt" :key="page" @click="goToPage(page)" :disabled="page === pageNo" class="btn">{{ page }}</button>
    <button class="btn" @click="goToPage(pageNo+1)" :disabled="pageNo === totalPageCnt">></button>
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

const emit = defineEmits(['pageUpdate']);
const router = useRouter();

const goToPage = (page) => {
  if (page < 1 || page > props.totalPageCnt || page === props.pageNo) {
    return;
  }
  router.push({ query: { page } });
  emit('pageUpdate', page);
};
</script>
<style scoped>
.pagenator {
  display: flex;
  margin: 20px 0;
}
.btn {
  margin: 0 5px;
}
</style>