<template>
  <ul>
    <li>
      <nuxt-link
        :to="{
          path: $route.path,
          query: { page: pageNo - 1 },
        }"
        @click.native="refresh(pageNo - 1)"
        :class="{ disabled: ($route.query.page || 1) <= 1 }"
      >
        前へ
      </nuxt-link>
    </li>

    <li v-for="i in totalPageCnt" :key="i">
      <nuxt-link
        :to="{ path: $route.path, query: { page: i } }"
        @click.native="refresh(i)"
        :class="{
          disabled: pageNo === i,
        }"
      >
        {{ i }}
      </nuxt-link>
    </li>
    <li v-if="pageNo === totalPageCnt">次へ</li>
    <li v-else>
      <nuxt-link
        :to="{
          path: $route.path,
          query: { page: pageNo + 1 },
        }"
        :class="{
          disabled: totalPageCnt === $route.query.page,
        }"
        @click.native="refresh(pageNo + 1)"
      >
        次へ
      </nuxt-link>
    </li>
  </ul>
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
const refresh = (i) => {
  emit("pageUpdate", i);
};
</script>
<style>
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