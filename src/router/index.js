import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import MyLists from '../views/MyLists.vue'
import ListPage from '../views/ListPage.vue'
import CloseBuy from '../components/CloseBuy.vue'
import Error from "../views/Error.vue"

//import map from "@/views/maps.vue"
//import MapLayout from "@/layouts/MapLayout"

import MapPlaceHolder from "../views/MapPlaceHolder.vue"

import {auth} from '../firebaseConfig.js'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuesax from 'vuesax'


import 'vuesax/dist/vuesax.css' //Vuesax styles
import VueSimpleAlert from "vue-simple-alert";

Vue.use(VueSimpleAlert);
Vue.use(Vuesax, {
  // options here
})

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/my-lists',
    name: 'MyLists',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: MyLists,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/my-lists/:id',
    name: 'ListPage',
    component: ListPage,
    props: function(route) {
      return {id: route.params.id}
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/add-place/:list_id',
    name: 'addPlace',
    component: CloseBuy,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/display-map/:list_id',
    name: 'mapPlaceHolderPage',
    component: MapPlaceHolder,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/404',
    name: 'Error',
    component: Error
  },

  /*{
    path: '/maps',
    component: MapLayout,
    children: [
      {
        path: '',
        name: 'map',
        component: map
      },
    ],
    meta: {
      requiresAuth: true
    }
  },*/


  {
    path: '*',
    name: 'Error',
    component: Error
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// this makes the router check each change in routes -- if their "meta" says it requires auth, it will check for auth.
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
