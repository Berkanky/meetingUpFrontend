<template>
  <q-page :style="{'height':this.$q.screen.height + 'px'}">
    <div class="container">
      <q-card class="bg-grey-8" :style="{'width':this.store.mobileActive ? '100%' : '800px'}">
        <q-card-section class="row" v-if="this.pageNumber === 0">
          <q-card class="col-6 bg-transparent" flat v-for="(data,key) in this.groupTypes" :key="key" style="height:200px;">
            <q-card-section style="height:200px;">
              <q-btn class="full-width full-height" :icon="data.icon" :color="data.color" v-on:click="selectType(data)"></q-btn>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section class="text-center" v-if="this.pageNumber === 1">
          <q-card-section class="text-right">
            <upload @currentImageData="getcurrentImageData"/>
          </q-card-section>
          <q-avatar size="150px">
            <img :src="this.newData.image" alt="" v-if="this.newData.image" v-on:click="clearImage" style="object-fit:cover;">
            <q-btn icon="collections_bookmark" color="dark" round size="50px" v-if="!this.newData.image"></q-btn>
          </q-avatar>
          <q-card-section>
            <div class="row">
              <q-input dark filled label="Enter Event Group Name" type="text" class="col-6" v-model="this.newData.name">
                <template v-slot:prepend>
                  <q-icon name="groups"></q-icon>
                </template>
              </q-input>
              <q-input dark filled label="Enter Event Group Max Member" class="col-6" type="number" v-model="this.newData.maxMember">
                <template v-slot:prepend>
                  <q-icon name="groups"></q-icon>
                </template>
              </q-input>
            </div>
            <q-input
              class="q-mt-sm"
              type="textarea" filled dark label="Enter Description" v-model="this.newData.description"
            >
              <template v-slot:prepend>
                <q-icon name="info"></q-icon>
              </template>
            </q-input>
            <div class="row q-mt-sm">
              <q-input dark filled :label="this.store.userDetail.userName ?? this.store.userDetail.email" type="text" class="col-6" readonly>
                <template v-slot:prepend>
                  <q-icon name="badge"></q-icon>
                </template>
              </q-input>
              <q-input dark filled :label="this.selectedOption.label" type="text" class="col-6" readonly :textColor="this.selectedOption.color">
                <template v-slot:prepend>
                  <q-icon :name="this.selectedOption.icon" :color="this.selectedOption.color"></q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section class="text-right" v-if="this.pageNumber === 1">
          <q-btn label="clear" color="red" v-on:click="clearAll"></q-btn>
          <q-btn label="Create" color="green-4" v-on:click="createEventGroup"></q-btn>
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn icon="skip_previous" v-if="this.pageNumber > 0" v-on:click="goPreviousPage"></q-btn>
          <q-btn :label="this.pageNumber"></q-btn>
          <q-btn icon="skip_next" v-if="this.pageNumber < 1" v-on:click="goNextPage"></q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import upload from 'src/components/upload.vue'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    upload
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      newData:{},
      selectedOption:{},
      pageNumber:0,
      groupTypes:[
        {id:4,label:'Food',icon:'restaurant_menu',color:'red'},
        {id:1,label:'Drink',icon:'local_bar',color:'green'},
        {id:2,label:'Game',icon:'sports_esports',color:'orange'},
        {id:3,label:'Meeting',icon:'meeting_room',color:'primary'}
      ]
    }
  },
  methods:{
    createEventGroup(){
      const url = 'http://localhost:8000';
      const eventData = {
        image:this.newData.image ?? '',
        icon:this.selectedOption.icon,
        color:this.selectedOption.color,
        eventType:this.selectedOption.label,
        name:this.newData.name ?? '',
        maxMember:this.newData.maxMember ?? '',
        description:this.newData.description ?? '',
        createrName:this.store.userDetail.userName ?? '',
        createrEmail:this.store.userDetail.email,
        createrId:this.store.userDetail._id,
        fullDate:this.store.globalSetDate(),
      }
      axios.post(`${this.store.baseUrl}/bbc/eventlists`,eventData)
        .then(res => {
          console.log('event created',res)
          this.newData = {}
          this.goPreviousPage()
          this.selectedOption = {}
        })
        .catch(error => {
          console.error('error creating event',error)
        })
    },
    clearImage(){
      this.newData.image = ''
    },
    getcurrentImageData(data){
      if(data){
        this.newData.image = data.image
      }
    },
    clearAll(){
      this.selectedOption = {}
      this.newData = {}
      this.goPreviousPage()
    },
    goNextPage(){
      if(this.selectedOption.id){
        this.pageNumber = this.pageNumber + 1
      }
    },
    goPreviousPage(){
      this.pageNumber = this.pageNumber - 1
    },
    selectType(data){
      console.log(data)
      this.selectedOption = data
      this.goNextPage()
    }
  },
  created(){
    this.store.getEvents()
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
