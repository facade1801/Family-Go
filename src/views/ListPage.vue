<template>
  <b-container class="listpage_top" v-if="list && !list.loading" style="max-width: 1000px; margin-top:8px;">
    <div class="row">
    <div class="col-sm-12 col-md-6">
      <b-card style="opacity:0.85;">
        <b-card-title><EditableTitleText v-bind:id="this.id"></EditableTitleText></b-card-title>
        <b-card-text><EditableShared v-bind:id="this.id"></EditableShared></b-card-text>
        <b-card-text v-if="list.departure_time && list.created_at">
          Created On: {{ list.created_at.toDate().toISOString().slice(0, 10) }}
        </b-card-text>
        <b-card-text v-if="!edit_date" @click="edit_date = true">
          Departure Date: {{ list.departure_time.toDate().toISOString().slice(0, 10) }}  <i class="fa fa-pencil" aria-hidden="true"></i>
        </b-card-text>
        <b-card-text v-if="edit_date">
          <!-- <date-picker v-model="departure_time" @dp-change="saveDepartureDate"></date-picker> -->
          <b-form-datepicker id="example-datepicker" v-model="departure_time" class="mb-2" 
          @shown="loadcurrentDate"
          @input="saveDepartureDate" 
          @hidden="cancelSaveDepartureDate" style="
              width: 20%;
              margin: auto;
              min-width: 300px;
          ">
          </b-form-datepicker>
        </b-card-text>
        <b-button variant="primary" style="margin:4px" v-bind:to="'/add-place/' + this.id">Add a new place</b-button>
        <b-button variant="outline-primary" style="margin:4px" v-bind:to="'/display-map/' + this.id">View current places on the map</b-button>
        <b-button variant="primary" style="margin:4px" @click="exportGoogle()">Export to Google Maps</b-button>
      </b-card>
    </div>

      <!-- places -->
      <div class="col-sm-12 col-md-6">
        <div v-for="location in list.locations" :key="location.id">
          <div v-if="list.locations.indexOf(location)%2==0" class="column" style="background-color: rgb(255,255,255);">
            <b-icon icon="x-circle-fill" @click="delete_place(list.locations.indexOf(location))" style="float:right;"></b-icon>
            <h5>{{ location.name }}</h5>
            <!-- <p v-if="location.note">Note: <EditableNoteText v-bind:id="this.id"></EditableNoteText></p> -->
            <EditableNoteText v-bind:id="id" v-bind:index="list.locations.indexOf(location)"></EditableNoteText>
          </div>
          <div v-if="list.locations.indexOf(location)%2==1" class="column" style="background-color: rgb(214,228,255);">
            <b-icon icon="x-circle-fill" @click="delete_place(list.locations.indexOf(location))" style="float:right;"></b-icon>
            <h5>{{ location.name }}</h5>
            <!-- <p v-if="location.note">Note: <EditableNoteText v-bind:id="this.id"></EditableNoteText></p> -->
            <EditableNoteText v-bind:id="id" v-bind:index="list.locations.indexOf(location)"></EditableNoteText>
          </div>
        </div>
      </div>
    </div>
  </b-container>
  <div v-else>
    <h1>Loading...</h1>
    <b-button variant="primary" :to="'/my-lists/'">Back to my lists</b-button>
  </div>
</template>

<script>
import { db } from "../firebaseConfig.js";
import EditableTitleText from "../components/EditableTitleText.vue";
import EditableShared from "../components/EditableShared.vue";
import firebase from "firebase/app";
// import MapPlaceHolder from "./MapPlaceHolder.vue";
import EditableNoteText from "../components/EditableNoteText.vue"

export default {
  name: "ListPage",
  props: ["id"], //list id
  components: {
    EditableTitleText,
    EditableShared,
    EditableNoteText
  },

  data: function () {
    return {
      list: { loading: true }, //this list
      departure_time: new Date(),
      edit_date: false,
      exportLink2: 'https://www.google.com/maps/dir',
    };
  },
  created () {
    document.title = "Family Go: My List";
    document.getElementById("exportLink").setAttribute("href", this.exportLink2);
  },
  beforeUpdate() {
    if (!this.list) {
      //this.$router.push("/404");
    }
  },
  firestore: function () {
    return {
      list: db.collection("lists").doc(this.id), //get list by id
      // departure_date: db.collection("lists").doc(this.id).departure_date.toDate()
    };
  },
  methods: {
    getDate: function (date) {
      return (
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
      );
    },
    exportGoogle: function() {
      var websitelink = "https://www.google.com/maps/dir/";
      var mylist = this.list.locations;
      for (const location of mylist) {
        const words = location.name.split(' ');
        for (const word of words) {
          websitelink += word;
          websitelink += '+';
        }
        if (location.address) {
          const addrs = location.address.split(' ');
          for (const addr of addrs) {
            websitelink += addr;
            websitelink += '+';
          }
        }
        websitelink += '/';
      }
      window.location.href = websitelink;
    },
    loadcurrentDate: function(){
      this.departure_time = this.list.departure_time.toDate();
      console.log(this.departure_time);
    },
    saveDepartureDate: function () {
      // However we want to save it to the database
      this.departure_time = new Date(this.departure_time);
      this.list.departure_time = firebase.firestore.Timestamp.fromDate(
        this.departure_time
      );
      this.$firestoreRefs.list
        .update({ departure_time: this.departure_time })
        .then(() => {});
      this.edit_date = false;
    },
      cancelSaveDepartureDate: function () {
      this.edit_date = false;
    },
    delete_place: function (index) {
      this.$confirm("Remove this place?").then(()=>{
        this.list.locations.splice(index, 1);
        this.$firestoreRefs.list.set(this.list);
      })
    },
  },
};
</script>

<style scoped>

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 50%;
  padding: 10px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.column {
  width: 100%;
}
.button-a {
  background: rgb(66, 184, 221);
  border-radius: 1px;
  color: #0e0501;
  width: 250px;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 20px;
}
</style>