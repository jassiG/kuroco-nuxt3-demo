<template>
  <div class="container">
    <h3>Map (Google Maps)</h3>
    <div>
      The position that is set changes when you click on the map. You can also
      set the zoom and other states.
    </div>
    <form id="topics_edit" @submit.prevent="update">
      <div>
        <form onsubmit="return false;">
          <GmapAutocomplete
            :options="{ fields: ['geometry'] }"
            :select-first-on-enter="true"
            @place_changed="setPlace"
          />
          <GmapMap
            ref="gmap"
            :center="mapCenter"
            :zoom="gmap_zoom"
            :map-type-id="gmap_type"
            style="width: 500px; height: 300px"
            @click="mark($event)"
            @zoom_changed="gmap_zoom = $event"
            @maptypeid_changed="gmap_type = $event"
          >
            <GmapMarker v-if="markPlace" :position="markPlace" />
          </GmapMap>
        </form>
      </div>
      <input type="submit" value="Save" />
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
    gmap_zoom: {
      get() {
        return Number(this.contents.gmap?.gmap_zoom) || 15;
      },
      set(val) {
        this.contents.gmap.gmap_zoom = String(val);
      },
    },
    gmap_type: {
      get() {
        return this.contents.gmap?.gmap_type || "roadmap";
      },
      set(val) {
        this.contents.gmap.gmap_type = val;
      },
    },
  },
  methods: {
    setPlace(place) {
      if (place.geometry) {
        this.markPlace = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        if (place.geometry.viewport) {
          this.$refs.gmap.fitBounds(place.geometry.viewport);
        } else {
          this.$refs.gmap.panTo(place.geometry.location);
        }
      }
    },
    mark(event) {
      this.markPlace = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
    },
    async update() {
      const params = {
        gmap: {
          gmap_x: "",
          gmap_y: "",
          gmap_zoom: this.contents?.gmap?.gmap_zoom || 15,
          gmap_type: this.contents?.gmap?.gmap_type || "roadmap",
        },
      };
      if (this.markPlace) {
        params.gmap.gmap_x = String(this.markPlace.lng);
        params.gmap.gmap_y = String(this.markPlace.lat);
      }
      await this.$axios
        .post("/rcms-api/3/building/update/" + this.$route.params.id, params)
        .then((response) => {
          if (response.data.errors?.length) {
            console.log(response.data.errors);
          }
          this.errors = [];
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
