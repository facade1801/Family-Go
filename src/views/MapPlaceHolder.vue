<template>
  <div class="MapPlaceHolder">
    <div class="row" style="    width: 60%;
    margin-left: auto;
    margin-right: auto;
    min-width: 350px;
    margin-top: 20px;">
      <div class="col-lg" style="height: 500px" ref="map">
        <gmap-map
          :center="{ lat: lat, lng: lng }"
          :zoom="13"
          map-type-id="terrain"
        >
          <gmap-info-window
            :options="infoWindowOptions"
            :position="infoWindowPosition"
            :opened="infoWindowOpened"
            @closeclick="
              activeResteraunt = {};
              infoWindowOpened = false;
            "
          >
            <div class="info-window">
              <h2 v-text="activeResteraunt.name"></h2>
              <h v-text="activeResteraunt.note"></h>
            </div>
          </gmap-info-window>

          <gmap-marker
            v-for="(m, index) in markers"
            :key="index"
            :position="m.position"
            :clickable="true"
            @click="handleMarkerClicked(m)"
          />
        </gmap-map>
      </div>
    </div>
    <br />
    <router-link
      class="ui button"
      :to="{ name: 'ListPage', params: { id: this.$route.params.list_id } }"
      >Back to my list</router-link
    >
  </div>
</template>

<script>
import { db } from "../firebaseConfig.js";
export default {
  name: "closeBuy",
  data() {
    return {
      type: "",
      radius: "",
      lat: 44.9599665,
      lng: -93.2328231,
      places: [],
      markers: [],
      infoWindowOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      activeResteraunt: {},
      infoWindowOpened: false,
    };
  },
  created() {
    this.addLocationsToGoogleMaps();
  },
  methods: {
    addLocationsToGoogleMaps() {
      this.markers = [];
      console.log("list id: " + this.$route.params.list_id);
      const listRef = db.collection("lists").doc(this.$route.params.list_id);
      listRef.get().then((doc) => {
        const placesInList = [];
        doc.data()["locations"].forEach((location) => {
          placesInList.push(location);
        });
        placesInList.forEach((place) => {
          const lat = place.lat;
          const lng = place.lng;
          const name = place.name;
          const note = place.note;
          const marker = {
            position: {
              lat: lat,
              lng: lng,
            },
            lat: lat,
            lng: lng,
            name: name,
            note: note,
            clicked: false,
          };
          this.markers.push(marker);
          this.lat=lat;
          this.lng=lng;
        });
      });
    },
    handleMarkerClicked(m) {
      //console.log("m is: ");
      //console.log(m);
      this.activeResteraunt = m;
      this.infoWindowOpened = true;
    },
  },
  computed: {
    coordinates() {
      return `${this.lat}, ${this.lng}`;
    },
    infoWindowPosition() {
      return {
        lat: parseFloat(this.activeResteraunt.lat),
        lng: parseFloat(this.activeResteraunt.lng),
      };
    },
  },
};
</script>

<style>
.vue-map-container,
.vue-map-container .vue-map {
  width: 100%;
  height: 100%;
}
</style>