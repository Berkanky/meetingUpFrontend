<template>
<q-page
  class="bg-grey-9 text-white"
  >
  <div
    v-if="this.store.currentEvent.eventNotifyMessage"
    style="position: absolute; top: 0; right: 0;">
    <notifiesMessagesVue :currentEvent="this.store.currentEvent"/>
  </div>
    <div
      style="margin:0 auto;max-width:700px;"
    >
      <q-card style="height:100%;width:100%;" class="bg-grey-3" >
        <q-card-section class="row text-capitalize">
          <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn
            :icon="this.store.currentEvent.icon"
            :color="this.store.currentEvent.color"
            flat
            :label="this.store.currentEvent.name ?? this.store.currentEvent.eventType"
            no-caps
          ></q-btn>
          <q-avatar>
            <q-btn icon="groups" round color="dark" v-if="!this.store.currentEvent.image"></q-btn>
            <img :src="this.store.currentEvent.image" style="object-fit:cover;" alt="" v-if="this.store.currentEvent.image">
          </q-avatar>
        </q-card-section>
        <q-separator color="grey" size="3px"></q-separator>
        <mapComp />
        <q-card-section class="text-dark row">
          <q-btn
            round
            glossy
            icon="location_on"
            :color="this.checkYourLocationSharedOrNot() ? 'green' : 'red'"
          ></q-btn>
          <div class="text-subtitle2 q-pa-sm" v-if="this.checkYourLocationSharedOrNot()">
            Your Location Shared With Group Members, Make your settings on profile page.
          </div>
          <div class="text-subtitle2 q-pa-sm" v-if="!this.checkYourLocationSharedOrNot()">
            Your Location Not Sharing With Group Members, Make your settings on profile page.
          </div>
        </q-card-section>
        <q-separator color="grey" size="3px"></q-separator>
        <q-card-section horizontal>
          <q-card class="bg-dark col-6">
            <q-card-section>
              <q-btn icon="event" class="full-width full-height" flat color="pink" v-on:click="openTheCurrentEventDetail">
                <q-badge color="white" rounded floating  v-if="this.checkCurrentEvent()"/>
              </q-btn>
            </q-card-section>
          </q-card>
          <q-card class="bg-dark col-6" bordered>
            <q-card-section>
              <q-btn icon="chat" class="full-width full-height" flat color="green" v-on:click="goChatWithGroup"></q-btn>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section horizontal v-if="!this.checkCurrentEvent()">
          <q-input
            :readonly="this.store.currentEvent.createrId === this.store.userDetail._id ? false : true"
            filled v-model="this.date" class="col q-pa-sm" label="Tarih Giriniz" color="dark">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="this.date" mask="YYYY-MM-DD HH:mm" color="orange" dark today-btn>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="white" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="this.date" mask="YYYY-MM-DD HH:mm" format24h dark color="orange" now-btn>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="white" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="text-dark" v-if="!this.checkCurrentEvent()">
          <div class="text-subtitle2 q-pa-md">
            <q-icon name="info" size="19px" color="grey"></q-icon>
            {{ this.store.currentEvent.createrId === this.store.userDetail._id ? 'Seçili Lokasyonu Event Olarak Onaylıyor musunuz ?' : 'Admin Onayı Bekleniyor.' }}
            <q-btn icon="check" color="green" flat v-if="this.store.currentEvent.createrId === this.store.userDetail._id" v-on:click="confirmEvent"></q-btn>
          </div>
        </q-card-section>
        <q-card-section class="row">
          <q-btn icon="groups" label="members" flat color="dark"></q-btn>
          <q-space></q-space>
          <!-- <q-btn icon="more_vert" flat color="dark" v-on:click="showMoreOption"></q-btn> -->
          <q-btn-dropdown color="dark" flat label="Options" icon="more_vert">
            <q-list>
              <q-item clickable v-close-popup @click="selectOption(data)" v-for="(data,key) in this.options" :key="key">
                <q-item-section>
                  <q-item-label>{{data.label}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn icon="notifications" flat :color="this.store.currentEvent.color">
            <q-badge floating color="dark" rounded />
          </q-btn>
        </q-card-section>
        <q-card-section class="row">
          <q-card class="col-6 bg-transparent text-dark" v-for="(data,key) in this.store.currentEventMembersList" :key="key">
            <q-card-section horizontal>
              <q-card-section class="col-3">
                <q-avatar v-on:click="selectCurrentUser(data)">
                  <img :src="data.userImage" style="object-fit:cover;" alt="" v-if="data.userImage">
                  <q-btn icon="person" round color="dark" v-if="!data.userImage"></q-btn>
                </q-avatar>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="text-overline">
                  <q-icon :name="data._id === this.store.currentEvent.createrId ? 'admin_panel_settings' : 'person'"></q-icon>
                  {{ data.userName ?? data.email }}
                </div>
                <div class="text-caption">
                  <q-icon name="work"></q-icon>
                  {{ data.userDescription ?? 'No Info' }}
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section v-if="this.store.userDetail._id !== this.store.currentEvent.createrId">
          <q-btn icon="logout" flat color="red" label="remove from group" class="full-width" v-on:click="removeFromSelectedGroup"></q-btn>
        </q-card-section>
      </q-card>
    </div>
    <currentEventComp v-if="this.store.currentEventDetailCompActive"/>
    <profileDetail v-if="this.store.profileDetailActive" :selectedUser="this.selectedUser"/>
    <zoomImage v-if="this.store.zoomImageActive"/>
    <oldMembersVue v-if="this.store.oldMembersActive"/>
    <eventNotifyMessage v-if="this.store.eventNotifyMessageCompActive"/>
    <blockedUsers v-if="this.store.eventBlockedCompActive"/>
    <adviceFriendToGroup v-if="this.store.adviceFrientToGroupCompActive"/>
  </q-page>
</template>

<script>
import adviceFriendToGroup from 'src/eventDetailComp/adviceFriendToGroup.vue';
import blockedUsers from 'src/eventDetailComp/blockedUsers.vue';
import notifiesMessagesVue from '../eventDetailComp/notifiesMessages.vue'
import eventNotifyMessage from 'src/eventDetailComp/eventNotifyMessage.vue';
import oldMembersVue from '../components/oldMembers.vue'
import zoomImage from 'src/components/zoomImage.vue';
import profileDetail from 'src/components/profileDetail.vue';
import currentEventComp from 'src/eventDetailComp/currentEventComp.vue';
import mapComp from '../components/map.vue'
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    mapComp,
    currentEventComp,
    profileDetail,
    zoomImage,
    oldMembersVue,
    eventNotifyMessage,
    notifiesMessagesVue,
    blockedUsers,
    adviceFriendToGroup
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      currentEventId:'',
      newEventData:{},
      selectedUser:{},
      date:'',
      options:[
        {id:1,label:'Old Members',icon:'groups'},
        {id:2,label:'Blocked Members',icon:'remove'},
        {id:3,label:'Send Notify To Group',icon:'info'},
        {id:4,label:'Advice List',icon:'receipt_long'}
      ]
    }
  },
  methods:{
    getEventNotifiesMessage(){
      console.log('this.store.currentEvent',this.store.currentEvent)
    },
    selectOption(data){
      if(data.id === 1){
        this.store.oldMembersActive = true
      }else if(data.id === 3){
        this.store.eventNotifyMessageCompActive = true
      }else if(data.id === 2){
        this.store.eventBlockedCompActive = true
      }else if(data.id === 4){
        this.store.adviceFrientToGroupCompActive = true
      }
    },
    removeFromSelectedGroup(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`${this.store.currentEvent.name ?? this.store.currentEvent.eventType} Grubundan Ayrılmak İstiyor musunuz ?`
      }).onOk(()=>{
        axios.delete(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/leaveFromEvent/${this.store.userDetail._id}`)
          .then(res =>{
            console.log(res)
            this.$router.push({path:'/allEvents'})
          })
          .catch(err=>{
            console.log(err)
          })
      })
    },
    showMoreOption(){
      this.store.showMoreOptionActive =! this.store.showMoreOptionActive
    },
    selectCurrentUser(data){
      this.selectedUser = data
      this.store.profileDetailActive = true
      console.log(data)
    },
    openTheCurrentEventDetail(){
      if(this.checkCurrentEvent()){
        this.getCurrentEvent()
        this.store.currentEventDetailCompActive = true
      }
    },
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
    confirmEvent(){
      if(this.date){
        console.log(this.newEventData)
        this.newEventData.lat = this.store.currentEvent.eventPosition.lat
        this.newEventData.lng = this.store.currentEvent.eventPosition.lng
        this.newEventData.userId = this.store.currentEvent.eventPosition.userId
        this.newEventData.eventStartDate = this.date

        const url = 'http://localhost:8000';
        axios.post(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/currentEvent`,this.newEventData)
          .then(res =>{
            console.log(res)
            this.store.currentEvent = res.data
          })
          .catch(err =>{
            console.log(err)
          })
      }else{
        this.$q.notify({
          type:'negative',
          message:'Date ve Lokasyon Bilgilerinin Girildiğinden Emin olun !',
          icon:"info",
          timeout:700,
          position:'right'
        })
      }
    },
    goChatWithGroup(){
      this.$router.push({path:'/chat'})
      this.store.selectedUserForDetail = {}
    },
    checkYourLocationSharedOrNot(){
      if(this.store.currentEvent.locationList){
        const result = this.store.currentEvent.locationList.some(object => object.userId === this.store.userDetail._id)
        if(result){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    goBack(){
      this.$router.go(-1)
    },
    getCurrentEvent(){
      const url = 'http://localhost:8000';
      axios.get(`${this.store.baseUrl}/bbc/eventlists/updateEvent/${this.currentEventId}`)
        .then(res =>{
          console.log(res)
          this.store.currentEvent = res.data
          console.log('currentEvent',this.store.currentEvent)
          this.store.getSelectedEventMembers()
          this.getEventNotifiesMessage()
        })
        .catch(error => {
          console.error(error)
        })
    },
    randomKey(){
      const randomNumber = Math.floor(Math.random() * 10);
      this.store.randomKeyForMap = randomNumber
    },
  },
  mounted(){
  },
  created(){
    this.store.getOnlyUsers()
    this.currentEventId = this.$route.params.id
    this.store.getCurrentUserInfo()

    const handleResize = () => {
      this.store.screenWidth = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);
  },
  watch:{
    'store.screenWidth'(newWidth) {
      // Handle screen width changes here
      console.log('Screen width changed:', newWidth);
      this.randomKey()
    },
    currentEventId:{
      handler(newValue,oldValue){
        if(newValue != '' && newValue != null){
          this.getCurrentEvent()
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
