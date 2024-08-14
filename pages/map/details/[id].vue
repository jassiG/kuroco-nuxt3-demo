<template>
  <div class="container">
    <h3>Map (Google Maps)</h3>
    <form id="topics_edit" @submit.prevent="update">
      <div>
        <GmapMap
          ref="gmap"
          :center="mapCenter"
          :zoom="gmap_zoom"
          :map-type-id="gmap_type"
          style="width: 500px; height: 300px"
        >
          <GmapMarker v-if="markPlace" :position="markPlace" />
        </GmapMap>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, route }) {
    const id = route.params.id;
    const url = `/rcms-api/3/map/details/${id}`;

    const contents = await $axios
      .$get(url)
      .then((response) => {
        if (response.details) {
          return response.details;
        }
        return {};
      })
      .catch((error) => {
        console.log(error);
        return {};
      });
    // Set the initial state of Google Maps
    let mapCenter = { lat: 35.66107078220203, lng: 139.7584319114685 };
    let markPlace = null;
    if (contents.gmap?.gmap_x && contents.gmap?.gmap_y) {
      const lat = Number(contents.gmap.gmap_y);
      const lng = Number(contents.gmap.gmap_x);
      mapCenter = { lat, lng };
      markPlace = { lat, lng };
    }

    return {
      mapCenter,
      markPlace,
      id,
      contents,
      errors: [],
    };
  },
  computed: {
    gmap_zoom() {
      return Number(this.contents.gmap?.gmap_zoom) || 15;
    },
    gmap_type() {
      return this.contents.gmap?.gmap_type || "roadmap";
    },
  },
};
</script>
