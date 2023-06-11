<template>
  <q-dialog
    v-model="this.store.eventNotifyMessageCompActive"
    persistent
    dark
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? '' : 'right'"
  >
    <q-card
      :style="{
        'max-width':this.store.mobileActive ? '100%' : '500px',
        'width':this.store.mobileActive ? '100%' : '500px'
      }"
      class="bg-dark text-white">

        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn icon="public" flat color="white"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="this.message"
            dark color="white" label="Send Message To All Members">
            <template v-slot:prepend>
              <q-icon name="event"></q-icon>
            </template>
            <template v-slot:after v-if="this.message">
              <q-btn icon="send" round color="dark" v-on:Click="sendMessage"></q-btn>
            </template>
            <template v-slot:append v-if="this.message">
              <q-btn icon="remove" flat color="white" v-on:click="this.message = ''"></q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <transition-group appear enter-active-class="animated fadeInRight slower" leave-active-class="animated fadeOutRight slower">
            <q-card
              v-on:click="removeNotify(data)"
              bordered
              style="width:100%;"
              class="q-mt-sm q-mr-sm text-dark"
              v-for="(data,key) in this.store.currentEvent.eventNotifyMessage" :key="key"
              v-if="this.store.currentEvent.eventNotifyMessage.length"
              >
              <q-card-section>
                <div class="text-subtitle2 text-capitalize">
                  <q-icon name="info" color="grey-5"></q-icon>
                  {{ data.message ?? 'no message' }}
                </div>
              </q-card-section>
            </q-card>
            <q-card
              v-if="!this.store.currentEvent.eventNotifyMessage.length"
              bordered
              style="width:100%;"
              class="q-mt-sm q-mr-sm">
              <q-card-section>
                <div class="text-subtitle2 text-dark text-capitalize">
                  <q-icon name="info" color="grey-5"></q-icon>
                  Mesaj Yok
                </div>
              </q-card-section>
            </q-card>
          </transition-group>
        </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      message:''
    }
  },
  methods:{
    removeNotify(data){
      console.log(this.store.userDetail._id,data.userId,this.store.currentEvent.createrId)
      if(data.userId === this.store.userDetail._id){
        axios.delete(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/${this.store.userDetail._id}/${data._id}/removeEventNotifyMessage`)
          .then(res=>{
            console.log(res)
            this.store.currentEvent.eventNotifyMessage = this.store.currentEvent.eventNotifyMessage.filter(object => object._id !== data._id)
            this.$q.notify({
              type:'positive',
              message:'Deleted',
              icon:'check',
              timeout:700,
              position:'right'
            })
          })
          .catch(err=>{
            console.log(err)
          })
      }
    },
    sendMessageToGroupNotify(){
      const messageData = {
        userId : this.store.userDetail._id,
        message:this.message
      }
      axios.post(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/${this.store.userDetail._id}/sendGroupMessage`,messageData)
        .then(res=>{
          console.log(res)
          this.store.currentEvent = res.data
          this.message = ''
          this.$q.notify({
            type:'positive',
            message:'Sended',
            icon:'check',
            timeout:700,
            position:'right'
          })
        })
        .catch(err=>{
          console.log(err)
        })
    },
    sendMessage(){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:'Are You Sure For Send Message To Group ?',
        cancel:true,
      }).onOk(()=>{
        this.sendMessageToGroupNotify()
      })
    },
    goBack(){
      this.store.eventNotifyMessageCompActive = false
    }
  }
}
</script>

<style>

</style>
