<template>
<b-container style="max-width: 1000px;">
  <div class="row">
    <div class="col-sm-12 col-md-5">
      <br><h1>My Lists</h1><br>
      <!-- <b-img src="https://popuppainting.com/wp-content/uploads/2018/08/blue-sky.jpg" fluid></b-img> -->
      <b-button variant="primary" @click="addNewList">Create a new list!</b-button>
    </div>

    <div class="col-sm-12 col-md-7" style="opacity:0.85;">
      <ListRow v-for="list_row in mylists" :key="list_row.id" :id = "list_row.id"/>
    </div>
  </div>
</b-container>
</template>

<script>
import { db } from "../firebaseConfig.js"
import { auth } from "@/firebaseConfig"
import firebase from 'firebase'
import ListRow from "../components/ListRow.vue"
export default { 
  name: "MyLists",
  components: {
      ListRow
  },
  created () {
    document.title = "Family Go: My Lists";
  },
  beforeCreate: function() {
    auth.onAuthStateChanged(user => {
      console.log("user state:", user);
      // uncomment above to check out which user properties are available.
      if (!user) {       
        //this.$router.push("/"); this have already been done in router
      }else{
        this.user = user;
        // this.todos = this.$firestoreRefs['todos'].orderBy("timestamp", "desc").where("done", "==", false).where("userId", "==", this.user);

      }
    });
  },

  data : function() {
    return {
        mylists: [],
        next_list:"",
        times:0
    }
  },

  firestore: function () {
    if (!firebase.auth().currentUser){
      return {}
    }else{
      return {
          mylists: db.collection("lists").where("shared_with", "array-contains", firebase.auth().currentUser.email).orderBy("created_at", "desc"),
      }
    }
    


  },

  methods:{
    addNewList: function() {
      this.$prompt("Type the name of the new list here").then(result=>{
        var newRecord = {
        title: result, 
        created_at: new Date(), 
        departure_time: new Date(),
        locations:[],
        shared_with: [firebase.auth().currentUser.email,], 
        displayNameMap:{
          [this.user.email]: this.user.displayName
          },
        owner: this.user.email
        };
      // add a new list.
      db.collection("lists").add(newRecord).then((docRef) => {
        this.next_list=db.collection("lists").doc(docRef.id);
        this.times++;
        while(!this.next_list&&this.times<10){
          this.next_list=db.collection("lists").doc(docRef.id);
          this.times++;
        }
        console.log("search times+++++++++++++++"+this.times);
        this.$router.push({ name: 'ListPage', params: { id: docRef.id } });
        if(this.times>=10){
          this.$router.go();
        }

      });
      })

    }
    
  },
}
</script>
