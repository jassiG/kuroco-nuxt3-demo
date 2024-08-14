<template>
  <div>
    <header>
      <nuxt-link :to="switchLocalePath('en')">{{ $t("links.en") }}</nuxt-link>
      |
      <nuxt-link :to="switchLocalePath('ja')">{{ $t("links.ja") }}</nuxt-link>
    </header>
    <NuxtPage />
  </div>
</template>