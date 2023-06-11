<template>
  <div class="appAll bg-dark text-white">
    <transition-group apper enter-active-class="animated fadeIn slower" leave-active-class="animated fadeOut slower">
      <router-view />
    </transition-group>
  </div>
</template>

<script>
import axios from 'axios'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {db} from './firebase/index.js'
import { defineComponent } from 'vue'
import {useCounterStore} from './stores/store'
export default defineComponent({
  name: 'App',
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    findMe(){
      const result = this.store.allUser.find(object => object.userId === this.store.firebaseInfoUser.uid)
      if(result){
        this.store.userDetail = result
        console.log('userDetail from mongo',this.store.userDetail)
      }
    },
    getCurrentUserInfo(){
      const url = 'http://localhost:8000';
      axios.get(`${this.store.baseUrl}/bbc/users`)
        .then(response => {
          this.store.allUser = response.data
          console.log('appgetcurrentuserınfo',response.data);
          console.log(this.store.allUser)
          this.findMe()
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleResize() {
      this.store.window.width = window.innerWidth;
      this.store.window.height = window.innerHeight;
      //console.log('window',this.window)
    },
    checkLoggedOrNot(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          // ...
          this.store.firebaseInfoUser = user
          console.log('user in',user)
          this.getCurrentUserInfo()
        } else {
          // User is signed out
          // ...
          console.log('user signed out')
          this.$router.replace({path:'/login'})
        }
      });
    }
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch:{
    'store.window':{
      handler(newValue,oldValue){
        if(newValue.width<580){
          this.store.newHeight = 300
          this.store.mobileActive = true
          console.log('newHeight',this.store.newHeight)
          console.log('avatar',this.store.mobileActive)
        }else{
          this.store.newHeight = ''
          this.store.mobileActive = false
          console.log('avatar',this.store.mobileActive)
          console.log('newHeight',this.store.newHeight)
        }
      },
      immediate:true,
      deep:true
    },
    $route:{
      handler(route){
        const path  = route.path
        this.checkLoggedOrNot()
      }
    },
  }
})
</script>


<style>
  .appAll{
    font-family: 'Roboto', sans-serif;
  }
</style>
