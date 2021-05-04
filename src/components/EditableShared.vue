<template>
  <div class="editable_shared">
    <div v-if="list&&!editing">
        <span @click="enableEditing" v-for="people in list.displayNameMap" :key="people.id"
            >{{ people }},
        </span>
        <i class="fa fa-plus-circle" aria-hidden="true" @click="enableEditing"></i>
    </div>
    <div v-if="list&&editing">
      <input v-model="tempValue" placeholder="input an email address" />
      <b-button @click="disableEditing" style="margin-left: 0.5%">Cancel</b-button>
      <b-button @click="saveEdit" style="margin-left: 0.5%">Add</b-button>
    </div>
  </div>
</template>

<script>
import { db } from "../firebaseConfig.js";

export default {
  name: "EditableShared",
  props: ["id"], 
  data: function () {
    return {
        list: null,
        tempValue: null,
        editing: false,
        // user: null
    }
  },
  firestore: function () {
    return {
      list: db.collection("lists").doc(this.id), //get list by id
    //   user: db.collection("user")
    }
  },
  methods: {
    enableEditing: function(){
      this.tempValue = "";
      this.editing = true;
    },
    disableEditing: function(){
      this.tempValue = "";
      this.editing = false;
    },
    saveEdit: function(){
      // However we want to save it to the database
    //   this.list.displayMap[this.tempValue];
    //   this.$firestoreRefs.list.update({ title: this.list.title}).then(() => {})
        var dbRef = db.collection('users');
        if (!this.list.shared_with.includes(this.tempValue)){
            dbRef.where("email", "==", this.tempValue).get()
            .then((querySnapshot) => {
                var exist = 0;
                querySnapshot.forEach((doc) => {
                    this.list.displayNameMap[this.tempValue] = doc.data().displayName;
                    this.list.shared_with.push(this.tempValue);
                    this.$firestoreRefs.list.update({ displayNameMap: this.list.displayNameMap, shared_with: this.list.shared_with}).then(() => {});
                    exist += 1;
                    this.disableEditing();
                });
                if (exist==0){
                    this.$alert("User "+this.tempValue+" has not registered. Please share family_go with them ^o^");
                }
                
            })
            .catch((error) => {
                console.log(error);
                this.disableEditing();
            });
        }else{
            this.$alert("User "+this.tempValue+" has already joined the list.");
            this.disableEditing();
        }

        
    }
  }
};
</script>