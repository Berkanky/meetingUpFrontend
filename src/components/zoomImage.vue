<template>
  <q-dialog
    v-model="this.store.zoomImageActive" v-if="this.store.zoomImageActive"
    persistent
    dark
    :maximized="this.fullScreenActive ? true : false"
    :full-height="this.fullScreenActive ? true : false"
  >
    <q-card style="width:100%;" :style="{'height':this.fullScreenActive ? '100%' : '50%;'}">
      <q-img
        :src="this.store.selectedImage.image"
        style="width:100%;height:100%;object-fit:cover;">
        <div class="absolute-top-left bg-transparent">
          <q-btn icon="remove" size="sm" color="red" round v-on:click="goBack"></q-btn>
        </div>
          <div class="absolute-top-right bg-transparent">
            <q-btn
              round
              size="sm"
              :icon="this.fullScreenActive ? 'close_fullscreen' : 'fullscreen'"
              v-on:click="this.fullScreenActive =! this.fullScreenActive" color="white" text-color="dark"></q-btn>
          </div>
        </q-img>
    </q-card>
  </q-dialog>
</template>

<script>
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      fullScreenActive:false
    }
  },
  methods:{
    goBack(){
      this.store.selectedImage={}
      this.store.zoomImageActive=false
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
