<template>
  <div>
    <h1 class="text-xl text-gray-800">Index</h1>
    <ul class="my-2 space-y-4">
      <!-- link buttons -->
      <li>
        <nuxt-link
          to="/news/"
          class="bg-slate-500 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded"
          >News</nuxt-link
        >
      </li>
      <li>
        <nuxt-link
          to="/form/form_validate"
          class="bg-slate-500 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded"
          >Form Validate</nuxt-link
        >
      </li>
    </ul>
  </div>
</template>
