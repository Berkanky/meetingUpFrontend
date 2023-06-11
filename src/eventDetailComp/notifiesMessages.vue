<template>
  <transition-group appear enter-active-class="animated fadeInRight slower" leave-active-class="animated fadeOutRight slower">
    <q-card
    v-if="this.notifyMessages.length"
    v-on:click="removeNotify(data)"
    bordered
    style="width:300px;"
    class="q-mt-sm q-mr-sm"
    v-for="(data,key) in this.notifyMessages" :key="key">
    <q-card-section>
      <div class="text-subtitle2 text-dark text-capitalize">
        <q-icon name="info" color="grey-5"></q-icon>
        {{ data.message ?? 'no message' }}
      </div>
    </q-card-section>
  </q-card>
  </transition-group>
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
      notifyMessages:[]
    }
  },
  methods:{
    removeNotify(data){
      console.log(data)
      data.readed =! data.readed
      this.notifyMessages = this.notifyMessages.filter(object => object._id !== data._id)
    }
  },
  created(){

  },
  watch:{
    currentEvent:{
      handler(newValue,oldValue){
        if(newValue._id){
          console.log('notifiesmessagesvue',newValue)
          this.notifyMessages  = this.store.currentEvent.eventNotifyMessage
          this.notifyMessages.forEach(element => {
            element.readed = false
          });
          console.log('notifyMessages',this.notifyMessages)
        }
      }
    }
  }
}
</script>

<style>

</style>
