<template>
  <q-page :style="{'height':this.$q.screen.height + 'px'}" class="bg-dark">
    <div
      class="row"
      style="margin:0 auto;"
      :style="{'width':this.store.mobileActive ? '100%' : '800px','height':this.$q.screen.height + 'px'}"
    >
     <q-scroll-area
      dark
      class="rounded-borders col"
      :style="{'height':this.$q.screen.height + 'px'}"
    >
    <q-card
      class="my-card"
      flat bordered style="max-width:500px;margin:0 auto;" dark
      v-for="(data,key) in this.store.eventList" :key="key">
      <q-img
        loading="lazy"
        spinner-color="white"
        :src="data.image" v-if="data.image" style="height:300px;object-fit:cover;"/>
      <q-card-section>
        <q-btn
          fab
          v-on:click="shareThisEvent(data)"
          icon="share" :color="data.color"
          class="absolute"
          style="top: 0; left: 12px; transform: translateY(-50%);"
        />
        <q-btn
          fab
          :icon="data.icon" :color="data.color"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />
        <div class="row no-wrap items-center  q-mt-sm">
          <div class="col text-h6 ellipsis">
            {{data.eventType}}
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="event" />
            {{data.date}}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-subtitle1 text-capitalize">
          {{data.name ?? ''}}
        </div>
        <div class="text-caption text-grey-6 text-weight-bold">
          {{data.description}}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn
          v-if="checkSavedOrNot(data)"
          flat
          icon="bookmark_remove" color="green"
          v-on:click="removeFromSavedEvents(data)"></q-btn>
        <q-btn
          v-if="!checkSavedOrNot(data)"
          flat
          icon="bookmark_add" color="white"
          v-on:click="addSavedEvents(data)"></q-btn>
        <q-space></q-space>
        <q-btn icon="join_inner" color="dark" v-if="!checkMemberOrNot(data)&&!this.checkRequestOrNot(data)" v-on:click="sendRequest(data)"></q-btn>
        <q-btn icon="hourglass_top" v-if="checkRequestOrNot(data)&&!checkMemberOrNot(data)" color="pink" round v-on:click="removeRequest(data)"></q-btn>
        <q-btn icon="login" v-if="checkMemberOrNot(data)" v-on:click="loginToGroup(data)"></q-btn>
      </q-card-actions>
    </q-card>
  </q-scroll-area>
    <transition-group apper enter-active-class="animated fadeInRight slower" leave-active-class="animated fadeOutLeft slower">
      <q-card class="col-4 bg-grey-4" v-if="!this.rightBarActive">
        <div class="text-left">
          <q-btn icon="remove" color="dark" flat v-on:Click="hideRightBar"></q-btn>
        </div>
        <q-card-section class="text-center">
          <div class="q-pa-md text-dark text-capitalize text-subtitle2" v-if="!this.store.allEventsFilterActive">
            <q-icon name="filter_list"></q-icon>
            Options
          </div>
          <q-btn icon="clear_all" label="clear" color="red" v-if="this.store.allEventsFilterActive" v-on:Click="clearAllFilters"></q-btn>
        </q-card-section>
        <q-input filled color="dark" label="Find Group or Admin" v-model="this.findGroup.searchValue" v-on:keyup.enter="findGroupOrAdmin">
          <template v-slot:prepend>
            <q-icon name="groups"></q-icon>
          </template>
        </q-input>
        <q-card-section class="row q-mt-xs">
          <q-card class="bg-grey-9 col-6 q-mt-xs" style="height:120px;border-radius:7px;" v-for="(data,key) in this.uniqueTypes" :key="key">
            <q-card-section  style="height:120px;">
              <q-btn :color="data.color" :icon="data.icon"  class="full-width full-height" v-on:click="selectOption(data)"></q-btn>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-select :options="this.uniqueAdmins" filled color="dark" label="Select Admin" @update:modelValue="selectAdmin">
          <template v-slot:prepend>
            <q-icon name="person"></q-icon>
          </template>
        </q-select>
        <q-card-section class="row">
          <q-card class="bg-grey-9 col-6 q-mt-xs" style="height:120px;" v-for="(data,key) in this.options" :key="key">
            <q-card-section style="height:120px;">
              <q-btn :icon="data.icon" :color="data.color" class="full-width full-height" v-on:click="selectNewOption(data)"></q-btn>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </transition-group>
    </div>
    <shareComp v-if="this.store.shareCompActive" :selectedEvent="this.selectedEvent"/>
    <notifies v-if="this.store.notifyCompActive" @findEventGroup="getfindEventGroup"/>
  </q-page>
