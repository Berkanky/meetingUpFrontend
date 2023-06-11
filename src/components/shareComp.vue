<template>
  <q-dialog
    persistent
    dark
    v-model="this.store.shareCompActive"
    :maximized="this.store.mobileActive ? true : false"  :full-height="this.store.mobileActive ? true :  false"
  >
    <q-card
      :style="{'width':this.store.mobileActive ? '100%' : '500px'}"
      style="" class="bg-dark text-white">
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-avatar>
          <img :src="this.currentEvent.image" v-if="this.currentEvent.image" style="object-fit:Cover;" alt="">
          <q-btn icon="group" round color="dark" v-if="!this.currentEvent.image"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn
          v-if="this.filterActive"
          icon="clear_all" label="clear" color="red"
          class="full-width" v-on:click="clearFilter"></q-btn>
        <q-select
          v-if="!this.filterActive"
          v-model="this.filterData"
          @update:model-value="selectUser"
          dark filled label="Filter Friends"
          :options="this.getFriendsListOnlyNames()" color="white">
          <template v-slot:prepend>
            <q-icon name="person"></q-icon>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section>
        <q-card class="bg-dark text-white" flat v-for="(data,key) in this.friendList " :key="key">
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar v-on:click="showUser(data)">
                <img :src="data.userImage" style="object-fit:Cover;" alt="" v-if="data.userImage">
                <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-subtitle2">
                <q-icon name="person"></q-icon>
                {{ data.userName ?? data.email }}, {{ data.userName && data.userLastName ? data.userLastName : '' }}
              </div>
              <div class="text-overline">
                <q-icon name="work"></q-icon>
                {{ data.userDescription ?? '' }}
              </div>
            </q-card-section>
            <q-card-section class="col-3">
              <q-btn icon="share" flat color="white" v-on:click="shareToThisUser(data)"></q-btn>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <profileDetail v-if="this.store.profileDetailActive" :selectedUser="this.selectedUser"/>
  </q-dialog>
</template>

<script>
import profileDetail from './profileDetail.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  props:['selectedEvent'],
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
      filterData:'',
      currentEvent:{},
      friendList:[],
      selectedUser:{},
      filterActive:false
    }
  },
  methods:{
    clearFilter(){
      this.filterActive = false
      this.getMyFriends()
    },
    selectUser(val){
      if(val){
        console.log(val)
        this.friendList = this.friendList.filter(object => object.email === val)
        this.filterActive = true
      }
    },
    getFriendsListOnlyNames(){
      const optionList = []
      this.friendList.forEach(element => {
        optionList.push(element.email)
      });
      return optionList
    },
    shareToThisUser(data){
      console.log(data)
      const selectedEvent = this.currentEvent
      selectedEvent.sharerId = this.store.userDetail._id
      axios.post(`${this.store.baseUrl}/bbc/notifylists/${this.currentEvent._id}/${data._id}/shareEvent`,selectedEvent)
        .then(res=>{
          console.log(res)
          this.$q.notify({
            type:'positive',
            icon:'check',
            message:`${this.currentEvent.eventType}, ${data.userName ?? data.email} Adlı Kişiye Gönderildi.`,
            timeout:700,
            position:'right'
          })
        })
        .catch(err=>{
          console.log(err)
        })
    },
    showUser(data){
      this.selectedUser = data
      this.store.profileDetailActive = true
    },
    goBack(){
      this.store.shareCompActive = false
    },
    getMyFriends(){
      axios.get(`${this.store.baseUrl}/bbc/friendlists/${this.store.userDetail._id}/friends`)
        .then(res=>{
          console.log(res)
          this.friendList = res.data.friendListUpdated
        })
        .catch(err=>{
          console.log(err)
        })
    },
  },
  created(){

  },
  watch:{
    selectedEvent:{
      handler(newValue,oldValue){
        if(newValue._id){
          this.currentEvent = newValue
        }
      },
      immediate:true,
      deep:true
    },
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.getMyFriends()
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
