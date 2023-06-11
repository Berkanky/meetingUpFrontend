<template>
  <div style="height:600px; width:100%;">
    <l-map
      :key="this.store.randomKeyForMap"
      ref="map" v-model:zoom="this.zoom" :center="this.centerLocation">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker
        :draggable="this.store.currentEvent.createrId === this.store.userDetail._id&&data.userId == '1'&&!this.checkCurrentEvent()"
        :lat-lng="data" v-for="(data,key) in this.locationList" :key="key" @dragend="setMarkerPosition" ref="marker" >
        <l-popup>
            {{ findUserName(data) }}
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import axios from 'axios'
import "leaflet/dist/leaflet.css";
import leaflet from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "@vue-leaflet/vue-leaflet";
import {useCounterStore} from '../stores/store'
import { event } from 'quasar';
export default {
  components:{
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      iconSize: 64,
      locationList:[],
      centerLocation:[45,55],
      zoom: 5,
      loading:false,

    }
  },
  methods:{
    checkCurrentEvent(){
      if(this.store.currentEvent.currentEvent){
        if(this.store.currentEvent.currentEvent.eventStartDate){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    setMarkerPosition(e){
      ///bbc/eventlists/:currentEventId/eventPosition/:newPositionData
      const url = 'http://localhost:8000';
      const newLocationData = {
        userId:1,
        lat:e.target._latlng.lat,
        lng:e.target._latlng.lng
      }
      console.log(newLocationData)
      axios.post(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/eventPosition`,newLocationData)
        .then(res=>{
          this.store.currentEvent = res.data
          console.log(res)
          console.log(e.target._latlng)
        })
        .catch(err=>{
          console.log(err)
        })

    },
    dynamicSize () {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor () {
      return [this.iconSize / 2, this.iconSize * 1.15];
    },
    handleSuccess(position) {
      this.loading = false;
      this.centerLocation = [ position.coords.latitude,position.coords.longitude]
      console.log('centerLocation',this.centerLocation)
    },
    handleError(error) {
      this.loading = false;
    },
    deleteMyLocationFromDb(){
      const url = 'http://localhost:8000';
      axios.delete(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/locationList/${this.store.userDetail._id}`)
        .then(res=>{
          console.log(res)
          this.store.currentEvent.locationList = this.store.currentEvent.locationList.filter(object => object.userId !== this.store.userDetail._id)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    addMyLocation(){
      if(this.store.userDetail.locationInformations){
        const locationData = {
          lat:this.store.userDetail.locationInformations.details.lat,
          lng:this.store.userDetail.locationInformations.details.lng,
          userId:this.store.userDetail._id
        }
        const url = 'http://localhost:8000';
        axios.post(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/locationList/${this.store.userDetail._id}`,locationData)
          .then(res =>{
            console.log(res)
          })
          .catch(err =>{
            console.log(err)
          })
      }else{
        if(this.store.currentEvent.locationList){
          const result = this.store.currentEvent.locationList.find(object => object.userId === this.store.userDetail._id)
          if(result){
            this.deleteMyLocationFromDb()
          }
        }
      }
    },
    getEventLocation(){
      this.addLocationsToMap()
      console.log('currenteventposition',this.store.currentEvent.eventPosition)
      if(this.store.currentEvent.eventPosition){
        const result = this.locationList.find(object => object.userId === this.store.currentEvent.eventPosition.userId)
        if(result){
          result.lat = this.store.currentEvent.eventPosition.lat
          result.lng = this.store.currentEvent.eventPosition.lng
        }else{
          this.locationList.push({lat:this.store.currentEvent.eventPosition.lat,lng:this.store.currentEvent.eventPosition.lng,userId:this.store.currentEvent.eventPosition.userId})
        }
      }else{
        const eventData = {
          lat:this.centerLocation[0],
          lng:this.centerLocation[1],
          userId:1
        }
        const result = this.locationList.find(object => object.userId === eventData.userId)
        if(result){
          result.lat = eventData.lat
          result.lng = eventData.lng
        }else{
          this.locationList.push(eventData)
        }
      }
      console.log('last loc list',this.locationList)
    },
    findUserName(data){
      if(data.userId === '1' || data.userId === 1){
        const name = 'Group Meet Location'
        return name
      }else{
        const result = this.store.allUser.find(object => object._id === data.userId)
        if(result){
          if(result._id === this.store.userDetail._id){
            const name = 'Siz'
            return name
          }else{
            const name = result.userName ?? result.email
            console.log('name',name)
            return name
          }
        }
      }
    },
    addLocationsToMap(){
      this.locationList = []
      if(this.store.currentEvent.locationList){
        this.store.currentEvent.locationList.forEach(element => {
          this.locationList.push({lat:element.lat,lng:element.lng,userId:element.userId})
        });
      }
      console.log('locationList',this.locationList)
    }
  },
  created(){
  //  this.addLocationsToMap()
  },
  mounted() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleSuccess,
        this.handleError
      );
    } else {
      //
    }
    this.addMyLocation()
    console.log('yokla',this.store.userDetail)
  },
  watch:{
    'store.currentEvent':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.getEventLocation()
        }
      }
    },
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue.locationInformations){
          //this.addMyLocation()
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
