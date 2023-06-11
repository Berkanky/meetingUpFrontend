<template>
  <div class="WAL position-relative bg-grey-4" style="" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-black" v-if="this.store.selectedUserForDetail._id">
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            @click="toggleLeftDrawer"
          />
          <q-btn round flat v-on:click="showDetail">
            <q-avatar>
              <img :src="this.store.selectedUserForDetail.userImage" v-if="this.store.selectedUserForDetail.userImage" style="object-fit:Cover;">
              <q-btn icon="person" round color="dark" v-if="!this.store.selectedUserForDetail.userImage"></q-btn>
            </q-avatar>
          </q-btn>
          <span class="q-subtitle-1 q-pl-md text-capitalize text-weight-bold text-grey-7">
            {{ this.store.selectedUserForDetail.userName ?? this.store.selectedUserForDetail.email }}
          </span>
          <q-space/>

          <q-btn round flat icon="search" v-on:click="searchOnMessages" v-if="!this.store.chatMessagesFindFilterActive"/>
          <q-btn round flat icon="clear_all" v-on:click="clearSearch" v-if="this.store.chatMessagesFindFilterActive"></q-btn>
          <q-btn round flat>
            <q-icon name="attachment" class="rotate-135" />
          </q-btn>
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>Contact data</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Block</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Select messages</q-item-section>
                </q-item>
                <q-item clickable v-on:click="blockUser" v-if="!this.checkBlockedOrNot()">
                  <q-item-section>Silence</q-item-section>
                </q-item>
                <q-item clickable v-on:click="unBlockUser" v-if="this.checkBlockedOrNot()">
                  <q-item-section>Remove Silence</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Clear messages</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Erase messages</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
        <q-toolbar class="bg-grey-3 text-black" v-if="this.store.currentEvent._id">
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            @click="toggleLeftDrawer"
          />
          <q-btn round flat>
            <q-avatar>
              <img :src="this.store.currentEvent.image" v-if="this.store.currentEvent.image" style="object-fit:Cover;">
              <q-btn icon="groups" round color="dark" v-if="!this.store.currentEvent.image"></q-btn>
            </q-avatar>
          </q-btn>
          <span class="q-subtitle-1 q-pl-md text-capitalize text-weight-bold text-grey-7">
            {{ this.store.currentEvent.name ?? this.store.currentEvent.eventType }}
          </span>
          <q-space/>

          <q-btn round flat icon="search" v-on:click="searchOnMessages" v-if="!this.store.chatMessagesFindFilterActive"/>
          <q-btn round flat icon="clear_all" v-on:click="clearSearch" v-if="this.store.chatMessagesFindFilterActive"></q-btn>
          <q-btn round flat>
            <q-icon name="attachment" class="rotate-135" />
          </q-btn>
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>Contact data</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Block</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :breakpoint="690"
      >
        <q-toolbar class="bg-grey-3">
          <q-avatar class="cursor-pointer">
            <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBackPage"></q-btn>
          </q-avatar>
          <q-space />
          <q-btn round flat icon="more_vert" color="dark">
            <q-menu auto-close :offset="[110, 8]">
              <q-list style="min-width: 150px">
                <q-item clickable v-on:click="findNewUser">
                  <q-item-section>Find User</q-item-section>
                </q-item>
                <q-item clickable v-on:click="this.$router.push({path:'/profile'})">
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Archived</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Favorites</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            round
            flat
            icon="close"
            class="WAL__drawer-close"
            @click="toggleLeftDrawer"
          />
        </q-toolbar>

        <q-toolbar class="bg-grey-2">
          <q-input
            v-if="!this.store.searchBarActive"
            rounded outlined dense
            class="WAL__field full-width" bg-color="white" v-model="this.searchValue"
            placeholder="Search or start a new conversation" v-on:keyup.enter="findUser">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn icon="clear_all" label="clear" color="red" v-if="this.store.searchBarActive" v-on:click="clearFilter"></q-btn>
        </q-toolbar>

        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item
              :class="this.checkSelectedGroup(data) ? 'bg-dark text-white' : 'text-dark bg-white'"
              v-if="this.store.myMemberedEvents.length&&!this.findedUsers.length"
              v-for="(data,key) in this.store.myMemberedEvents" :key="key"
              clickable
              v-ripple
              v-on:click="selectGroup(data)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="data.image" v-if="data.image" style="object-fit:cover;">
                  <q-btn icon="person" color="dark" round v-if="!data.image"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-item-section >
                <q-item-label lines="1" class="">
                  {{ data.name ?? data.eventType }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption :class="this.checkSelectedGroup(data) ? 'text-white' : 'text-dark'">
                  {{ data.description ?? '' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                </q-item-label>
                <q-icon :name="data.icon" :color="data.color" />
              </q-item-section>
            </q-item>
            <q-item
              v-if="this.findedUsers.length"
              v-for="(data,key) in this.findedUsers" :key="key"
              clickable
              v-ripple
              v-on:click="selectUser(data)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="data.userImage" v-if="data.userImage" style="object-fit:cover;">
                  <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1" class="text-dark">
                  {{ data.userName ?? data.email }} <q-btn icon="fiber_manual_record" flat :color="this.checkOnlineOrNot(data) ? 'green' : 'red'" size="sm"></q-btn>
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  {{ data.userDescription ?? '' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                </q-item-label>
                <q-icon name="keyboard_arrow_down" />
              </q-item-section>
            </q-item>
            <q-item
              style="border-radius:7px;"
              :class="this.checkSelectedOrNot(data) ? 'bg-dark text-white' : 'bg-white text-dark'"
              v-if="this.store.myFriendList.length&&!this.findedUsers.length"
              v-for="(data,key) in this.store.myFriendList" :key="key"
              clickable
              v-ripple
              v-on:click="selectUser(data)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="findUserImage(data)" style="object-fit:cover;" v-if="checkUserImageOrNot(data)">
                   <q-btn icon="person" color="dark" round v-if="!checkUserImageOrNot(data)"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-space></q-space>
              <q-item-section>
                <q-item-label lines="1" :class="this.checkSelectedOrNot(data) ? 'text-white' : 'text-dark'">
                  {{ this.getUserName(data) }} <q-btn icon="fiber_manual_record" flat :color="this.checkOnlineOrNot(data) ? 'green' : 'red'" size="sm"></q-btn>
                </q-item-label>
                <q-item-label class="conversation__summary" caption :class="this.checkSelectedOrNot(data) ? 'text-white' : 'text-dark'">
                  {{ this.getUserDescrip(data) }}
                </q-item-label>
              </q-item-section>
              <q-space></q-space>
              <q-item-section side>
                <q-item-label caption>
                </q-item-label>
                <q-icon name="keyboard_arrow_down" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <q-page-container class="bg-grey-2" :style="{'height':this.store.chatMessages.length ? '100%' : this.$q.screen.height + 'px'}">
        <div class="q-mb-md"></div>
   <!--      <q-intersection
          v-for="(data,key,index) in this.store.chatMessages" :key="index"
          style="height:100%;"
        >
        <q-chat-message
          :stamp="data.fullDate"
          :sent="data.senderId === this.store.userDetail._id ? true : false"
          text-color="white"
          bg-color="pink-5"
        >
        <template v-slot:name>
          {{ data.name ?? data.email }}
        </template>
        <template v-slot:avatar>
          <q-avatar class="q-ma-sm">
            <img :src="findMessageAvatar(data)" alt="" style="object-fit:cover;" v-if="checkAvatarOrNot(data)"/>
            <q-btn icon="person" color="dark" round v-if="!checkAvatarOrNot(data)" size="md"></q-btn>
          </q-avatar>
        </template>
        <div>
          {{ data.message }}
        </div>
        </q-chat-message>
      </q-intersection> -->
      <!--   <router-view /> -->
      <q-chat-message
      v-for="(data,key,index) in this.store.chatMessages" :key="index"
          :stamp="data.fullDate"
          :sent="data.senderId === this.store.userDetail._id ? true : false"
          text-color="white"
          bg-color="pink-5"
        >
        <template v-slot:name>
          {{ data.name ?? data.email }}
        </template>
        <template v-slot:avatar>
          <q-avatar class="q-ma-sm">
            <img :src="findMessageAvatar(data)" alt="" style="object-fit:cover;" v-if="checkAvatarOrNot(data)"/>
            <q-btn icon="person" color="dark" round v-if="!checkAvatarOrNot(data)" size="md"></q-btn>
          </q-avatar>
        </template>
        <div>
          {{ data.message }}
        </div>
        </q-chat-message>
        <div class="q-mt-xl"></div>
      </q-page-container>
      <q-footer v-if="this.store.selectedUserForDetail._id">
        <q-toolbar class="bg-grey-3 text-black row">
          <q-input
            :disable="this.store.selectedUserForDetail._id && !this.youBlocked ? false : true"
            rounded outlined color="pink" dense class="WAL__field col-grow q-mr-sm" bg-color="white"
            v-model="this.message" placeholder="Type a message" v-on:keyup.enter="this.sendMessageFirst()">
            <template v-slot:after v-if="this.message">
              <q-btn icon="send" round v-on:click="this.sendMessageFirst()"></q-btn>
            </template>
          </q-input>
        </q-toolbar>
      </q-footer>
      <q-footer v-if="this.store.currentEvent._id">
        <q-toolbar class="bg-grey-3 text-black row">
          <q-input
            rounded outlined color="pink" dense class="WAL__field col-grow q-mr-sm" bg-color="white"
            v-model="this.message" placeholder="Type a message" v-on:keyup.enter="this.sendMessageToGroup()">
            <template v-slot:after v-if="this.message">
              <q-btn icon="send" round v-on:click="this.sendMessageToGroup()"></q-btn>
            </template>
          </q-input>
        </q-toolbar>
      </q-footer>
    </q-layout>
    <selectedUserDetail v-if="this.store.selectedUserDetailActive"/>
  </div>
</template>

<script>
import axios from 'axios'
import { getDatabase, ref, set } from "firebase/database";
import selectedUserDetail from 'src/components/selectedUserDetail.vue'
import {useCounterStore} from '../stores/store'
import { useQuasar } from 'quasar'
import { v4 as uuidv4 } from 'uuid';
import { ref as vueRef, computed } from 'vue'
export default {
  name: 'WhatsappLayout',
  components:{
    selectedUserDetail
  },
  setup () {
    const store = useCounterStore()
    const $q = useQuasar()
    const leftDrawerOpen = vueRef(false)
    const style = computed(() => ({
      height: $q.screen.height + 'px'
    }))
    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    return {
      leftDrawerOpen,
      style,
      toggleLeftDrawer,
      store
    }
  },
  data:function(){
    return{
      searchValue:'',
      message:'',
      selectedImage:{},
      findedUsers:[],
      findMessage:'',
      youBlocked:false,
    }
  },
  methods:{
    checkSelectedGroup(data){
      if(this.store.currentEvent._id === data._id){
        return true
      }else{
        return false
      }
    },
    sendMessageToGroup(){
      if(this.message){
        const randomId = uuidv4()
        const db = getDatabase()
        set(ref(db,`groupChats/${this.store.currentEvent._id}/${randomId}`),{
          id:randomId,
          message:this.message,
          email:this.store.userDetail.email,
          name:this.store.userDetail.userName ?? '',
          date:Date.now(),
          fullDate:this.store.globalSetDate(),
          senderId:this.store.userDetail._id,
          image:this.selectedImage.image ?? ''
        })
      }
      this.message = ''
    },
    watchMyFriendsAlways(){
      // Create a new axios instance.
      const axiosInstance = axios.create();
      const url = 'http://localhost:8000';
      // Subscribe to the `users` collection.
      axiosInstance.get(`${this.store.baseUrl}/bbc/users`).then((response) => {
        // In the callback function, you can access the new data that was added to the collection.
        this.store.allUser = response.data;
      });
    },
    clearFilter(){
      this.store.searchBarActive = false
      this.findedUsers = []
    },
    findNewUser(){
      this.$q.dialog({
          title: 'Find User',
          message: 'Enter Name, Email...',
          maximized:this.store.mobileActive ? true : false,
          fullHeight:this.store.mobileActive ? true : false,
          prompt: {
            model: this.searchValue,
            isValid: val => val.length > 0, // << here is the magic
            type: 'text' // optional
          },
          cancel: true,
          persistent: true,
          dark:true
        }).onOk(data => {
          this.store.getOnlyUsers()
          const result = this.store.allUser.filter(object => (object.userName ?? object.email).includes(data))
          if(result){
            this.findedUsers = result
            this.store.searchBarActive = true
          }else{
            this.$q.notify({
              type:'negative',
              message:`${data} Bulunamadı, Tekrar Deneyiniz !`,
              icon:'info',
              timeout:700,
              position:'top'
            })
            this.searchValue = ''
          }
        })
    },
    selectGroup(data){
      console.log(data)
      this.store.selectedUserForDetail = {}
      this.store.currentEvent = data
    },
    getSelectedUserBlockedCheck(){
      const url = 'http://localhost:8000';
      axios.get(`${this.store.baseUrl}/bbc/blockedlists/${this.store.selectedUserForDetail._id}/blockeds/${this.store.userDetail._id}`)
        .then(response => {
          console.log(response)
          if(response.data.selectedUserId){
            this.youBlocked = true
          }else{
            this.youBlocked = false
          }
        })
        .catch(error => {
          console.error(error);
          this.youBlocked = false
        });
    },
    unBlockUser(){
      const baseUrl = 'http://localhost:8000';
      const userId = this.store.userDetail._id;
      const selectedUser = this.store.selectedUserForDetail._id;
      const url = `${this.store.baseUrl}/bbc/blockedlists/${userId}/blockeds/${selectedUser}`;
      axios.delete(url)
        .then(response => {
          console.log('Blocked user deleted:', response.data);
          // Perform any necessary actions after successful deletion
          this.store.getBlockedUsers()
        })
        .catch(error => {
          console.error('Error deleting blocked user:', error);
          // Handle the error case
        });
    },
    checkBlockedOrNot(){
      const result = this.store.blockedList.find(object => object.selectedUserId === this.store.selectedUserForDetail._id)
      if(result){
        return true
      }else{
        return false
      }
    },
    blockUser(){
      const url = 'http://localhost:8000';
      // Assuming you have the necessary data stored in variables
      const userId = this.store.userDetail._id;
      const selectedUserId = this.store.selectedUserForDetail._id;
      const name = this.store.selectedUserForDetail.userName ?? '';
      const email = this.store.selectedUserForDetail.email;
      // Make the POST request
      axios.post(`${this.store.baseUrl}/bbc/blockedlists/${userId}/blockeds`, {
        selectedUserId,
        name,
        email
      })
        .then(response => {
          // Handle success response
          console.log('Blocked user added successfully');
          this.store.getBlockedUsers()
        })
        .catch(error => {
          // Handle error response
          console.error('Error adding blocked user:', error);
        });

    },
    clearSearch(){
      this.store.chatMessages = this.store.pureChatMessages
      this.store.chatMessagesFindFilterActive = false
    },
    searchOnMessages(){
      this.$q.dialog({
          title: 'Find Message',
          textColor:'dark',
          color:'pink',
          message: 'Find Message, Enter Word',
          prompt: {
            model: this.findMessage,
          //  isValid: val => val.length > 1, // << here is the magic
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          const result = this.store.chatMessages.filter(object => (object.message.toLowerCase()).includes(data.toLowerCase()))
          if(result.length){
            this.store.chatMessages = result
            this.store.chatMessagesFindFilterActive = true
          }
        })
    },
    checkAvatarOrNot(data){
      const result = this.store.allUser.find(object => object._id === data.senderId)
      if(result){
        if(result.userImage){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    findMessageAvatar(data){
      const result = this.store.allUser.find(object => object._id === data.senderId)
      if(result){
        if(result.userImage){
          const image = result.userImage
          return image
        }
      }
    },
    sendSecondMessage(messageData){
      const db = getDatabase()
      set(ref(db,`chats/${this.store.selectedUserForDetail._id}/${this.store.userDetail._id}/${messageData.id}`),{
        id:messageData.id,
        email:messageData.email ?? '',
        name:messageData.name ?? '',
        date:messageData.date,
        message:messageData.message,
        senderId:messageData.senderId,
        fullDate:messageData.fullDate,
        image:messageData.image
      })
      this.message = ''
    },
    sendMessageFirst(){
      if(this.message){
        const messageData = {
          id:uuidv4(),
          date:Date.now(),
          message:this.message,
          senderId:this.store.userDetail._id,
          fullDate:this.store.globalSetDate(),
          image:this.selectedImage.image ?? '',
          name:this.store.userDetail.userName ?? '',
          email:this.store.userDetail.email
        }
        const db = getDatabase()
        set(ref(db,`chats/${this.store.userDetail._id}/${this.store.selectedUserForDetail._id}/${messageData.id}`),{
          id:messageData.id,
          date:messageData.date,
          message:messageData.message,
          email:messageData.email ?? '',
          name:messageData.name ?? '',
          senderId:messageData.senderId,
          fullDate:messageData.fullDate ?? '',
          image:messageData.image ?? ''
        })
        this.sendSecondMessage(messageData)
      }
    },
    checkSelectedOrNot(data){
      if(this.store.selectedUserForDetail._id === data.selectedUserId){
        return true
      }else{
        return false
      }
    },
    showDetail(){
      if(this.store.selectedUserForDetail._id){
        console.log('selected User Detail',this.store.selectedUserForDetail)
        this.store.selectedUserDetailActive = true
      }
    },
    getUserDescrip(data){
      const result = this.store.allUser.find(object => object._id === data.selectedUserId)
      if(result){
        const descrip = result.userDescription ? result.userDescription : ''
        return descrip
      }
    },
    getUserName(data){
      const result = this.store.allUser.find(object => object._id === data.selectedUserId)
      if(result){
        const name = result.userName ?? result.email
        return name
      }else{
        return ''
      }
    },
    checkUserImageOrNot(data){
      const result = this.store.allUser.find(object => object._id === data.selectedUserId)
      if(result){
        if(result.userImage){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    findUserImage(data){
      const result = this.store.allUser.find(object => object._id === data.selectedUserId)
      if(result){
        const image = result.userImage
        return image
      }
    },
    selectUser(data){
      this.store.currentEvent = {}
      console.log(data)
        if(data.selectedUserId){
          this.store.selectedUserForDetail._id = data.selectedUserId
        }else{
          this.store.selectedUserForDetail._id = data._id
        }
        this.store.getSelectedUserInfo()
        this.getSelectedUserBlockedCheck()
    },
    checkOnlineOrNot(data){
      const result = this.store.allUser.find(object => object._id === data.selectedUserId)
      if(result){
        if(result.online){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    goBackPage(){
      this.$router.go(-1)
    },
    findUser(){
      if(this.searchValue){
        const result = this.store.myFriendList.filter(object =>
          (object.userName  ?? object.email).includes(this.searchValue)
        )
        const secondResult = this.store.myMemberedEvents.filter(object =>
          (object.name ?? object.eventType).includes(this.searchValue)
        )
        if(result){
          this.store.myFriendList = result
        }
        if(secondResult){
          this.store.myMemberedEvents = secondResult
        }
        this.store.searchBarActive = true
      }else{
        this.store.searchBarActive = false

        this.store.getFriendList()
        this.store.getEventsIfMember()
      }
    }
  },
  updated(){
    this.watchMyFriendsAlways()
  },
  created(){
    this.store.getCurrentUserInfo()
  },
  watch:{
    'store.currentEvent':{
      handler(newValue,oldValue){
        if(newValue._id){
          setTimeout(()=>{
            this.store.getGroupMessages()
          },100)
        }
      },
      immediate:true,
      deep:true
    },
    'store.selectedUserForDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getChat()
        }else{
          this.store.chatMessages = []
          this.store.pureChatMessages = []
        }
      },
      immediate:true,
      deep:true
    },
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getFriendList()
          this.store.getBlockedUsers()
          this.store.getEventsIfMember()
        }
      }
    }
  }
}
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px
  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px

  &__field.q-field--outlined .q-field__control:before
    border: none

  .q-drawer--standard
    .WAL__drawer-close
      display: none

@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0

@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none

.conversation__summary
  margin-top: 4px

.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
