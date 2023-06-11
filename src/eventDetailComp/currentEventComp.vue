<template>
  <q-dialog
    v-if="this.store.currentEventDetailCompActive" v-model="this.store.currentEventDetailCompActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    dark persistent
  >
    <q-card
      style="max-width:700px;"
      :style="{'width':this.store.mobileActive ? '100%' : '700px'}"
      class="bg-dark text-white">
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-btn icon="delete_forever" flat color="red" v-on:Click="deleteEvent"></q-btn>
      </q-card-section>
      <q-card-section horizontal>
        <q-card class="bg-dark col-6" style="height:180px;">
          <q-card-section style="height:180px;">
            <q-btn icon="event" class="full-width full-height" :color="this.store.currentEvent.color"></q-btn>
          </q-card-section>
        </q-card>
        <q-card class="col-6 bg-dark" >
          <q-card-section>
            <div class="text-overline q-pa-sm">
              <q-icon name="flag" size="19px"></q-icon>
              {{ this.currentLocation.country }}
            </div>
            <div class="text-overline q-pa-sm">
              <q-icon name="location_city" size="19px"></q-icon>
              {{ this.currentLocation.city }}
            </div>
            <div class="text-overline q-pa-sm">
              <q-icon name="location_on" size="19px"></q-icon>
              {{ this.currentLocation.fullAddress }}
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section>
        <q-stepper
          dark
          v-model="step"
          ref="stepper"
          color="white"
          animated
        >
          <q-step
            :name="0"
            title="Event Start"
            icon="event"
            :done="this.store.currentEvent.eventStep === 0"
          >
          Event Start
          </q-step>
          <q-step
            :name="1"
            title=""
            caption="Upload Event Files"
            icon="event"
            :done="this.store.currentEvent.eventStep === 1"
          >
            Waiting For Users Upload Images or Videos
          </q-step>

          <q-step
            :name="3"
            title="Event End"
            icon="event"
          >
            Event Finished
          </q-step>
        </q-stepper>
      </q-card-section>
      <q-card-section class="row q-pa-md" v-if="this.store.currentEvent.eventStep === 1">
        <q-btn-dropdown
          flat
          color="white"
          icon="more_vert"
        >
          <q-list class="bg-dark text-white">
            <q-item clickable v-close-popup @click="selectOption(data) " v-for="(data,key) in this.options.optionList" :key="key">
              <q-item-section>
                <q-item-label>{{data.label}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
    </q-btn-dropdown>

        <q-space></q-space>
        <upload @currentImageData="getcurrentImageData"/>
      </q-card-section>
      <q-card-section v-if="this.images.length && this.store.currentEvent.eventStep === 1" class="row">
        <q-card class="col-4" dark style="height:150px;" v-for="(data,key) in this.images" :key="key">
          <q-img
            loading="lazy"
            spinner-color="white"
            :src="data.image"
            style="height:150px;object-fit:cover;"
          >
            <div class="absolute-top-right bg-transparent">
              <q-btn icon="remove" round size="sm" v-on:click="removeImage(data)"></q-btn>
            </div>
          </q-img>
        </q-card>
        <q-card class="col-4" dark style="heigth:150px;">
          <q-card-section style="height:150px;">
            <q-btn icon="add" color="green" flat  class="full-width full-height" v-on:click="addImagesToEvent"></q-btn>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="row" v-if="this.store.currentEvent.eventStep === 0">
        <div class="text-subtitle2 text-capitalize q-pa-sm">
          <q-icon name="question_mark"></q-icon>
          Are You Ready For Event Date ?
        </div>
        <q-btn
          :icon="this.checkConfirmedOrNot() ? 'remove' : 'check'"
          flat
          :color="this.checkConfirmedOrNot() ? 'green' :'red'"
          v-on:click="confirmDate"></q-btn>
      </q-card-section>
      <q-card-section class="row" v-if="this.store.currentEvent.eventStep > 0">
        <q-card
          dark class="col-4" style="height:120px;" v-if="this.options.showMyPhotoActive&&!this.images.length" v-for="(data,key) in this.myImages" :key="key">
          <q-img
            loading="lazy"
            spinner-color="white"
            style="height:120px;object-fit:Cover;" :src="data.image"></q-img>
        </q-card>
        <q-card

          dark class="col-4" style="height:120px;" v-if="!this.options.showMyPhotoActive&&!this.images.length" v-for="(data,key) in this.allImages" :key="key">
          <q-img
            loading="lazy"
            spinner-color="white"
            style="height:120px;object-fit:Cover;" :src="data.image">
              <div class="absolute-top-right bg-transparent" v-if="data.userId === this.store.userDetail._id">
                <q-btn icon="remove" size="sm" round color="dark" v-on:click="removeThisImage(data)"></q-btn>
              </div>
            </q-img>
        </q-card>
      </q-card-section>
      <q-card-section class="text-center q-pa-md " horizontal>
        <q-btn
          v-if="this.store.currentEvent.eventStep === 0"
          icon="event"
          label="Next Step"
          class="col-6"
          :disable="this.store.currentEvent.createrId === this.store.userDetail._id ? false : true"
          flat color="white" v-on:click="goNextStepEvent"
          ></q-btn>
          <q-btn
            :disable="this.store.currentEvent.createrId === this.store.userDetail._id ? false : true"
            icon="skip_previous" class="col-6" v-if="this.store.currentEvent.eventStep > 0"
            v-on:click="goPrevious" label="Back"></q-btn>
        <q-btn
          v-if="this.store.currentEvent.eventStep === 1"
          :disable="this.store.currentEvent.createrId === this.store.userDetail._id ? false : true"
          icon-right="event" label="end event" class=" col-6"
          flat color="white" v-on:Click="endCurrentEvent"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
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
      currentLocation:{},
      images:[],
      myImages:[],
      allImages:[],
      options:{
        optionList:[
          {id:1,label:'My Photos'},
          {id:2,label:'All Photos'}
        ],
        optionValue:'',
        showMyPhotoActive:false
      }
    }
  },
  methods:{
    deleteEvent(){
      this.$q.dialog({
        cancel:true,
        title:'Warning',
        dark:true,
        message:'Eventi İptal Etmek İstediğinize Emin misiniz ?'
      }).onOk(()=>{
        this.clearOtherInformations()
      })
    },
    goPrevious(){
      const url = 'http://localhost:8000';
      const newData = {
        number:0
      }
      axios.put(`${this.store.baseUrl}/bbc/oldeventlists/updateEventStep/${this.store.userDetail._id}/${this.store.currentEvent._id}`,newData)
        .then(res=>{
          console.log(res)
          this.store.currentEvent = res.data
        })
        .catch(err=>{
          console.log(err)
        })
    },
    removeThisImage(data){
      const url = 'http://localhost:8000';
      const imageData = data
      axios.put(`${this.store.baseUrl}/bbc/oldeventlists/${this.store.currentEvent._id}/removeImage/${this.store.userDetail._id}`,imageData)
        .then(res=>{
          console.log(res)
          this.store.currentEvent = res.data
          this.getImages()
        })
        .catch(err=>{
          console.log(err)
        })
    },
    selectOption(data){
      if(data.id === 1){
        if(this.myImages.length){
          this.options.showMyPhotoActive = true
          console.log(this.options.showMyPhotoActive)
        }else{
          this.$q.notify({
            type:'negative',
            message:'Fotoğraf Bulunamadı, Tekrar Deneyiniz !',
            timeout:700,
            position:'right',
            icon:'info'
          })
        }
      }else{
        this.options.showMyPhotoActive = false
        console.log(this.options.showMyPhotoActive)
      }
    },
    getImages(){
      const url = 'http://localhost:8000';
      axios.get(`${this.store.baseUrl}/bbc/oldeventlists/${this.store.currentEvent._id}/getImages/${this.store.userDetail._id}`)
        .then(res =>{
          console.log('myımages',res)
          this.myImages = res.data.myImages
          this.allImages = res.data.allImages
        })
        .catch(err=>{
          console.log(err)
        })
    },
    addImagesToEvent(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:'Seçili Fotoğraflar Sisteme Yüklenicek, İşlemi Onaylıyor musunuz ?'
      }).onOk(()=>{
        const url = 'http://localhost:8000';
        const images = this.images
        axios.post(`${this.store.baseUrl}/bbc/oldeventlists/postImagesToEvent/${this.store.userDetail._id}/${this.store.currentEvent._id}`,images)
        .then(res =>{
          console.log(res)
          this.store.currentEvent = res.data
          this.getImages()
          this.images = []
        })
        .catch(err=>{
          console.log(err)
        })
      }).onCancel(()=>{
        //
      })
    },
    removeImage(data){
      this.images = this.images.filter(object=> object.id !== data.id)
    },
    getcurrentImageData(data){
      if(data){
        console.log(data)
        const result = this.images.some(object => object.id === data.id)
        if(!result){
          this.images.push(data)
        }
      }
    },
    goNextStepEvent(){
      const url = 'http://localhost:8000';
      const newData = {
        number:1
      }
      axios.put(`${this.store.baseUrl}/bbc/oldeventlists/updateEventStep/${this.store.userDetail._id}/${this.store.currentEvent._id}`,newData)
        .then(res=>{
          console.log(res)
          this.store.currentEvent = res.data
        })
        .catch(err=>{
          console.log(err)
        })
    },
    clearOtherInformations(){
      const url = 'http://localhost:8000';
      const currentevent = this.store.currentEvent
      axios.put(`${this.store.baseUrl}/bbc/oldeventlists/updateevent/${this.store.userDetail._id}/${this.store.currentEvent._id}`,currentevent)
        .then(res=>{
          console.log(res)
          this.store.currentEvent = res.data
          this.store.currentEventDetailCompActive = false
        })
        .catch(err=>{
          console.log(err)
        })
    },
    endCurrentEvent(){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:'Are You Want to End Current Event ?',
        cancel:true
      }).onOk(()=>{
        this.store.currentEvent.confirmEventList.forEach(element => {
          this.store.currentEvent.currentEvent.eventEndDate = this.store.globalSetDate()
          const currentEvent = this.store.currentEvent
          const url = 'http://localhost:8000';
          axios.post(`${this.store.baseUrl}/bbc/oldeventlists/${element.userId}/${this.store.currentEvent._id}`,currentEvent)
            .then(res =>{
              console.log(res)
              this.store.currentEvent.confirmEventList = this.store.currentEvent.confirmEventList.filter(object => object.userId !== element.userId)
            })
            .catch(err =>{
              console.log(err)
            })
        });
        this.clearOtherInformations()
      }).onCancel(()=>{
        //
      })
    },
    checkConfirmedOrNot(){
      const result = this.store.currentEvent.confirmEventList.some(object => object.userId === this.store.userDetail._id)
      if(result){
        return true
      }else{
        return false
      }
    },
    confirmDate(){
      const url = 'http://localhost:8000';
      const userData  = {
        userId : this.store.userDetail._id
      }
      axios.post(`${this.store.baseUrl}/bbc/eventlists/${this.store.currentEvent._id}/currentEvent/${this.store.userDetail._id}`,userData)
        .then(res =>{
          console.log(res)
          this.store.currentEvent = res.data
        })
        .catch(err =>{
          console.log(err)
        })
    },
    async getCurrentEventLocationInfos(){
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${this.store.currentEvent.currentEvent.lat}+${this.store.currentEvent.currentEvent.lng}&key=a7ac3cc8ba514f0287f82a6a306eabc8`);
      const data = await response.json();
      console.log(data)
      this.currentLocation.city = data.results[0].components.province
      this.currentLocation.country = data.results[0].components.country
      this.currentLocation.fullAddress =  data.results[0].formatted
      this.currentLocation.lat = this.store.currentEvent.currentEvent.lat
      this.currentLocation.lng = this.store.currentEvent.currentEvent.lng
      console.log(this.currentLocation)
    },
    goBack(){
      this.store.currentEventDetailCompActive = false
    }
  },
  created(){
    this.getCurrentEventLocationInfos()
    this.getImages()
  },
  watch:{

  }
}
</script>

<style>

</style>
