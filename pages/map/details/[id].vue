<template>
  <div :v-if="data" class="container">
    {{ data }}
    <h3>Map (Google Maps)</h3>
    <div>
      The position that is set changes when you click on the map. You can also
      set the zoom and other states.
    </div>
    <form id="topics_edit" @submit.prevent="update">
      <div>
        <form onsubmit="return false;">
          <GMapAutocomplete
            :options="{ fields: ['geometry'] }"
            :select-first-on-enter="true"
            @place_changed="setPlace"
          />
          <GoogleMap
            ref="gmap"
            :center="mapCenter"
            :zoom="gmap_zoom"
            :map-type-id="gmap_type"
            style="width: 500px; height: 300px"
            @click="mark($event)"
            @zoom_changed="gmap_zoom = $event"
            @maptypeid_changed="gmap_type = $event"
          >
            <AdvancedMarker v-if="markPlace" :options="markerOptions" />
          </GoogleMap>
        </form>
      </div>
      <input type="submit" value="Save" />
    </form>
  </div>
</template>

<script setup>
import { AdvancedMarker, GoogleMap } from "vue3-google-map";
const route = useRoute();

const gmap = ref(null);
const mapCenter = ref({ lat: 35.66107078220203, lng: 139.7584319114685 });
const markerOptions = { position: mapCenter, label: "L", title: "title" };
const markPlace = ref(null);
const id = ref(route.params.id);
const contents = ref({});
const errors = ref([]);

const { data } = await useAsyncData("mapDetails", async () => {
  const url = `/rcms-api/3/newsdetail/${id.value}`;
  try {
    const response = await $fetch(url, {
      method: "GET",
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    console.log(response);
    if (response.details) {
      return response.details;
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
});

onMounted(() => {
  contents.value = data.value;
  if (contents.value.gmap?.gmap_x && contents.value.gmap?.gmap_y) {
    const lat = Number(contents.value.gmap.gmap_y);
    const lng = Number(contents.value.gmap.gmap_x);
    console.log(lat, lng);
    mapCenter.value = { lat, lng };
    markPlace.value = { lat, lng };
  }
});

const gmap_zoom = computed({
  get: () => Number(contents.value.gmap?.gmap_zoom) || 15,
  set: (val) => {
    if (!contents.value.gmap) contents.value.gmap = {};
    contents.value.gmap.gmap_zoom = String(val);
  },
});

const gmap_type = computed({
  get: () => contents.value.gmap?.gmap_type || "roadmap",
  set: (val) => {
    if (!contents.value.gmap) contents.value.gmap = {};
    contents.value.gmap.gmap_type = val;
  },
});

function setPlace(place) {
  if (place.geometry) {
    markPlace.value = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    if (place.geometry.viewport) {
      gmap.value.fitBounds(place.geometry.viewport);
    } else {
      gmap.value.panTo(place.geometry.location);
    }
  }
}

function mark(event) {
  markPlace.value = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng(),
  };
}

async function update() {
  const params = {
    gmap: {
      gmap_x: "",
      gmap_y: "",
      gmap_zoom: contents.value?.gmap?.gmap_zoom || "15",
      gmap_type: contents.value?.gmap?.gmap_type || "roadmap",
    },
  };
  if (markPlace.value) {
    params.gmap.gmap_x = String(markPlace.value.lng);
    params.gmap.gmap_y = String(markPlace.value.lat);
  }
  try {
    const response = await $fetch(
      "/rcms-api/3/update_news/" + route.params.id,
      {
        method: "POST",
        credentials: "include",
        baseURL: config.public.apiBase,
        body: params,
      }
    );
    console.log(response);
    if (response.data.errors?.length) {
      console.log(response.data.errors);
    }
    errors.value = [];
  } catch (error) {
    console.log(error);
  }
}
</script>
