<template>
  <div class="closebuy">
    <div class="row">
      <div class="col-sm-12 col-md-5" style="opacity:0.85;">
        <b-card style="padding:0rem'">
          <b-form class="form-row">
            <b-input-group style="margin-bottom:8px">
              <b-button variant="outline-primary" style="margin-right:4px;" :to="{ name: 'ListPage', params: { id: this.$route.params.list_id } }">
                &lt; Back
              </b-button>
              <b-input type="text" placeholder="Enter your address" v-model="coordinates"/>
                <b-input-group-text><b-icon-record-circle-fill @click="locatorButtonPressed"/></b-input-group-text>
              <b-form-select  class="col-3" v-model="radius" style="margin-left:4px;">
                <option disabled="true" value="">Radius</option>
                <option value="1">0-1 KM</option>
                <option value="5">1-5 KM</option>
                <option value="10">5-10 KM</option>
                <option value="15">10-15 KM</option>
                <option value="20">15-20 KM</option>
              </b-form-select>
            </b-input-group>
            <b-input-group>
              <b-form-select class="col-3" v-model="type">
                <option disabled="true" value="">Select type</option>
                <option value="restaurant">Restaurant</option>
                <option value="bakery">bakery</option>
                <option value="bank">bank</option>
                <option value="bar">bar</option>
                <option value="beauty_salon">beauty salon</option>
                <option value="car_wash">car wash</option>
                <option value="church">church</option>
                <option value="gym">gym</option>
                <option value="gas_station">gas station</option>
                <option value="laundry">laundry</option>
                <option value="liquor_store">liquor store</option>
                <option value="museum">museum</option>
                <option value="night_club">night club</option>
                <option value="park">park</option>
                <option value="shoe_store">shoe store</option>
              </b-form-select>

              <b-form-input v-model="searchInput" placeholder="Optional Keyword" style="margin-left:4px; margin-right:4px;"/>
              <b-button variant="primary" @click="searchButtonPressed">
                Search
              </b-button>
            </b-input-group>
          </b-form>

          <!-- <b-button variant="primary" @click="findCloseBuyButtonPressed" style="margin-right:8px;">
            Find nearby
          </b-button> -->

        </b-card>
        
        <div v-if="pressed" class="ui segment list centerd1111" >
          <div class="ui divided items">
            <div class="item" v-for="place in places" :key="place.id">
              <div class="content">
                <div class="header" @click="locateToPlace(place)">{{ place.name }}</div>
                <b-icon icon="geo-alt" @click="locateToPlace(place)"></b-icon>
                <div class="meta" @click="locateToPlace(place)">{{ place.vicinity }}</div>
                <button :disabled="isAdded(place.place_id)" class="ui button" @click="addToListByText(place)">add to list</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-7" ref="map">
        <gmap-map
          :center="{ lat: lat, lng: lng }"
          v-bind:zoom="scale"
          map-type-id="terrain"
        >
          <gmap-info-window
            :options="infoWindowOptions"
            :position="infoWindowPosition"
            :opened="infoWindowOpened"
            @closeclick="activeResteraunt = {}; infoWindowOpened = false;"
          >
            <div class="info-window">
              <h2 v-text="activeResteraunt.name"></h2>
              <button :disabled="activeResteraunt.clicked" class="ui button" @click="addToList">add to list</button>
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
    <br>

  </div>
</template>

<script>
import axios from "axios";
import { db } from "../firebaseConfig.js";
import firebase from "firebase";

