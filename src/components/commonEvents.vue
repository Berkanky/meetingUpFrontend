<template>
  <q-scroll-area
    dark
    class="bg-dark text-white rounded-borders"
    style="width:100%;height:200px;"
  >
  <q-card class="bg-dark text-white" flat v-for="(data,key) in this.commonEventGroupList" :key="key">
    <q-card-section horizontal>
      <q-card-section class="col-3">
        <q-avatar>
          <img :src="data.image" v-if="data.image" style="object-fit:Cover;" alt="">
          <q-btn icon="group" round color="dark" v-if="!data.image"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section class="col-6">
        <div class="text-subtitle2 text-capitalize">
          <q-icon name="group"></q-icon>
          {{ data.name ?? data.eventType }}
        </div>
        <div class="text-caption text-capitalize">
          <q-icon name="info"></q-icon>
          {{ data.description ?? '' }}
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
  </q-scroll-area>
</template>

<script>
import axios from 'axios'
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
      commonEventGroupList:[]
    }
  },
  methods:{
    getCommonEvents(){
      axios.get(`${this.store.baseUrl}/bbc/eventlists/${this.store.selectedUserForDetail._id}/commonEventGroups/${this.store.userDetail._id}`)
        .then(res=>{
          console.log(res)
          this.commonEventGroupList = res.data.oldEventList
        })
        .catch(err=>{
          console.log(err)
        })
    },
  },
  created(){

  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.getCommonEvents()
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
