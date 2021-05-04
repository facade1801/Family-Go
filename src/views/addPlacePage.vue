<template>
  <div class="placeSearchbar">
    <closeBuy :list_id=id></closeBuy>
  </div>
</template>

<script>
import closeBuy from '../components/CloseBuy.vue'
export default { 
  name: "addPlacePage",
  components: {
      closeBuy
  },
  
  props: function() {
    return {
      props: ["id"] 
    }
  },
  created: function(){
    console.log("list id in addplace: "+this.id);
  }
}
</script>
