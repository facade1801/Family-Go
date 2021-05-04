<template>
  <div class="editable_text">
    <div v-if="list&&!editing&&list.locations[this.index].note">
      <span class='text' @click="enableEditing">Note: {{list.locations[this.index].note}}  <i class="fa fa-pencil" aria-hidden="true"></i></span>
    </div>
    <div v-if="list&&!editing&&!list.locations[this.index].note">
      <span class='text' @click="enableEditing">Note: <i class="fa fa-plus-circle" aria-hidden="true" @click="enableEditing"></i></span>
    </div>
    <div v-if="list&&editing">
      <input v-model="tempValue" class="input" style="width: 60%; max-width: 450px"/>
      <b-button @click="disableEditing" style="margin-left: 0.5%; margin-bottom: 0.5rem" > Cancel </b-button>
      <b-button @click="saveEdit" style="margin-left: 0.5%; margin-bottom: 0.5rem"> Save </b-button>
    </div>
  </div>
</template>

<script>
import { db } from "../firebaseConfig.js";

export default {
  name: "EditableNoteText",
  props: ["id", "index"], 
  data: function () {
    return {
        list: null,
        tempValue: null,
        editing: false
    }
  },
  firestore: function () {
    return {
      list: db.collection("lists").doc(this.id), //get list by id
    }
  },
  methods: {
    enableEditing: function(){
      this.tempValue = this.list.locations[this.index].note;
      this.editing = true;
    },
    disableEditing: function(){
      this.tempValue = null;
      this.editing = false;
    },
    saveEdit: function(){
      // However we want to save it to the database
      this.list.locations[this.index].note = this.tempValue;
      this.$firestoreRefs.list.update({ locations: this.list.locations}).then(() => {})
      this.disableEditing();
    }
  }
};
</script>