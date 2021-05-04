<template>
  <div class="home p-5">
    <h1>Search Restuarants with Latitude and Longitude</h1>
    <div class="lat-lng-form">
      <b-row>
        <b-col cols="12" md="6">
          <p class="text-left">Latitude</p>
          <b-input v-model="lat" placeholder="Latitude"></b-input>
        </b-col>
        <b-col cols="12" md="6">
          <p class="text-left">Longitude</p>
          <b-input v-model="lng" placeholder="Longitude"></b-input>
        </b-col>
      </b-row>
      <b-row align-h="end">
        <b-btn @click="initMap" class="mt-4">Search</b-btn>
      </b-row>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
// const google = window.google

export default {
  data(){
    return {
      map: null,
      infowindow: null,
      lat: -33.8665433,
      lng: 151.1956316
    }
  },
  mounted(){
    this.loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBelxKrWBTQJ4XOZ-Xx3HqcEEstLBIYvhc&libraries=places&v=weekly", this.initMap)
  },
  
  methods:{
    initMap(){
      var baseLocation = new window.google.maps.LatLng(this.lat,this.lng)

      this.infowindow = new window.google.maps.InfoWindow();

      this.map = new window.google.maps.Map(document.getElementById('map'), {center: baseLocation, zoom: 15});

      var request = {
        location: baseLocation,
        radius: '500',
        type: ['restaurant']
      };

      var service = new window.google.maps.places.PlacesService(this.map);

      let _this = this
      service.nearbySearch(request, function(results, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            _this.createMarker(results[i]);
          }
          _this.map.setCenter(results[0].geometry.location);
        }
      });
    },
    createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;
      const marker = new window.google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
      });
      window.google.maps.event.addListener(marker, "click", () => {
        this.infowindow.setContent(place.name || "");
        this.infowindow.open(this.map, marker);
      });
    },
    loadScript(src, callback){
      var s,
          r,
          t;
      r = false;
      s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = src;
      s.onload = s.onreadystatechange = function() {
        if ( !r && (!this.readyState || this.readyState == 'complete') )
        {
          r = true;
          callback();
        }
      };
      t = document.getElementsByTagName('script')[0];
      t.parentNode.insertBefore(s, t);
    }
  },
}
</script>

<style lang="sass" scoped>
.home
  #map
    min-height: 450px
    min-width: 100%
  .lat-lng-form
    max-width: 500px
    margin: 50px auto
</style>