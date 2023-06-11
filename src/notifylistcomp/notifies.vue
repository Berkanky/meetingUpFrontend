<template>
  <q-dialog
    v-if="this.store.notifyCompActive" v-model="this.store.notifyCompActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    dark
  >
    <q-card
      :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
      class="bg-dark text-white">
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn icon="notifications" flat color="white"></q-btn>
          <q-btn icon="clear_all" flat color="red" v-on:click="clearAll"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-card
            bordered class="bg-dark text-white" v-for="(data,key) in this.sharedEvents" :key="key">
            <q-card-section horizontal style="height:150px;">
              <q-img class="col-9" style="object-fit:Cover;height:100%;" :src="data.image" v-if="data.image">
                <div class="absolute-bottom text-caption row">
                  <q-btn :icon="data.icon" :color="data.color" flat :label="data.name" no-caps></q-btn>
                  <q-space></q-space>
                  <q-btn class="" icon="info" flat v-on:click="goSelectedEvent(data)"></q-btn>
                </div>
              </q-img>
              <q-card-section vertical>
                <q-btn icon="delete_forever" flat color="white" v-on:click="clearNotify(data)" class="q-pa-md"></q-btn>
                <q-btn icon="person" flat color="white" class="q-pa-md" v-on:Click="showSender(data)"></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
          <q-card
            v-touch-hold:2000.mouse="event => clearNotifyUser(data)"
            flat class="bg-dark text-white q-ma-sm" v-for="(data,key) in this.myNotifies.newAddedUsers" :key="key">
            <q-card-section horizontal>
              <q-card-section class="col-3">
                <q-avatar>
                  <img :src="data.detail.userImage" v-if="data.detail.userImage" alt="" style="object-fit:Cover;">
                  <q-btn icon="event" v-if="!data.detail.userImage" color="dark" round></q-btn>
                </q-avatar>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="text-subtitle2">
                  <q-icon name="badge"></q-icon>
                  {{ data.detail.userName ?? data.detail.email }}, {{ data.detail.userLastName && data.detail.userName ? data.detail.userLastName : '' }}
                </div>
                <div class="text-subtitle2 text-grey-6" >
                  <!--  {{ data.detail.userDescription ?? '' }} -->
                  <q-icon name="info"></q-icon>
                  Sizi Arkadas Olarak Ekledi
                </div>
              </q-card-section>
              <q-card-section class="col-3">
                <q-btn icon="person" flat size="sm" v-on:click="showmoredetail(data)"></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
          <q-card
            bordered class="bg-dark text-white" v-for="(data,key,index) in this.requestedEvents" :key="key"
          >
            <q-card-section horizontal style="height:150px;">
              <q-img class="col-9" :src="data.image" v-if="data.image" style="object-fit:cover;height:100%;"></q-img>
              <q-card-section vertical class="col">
                <q-btn icon="delete_forever" flat color="white" class="q-pa-md"  v-on:click="clearRequest(data,key)"></q-btn>
                <q-btn icon="login" flat color="white" class="q-pa-md" v-on:click="joinTheGroup(data)"></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
    </q-card>
    <profileDetail v-if="this.store.profileDetailActive" :selectedUser="this.selectedUser"/>
  </q-dialog>
</template>

<script>
import profileDetail from 'src/components/profileDetail.vue';
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    profileDetail
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      sharedEvents:[],
      selectedUser:{},
      myNotifies:{},
      requestedEvents:[]
    }
  },
  methods:{
    clearAll(){
      console.log(this.myNotifies)
      this.$q.dialog({
        dark:true,
        title:'Warning',
        cancel:true,
        message:'Tüm Bildirimleri Silmek İstediğinizden Emin  misiniz ?'
      }).onOk(()=>{
        axios.delete(`${this.store.baseUrl}/bbc/notifylists/${this.store.userDetail._id}/removeAllNotifies`)
          .then(res=>{
            console.log(res)
            this.getMyNotifies()
            this.$q.notify({
              type:'negative',
              icon:'check',
              position:'right',
              timeout:700
            })
          })
          .catch(err=>{
            console.log(err)
          })
      }).onCancel(()=>{
        //
      })
    },
    joinTheGroup(data){
      console.log(data)
      const myData = {
        userId:this.store.userDetail._id
      }
      axios.post(`${this.store.baseUrl}/bbc/eventlists/${data.eventId}/memberList`,myData)
        .then(res=>{
          console.log(res)
          this.clearRequestFunction(data)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    clearRequestFunction(data){
      axios.delete(`${this.store.baseUrl}/bbc/notifylists/${this.store.userDetail._id}/${data._id}/removeRequestEvent`)
        .then(res=>{
          console.log(res)
          this.requestedEvents = this.requestedEvents.filter(object => object._id !== data._id)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    clearRequest(data,key){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:'You Sure For Continue Delete Process ?'
      }).onOk(()=>{
        console.log(data,key)
        axios.delete(`${this.store.baseUrl}/bbc/notifylists/${this.store.userDetail._id}/${data._id}/removeRequestEvent`)
          .then(res=>{
            console.log(res)
            this.requestedEvents = this.requestedEvents.filter(object => object._id !== data._id)
          })
          .catch(err=>{
            console.log(err)
          })
      }).onCancel(()=>{
        //
      })
    },
    clearNotifyUser(data){
      axios.delete(`${this.store.baseUrl}/bbc/notifylists/${this.store.userDetail._id}/${data.userId}/newAddedUsers`)
        .then(res=>{
          console.log(res)
          this.myNotifies.newAddedUsers = this.myNotifies.newAddedUsers.filter(object => object.userId !== data.userId)
          this.$q.notify({
            type:'positive',
            icon:'check',
            timeout:700,
            position:'right',
            message:`${data.detail.email} Bildirimi silindi.`
          })
        })
        .catch(err=>{
          console.log(err)
        })
    },
    showmoredetail(data){
      console.log(data)
      const selectedUser = {
        _id : data.detail._id
      }
      this.selectedUser = selectedUser
      this.store.profileDetailActive = true
    },
    clearNotify(data){
      console.log(data)
      axios.delete(`${this.store.baseUrl}/bbc/notifylists/${this.store.userDetail._id}/${data._id}/removeSelectedSharedNotify/${data.sharerId}`)
        .then(res=>{
          console.log(res)
          this.sharedEvents = res.data.sharedEvents
          this.$q.notify({
            type:'positive',
            icon:'check',
            position:'right'
          })
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goSelectedEvent(data){
      console.log(data)
      axios.get(`${this.store.baseUrl}/bbc/eventlists/${data._id}/findInNotifies`)
        .then(res=>{
          console.log(res)
          if(res.data.inDb === true){
            this.$emit('findEventGroup',res.data.findedEvent)
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    showSender(data){
      if(data.sharerId){
        const selectedUser = {
          _id : data.sharerId
        }
        this.selectedUser = selectedUser
        this.store.profileDetailActive = true
      }
    },
    getMyNotifies(){
      axios.get(`${this.store.baseUrl}/bbc/notifylists/${this.store.userDetail._id}/getSharedEvents`)
        .then(res=>{
          console.log('mynotifies',res)
          this.myNotifies = res.data.myNotifyList
          console.log('myNotifies',this.myNotifies)
          this.requestedEvents = res.data.myNotifyList.requestGroupEvents
          this.sharedEvents = res.data.myNotifyList.sharedEvents
        })
        .catch(error=>{
          console.log(error)
        })
    },
    goBack(){
      this.store.notifyCompActive = false
    }
  },
  created(){

  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.getMyNotifies()
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
