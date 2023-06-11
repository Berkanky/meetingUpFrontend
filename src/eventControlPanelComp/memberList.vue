<template>
  <q-card v-for="(data,key) in this.localMembers" :key="key" class="text-white col-6 bg-grey-9" bordered dark>
    <q-card-section horizontal>
      <q-card-section class="col-3">
        <q-avatar v-on:click="goSelectedPerson(data)">
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
        <q-btn icon="delete" flat color="red" v-on:click="removeFromMemberList(data)"></q-btn>
        <q-btn icon="block" flat color="red" v-on:click="blockTheUser(data)" v-if="!this.checkTheUserBlockedOrNot(data)"></q-btn>
        <q-btn icon="undo" flat color="whiee" v-on:click="removeTheBlockUser(data)" v-if="this.checkTheUserBlockedOrNot(data)"></q-btn>
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
      localMembers:[]
    }
  },
  methods:{
    goSelectedPerson(data){
      this.$router.push({path:'/chat'})
      this.store.selectedUserForDetail = data
      this.store.selectedUserDetailActive = true
    },
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
    checkTheUserBlockedOrNot(data){
      const result = this.currentEvent.blockedList.find(object => object.userId === data._id)
      if(result){
        return true
      }else{
        return false
      }
    },
    blockTheUser(data){
      const url = 'http://localhost:8000';
      const bodyData = {
        userId:data._id
      }
      axios.post(`${this.store.baseUrl}/bbc/eventlists/${this.currentEvent._id}/blockedList`,bodyData)
        .then(res => {
          console.log(res)

        })
        .catch(res =>{
          console.log(res)
        })
    },
    removeFromMemberList(data){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:`${data.userName ?? data.email} Adlı Kişiyi Çıkarmak İstediğinizden Emin misinz ?`,
        cancel:true
      }).onOk(()=>{
        console.log(data)
        const url = 'http://localhost:8000';
        axios.delete(`${this.store.baseUrl}/bbc/eventlists/${this.currentEvent._id}/memberList/${data._id}`)
          .then(res =>{
            console.log(res)
            this.localMembers = this.localMembers.filter(object => object._id !== data._id)
          })
          .catch(error =>{
            console.error(error)
          })
      })
    },
    findAllMembers(data){
      this.localMembers = []
      data.memberList.forEach(element => {
        const result = this.store.allUser.find(object => object._id === element.userId)
        if(result){
          this.localMembers.push(result)
        }
      });
      const result = this.localMembers.some(object => object._id === this.store.userDetail._id)
      if(!result){
        this.localMembers.push(this.store.userDetail)
      }
      console.log('localMembers',this.localMembers)
    }
  },
  created(){
    this.store.getOnlyUsers()
  },
  watch:{
    currentEvent:{
      handler(newValue,oldValue){
        if(newValue){
          console.log('memberlist',newValue)
          const data = newValue
          this.findAllMembers(data)
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
