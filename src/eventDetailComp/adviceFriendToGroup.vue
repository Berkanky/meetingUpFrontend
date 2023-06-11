<template>
  <q-dialog
    v-model="this.store.adviceFrientToGroupCompActive"
    persistent
    dark
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? '' : 'top'"
  >
    <q-card
      :style="{
          'max-width':this.store.mobileActive ? '100%' : '500px',
          'width':this.store.mobileActive ? '100%' : '500px'
        }"
      class="bg-dark text-white"
    >
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="this.findUser"
            dark color="white" label="Select Friend OR Search"
          >
            <template v-slot:prepend>
              <q-icon name="person"></q-icon>
            </template>
            <template v-slot:append v-if="this.findUser">
              <q-btn icon="remove" color="dark" round v-on:click="this.findUser = ''"></q-btn>
            </template>
            <template v-slot:after v-if="this.findUser">
              <q-btn icon="search" color="dark" round size="sm"></q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-card
            v-for="(data,key) in this.store.updatedMyFriendList" :key="key"
            class="bg-dark text-white" flat>
            <q-card-section horizontal>
              <q-card-section class="col-3">
                <q-avatar>
                  <img
                    :src="data.userImage" v-if="data.userImage" style="object-fit:Cover;" alt="">
                  <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
                </q-avatar>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="text-subtitle2">
                  <q-icon name="person"></q-icon>
                  {{ data.userName ?? data.email }},
                  {{ data.userName && data.userLastName ? data.userLastName : '' }}
                </div>
                <div class="text-caption text-grey-5">
                  <q-icon name="work"></q-icon>
                  {{ data.userDescription ?? '' }}
                </div>
              </q-card-section>
              <q-card-section class="col-3">
                <q-btn icon="share" flat color="white" v-on:click="shareToEventAdviceList(data)"></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md text-subtitle2">
            <q-icon name="group"></q-icon>   Advices
          </div>
        </q-card-section>
        <q-card-section>
          <q-card
            v-for="(data,key) in this.adviceList" :key="key"
            class="bg-dark text-white" flat>
            <q-card-section horizontal>
              <q-card-section class="col-3">
                <q-avatar>
                  <img
                    :src="data.detail.userImage" v-if="data.detail.userImage" style="object-fit:Cover;" alt="">
                  <q-btn icon="person" color="dark" round v-if="!data.detail.userImage"></q-btn>
                </q-avatar>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="text-subtitle2">
                  <q-icon name="person"></q-icon>
                  {{ data.detail.userName ?? data.detail.email }},
                  {{ data.detail.userName && data.detail.userLastName ? data.detail.userLastName : '' }}
                </div>
                <div class="text-caption text-grey-5">
                  <q-icon name="work"></q-icon>
                  {{ data.detail.userDescription ?? '' }}
                </div>
              </q-card-section>
              <q-card-section class="col-3" horizontal v-if="this.store.userDetail._id === this.store.currentEvent.createrId">
                <q-btn
                  icon="delete_forever" flat color="white" v-on:click="removeFromAdvicesList(data)"></q-btn>
                <q-btn icon="add" flat color="white" v-on:Click="sendRequest(data)"></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return {
      store
    }
  },
  data:function(){
    return{
      findUser:'',
      adviceList:[]
    }
  },
  methods:{
    sendRequest(data){
      console.log(data)
      const eventData = this.store.currentEvent
      axios.post(`${this.store.baseUrl}/bbc/notifylists/${this.store.userDetail._id}/${data.detail._id}/${this.store.currentEvent._id}/sendRequest`,eventData)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    removeFromAdvicesList(data){
      axios.delete(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/${this.store.userDetail._id}/${data.detail._id}/removeFromAdviceList`)
        .then(res=>{
          console.log(res)
          this.adviceList = this.adviceList.filter(object => object.userId !== data.userId)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getAdviceList(eventData){
      axios.get(`${this.store.baseUrl}/bbc/eventlists/${eventData._id}/getAdviceList`)
        .then(res=>{
          console.log('getadvicelist',res)
          this.adviceList = res.data.adviceList
        })
        .catch(err=>{
          console.log(err)
        })
    },
    shareToEventAdviceList(data){
      const selectedUserData = data
      axios.post(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/${this.store.userDetail._id}/postAdviceList`,selectedUserData)
        .then(res=>{
          console.log(res)
          if(!res.data.message){
            const userData = {
              userId:data._id,
              detail:data
            }
            this.adviceList.push(userData)
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goBack(){
      this.store.adviceFrientToGroupCompActive = false
    },
  },
  created(){

  },
  watch:{
    'store.currentEvent':{
      handler(newValue,oldValue){
        if(newValue._id){
          const eventData =  newValue
          this.getAdviceList(eventData)
        }
      },
      immediate:true,
      deep:true
    },
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getFriendList()
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
