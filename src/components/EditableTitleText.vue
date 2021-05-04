<template>
  <div class="editable_text">
    <div v-if="list&&!editing">
      <span class='text' @click="enableEditing">{{list.title}}  <i class="fa fa-pencil" aria-hidden="true"></i></span>
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
  name: "EditableTitleText",
  props: ["id"], 
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
      this.tempValue = this.list.title;
      this.editing = true;
    },
    disableEditing: function(){
      this.tempValue = null;
      this.editing = false;
    },
    saveEdit: function(){
      // However we want to save it to the database
      this.list.title = this.tempValue;
      this.$firestoreRefs.list.update({ title: this.list.title}).then(() => {})
      this.disableEditing();
    }
  }
};
</script>