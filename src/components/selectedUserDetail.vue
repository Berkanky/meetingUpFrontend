<template>
  <q-dialog
    v-model="this.store.selectedUserDetailActive" v-if="this.store.selectedUserDetailActive"
    persistent
    :maximized="this.store.mobileActive ? true : false"
    :full-height="this.store.mobileActive ? true : false"
    dark
  >
    <q-card :style="{'width':this.store.mobileActive ? '100%' : '700px'}" class="bg-dark text-white">
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="goBack"></q-btn>
        <q-space></q-space>
        <div class="text-overline text-weight-bold">
          <q-icon name="mail"></q-icon>
          {{ this.store.selectedUserForDetail.email }}
          <q-btn icon="fiber_manual_record" flat :color="this.checkUserOnlineOrNot() ? 'green' : 'red'" size="sm"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-avatar size="150px" v-on:click="this.zoomProfilePic()">
          <img :src="this.store.selectedUserForDetail.userImage" alt="" v-if="this.store.selectedUserForDetail.userImage" style="object-fit:Cover;">
          <q-btn icon="person" color="dark" round size="40px"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section>
        <div class="text-center text-weight-bold text-capitalize">
          {{ this.store.selectedUserForDetail.userName && this.store.selectedUserForDetail.userLastName ?  this.store.selectedUserForDetail.userName + ' ' + this.store.selectedUserForDetail.userLastName : this.store.selectedUserForDetail.email}}
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn icon="person_add" color="green" push v-on:click="addFriends" v-if="!this.checkInFriendsOrNot()"></q-btn>
        <q-btn icon="person_remove" color="red" push v-on:click="removeFromFriends" v-if="this.checkInFriendsOrNot()"></q-btn>
      </q-card-section>
      <q-separator color="grey-6" size="1px"></q-separator>
      <q-card-section class="">
        <q-card class="bg-dark text-white" dark>
          <q-card-section horizontal>
            <q-card-section class="col-6 text-center">
              <div class="text-subtitle2 text-weight-bold">
                <q-icon name="flag"></q-icon>
                Country : {{ this.store.selectedUserForDetail.locationInformations ? this.store.selectedUserForDetail.locationInformations.details.country : '' }}
              </div>
            </q-card-section>
            <q-card-section class="col-6 text-center">
              <div class="text-subtitle2 text-weight-bold">
                <q-icon name="location_city"></q-icon>
                City : {{ this.store.selectedUserForDetail.locationInformations ? this.store.selectedUserForDetail.locationInformations.details.city  : '' }}
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="row">
        <q-card class="col-6 bg-dark" style="height:150px;">
          <q-card-section style="height:150px;">
            <q-btn color="white" class="full-width full-height" :icon="checkUserGenderIcon()" flat></q-btn>
          </q-card-section>
        </q-card>
        <q-card class="col-6 bg-dark text-white" style="height:150px;">
          <div class="text-overline text-weight-bold text-capitalize q-pa-md">
            <q-icon name="work" size="17px"></q-icon>
            <span class="q-ma-sm"></span>
            {{ this.store.selectedUserForDetail.userDescription  ?? 'No information' }}
          </div>
        </q-card>
      </q-card-section>
      <q-card-section class="row q-ma-sm">
        <q-card
          v-on:click="zoomEachImage(data)"
          v-if="this.store.selectedUserForDetail.userImages.length"
          :key="key"
          class="bg-dark col-4" bordered style="height:100px;"
          v-for="(data,key) in this.store.selectedUserForDetail.userImages">
          <q-img :src="data.image.image" style="object-fit:Cover;height:100px;"></q-img>
        </q-card>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2 q-pa-md">
          <q-icon name="group"></q-icon>
          Bazı Ortak Grouplar
        </div>
        <commonEvents/>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2 q-pa-md">
          <q-icon name="person"></q-icon>
          Bazı Ortak Arkadaşlar
        </div>
        <q-scroll-area
          dark
          class="bg-dark text-white rounded-borders"
          style="width:100%;height:200px;"
        >
          <q-card class="bg-dark text-white" flat v-for="(data,key) in this.commonFriends" :key="key" v-if="this.commonFriends.length">
            <q-card-section horizontal>
              <q-card-section class="col-3">
                <q-avatar>
                  <img :src="data.detail.userImage" style="object-fit:cover;" alt="" v-if="data.detail.userImage">
                  <q-btn icon="person" color="dark" round v-if="!data.detail.userImage"></q-btn>
                </q-avatar>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="text-subtitle2">
                  <q-icon name="person"></q-icon>
                  {{ data.detail.userName ?? data.detail.email }}, {{ data.detail.userName && data.detail.userLastName ? data.detail.userLastName : '' }}
                </div>
                <div class="text-caption text-grey-5">
                  <q-icon name="badge"></q-icon>
                  {{ data.detail.userDescription ?? '' }}
                </div>
              </q-card-section>
              <q-card-section class="col-3">
                <q-btn icon="person" flat color="white" v-on:click="selectUser(data)"></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-scroll-area>
      </q-card-section>
    </q-card>
    <profileDetail v-if="this.store.profileDetailActive" :selectedUser="this.selectedUser"/>
    <zoomImage v-if="this.store.zoomImageActive"/>
  </q-dialog>
