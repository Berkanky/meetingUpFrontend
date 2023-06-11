<template>
  <q-card v-for="(data,key) in this.requestMemberListLocal" :key="key" class="text-dark">
    <q-card-section horizontal>
      <q-card-section class="col-3">
        <q-avatar>
          <img :src="this.store.findUserImage(data)" alt="" style="object-fit:cover;">
        </q-avatar>
      </q-card-section>
      <q-card-section class="col-7">
        <div class="text-overline text-dark">
          <q-icon name="person"></q-icon>
          {{ this.store.findUserName(data) }}
        </div>
        <div class="text-subtitle2 text-dark">
          <q-icon name="work"></q-icon>
          {{ this.store.findUserDescription(data) }}
        </div>
      </q-card-section>
      <q-card-section class="col-2">
        <q-btn icon="add" flat color="green" v-on:click="addToMemberList(data)"></q-btn>
        <q-btn icon="delete" flat color="red" v-on:click="removeFromRequest(data)"></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  props:['requestMemberList','currentEvent'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      requestMemberListLocal:[]
    }
  },
  methods:{
    addToMemberList(data){
      console.log(data)
      const url = 'http://localhost:8000';
      const memberData = {
        userId:data.userId
      }
      axios.post(`${this.store.baseUrl}/bbc/eventlists/${this.currentEvent._id}/memberList`, memberData)
      .then(response => {
        console.log('Member added:', response.data);
        // Handle the response or perform any additional actions
        this.removeFromRequest(data)
      })
      .catch(error => {
        console.error('Error adding member:', error);
        // Handle the error or show an error message
      });
    },
    removeFromRequest(data){
      const url = 'http://localhost:8000';
      const selectedEventId = this.currentEvent._id;
      const selectedUserId = data.userId;
      axios.delete(`${this.store.baseUrl}/bbc/eventlists/${selectedEventId}/requestList/${selectedUserId}`)
        .then(response => {
          console.log('Request list updated:', response.data);
          this.requestMemberListLocal = this.requestMemberListLocal.filter(object => object.userId !== data.userId)
        })
        .catch(error => {
          console.error('Error updating request list:', error);
          // Handle the error
        });
    },
    findUserFromServer(data){
      const url = 'http://localhost:8000';
      axios.get(`${this.store.baseUrl}/bbc/users/getUserForLoop/${data.userId}`)
      .then(res => {
        console.log(res)
        if(res){
          console.log('burda',res)
          const name = res.data.email
          return name
        }
      })
      .catch(error => {
        console.error(error);
      });
    },
  },
  created(){

  },
  watch:{
    requestMemberList:{
      handler(newValue,oldValue){
        if(newValue.length){
          this.requestMemberListLocal = newValue
          console.log('requestMemberListLocal',this.requestMemberListLocal)
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
