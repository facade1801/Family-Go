<template>
  <div id="app">
    <!-- this is the new navigation bar. Added by Jia -->
    <div>
      <!-- Navigation bar type -->
      <b-navbar toggleable="sm" type="dark" class="navbar navbar-default navbar-fixed-top">
        <b-navbar-brand href="/">Family Go!</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/my-lists">My Lists</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <template v-if="!user">
              <b-nav-item>
                <a href @click.prevent="signInWithGoogle">Log In/Sign Up</a>
              </b-nav-item>
            </template>

            <template v-if="user">
              <b-nav-item-dropdown right>
                <template #button-content>
                  <img :src="user.photoURL" alt="avatar"
                    style=" width: 30px; height: 30px; border-radius: 25%; margin-right: 10px; " />
                  <label style="margin-bottom: 0rem !important">{{ user.displayName }}</label>
                </template>
                <b-dropdown-item @click.prevent="signOut">Sign Out</b-dropdown-item>
              </b-nav-item-dropdown>
            </template>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url('https://images.pexels.com/photos/706484/pexels-photo-706484.png?');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  min-height: 100%;
  width: 100%;
  min-height: 100vh;
}

.navbar {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
  position: relative;
  z-index: 100;
  background-color:#023E8A;
}
</style>

<script>
import { auth, provider } from "@/firebaseConfig";
import {db} from "./firebaseConfig.js"

export default {
  components: {},
  name: "Auth",
  data() {
    return {
      user: null,
    };
  },
  created () {
    document.title = "Family Go!";
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
        // this.$router.push("/my-lists");
        // this.$router.go();
      }
    });
  },
  methods: {
    signInWithGoogle: function () {
      console.log("here1");
      auth
        .signInWithRedirect(provider)
        .then(result => {
          console.log("here");
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
        })
        //.catch(err => console.log(err));
        this.$router.push("my-lists");
    },
    signOut: function () {
      auth
        .signOut()
        .then(() => {
          this.user = null;
          this. $router. push('/')
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>