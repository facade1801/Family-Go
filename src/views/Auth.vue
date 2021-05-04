<template>
<div class="auth">

    <template v-if="!user">
      <b-button class="btn-xlarge" variant="primary" @click.prevent="signInWithGoogle">Sign Up to Start the Experience</b-button>
      
    </template>

    <template v-if="user">
      <img :src="user.photoURL" alt="avatar" style="width: 30px; height: 30px; border-radius: 50%;">
      <a href @click.prevent="signOut">Sign Out</a>
    </template>

    <!-- <pre>{{ user }}</pre> -->
  </div>
</template>

<style scoped>
.btn-xlarge {
   
    padding: 18px;
    font-size: 20px;
    line-height: normal;

}
</style>

<script>
import { auth, provider } from "@/firebaseConfig";
import {db} from "../firebaseConfig.js"
export default {
    components: {},
    name: "Auth",
  data() {
    return {
      user: null
    };
  },
  beforeCreate: function() {
    auth.onAuthStateChanged(user => {
      // console.log("user state:", user);
      // uncomment above to check out which user properties are available.
      if (user) {       
        this.user = user;
        db.collection("users").doc(this.user.uid).set({
            displayName: this.user.displayName,
            email: this.user.email
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        this.$router.push("/my-lists");
        // this.$router.go();
      }
    });
  },
  methods: {
    signInWithGoogle: function() {
      auth.signInWithRedirect(provider)
        .then(result => {
          this.user = result.user;
          
          db.collection("users").doc(this.user.uid).set({
              displayName: this.user.displayName,
              email: this.user.email
          })
          .then(() => {
              console.log("Document successfully written!");
          })
          .catch((error) => {
              console.error("Error writing document: ", error);
          });
          //this.$router.push("/my-lists");
        })
        .catch(err => console.log(err));
    },

    //not used
    signOut: function() {
      auth.signOut()
        .then(() => {
          this.user = null;
          //this. $router. push('/')
        })
        .catch(err => console.log(err));
    }
  }
};
</script>