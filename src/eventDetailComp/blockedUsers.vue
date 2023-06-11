<template>
  <q-dialog
    v-model="this.store.eventBlockedCompActive"
    persistent
    dark
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? '' : 'right'"
  >
    <q-card
      :style="{
          'max-width':this.store.mobileActive ? '100%' : '500px',
          'width':this.store.mobileActive ? '100%' : '500px'
        }"
        class="bg-dark text-white"
    >
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn icon="block" flat color="white"></q-btn>
        </q-card-section>
        <q-card-section>
          <transition-group appear enter-active-class="animated fadeInRight slower" leave-active-class="animated fadeOutRight slower">
            <q-card
              v-if="this.blockedList.length"
              v-for="(data,key) in this.blockedList" :key="key"
              flat class="bg-dark text-white" >
              <q-card-section  horizontal>
                <q-card-section class="col-3">
                  <q-avatar>
                    <img :src="data.detail.userImage" v-if="data.detail.userImage" style="object-fit:Cover;" alt="">
                    <q-btn icon="person" round color="dark" v-if="!data.detail.userImage"></q-btn>
                  </q-avatar>
                </q-card-section>
                <q-card-section class="col-6">
                  <div class="text-subtitle2">
                    <q-icon name="person"></q-icon>
                    {{ data.detail.userName ?? data.detail.userName }},
                    {{ data.detail.userLastName && data.detail.userName ? data.detail.userLastName : '' }}
                  </div>
                  <div class="text-caption text-grey-5">
                    <q-icon name="work"></q-icon>
                    {{ data.detail.userDescription ?? '' }}
                  </div>
                </q-card-section>
                <q-card-section class="col-3">
                  <q-btn icon="undo" flat color="white" v-on:click="removeFromBlocked(data)"></q-btn>
                </q-card-section>
              </q-card-section>
            </q-card>
            <q-card class="bg-dark text-white" v-if="!this.blockedList.length">
              <q-card-section>
                <div class="text-subtitle2">
                  <q-icon name="info" color="grey-5"></q-icon>
                  Herhangi Bir Bloke Yok
                </div>
              </q-card-section>
            </q-card>
          </transition-group>
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
    return{
      store
    }
  },
  data:function(){
    return{
      blockedList:[]
    }
  },
  methods:{
    removeFromBlocked(data){
      axios.delete(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/blockedList/${data.detail._id}`)
        .then(res=>{
          console.log(res)
          this.blockedList = this.blockedList.filter(object => object.userId !== data.userId)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goBack(){
      this.store.eventBlockedCompActive = false
    },
    getBlockedList(data){
      axios.get(`${this.store.baseUrl}/bbc/eventlists/${data._id}/blockedList`)
        .then(res=>{
          console.log('blockedList',res)
          this.blockedList = res.data.blockedList
        })
        .catch(err=>{
          console.log(err)
        })
    }
  },
  created(){

  },
  watch:{
    'store.currentEvent':{
      handler(newValue,oldValue){
        if(newValue._id){
          const data = newValue
          this.getBlockedList(data)
        }
      },
      immediate:true
    }
  }
}
</script>

<style>

</style>
