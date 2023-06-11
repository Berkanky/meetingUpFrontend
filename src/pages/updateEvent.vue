<template>
  <q-page :style="{'height':this.$q.screen.height + 'px'}">
    <div class="container">
      <q-card class="bg-white text-capitalize" :style="{'width':this.store.mobileActive ? '100%' : '800px'}">
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn :icon="this.currentEvent.icon" :color="this.currentEvent.color" :label="this.currentEvent.eventType" no-caps flat></q-btn>
          <upload @currentImageData="getcurrentImageData"/>
        </q-card-section>
        <q-card-section class="text-center">
          <q-avatar size="150px">
            <img :src="this.currentEvent.image" alt="" v-if="this.currentEvent.image&&!this.newData.image" style="object-fit:cover;">
            <img :src="this.newData.image" alt="" v-if="this.newData.image" style="object-fit:cover;">
            <q-btn icon="group" color="dark" round v-if="!this.currentEvent.image&&!this.newData.image"></q-btn>
          </q-avatar>
        </q-card-section>
        <q-card-section horizontal>
          <q-input filled class="col-6" :label="this.currentEvent.name" color="dark" v-model="this.newData.name" type="text">
            <template v-slot:prepend>
              <q-icon name="group"></q-icon>
            </template>
          </q-input>
          <q-input filled class="col-6" :label="`Max Member ${this.currentEvent.maxMember}`" type="number" color="dark" v-model="this.newData.maxMember">
            <template v-slot:prepend>
              <q-icon name="group"></q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section horizontal>
          <q-input
            class="col q-mt-sm"
            filled color="dark"
            v-model="this.newData.description"
            type="textarea"
            :label="this.currentEvent.description"
          >
            <template v-slot:prepend>
              <q-icon name="info"></q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="text-right">
          <q-btn icon="cancel" color="red" flat label="Cancel" no-caps v-on:Click="clearNewData"></q-btn>
          <q-btn icon="check" color="green" flat label="Save" no-caps v-on:click="saveUpdate"></q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import upload from 'src/components/upload.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    upload
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
      currentEvent:{},
      newData:{}
    }
  },
  methods:{
    saveUpdate(){
      const url = 'http://localhost:8000';
      const selectedEventId = this.currentEvent._id;
      const updateData = this.newData;

      axios.put(`${this.store.baseUrl}/bbc/eventlists/updateEvent/${selectedEventId}`, updateData)
        .then(response => {
          console.log('Event updated:', response.data);
          // Handle the response or perform any additional tasks
          this.$router.push({path:'/myEventPage'})
        })
        .catch(error => {
          console.error('Error updating event:', error);
          // Handle the error or display an error message
        });

    },
    clearNewData(){
      this.newData = {}
    },
    getcurrentImageData(data){
      if(data){
        this.newData.image = data.image
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
          this.currentEvent = res.data
          console.log('currentEvent',this.currentEvent)
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  created(){
/*     this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        console.log(toParams,previousParams)
      }
    ) */
    console.log(this.$route.params)
    this.currentEventId = this.$route.params.id
  },
  watch:{
    currentEventId:{
      handler(newValue,oldValue){
        if(newValue){
          this.getCurrentEvent()
        }
      },
      immediate:true,
      deep:true
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
