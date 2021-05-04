<template>
<div>
    <b-card v-if="list_row" class="list_row text-center item" style="margin:8px;">
        <b-row>
            <b-col style="padding-right:0px;">
                <b-card-title>{{ list_row.title }}</b-card-title>
                Created at: {{list_row.created_at.toDate().toISOString().slice(0,10)}}<br>
                Owner(s): <template v-for="displayName in list_row.displayNameMap">{{displayName}}, </template>
                <a v-bind:href="'/my-lists/' + this.id" class="stretched-link"></a>
            </b-col>
            <b-col class="col-auto" style="padding:0px; top:-16px;">
                <b-icon @click="deleteList" icon="x-octagon-fill" style="float:right;">delete</b-icon>
            </b-col>
        </b-row>
    </b-card>
</div>
</template>

<script>
import {db} from "../firebaseConfig.js"
import firebase from 'firebase'

export default {
    name: "ListRow",

    props: ["id"],

    data: function() {
        return {
            // list_row: {id: 1, title: "weekend plan", shared_with: ["Ruoyan", "jia jun"], created_at: "2021-03-29"},
            list_row: null,
        };
    },

    firestore: function() {
        return {
            list_row: db.collection("lists").doc(this.id)
        }

    },

    computed: {
        listLink: function() {
            return '/my-lists/' + this.id;
        }
    },
    
    methods: {
        deleteList: function() {
          this.$confirm("Remove this list?").then(()=>{
              if (this.list_row.owner == firebase.auth().currentUser.email){
                    db.collection("lists").doc(this.id).delete();
                    this.$alert("List deleted.")
                }
                else {
                    var index = this.list_row.shared_with.indexOf(firebase.auth().currentUser.email);
                    if (index !== -1) {
                        this.list_row.shared_with.splice(index, 1);
                    }
                    delete this.list_row.displayNameMap[firebase.auth().currentUser.email];
                    // this.list_row.displayNameMap.delete(firebase.auth().currentUser.email);
                    this.$firestoreRefs.list_row.update({ displayNameMap: this.list_row.displayNameMap, shared_with: this.list_row.shared_with}).then(() => {});
                    this.$alert("You are no longer in this list.")
                }
          })
        }
    }
}
</script>

<style scoped>
.clickable {
    cursor: pointer;
    color:red;
}

</style>