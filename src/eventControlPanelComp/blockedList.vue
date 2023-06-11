<template>
 <q-card v-for="(data,key) in this.blockedUsers" :key="key" class="text-white col-6 bg-grey-9" bordered dark>
    <q-card-section horizontal>
      <q-card-section class="col-3">
        <q-avatar>
          <img :src="data.userImage" alt="" v-if="data.userImage" style="object-fit:cover;">
          <q-btn icon="person" v-if="!data.userImage" round color="dark"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section class="col-6 text-capitalize">
        <div class="text-subtitle2">
          <q-icon :name="data._id !== this.currentEvent.createrId ? 'person' : 'admin_panel_settings'" size="17px"></q-icon>
          {{ data.userName ?? data.email }}
        </div>
        <div class="text-caption">
          <q-icon name="work"></q-icon>
          {{ data.userDescription ?? 'No info' }}
        </div>
      </q-card-section>
      <q-card-section class="col-3" v-if="data._id !== this.store.userDetail._id">
        <q-btn icon="undo" flat color="whiee" v-on:click="removeTheBlockUser(data)"></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  props:['currentEvent'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      blockedUsers:[]
    }
  },
  methods:{
    removeTheBlockUser(data){
      const url = 'http://localhost:8000';
      axios.delete(`${this.store.baseUrl}/bbc/eventlists/${this.currentEvent._id}/blockedList/${data._id}`)
        .then(res =>{
          console.log(res)
          this.currentEvent.blockedList = this.currentEvent.blockedList.filter(object => object.userId !== data._id)
        })
        .catch(res =>{
          console.log(res)
        })
    },
    getBlockedUsersInformations(data){
      this.blockedUsers = []
      data.blockedList.forEach(element => {
          const result = this.store.allUser.find(object => object._id === element.userId)
          if(result){
            this.blockedUsers.push(result)
          }
      });
      console.log('blockedUsers',this.blockedUsers)
    }
  },
  created(){
    this.store.getOnlyUsers()
  },
  watch:{
    currentEvent:{
      handler(newValue,oldValue){
        if(newValue._id){
          const data = newValue
          this.getBlockedUsersInformations(data)
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
