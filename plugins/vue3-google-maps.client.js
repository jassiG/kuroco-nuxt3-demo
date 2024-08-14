import Vue from "vue";
import * as VueGoogleMaps from "vue3-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GCP_KEY,
    libraries: "places",
  },
});