export default {
  name: "closeBuy",
  data() {
    return {
      searchInput: "",
      type: "",
      radius: "",
      lat: 45,
      lng: -93,
      scale:12,
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
      pressed: false,
    };
  },
  created : function(){
      document.title = "Family Go: Add a new place";
      this.locatorButtonPressed();
    },
  methods: {

    locatorButtonPressed() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        },
        (error) => {
          console.log("Error getting location");
          console.log(error);
        }
      );
    },
    addToList() {
      this.$prompt("Type your notes here").then(result=>{

        this.activeResteraunt["clicked"] = true;

        this.activeResteraunt["note"] = result;
        db.collection("lists")
          .doc(this.$route.params.list_id)
          .update({
            locations: firebase.firestore.FieldValue.arrayUnion(
              this.activeResteraunt
            ),
          });
          this.$alert("Place added.")
      }).catch(()=>{
        this.activeResteraunt["clicked"] = true;

        this.activeResteraunt["note"] = "";
        db.collection("lists")
          .doc(this.$route.params.list_id)
          .update({
            locations: firebase.firestore.FieldValue.arrayUnion(
              this.activeResteraunt
            ),
          });
          this.$alert("Place added.")
      });

    },
    addToListByText(place){
      this.$prompt("Type your notes here").then(result=>{
      this.markers.forEach((marker)=>{
          if(place.place_id==marker.place_id){
            marker["clicked"] = true;
          }
      });
      const lat = place.geometry.location.lat;
      const lng = place.geometry.location.lng;
      const name = place.name;
      const place_id = place.place_id;
      const address = place.vicinity;
      const marker2 = {
      position: {
                lat: lat,
                lng: lng,
              },
      lat: lat,
      lng: lng,
      name: name,
      place_id: place_id,
      note: "",
      clicked: false,
      address: address,
      };
      marker2["note"] = result;
      db.collection("lists")
          .doc(this.$route.params.list_id)
          .update({
          locations: firebase.firestore.FieldValue.arrayUnion(marker2),
        });
      this.$alert("Place added.")
      }).catch((error)=>{
        console.log(error);
        this.markers.forEach((marker)=>{
          if(place.place_id==marker.place_id){
            marker["clicked"] = true;
          }
      });
      const lat = place.geometry.location.lat;
      const lng = place.geometry.location.lng;
      const name = place.name;
      const place_id = place.place_id;
      const marker2 = {
      position: {
                lat: lat,
                lng: lng,
              },
      lat: lat,
      lng: lng,
      name: name,
      place_id: place_id,
      note: "",
      clicked: false,
      };
         marker2["note"] = "";
         db.collection("lists")
            .doc(this.$route.params.list_id)
            .update({
             locations: firebase.firestore.FieldValue.arrayUnion(
                marker2
              ),
           });
          this.$alert("Place added.")

      })
    },
    isAdded(place_id){
      var add=false;
      this.markers.forEach((marker)=>{
        if(marker.clicked==true&&marker.place_id==place_id){
          add=true;
        }
      });
      return add;
    },
    locateToPlace(place){
      this.lat=place.geometry.location.lat;
      this.lng=place.geometry.location.lng;
      this.markers.forEach((marker)=>{
        if(marker.place_id==place.place_id){
          this.activeResteraunt = marker;
          this.infoWindowOpened = true;
        }
      });

      
    },


    //   const URL = `https://cors.bridged.cc/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat}, ${this.lng}&type=${this.type}&radius=${this.radius * 1000}&KEY="YOUR-KEY`;

    //   axios.get(URL).then((response) => {
    //     console.log(response.data.results);
    //     this.places = response.data.results;
    //     this.addLocationsToGoogleMaps();
    //     this.pressed = true;
    //   });
    // },
    searchButtonPressed() {
      switch(this.radius)
      {
        case "": this.scale=15;
        break;
        case "1":this.scale=15;
        break;
        case "5":this.scale=14;
        break;
        case "10":this.scale=13;
        break;
        case "15":this.scale=12;
        break;
        case "20":this.scale=12;
        break;
      }
      var URL = "";
      // If the user selected radius, use radius
      if (this.radius != "") {
        URL = `https://cors.bridged.cc/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat}, ${this.lng}`
          + `&radius=${this.radius * 1000}&keyword=${this.searchInput}&type=${this.type}&key=YOUR_KEY`;
      }
      // if no radius, sort by distance
      else {
        URL = `https://cors.bridged.cc/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat}, ${this.lng}`
          + `&rankby=distance&keyword=${this.searchInput}&type=${this.type}&key=YOUR_KEY`;
      }
      axios.get(URL).then((response) => {
        this.places = response.data.results;
        this.addLocationsToGoogleMaps();
        this.pressed = true;
      });
    },
    addLocationsToGoogleMaps() {
      this.markers = [];
      // console.log("list id: " + this.$route.params.list_id);
      const listRef = db.collection("lists").doc(this.$route.params.list_id);
      listRef.get().then((doc) => {
        const existed_ids = [];
        doc.data()["locations"].forEach((location) => {
          existed_ids.push(location["place_id"]);
        });
        this.places.forEach((place, index, object) => {
          if (!existed_ids.includes(place.place_id)) {
            const lat = place.geometry.location.lat;
            const lng = place.geometry.location.lng;
            const name = place.name;
            const place_id = place.place_id;
            const address = place.vicinity;
            const marker = {
              position: {
                lat: lat,
                lng: lng,
              },
              lat: lat,
              lng: lng,
              name: name,
              place_id: place_id,
              address: address,
              note: "",
              clicked: false,
            };
            this.markers.push(marker);
          } else {
            object.splice(index, 1);
          }
        });
        //change view center
        if(this.markers!=null&&this.markers[0]!=null)
        {
          this.lat=this.markers[0].lat;
          this.lng=this.markers[0].lng;
        }
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
  min-height:300px;
  width: 100%;
  height: 100%;
}

.list{
  max-height: 500px; 
  min-height: 500px; 
  overflow: scroll
}
@media only screen and (max-width: 500px){
  .centerd1111 { 
    max-height: 300px;
    min-height: 300px;
    overflow: scroll
  }
}
</style>
