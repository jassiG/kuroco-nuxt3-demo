import { useRuntimeConfig } from "nuxt/app";
import Vue from "vue";
import * as VueGoogleMaps from "vue3-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: useRuntimeConfig().gcpKey,
    libraries: "places",
  },
});