</template>

<script>
import profileDetail from './profileDetail.vue'
import commonEvents from './commonEvents.vue'
import zoomImage from './zoomImage.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    zoomImage,
    commonEvents,
    profileDetail
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      commonFriends:[],
      selectedUser:{}
    }
  },
  methods:{
    selectUser(data){
      const selectedUser = {
        _id:data.detail._id
      }
      this.selectedUser = selectedUser
      this.store.profileDetailActive = true
    },
    getCommonFriends(){
      axios.get(`${this.store.baseUrl}/bbc/friendList/${this.store.selectedUserForDetail._id}/${this.store.userDetail._id}/commonFriends`)
        .then(res=>{
          this.commonFriends = res.data
          console.log('commonFriends',this.commonFriends)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    zoomProfilePic(){
      this.store.selectedImage.image = this.store.selectedUserForDetail.userImage
      this.store.selectedImage.id = 0
      this.store.zoomImageActive = true
    },
    zoomEachImage(data){
      this.store.selectedImage.image = data.image.image
      this.store.selectedImage.id = 0
      this.store.zoomImageActive = true
    },
    checkUserGenderIcon(){
      if(this.store.selectedUserForDetail.gender){
        const icon = this.store.selectedUserForDetail.gender
        return icon
      }else{
        const icon = 'info'
        return icon
      }
    },
    checkUserOnlineOrNot() {
      const { allUser, selectedUserForDetail } = this.store;
      const result = allUser.find(user => user._id === selectedUserForDetail._id);
      return result?.online ?? false;
    },
    removeFromFriends(){
      const baseUrl = 'http://localhost:8000';
      const url = `${this.store.baseUrl}/bbc/friendlists/${this.store.userDetail._id}/friends/${this.store.selectedUserForDetail._id}`;
      axios.delete(url)
        .then(response => {
          console.log('friend deleted:', response.data);
          // refresh friend list or update UI
          this.store.getFriendList()
        })
        .catch(error => {
          console.log('error deleting friend:', error.message);
        });
    },
    checkInFriendsOrNot(){
      const result = this.store.myFriendList.find(object => object.selectedUserId === this.store.selectedUserForDetail._id)
      if(result){
        return true
      }else{
        return false
      }
    },
    sendToInfoToUser(){
      const newData = {
        userId:this.store.userDetail._id
      }
      axios.post(`${this.store.baseUrl}/bbc/notifylists/${this.store.userDetail._id}/${this.store.selectedUserForDetail._id}/sendInfosToSelectedUser`,newData)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    async addFriends(){
      const url = 'http://localhost:8000'; // replace this with the URL of your remote server
      const selectedUserId = this.store.selectedUserForDetail._id;
      const name  = this.store.selectedUserForDetail.name ?? '';
      const email = this.store.selectedUserForDetail.email;
      try {
        const response = await axios.post(`${this.store.baseUrl}/bbc/friendlists/${this.store.userDetail._id}/friends`, {
          selectedUserId,
          name,
          email
        });
        console.log(response.data); // log the response to the console
        this.sendToInfoToUser()
        this.store.getFriendList()
      } catch (error) {
        console.error(error.message); // log the error message to the console
      }
    },
    goBack(){
      this.store.selectedUserDetailActive = false
    }
  },
  created(){
    this.getCommonFriends()
  },
  watch:{

  }
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
