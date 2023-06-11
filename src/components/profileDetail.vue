<template>
  <q-dialog

    v-if="this.store.profileDetailActive" v-model="this.store.profileDetailActive"
     dark
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
  >
    <q-card class="text-dark" :style="{'width':this.store.mobileActive ? '100%' : '400px'}">
<!--       <q-card-section class="text-right">
        <q-btn icon="cancel" flat color="dark" v-on:click="goBack"></q-btn>
      </q-card-section> -->
      <q-card-section class="text-center" style="background: linear-gradient(to top right, #eeebeb 50%, #0d0d0e 50%);">
        <q-avatar size="150px" round>
          <img :src="this.user.userImage" v-if="this.user.userImage" alt="" style="object-fit:Cover;">
        </q-avatar>
      </q-card-section>
<!--       <q-card-section class="text-right">
        <q-btn icon="logout" flat color="grey-6" v-on:click="goBack"></q-btn>
      </q-card-section> -->
      <q-card-section class="text-center">
        <div class="text-overline text-weight-bold text-capitalize">
          {{ this.user.userName ?? this.user.email }} {{ this.user.userName && this.user.userLastName ? this.user.userLastName : '' }}
        </div>
        <div class="text-overline text-grey-7">
          <q-icon name="work" size="17px"></q-icon>
          {{ this.user.userDescription ?? '' }}
        </div>
        <div class="text-caption text-grey-6">
          <q-icon name="location_on" size="17px"></q-icon>
          {{ this.user.locationInformations ? this.user.locationInformations.details.country : '' }}, {{ this.user.locationInformations ? this.user.locationInformations.details.city : '' }}
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn icon="logout" flat color="grey-7" v-on:click="goBack"></q-btn>
        <q-btn icon="chat" flat color="grey-7" v-on:click="goChat"></q-btn>
        <q-btn icon="info" color="grey-7" flat v-on:Click="goUserDetail"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  props:['selectedUser'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      user:{}
    }
  },
  methods:{
    getUserFromDb(userData){
      axios.get(`${this.store.baseUrl}/bbc/users/${userData._id}`)
        .then(res =>{
          this.user = res.data
          console.log('user',res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goChat(){
      this.$router.push({path:'/chat'})
      this.store.selectedUserForDetail = this.user
    },
    goUserDetail(){
      this.$router.push({path:'/chat'})
      this.store.selectedUserForDetail = this.user
      this.store.selectedUserDetailActive = true
    },
    goBack(){
      this.store.profileDetailActive = false
    }
  },
  created(){

  },
  watch:{
    selectedUser:{
      handler(newValue,oldValue){
        if(newValue._id){
         // this.user = newValue
         const userData = newValue
         this.getUserFromDb(userData)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style>

</style>
