<template>
  <div v-if="response">
    <h1 class="title">{{ response.details.subject }}</h1>
    <div class="post" v-html="response.details.contents"></div>
    <p v-if="resultMessage !== null">
      {{ resultMessage }}
    </p>
    <div>
        <ul v-for="comment in comments" :key="comment.comment_id">
            <li>
                {{ comment.note }} by {{ comment.name }}
                <button v-if="commentHistory.map(({ id }) => id).includes(comment.comment_id)" type="button" @click="() => deleteComment(comment.comment_id)">
                    delete
                </button>
            </li>
        </ul>
        <form @submit.prevent="submitComment">
            <input v-model="inputComment" type="text" placeholder="comment">
            <button type="submit" :disabled="inputComment === ''">
                submit
            </button>
        </form>
    </div>
  </div>
</template>
  
<script setup>
definePageMeta({
  middleware: ['auth']
})

const profile = ref(null);
const response = ref(null);
const comments = ref([]);
const userName = ref('');
const inputComment = ref('');
const resultMessage = ref(null);
const config = useRuntimeConfig();
const commentHistory = ref([]);

async function getAllComments(topics_id) {
  const res = await useFetch(`/rcms-api/21/comments?module_id=${topics_id}&cnt=999`,{
    baseURL:config.public.apiBase,
    credentials: 'include',
  });
  const {list} = await res.data.value;
  return list;
}

const COMMENT_HISTORY_KEY = 'CommentHistory';

async function fetchData() {
  const res = await useFetch('/rcms-api/21/newsdetail/965',{
    baseURL:config.public.apiBase,
    credentials: 'include',
  });
  response.value = res.data.value;
  comments.value = await getAllComments(response.value.details.topics_id);
}

onMounted(() => {
  commentHistory.value = JSON.parse(localStorage.getItem(COMMENT_HISTORY_KEY)) || [];
});
getProfile();
fetchData();

async function getProfile() {
  const res = await useFetch('/rcms-api/1/profile',{
    baseURL:config.public.apiBase,
    credentials: 'include',
  });
  profile.value = res.data.value;
}
async function submitComment() {
  const delkey = `${userName.value}_${Date.now()}`;
  const submitResponse = await $fetch('/rcms-api/21/comment', {
    method: 'POST',
    body: JSON.stringify({
      module_id: response.value.details.topics_id,
      name: `${profile.value.name1} ${profile.value.name2}`,
      mail: profile.value.email,
      note: inputComment.value,
      delkey,
    }),
    baseURL:config.public.apiBase,
    credentials: 'include',
  });
  addCommentHistory({ id: submitResponse.id, delkey });
  comments.value = await getAllComments(response.value.details.topics_id);
  inputComment.value = '';
}

async function deleteComment(commentId) {
  try {
    await $fetch(`/rcms-api/21/comment_delete/${commentId}`, {
      method: 'POST',
      baseURL:config.public.apiBase,
      credentials: 'include',
      body: {
        delkey: commentHistory.value.find(({ id }) => `${id}` === `${commentId}`).delkey
      }
    });
    deleteCommentHistory(commentId);
    comments.value = await getAllComments(response.value.details.topics_id);
    inputComment.value = '';
  } catch (error) {
    resultMessage.value = error.message;
  }
}
async function addCommentHistory (payload) {
  const restored = JSON.parse(localStorage.getItem(COMMENT_HISTORY_KEY)) || []
  restored.push(payload)
  localStorage.setItem(COMMENT_HISTORY_KEY, JSON.stringify(restored))
  commentHistory.value = restored
}
async function deleteCommentHistory (commentId) {
  const restored = JSON.parse(localStorage.getItem(COMMENT_HISTORY_KEY)) || []
  const filtered = restored.filter(({ id }) => `${id}` !== `${commentId}`)
  localStorage.setItem(COMMENT_HISTORY_KEY, JSON.stringify(filtered))
  commentHistory.value = filtered
}
</script>