</template>

<script>
import notifies from 'src/notifylistcomp/notifies.vue';
import shareComp from 'src/components/shareComp.vue';
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    shareComp,
    notifies
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      findGroup:{
        searchValue:''
      },
      uniqueTypes:[],
      selectedEvent:{},
      uniqueAdmins:[],
      rightBarActive:false,
      options:[
        {id:1,label:'Saved',icon:'bookmark',color:'green'},
        {id:2,label:'Member',icon:'login',color:'pink'},
        {id:3,label:'Request',icon:'join_inner',color:'red'}
      ]
    }
  },
  methods:{
    getfindEventGroup(data){
      if(data){
        console.log(data)
        this.findGroup.searchValue = data.name ?? data.eventType
        this.findGroupOrAdmin()
        this.store.notifyCompActive = false
      }
    },
    shareThisEvent(data){
      this.selectedEvent = data
      this.store.shareCompActive = true
    },
    checkRightBarStatus(){
    },
    hideRightBar(){
      this.rightBarActive =! this.rightBarActive
    },
    loginToGroup(data){
      console.log(data)
      this.$router.push({name:'eventDetail',params:{id:data._id}})
    },
    selectNewOption(data){
      this.store.getAllMySavedEvents()
      if(data.id === 1){
        this.store.eventList.forEach(element => {
          const result = this.store.mySavedEvents.savedEvents.find(object => object._id === element._id)
          if(!result){
            this.store.eventList = this.store.eventList.filter(object => object._id !== element._id)
            this.store.allEventsFilterActive = true
          }
        });
      }else if(data.id === 2){
        this.store.eventList.forEach(element => {
          const result = element.memberList.find(object => object.userId === this.store.userDetail._id)
          if(!result){
            this.store.eventList = this.store.eventList.filter(object => object._id !== element._id)
            this.store.allEventsFilterActive = true
          }
        });
      }else if(data.id === 3){
        this.store.eventList.forEach(element => {
          const result = element.requestList.find(object => object.userId === this.store.userDetail._id)
          if(!result){
            this.store.eventList = this.store.eventList.filter(object => object._id !== element._id)
            this.store.allEventsFilterActive = true
          }
        });
      }
    },
    selectAdmin(val){
      if(val){
        const result = this.store.allUser.find(object => object.email === val)
        if(result){
          const selectedAdminId = result._id
          this.store.eventList = this.store.eventList.filter(object => object.createrId === selectedAdminId)
          this.store.allEventsFilterActive = true
        }
      }
    },
    getAdminsList(){
      if(this.store.eventList.length){
        const uniqueAdminId = []
        this.uniqueAdmins = []
        this.store.eventList.forEach(element => {
          const result = uniqueAdminId.find(object => object.createrId === element.createrId)
          if(!result){
            uniqueAdminId.push({createrId : element.createrId})
          }
        });
        console.log('uniqueAdminId',uniqueAdminId)
        uniqueAdminId.forEach(element => {
            const result = this.store.allUser.find(object => object._id === element.createrId)
            if(result){
              this.uniqueAdmins.push(result.email)
            }
          });
          console.log('uniqueAdmins',this.uniqueAdmins)
      }
    },
    clearAllFilters(){
      this.store.getEvents()
      this.store.allEventsFilterActive = false
    },
    selectOption(data){
      this.store.eventList = this.store.eventList.filter(object => object.eventType === data.eventType)
      this.store.allEventsFilterActive = true
    },
    getEventTypes(){
      if(this.store.eventList.length){
        this.uniqueTypes = []
        this.store.eventList.forEach(element => {
            const result = this.uniqueTypes.find(object => object.eventType === element.eventType)
            if(!result){
              this.uniqueTypes.push(
                {icon:element.icon,color:element.color,eventType:element.eventType}
              )
            }
        });
        console.log('uniquetypes',this.uniqueTypes)
      }else{
        this.uniqueTypes = []
      }
    },
    findGroupOrAdmin(){
    //  this.store.getEvents()
      if(this.findGroup.searchValue){
        const result = this.store.eventList.filter(object => (object.name ?? object.eventType).includes(this.findGroup.searchValue))
        if(result.length){
          this.store.eventList = result
          this.store.allEventsFilterActive = true
        }
      }else{
        this.store.getEvents()
      }
    },
    checkSavedOrNot(data){
      if(this.store.mySavedEvents.savedEvents){
        const result = this.store.mySavedEvents.savedEvents.some(object => object._id === data._id)
        if(result){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    removeFromSavedEvents(data){
      const url = 'http://localhost:8000';
        axios.delete(`${this.store.baseUrl}/bbc/savedeventlists/${this.store.userDetail._id}/savedEvents/${data._id}`)
          .then(res =>{
            console.log(res)
          //  this.store.getAllMySavedEvents()
            this.store.mySavedEvents.savedEvents = this.store.mySavedEvents.savedEvents.filter(object => object._id !== data._id)
          })
          .catch(error =>{
            console.log(error)
          })
    },
    addSavedEvents(data){
      const url = 'http://localhost:8000';
        const selectedEvent = data
        axios.post(`${this.store.baseUrl}/bbc/savedeventlists/${this.store.userDetail._id}/savedEvents`,selectedEvent)
          .then(res =>{
            console.log(res)
            this.store.getAllMySavedEvents()
          })
          .catch(error =>{
            console.log(error)
          })
    },
    removeRequest(data){
      const url = 'http://localhost:8000';
      const selectedEventId = data._id;
      const myId = this.store.userDetail._id;
      axios.delete(`${this.store.baseUrl}/bbc/eventlists/${selectedEventId}/requestList/${myId}`)
        .then(response => {
          console.log('Request list updated:', response.data);
          // Perform any necessary actions after successful deletion
          data.requestList = data.requestList.filter(object => object.userId !== this.store.userDetail._id)
        })
        .catch(error => {
          console.error('Error updating request list:', error);
          // Handle the error
        });
    },
    checkRequestOrNot(data){
      const result = data.requestList.find(object => object.userId === this.store.userDetail._id)
      if(result){
        return true
      }else{
        return false
      }
    },
    sendRequest(data){
      console.log(data)
      const url = 'http://localhost:8000';
      const requestData = {
        userId:this.store.userDetail._id,
      }
      axios.post(`${this.store.baseUrl}/bbc/eventlists/${data._id}/requestList/${this.store.userDetail._id}`,requestData)
        .then(res =>{
          console.log(res)
          //this.store.getEvents()
          data.requestList.push({
            joinedAt:this.store.globalSetDate(),
            userId:this.store.userDetail._id,
          })
        })
        .catch(error =>{
          console.error(error)
        })
    },
    checkMemberOrNot(data){
      if(data.createrId === this.store.userDetail._id){
        return true
      }else{
        const result = data.memberList.find(object => object.userId === this.store.userDetail._id)
        if(result){
          return true
        }else{
          return false
        }
      }
    }
  },
  created(){
    this.store.getEvents()
  },
  watch:{
    'store.eventList':{
      handler(newValue,oldValue){
        if(newValue.length){
          this.getEventTypes()
          this.getAdminsList()
        }
      },
      immediate:true,
      deep:true
    },
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getAllMySavedEvents()
        }
      },
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
