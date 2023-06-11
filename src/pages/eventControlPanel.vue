<template>
  <q-page :style="{'height':this.$q.screen.height + 'px'}">
    <div class="" >
      <q-card
        class="bg-white"
        :style="{
          'width':this.store.mobileActive ? '100%' : '800px',
          'margin':this.store.mobileActive ? '0 auto' : '3% auto'
        }">
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn :icon="this.currentEvent.icon" :color="this.currentEvent.color" flat :label="this.currentEvent.name" no-caps></q-btn>
          <q-avatar>
            <img :src="this.currentEvent.image" alt="" v-if="this.currentEvent.image" style="object-fit:cover;">
          </q-avatar>
        </q-card-section>
        <q-card-section horizontal>
          <q-card class="col" style="height:150px;" v-for="(data,key) in this.options" :key="key">
            <q-card-section style="height:150px;width:100%;">
              <q-btn class="full-width full-height" :icon="data.icon" :color="data.color" v-on:click="selectOption(data)"></q-btn>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-scrol-area dark style="width:100%;height:100%;" class="rounded-borderes">
        <q-card-section class="row">
          <blockedList v-if="this.activeOption.blockedListActive" :currentEvent="this.currentEvent"/>
          <memberList v-if="this.activeOption.memberListActive" :currentEvent="this.currentEvent"/>
          <requestListVue
            :currentEvent="this.currentEvent"
            v-if="this.activeOption.requestListActive" :requestMemberList="this.currentEvent.requestList.length ? this.currentEvent.requestList : ''"/>
        </q-card-section>
      </q-scrol-area>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import blockedList from 'src/eventControlPanelComp/blockedList.vue'
import memberList from 'src/eventControlPanelComp/memberList.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import requestListVue from '../eventControlPanelComp/requestList.vue'
export default {
  components:{
    requestListVue,
    memberList,
    blockedList
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      activeOption:{},
      currentEvent:{},
      currentEventId:'',
      options:[
        {id:1,label:'Request',icon:'list',color:'green'},
        {id:2,label:'Members',icon:'groups',color:'primary'},
        {id:3,label:'Blockeds',icon:'block',color:'red'},
        {id:4,label:'Advices',icon:'receipt_long',color:'dark'}
      ]
    }
  },
  methods:{
    selectOption(data){
      this.activeOption = {}
      this.getCurrentEvent()
      if(data.id === 1){
        if(this.currentEvent.requestList.length){
          this.activeOption.requestListActive =! this.activeOption.requestListActive
          console.log(this.currentEvent,this.activeOption.requestListActive)
        }
      }else if(data.id === 2){
        this.activeOption.memberListActive =! this.activeOption.memberListActive
      }else if(data.id  === 3){
        this.activeOption.blockedListActive =! this.activeOption.blockedListActive
      }
    },
    goBack(){
      this.$router.go(-1)
    },
    getCurrentEvent(){
      const url = 'http://localhost:8000';
      axios.get(`${this.store.baseUrl}/bbc/eventlists/updateEvent/${this.currentEventId}`)
        .then(res =>{
          console.log(res)
          this.currentEvent = res.data
          console.log('currentEvent',this.currentEvent)
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  created(){
    this.currentEventId = this.$route.params.id
    this.store.getOnlyUsers()
  },
  mounted(){

  },
  watch:{
    currentEventId:{
      handler(newValue,oldValue){
        if(newValue){
          this.getCurrentEvent()
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height:100%;
}
</style>
