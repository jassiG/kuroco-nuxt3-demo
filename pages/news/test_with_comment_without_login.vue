<template>
  <div v-if="response">
    <h1 class="title">{{ response.details.subject }}</h1>
    <div class="post" v-html="response.details.contents"></div>
    <p v-if="resultMessage !== null">
      {{ resultMessage }}
    </p>
    <div>
      please type your name:
      <input v-model="userName" type="text" placeholder="your name" />
    </div>
    <div>
      <ul v-for="comment in comments" :key="comment.comment_id">
        <li>
          {{ comment.note }} by {{ comment.name }}
          <button
            v-if="
              commentHistory.map(({ id }) => id).includes(comment.comment_id)
            "
            type="button"
            @click="() => deleteComment(comment.comment_id)"
          >
            delete
          </button>
        </li>
      </ul>
      <form @submit.prevent="submitComment">
        <input v-model="inputComment" type="text" placeholder="comment" />
        <button
          type="submit"
          :disabled="inputComment === '' || userName === ''"
        >
          submit
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const COMMENT_HISTORY_KEY = "CommentHistory";

const config = useRuntimeConfig();

const userName = ref("");
const response = ref(null);
const comments = ref([]);
const inputComment = ref("");
const resultMessage = ref(null);
const commentHistory = ref([]);

const getAllComments = async (topics_id) => {
  const { list } = await $fetch(
    `/rcms-api/1/comments?module_id[]=${topics_id}&cnt=999`,
    {
      baseURL: config.public.apiBase,
    }
  );
  return list;
};

const getData = async () => {
  try {
    const apiResponse = await $fetch("/rcms-api/1/newsdetail/3034?lang=ja", {
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    response.value = apiResponse;
    const allComments = await getAllComments(apiResponse.details.topics_id);
    comments.value = allComments;
  } catch (e) {
    console.log(e.message);
  }
};

await getData();

const submitComment = async () => {
  const delkey = `${userName.value}_${Date.now()}`;
  const submitResponse = await $fetch("/rcms-api/1/comment", {
    method: "POST",
    baseURL: config.public.apiBase,
    credentials: "include",
    body: {
      module_id: response.value.details.topics_id,
      name: userName.value,
      note: inputComment.value,
      delkey,
    },
  });
  addCommentHistory({ id: submitResponse.id, delkey });
  comments.value = await getAllComments(response.value.details.topics_id);
  inputComment.value = "";
};

const deleteComment = async (commentId) => {
  try {
    await $fetch(`/rcms-api/1/comment_delete/${commentId}`, {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: {
        delkey: commentHistory.value.find(
          ({ id }) => `${id}` === `${commentId}`
        ).delkey,
      },
    });
    deleteCommentHistory(commentId);
    comments.value = await getAllComments(response.value.details.topics_id);
    inputComment.value = "";
  } catch (error) {
    resultMessage.value = error.response._data.errors[0].message;
  }
};

const addCommentHistory = (payload) => {
  const restored = JSON.parse(localStorage.getItem(COMMENT_HISTORY_KEY)) || [];
  restored.push(payload);
  localStorage.setItem(COMMENT_HISTORY_KEY, JSON.stringify(restored));
  commentHistory.value = restored;
};

const deleteCommentHistory = (commentId) => {
  const restored = JSON.parse(localStorage.getItem(COMMENT_HISTORY_KEY)) || [];
  const filtered = restored.filter(({ id }) => `${id}` !== `${commentId}`);
  localStorage.setItem(COMMENT_HISTORY_KEY, JSON.stringify(filtered));
  commentHistory.value = filtered;
};

onMounted(() => {
  commentHistory.value =
    JSON.parse(localStorage.getItem(COMMENT_HISTORY_KEY)) || [];
});
</script>
