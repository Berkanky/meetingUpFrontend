<template>
  <q-dialog
    v-model="this.store.eventDetailVueActive" v-if="this.store.eventDetailVueActive"
    persistent dark :maximized="this.store.mobileActive ? true : false" :full-height="this.store.mobileActive ? true : false"
  >
    <q-card class="bg-dark text-white" :style="{'max-width':this.store.mobileActive ? '100%' : '700px','width':this.store.mobileActive ? '100%' : '700px'}">
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-btn :color="this.selectedEventData.color" :label="this.selectedEventData.eventType" flat no-caps :icon="this.selectedEventData.icon"></q-btn>
        <q-avatar>
          <q-btn icon="group" v-if="!this.selectedEventData.image" color="dark" round></q-btn>
          <img :src="this.selectedEventData.image" v-if="this.selectedEventData.image" style="object-fit:cover;" alt="">
        </q-avatar>
      </q-card-section>
      <q-card-section class="text-right">
        <div class="text-overline text-grey-5 q-mr-md">
          <q-icon name="event" size="17px"></q-icon>
          {{ this.selectedEventData.date }}
        </div>
        <div class="text-overline text-grey-5 q-mr-md">
          <q-icon name="admin_panel_settings" size="17px"></q-icon>
          {{ this.findAdminInMemberList() }}
        </div>
      </q-card-section>
      <q-card-section class="q-ml-sm">
        <q-btn icon="event_note" flat color="white" label="Description" no-caps></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input
          type="textarea"
          dark filled
          readonly
          :label="this.store.selectedEventData.description ?? ''"
        >
          <template v-slot:prepend>
            <q-icon name="info"></q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <div class="q-ml-sm">
          <q-btn icon="groups" no-caps flat color="white" :label="`Members - ${this.store.selectedEventMembersList.length}`"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="row">
        <q-card class="col-12 col-md-6 col-sm-6 text-white" dark  v-for="(data,key) in this.store.selectedEventMembersList" :key="key">
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar v-on:click="showProfile(data)">
                <q-btn icon="person" round color="dark" v-if="!data.userImage"></q-btn>
                <img :src="data.userImage" v-if="data.userImage" style="object-fit:cover;" alt="">
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-7">
              <div class="text-subtitle2">
                <q-icon :name="this.selectedEventData.createrId === data._id ? 'admin_panel_settings' : 'person'"></q-icon>
                {{ data.userName ?? data.email }}
                <q-btn icon="fiber_manual_record" flat size="sm" :color="data.online ? 'green' : 'red'"></q-btn>
              </div>
              <div class="text-overline text-white">
                <q-icon name="work"></q-icon>
                {{ data.userDescription ?? '' }}
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section>
        <div class="q-ml-sm">
          <q-btn icon="collections_bookmark" no-caps flat color="white" :label="`Images - ${this.selectedEventData.images.length}`"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="row">
        <q-card
          v-on:click="zoomImage(data)"
          style="height:100px;" class="col-4 bg-dark" v-for="(data,key) in this.store.selectedEventData.images" :key="key">
          <q-img
            loading="lazy"
            spinner-color="white"
            :src="data.image" style="object-fit:cover;height:100px;"></q-img>
        </q-card>
      </q-card-section>
      <q-card-section>
        <q-stepper
          dark
          v-model="step"
          ref="stepper"
          color="primary"
          animated
        >
          <q-step
            :name="1"
            title="Event Start Date"
            icon="event"
            :caption="this.store.selectedEventData.currentEvent.eventStartDate ?? ''"
          >
          </q-step>
          <q-step
            :name="2"
            title="Event End Date"
            icon="event"
            :caption="this.store.selectedEventData.currentEvent.eventEndDate ?? ''"
          >
          </q-step>
        </q-stepper>
      </q-card-section>
      <q-card-section horizontal>
        <q-card class="col-6 bg-dark text-white" style="height:150px;">
          <q-card-section style="height:100%;">
            <q-btn class="full-width full-height" icon="map" :color="this.store.selectedEventData.color" flat v-on:click="showMap"></q-btn>
          </q-card-section>
        </q-card>
        <q-card class="col-6 bg-dark text-white" style="height:150px;" v-if="this.detailOfLocation.results">
          <q-card-section class="text-subtitle2 text-capitalize">
            <div  class="q-mt-sm">
              <q-icon name="flag"></q-icon>
              Country -
              {{this.detailOfLocation.results[0].components.country ?? ''}}, {{ this.detailOfLocation.results[0].components.country_code ?? '' }}
            </div>
            <div class="q-mt-sm">
              <q-icon name="location_city"></q-icon>
              City -
              {{ this.detailOfLocation.results[0].components.state_district  ?? 'NaN'}}
            </div>
            <div class="q-mt-sm">
              <q-icon name="home"></q-icon>
              Full Adress -
              {{ this.detailOfLocation.results[0].formatted ?? ''}}
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <eventLocationMap v-if="this.store.mapActive"/>
    <profileDetail v-if="this.store.profileDetailActive" :selectedUser="this.selectedUser"/>
    <zoomImageVue v-if="this.store.zoomImageActive"/>
  </q-dialog>
</template>

<script>
import profileDetail from './profileDetail.vue';
import eventLocationMap from './eventLocationMap.vue';
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
import zoomImageVue from './zoomImage.vue';
export default {
  components:{
    eventLocationMap,
    profileDetail,
    zoomImageVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedEventData:{},
      detailOfLocation:{},
      selectedUser:{}
    }
  },
  methods:{
    zoomImage(data){
      this.store.selectedImage = data
      this.store.zoomImageActive = true
    },
    showProfile(data){
      this.selectedUser = data
      console.log(data)
      this.store.profileDetailActive = true
    },
    showMap(){
      this.store.mapActive = true
    },
    async getLocationDetails(){
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${this.store.selectedEventData.currentEvent.lat}+${this.store.selectedEventData.currentEvent.lng}&key=a7ac3cc8ba514f0287f82a6a306eabc8`);
      const data = await response.json();
      this.detailOfLocation = data
      console.log(data)
    },
    findAdminInMemberList(){
      const result = this.store.selectedEventMembersList.find(object => object._id === this.store.selectedEventData.createrId)
      if(result){
        const name = result.userName ?? result.email
        return name
      }else{
        return ''
      }
    },
    goBack(){
      this.store.eventDetailVueActive = false
      this.store.selectedEventData = {}
    },
  },
  created(){

  },
  watch:{
    'store.selectedEventData':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.selectedEventData = newValue
          setTimeout(()=>{
            this.getLocationDetails()
          },1000)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
