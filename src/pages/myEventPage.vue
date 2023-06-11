<template>
  <q-page :style="{'height':this.$q.screen.height + 'px'}" class="bg-grey-9">
    <div

      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '1000px'
      }"
      class="q-pa-xs">
      <q-card class="bg-grey-8">
      <q-card-section horizontal>
        <q-card-section class="col-6">
          <div class="text-h6">My Events</div>
          <div class="text-subtitle2">
            <q-icon name="mail"></q-icon>
            {{this.store.userDetail.email}}</div>
        </q-card-section>
        <q-card-section class="col-6 text-right">
          <q-btn
            label="Clear"
            icon="clear_all" color="red"
            v-if="this.selectEventType.filterActive" v-on:click="clearFilter"></q-btn>
          <q-select
            v-if="!this.selectEventType.filterActive"
            @update:modelValue="selectCategory"
            color="white" dark filled v-model="this.selectEventType.eventType"
            :options="this.selectEventType.eventCategoryList" label="Select Event Type">
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-select>
        </q-card-section>
      </q-card-section>
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-center">Image</th>
            <th class="text-center">Name</th>
            <th class="text-center">Created Date</th>
            <th class="text-center">Member</th>
            <th class="text-center">Event Type</th>
            <th class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data,index,key) in this.store.myEvents" :key="key">
            <td class="text-left">{{index}}</td>
            <td class="text-center">
              <q-avatar rounded>
                <img :src="data.image" alt="" v-if="data.image" style="object-fit:Cover;">
                <q-btn icon="group" v-if="!data.image" color="dark"></q-btn>
              </q-avatar>
            </td>
            <td class="text-center text-capitalize">{{ data.name ?? 'No Group Name' }}</td>
            <td class="text-center">{{data.date}}</td>
            <td class="text-center">{{ data.memberList.length }}</td>
            <td class="text-center">
              <q-btn :color="data.color" :icon="data.icon"></q-btn>
            </td>
            <td class="text-center">
              <q-btn icon="delete" color="red" flat v-on:Click="removeEvent(data)"></q-btn>
              <q-btn icon="edit" color="green" flat v-on:click="updateEvent(data)"></q-btn>
              <q-btn icon="admin_panel_settings" flat :color="data.color" v-on:click="goAdminPanelSettings(data)"></q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>
    <q-card class="bg-grey-8" flat bordered>
      <q-card-section class="row">
        <q-card-section class="col-6">
          <div class="text-h6">My Old Events</div>
          <div class="text-subtitle2">
            {{ this.myOldEvents.length }} - Event
          </div>
        </q-card-section>
        <q-card-section class="col-6">
          <q-btn icon="clear_all" label="clear filter" color="red" class="full-width" v-if="this.selectEventType.myOldEventsFilterActive" v-on:click="clearOldEventFilter"></q-btn>
          <q-select
            v-if="!this.selectEventType.myOldEventsFilterActive"
            dark filled label="Select Category" v-model="this.selectEventType.selectCategory"
            :options="this.categories" color="white" @update:model-value="selectCategoryOfOldEvents"></q-select>
        </q-card-section>
      </q-card-section>

      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-center">Image</th>
            <th class="text-center">Name</th>
            <th class="text-center">Created Date</th>
            <th class="text-center">Member</th>
            <th class="text-center">Event Type</th>
            <th class="text-center"></th>
          </tr>
        </thead>
        <tbody style="width:100%;">
          <tr v-for="(data,index,key) in this.myOldEvents" :key="key">
            <td class="text-left">{{index}}</td>
            <td class="text-center">
              <q-avatar rounded>
                <img :src="data.image" alt="" v-if="data.image" style="object-fit:Cover;">
                <q-btn icon="group" v-if="!data.image" color="dark"></q-btn>
              </q-avatar>
            </td>
            <td class="text-center text-capitalize">{{ data.name ?? 'No Group Name' }}</td>
            <td class="text-center">{{data.date}}</td>
            <td class="text-center">{{ data.memberList.length }}</td>
            <td class="text-center">
              <q-btn :color="data.color" :icon="data.icon"></q-btn>
            </td>
            <td class="text-center">
              <q-btn icon="delete_forever" color="red" flat v-on:click="deleteOldEvent(data)"></q-btn>
              <q-btn icon="info" flat :color="data.color" v-on:click="showMoreDetail(data)"></q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
