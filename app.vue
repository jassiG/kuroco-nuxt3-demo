<template>
  <div>
    <NuxtPage />
  </div>
</template>
<script setup>
useHead({
  script: [
        { src: "https://player.vimeo.com/api/player.js", body: true },
    ],
});
</script>
<style>
/* a {
  color: #007bff;
  text-decoration: underline;
}
input {
  border: 1px solid #ced4da;
}
textarea {
  border: 1px solid #ced4da;
} */
</style>
