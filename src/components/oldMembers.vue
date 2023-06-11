<template>
  <q-dialog
    :maximized="this.store.mobileActive ? true :  false"
    :full-height="this.store.mobileActive ? true : false"
    v-model="this.store.oldMembersActive" v-if="this.store.oldMembersActive"
    persistent dark
   >
    <q-card
      class="bg-dark text-white"
      :style="{'width':this.store.mobileActive ? '100%' : '500px'}"
    >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goback"></q-btn>
        <q-space></q-space>
        <q-avatar>
          <img :src="this.selectedEvent.image" v-if="this.selectedEvent.image" alt="" style="object-fit:Cover;">
          <q-btn icon="groups" v-if="!this.selectedEvent.image" round color="dark"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section>
        <q-card class="text-white bg-dark" flat v-for="(data,key) in this.oldMemberList" :key="key" v-if="this.oldMemberList.length">
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar v-on:click="showUser(data)">
                <img :src="data.userImage" v-if="data.userImage" style="object-fit:cover;" alt="">
                <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-subtitle2 text-capitalize">
                <q-icon name="person"></q-icon>
                {{ data.userName ?? data.email }}
              </div>
              <div class="text-overline text-capitalize">
                <q-icon name="work"></q-icon>
                {{ data.userDescription ?? 'NaN' }}
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card v-if="!this.oldMemberList.length" class="bg-dark text-white" flat>
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar>
                <q-btn icon="person" color="dark" round></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-subtitle2 text-capitalize">
                <q-icon name="info"></q-icon>
                Herhangi Bir Eski Üye Yok !
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <profileDetail v-if="this.store.profileDetailActive" :selectedUser="this.selectedUser"/>
  </q-dialog>
</template>

<script>
import profileDetail from './profileDetail.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  components:{
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
      selectedEvent:{},
      oldMemberList:[],
      selectedUser:{}
    }
  },
  methods:{
    showUser(data){
      this.selectedUser = data
      this.store.profileDetailActive = true
    },
    goback(){
      this.store.oldMembersActive = false
    },
    getOldMembers(data){
      axios.get(`${this.store.baseUrl}/bbc/eventlists/${data._id}/oldmemberslist/${this.store.userDetail._id}`)
        .then(res=>{
          console.log(res)
          this.selectedEvent = res.data.currentevent
          this.oldMemberList = res.data.oldMemberList
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
          this.getOldMembers(data)
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