<!--       <q-card-section class="text-center bg-white">
          <q-btn icon="skip_previous" flat color="dark" v-if="this.currentPageNumber > 0"></q-btn>
          <q-btn :label="this.currentPageNumber" color="dark" flat></q-btn>
          <q-btn icon="skip_next" ></q-btn>
        </q-card-section> -->
    </q-card>
    </div>
    <event-detail v-if="this.store.eventDetailVueActive"/>
  </q-page>
</template>

<script>
import eventDetail from 'src/components/eventDetail.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    eventDetail
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      currentPageNumber:0,
      selectEventType:{
        eventType:'',
        eventCategoryList:[],
        filterActive:false,
        categoryType:'',
        myOldEventsFilterActive:false
      },
      myOldEvents:[],
      categories:[]
    }
  },
  methods:{
    deleteOldEvent(data){
      console.log(data)
      axios.delete(`${this.store.baseUrl}/bbc/oldeventlists/${data._id}/removeEvent/${this.store.userDetail._id}`)
        .then(res=>{
          console.log(res)
          this.myOldEvents = this.myOldEvents.filter(object => object._id !== data._id)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    showMoreDetail(data){
      axios.get(`${this.store.baseUrl}/bbc/oldEventDetail/${data._id}/eventDetail/${this.store.userDetail._id}`)
        .then(res=>{
          console.log(res)
          this.store.selectedEventData = res.data.findedEvent
          this.store.selectedEventMembersList = res.data.memberList
          this.store.eventDetailVueActive = true
        })
        .catch(err=>{
          console.log(err)
        })
    },
    clearOldEventFilter(){
      this.getMyOldEvents()
      this.selectEventType.myOldEventsFilterActive = false
    },
    selectCategoryOfOldEvents(val){
      if(val){
        this.myOldEvents = this.myOldEvents.filter(object => object.eventType === val)
        this.selectEventType.myOldEventsFilterActive = true
      }
    },
    getMyOldEvents(){
      axios.get(`${this.store.baseUrl}/bbc/eventlists/${this.store.userDetail._id}/oldEvents`)
        .then(res=>{
          console.log('myoldevents',res)
          this.myOldEvents = res.data.oldEvent.oldEventList
          this.categories = res.data.uniqueCategoryList
        })
        .catch(err=>{
          console.log(err)
        })
    },
    clearFilter(){
      this.store.getMyEvents()
      this.selectEventType.filterActive = false
    },
    selectCategory(val){
      if(val){
        console.log(val)
        this.store.myEvents = this.store.myEvents.filter(object => object.eventType === val)
        this.selectEventType.filterActive = true
      }
    },
    getEventCategories(){
      this.selectEventType.eventCategoryList = []
      this.store.myEvents.forEach(element => {
        const result = this.selectEventType.eventCategoryList.some(object => object === element.eventType)
        if(!result){
          this.selectEventType.eventCategoryList.push(element.eventType)
        }
      });
    },
    goAdminPanelSettings(data){
      console.log(data)
      this.$router.push({name:'eventControlPanel',params:{id:data._id}})
    },
    removeEventFunction(data){
      const url = 'http://localhost:8000';
      const allUrl = `${this.store.baseUrl}/bbc/eventlists/${data._id}`
      axios.delete(allUrl)
        .then(res => {
          console.log(res)
          this.store.getMyEvents()
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateEvent(data){
      console.log(data)
      this.$router.push({name:'updateEvent',params:{id:data._id}})
    },
    removeEvent(data){
      console.log(data)
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:`${data.name ?? data.eventType} Eventini Silmek Istediğinizden Emin misiniz ?`,
        cancel:true
      }).onOk(()=>{
        this.removeEventFunction(data)
      }).onCancel(()=>{
        //
      })
    }
  },
  created(){
    this.store.getCurrentUserInfo()
    //
  },
  watch:{
    'store.myEvents':{
      handler(newValue,oldValue){
        if(newValue.length){
          this.getEventCategories()
        }
      },
      immediate:true,
      deep:true
    },
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getMyEvents()
          this.getMyOldEvents()
        }
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height:100%;
}
</style>
