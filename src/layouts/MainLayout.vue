<template>
  <q-layout view="lHh LpR fFf">

    <q-header elevated class="bg-grey-9 text-white" v-if="this.store.firebaseInfoUser.uid&&this.$route.path!=='/chat'">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title><!--
          <q-avatar>
            <img src="">
          </q-avatar>
          Title -->
        </q-toolbar-title>
        <q-btn icon="person" color="white" flat v-on:click="goProfile"></q-btn>
        <q-btn icon="notifications" flat color="white" v-on:click="openNotify">
          <q-badge floating color="red" rounded />
        </q-btn>
       <!--  <q-btn dense flat round icon="menu" @click="toggleRightDrawer" /> -->
       <!-- <q-btn icon="logout" flat color="white" v-on:click="logoutButton"></q-btn> -->
      </q-toolbar>
    </q-header>

    <!-- <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated class="bg-dark text-white" v-if="this.store.firebaseInfoUser.uid&&leftDrawerOpen&&this.$route.path!=='/chat'">
       <q-btn
        v-on:click="goRouter(data)"
        :color="this.findCurrentRouter(data) ? 'white' : 'dark'" :text-color="this.findCurrentRouter(data) ? 'dark' : 'white'"
        :icon="data.icon" class="full-width" no-caps :label="data.label"
        v-for="data in this.options" :key="data.id" ></q-btn>
    </q-drawer> -->

    <q-drawer
      elevated
      class="bg-grey-9 text-white"
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="400"
      v-if="this.store.firebaseInfoUser.uid&&leftDrawerOpen&&this.$route.path!=='/chat'"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
          <q-list padding>
            <q-item
              :class="this.findCurrentRouter(data) ? 'bg-white text-dark' : ''"
              clickable
              v-ripple v-for="(data,key) in this.options" :key="key" v-on:click="goRouter(data)">
              <q-item-section avatar>
                <q-icon :name="data.icon" />
              </q-item-section>
              <q-item-section>
                {{data.label}}
              </q-item-section>
              <q-item-section v-if="this.findCurrentRouter(data)" avatar>
                <q-icon name="chevron_right"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" :src="this.myOtherImages()" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="this.store.firebaseInfoUser.photoURL ?? this.store.userDetail.userImage" style="object-fit:cover;">
            </q-avatar>
            <div class="text-weight-bold">{{this.store.userDetail.userName}}, {{ this.store.userDetail.userLastName ?? '' }}</div>
            <div>
              <q-icon name="mail"></q-icon>
              {{ this.store.userDetail.email }}
            </div>
          </div>
        </q-img>
        <q-item clickable v-ripple class="absolute-bottom">
          <q-item-section>
            <q-btn icon="logout" flat label="Logout" no-caps v-on:click="this.logoutButton()"></q-btn>
          </q-item-section>
        </q-item>
      </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" elevated v-if="rightDrawerOpen">
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-grey-9 text-white" v-if="this.$route.path === '/login'">
      <q-toolbar class="text-right">
        <q-toolbar-title style="font-size:15px;" class="text-weight-bold text-capitalize">
          Copyright © 2023 Connectify. All rights reserved.
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import logo from '../logo/group.png'
import axios from 'axios'
import { getAuth, signOut } from "firebase/auth";
import { ref } from 'vue'
import { useCounterStore} from 'src/stores/store'
export default {
  setup () {
    const store = useCounterStore()
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      logo,
      store,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  },
  data:function(){
    return{
      currentRouterPath:'',
      options:[
        {id:0,label:'Home',icon:'home',path:'/'},
        {id:5,label:'Chat',icon:'chat',path:'/chat'},
        {id:6,label:'Create Event Group',icon:'groups',path:'/createEventGroup'},
        {id:7,label:'My Event Groups',icon:'group',path:'/myEventPage'},
        {id:8,label:'Show Events',icon:'diversity_1',path:'/allEvents'}
      ]
    }
  },
  methods:{
    openNotify(){
      this.store.notifyCompActive = true
    },
    myOtherImages(){
/*       if(this.store.userDetail.userImages.length){
        const randomNumber = Math.floor(Math.random() * this.store.userDetail.userImages.length);
        const image = this.store.userDetail.userImages[randomNumber].image.image
        return image
      }else{
        const image = 'https://cdn.quasar.dev/img/material.png'
        return image
      } */
      //'https://cdn.quasar.dev/img/material.png'
      const image = 'https://cdn.quasar.dev/img/material.png'
      return image
    },
    goProfile(){
      this.$router.push({path:'/profile'})
    },
    logoutMessage(){
      this.$q.notify({
          message: `${this.store.firebaseInfoUser.email} Çıkış Yapıldı !`,
          color: 'red',
          multiLine: true,
          position: 'top',
          size: 'large',
          avatar:this.store.firebaseInfoUser.photoURL,
          actions: [
            { label: 'Close', color: 'white', handler: () => { /* ... */ } }
          ]
        })
    },
    updateOnlineStatus(){
      const url = 'http://localhost:8000';
      const userData = {
        userId:this.store.firebaseInfoUser.uid,
        email:this.store.firebaseInfoUser.email,
        date:Date.now(),
        online:false
      }
      axios.put(`${url}/bbc/users/${this.store.userDetail._id}`, userData)
        .then(({ data }) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    logoutButton(){
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
        this.updateOnlineStatus()
        this.logoutMessage()
        this.store.userDetail = {}
        this.store.firebaseInfoUser = {}
        this.$router.replace({path:'/login'})
      }).catch((error) => {
        // An error happened.
      });
    },
    goRouter(data){
      this.$router.push({path:data.path})
    },
    findCurrentRouter(data){
      if(this.$route.path === data.path){
        return true
      }else{
        return false
      }
    }
  },
  created(){

  },
  watch:{
    '$route.params':{
      handler(newValue,oldValue){
        if(newValue){

        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>
