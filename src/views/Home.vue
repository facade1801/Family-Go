<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo3-lg.png" class="img-fluid" style="max-height:500px;">
    <Auth/>
  </div>
</template>

<script>
import Auth from "../views/Auth"
export default {
  name: 'Home',
  components: {
    Auth
  },
  created () {
    document.title = "Family Go!";
  }
}
</script>

<style scoped>

  h1{
     color: #ec931e; 
  }
  
</style>