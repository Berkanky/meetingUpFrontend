<template>
  <q-dialog
    persistent
    dark
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    v-model="this.store.mapActive" v-if="this.store.mapActive"
  >
    <q-card class="bg-dark text-white" :style="{'width':this.store.mobileActive ? '100%' : '700px'}">
      <q-card-section class="text-left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goback"></q-btn>
      </q-card-section>
      <q-card-section horizontal>
        <div style="width:100%;" class="col-12" :style="{'height':this.store.mobileActive ? this.$q.screen.height + 'px' : '600px'}">
          <l-map
            ref="map" v-model:zoom="this.zoom" :center="this.store.locationLatLng">
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
            <l-marker :lat-lng="this.store.locationLatLng">
              <l-popup>
                {{ this.store.selectedEventData.description ?? 'Event Location' }}
              </l-popup>
            </l-marker>
          </l-map>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import "leaflet/dist/leaflet.css";
import leaflet from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "@vue-leaflet/vue-leaflet";
import {useCounterStore} from '../stores/store'
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
      zoom:4,

    }
  },
  methods:{
    goback(){
      this.store.mapActive = false
    }
  },
  created(){

  },
  watch:{
    'store.selectedEventData':{
      handler(newValue,oldValue){
        if(newValue.currentEvent){
          this.store.locationLatLng[0] = this.store.selectedEventData.currentEvent.lat
          this.store.locationLatLng[1] = this.store.selectedEventData.currentEvent.lng
          console.log('locatioLatLng',this.store.locationLatLng)
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
