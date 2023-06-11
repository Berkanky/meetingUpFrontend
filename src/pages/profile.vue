<template>
  <q-page class="">
    <div>
      <q-card
        :style="{'margin':this.store.mobileActive ? '0%' : '2% auto'}"
        class="bg-white text-dark" style="max-width:1100px;">
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
        </q-card-section>
        <q-card-section class="row">
          <q-avatar
                >
                <img
                v-on:click="selectGoogleProfilePic"
                v-if="this.store.firebaseInfoUser.photoURL"
                style="object-fit:cover;"
                :src="this.store.firebaseInfoUser.photoURL"
              >
              <q-btn icon="person" color="dark" round v-if="!this.store.firebaseInfoUser.photoURL"></q-btn>
            </q-avatar>
          <q-space></q-space>
          <div class="text-subtitle2 text-weight-bold">
            <q-icon name="mail" size="sm" color="grey-6"></q-icon>
            {{ this.store.firebaseInfoUser.email }}
            <upload @currentImageData="getcurrentImageData"/>
          </div>
        </q-card-section>
        <q-card-section class="text-left">
              <div class="text-subtitle2 text-weight-bold text-capitalize q-ml-xl">
                <q-icon name="edit"></q-icon>
                Profili Düzenle
              </div>
            </q-card-section>
        <q-card-section class="row">
          <q-card-section class="col-12 col-md-4 col-sm-4 text-center">
            <q-card-section class="text-right">
              <q-btn-dropdown color="dark" flat icon="more_vert">
                <q-list class="bg-dark text-white">
                  <q-item clickable v-close-popup @click="selectOption(data)" v-for="(data,key) in this.options" :key="key">
                    <q-item-section avatar>
                      <q-item-label>
                        <q-icon :name="data.icon"></q-icon>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{data.label}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-card-section>
            <q-avatar size="200px">
              <img
                v-on:click="zoomProfilePic"
                v-touch-hold.mouse="event => removeCurrentProfilePic()"
                v-if="this.store.userDetail.userImage&&!this.selectedImage.image"
                style="object-fit:cover;"
                :src="this.store.userDetail.userImage"
              >
              <img
                v-on:click="this.selectedImage={}"
                v-if="!this.store.userDetail.userImage&&this.selectedImage.image"
                style="object-fit:cover;"
                :src="this.selectedImage.image"
              >
              <q-btn icon="person" color="dark" round size="70px" v-if="!this.store.userDetail.userImage"></q-btn>
            </q-avatar>
            <q-card-section class="row">
              <q-card v-for="(data,key) in this.imageList" :key="key" class="col-4" style="border-radius:4px;" bordered v-if="this.imageList.length">
                <q-img
                  loading="lazy"
                  spinner-color="white"
                  style="object-fit:cover;height:90px;" :src="data.image" v-on:click="removeImage(data)"  v-touch-hold.mouse="event => selectForProfilePic(data)"></q-img>
              </q-card>
              <q-card v-for="(data,key) in this.userCurrentImages" :key="key" class="col-4" style="border-radius:4px;" bordered v-if="!this.imageList.length&&this.userCurrentImages.length">
                <q-img
                  loading="lazy"
                  spinner-color="white"
                  style="object-fit:cover;height:90px;"
                  :src="data.image.image" v-touch-hold.mouse="event=> removeImageFromDb(data)" v-on:Click="zoomOwnImage(data)"></q-img>
              </q-card>
              <q-card class="col-4" style="border-radius:4px;" dark v-if="this.imageList.length">
                <q-card-section class="text-center bg-dark" style="height:90px;">
                  <q-btn icon="add" color="green" flat class="full-width full-height" v-on:click="addToDb"></q-btn>
                </q-card-section>
              </q-card>
            </q-card-section>
          </q-card-section>
          <q-card-section class="col-12 col-md-8 col-sm-8">
            <q-card-section horizontal>
              <q-btn-dropdown
                class="col-6"
                split
                glossy
                color="grey-4"
                no-caps
                text-color="dark"
                icon="category"
                label="Select Gender"
              >
                <q-list>
                  <q-item
                    clickable v-close-popup @click="selectGender(data)"
                    v-for="(data,key) in this.genderOptions"
                    :key="key"
                    >
                    <q-item-section avatar>
                      <q-avatar :icon="data.icon" :color="data.color" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{data.label}}</q-item-label>
                      <q-item-label caption>February 22, 2016</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="info" color="grey-6" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-card class="col-6 bg-grey-4" bordered>
                <q-card-section horizontal>
                  <q-card-section class="col-12">
                    <div
                      class="text-subtitle2 text-weight-bold text-grey-7 text-center text-capitalize">
                      <q-icon :name="this.checkGender()" size="16px"></q-icon>
                      {{ this.store.userDetail.gender ?? 'NaN' }}
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-card-section>
            <q-card-section horizontal class="q-mt-sm">
              <q-input class="col-6" :label="this.store.userDetail.userName ?? 'Lütfen Bir Ad Giriniz'" filled color="dark" v-model="this.updateNewData.userName">
                <template v-slot:prepend>
                  <q-icon name="badge"></q-icon>
                </template>
              </q-input>
              <q-input class="col-6" filled color="dark" v-model="this.updateNewData.userLastName" :label="this.store.userDetail.userLastName ?? 'Lütfen Soyadınızı Giriniz'">
                <template v-slot:prepend>
                  <q-icon name="badge"></q-icon>
                </template>
              </q-input>
            </q-card-section>
            <q-card-section horizontal class="q-mt-sm">
              <q-input
                class="col"
                type="textarea"
                v-model="this.updateNewData.userDescription"
                filled
                color="dark"
                :label="this.store.userDetail.userDescription ?? 'Lütfen Kendinizi Tanımlayınız'"
              >
                <template v-slot:prepend>
                  <q-icon name="info" color="grey-6"></q-icon>
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="q-mt-sm" horizontal>
              <q-card class="col bg-grey-3" style="height:160px;" bordered>
                <q-card-section horizontal style="height:160px;">
                  <q-btn icon="location_on" color="green" v-on:click="getCurrentLocation" class="col-2" v-if="!this.checkLocationInformations()"></q-btn>
                  <q-btn icon="location_on" color="red" v-on:click="removeCurrentLocation" class="col-2" v-if="this.checkLocationInformations()"></q-btn>
                  <q-card-section class="col text-grey-7">
                    <div class="text-subtitle2">
                      <q-icon name="flag" color="grey-6" size="17px"></q-icon>
                      Country - {{ this.getCountryName() }}
                    </div>
                    <div class="text-subtitle2">
                      <q-icon name="flag" color="grey-6" size="17px"></q-icon>
                      City - {{ this.getCityName() }}
                    </div>
                    <div class="text-subtitle2">
                      <q-icon name="flag" color="grey-6" size="17px"></q-icon>
                      Adress - {{ this.getfullAddress() }}
                    </div>
                    <q-btn icon="map" color="grey-7" flat v-on:click="showGeoCode"></q-btn>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-card-section>
            <q-card-section class="q-mt-sm text-right">
              <q-btn icon="bookmark" flat color="green" label="save" v-on:click="saveAll" :disable="this.checkNewUpdateData() ? false : true"></q-btn>
            </q-card-section>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <zoomImage v-if="this.store.zoomImageActive"/>
    <changeProfileImg
      v-if="this.store.profileImgChangeCompActive"/>
  </q-page>
</template>

<script>
import changeProfileImg from 'src/profileComp/changeProfileImg.vue';
import zoomImage from 'src/components/zoomImage.vue';
import upload from 'src/components/upload.vue';
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    upload,
    zoomImage,
    changeProfileImg
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedImage:{},
      imageList:[],
      userCurrentImages:[],
      currentLocation:{},
      updateNewData:{},
      genderColor:'',
      genderOptions:[
        {id:1,label:'male',icon:'male',color:'blue'},
        {id:2,label:'female',icon:'female',color:'pink'},
        {id:3,label:'transgender',icon:'transgender',color:'red'}
      ],
      options:[
        {id:1,label:'Change Profile Pic',icon:'settings'},
      ]
    }
  },
  methods:{
    selectOption(data){
      if(data.id === 1){
        this.store.profileImgChangeCompActive = true
      }
    },
    changeProfileWithThis(data){
      console.log(data)
    },
    goBack(){
      this.$router.go(-1)
    },
    checkGender(){
      if(this.store.userDetail._id){
        if(this.store.userDetail.gender){
          if(this.store.userDetail.gender === 'male'){
            const icon =  'male'
            this.genderColor = 'blue'
            return icon
          }else if(this.store.userDetail.gender === 'female'){
            const icon = 'female'
            this.genderColor = 'pink'
            return icon
          }else if(this.store.userDetail.gender === 'transgender'){
            const icon = 'transgender'
            this.genderColor = 'red'
            return icon
          }else{
            this.genderColor = 'grey'
            return ''
          }
        }else{
          const icon = 'info'
          return icon
        }
      }
    },
    selectGender(data){
      console.log(data)
      this.updateNewData.gender = data.label
    },
    checkNewUpdateData(){
      const lengthKey = Object.keys(this.updateNewData).length;
      if (lengthKey > 0 && Object.values(this.updateNewData).every(value => value !== null && value !== '')) {
        return true;
      } else {
        return false;
      }
    },
    saveAll(){
      console.log(this.store.userDetail)
      const userData = {
        userName:this.updateNewData.userName,
        userLastName:this.updateNewData.userLastName,
        userDescription:this.updateNewData.userDescription,
        gender:this.updateNewData.gender
      }
      const url = "http://localhost:8000"
      axios.put(`${this.store.baseUrl}/bbc/users/${this.store.userDetail._id}`,userData)
      .then((data) =>{
        this.getCurrentUserInfo()
        this.updateNewData = {}
      })
    },
    getfullAddress(){
      if(this.store.userDetail.locationInformations){
        const countryName = this.store.userDetail.locationInformations.details.fullAddress
        return countryName
      }else{
        return ''
      }
    },
    getCityName(){
      if(this.store.userDetail.locationInformations){
        const countryName = this.store.userDetail.locationInformations.details.city
        return countryName
      }else{
        return ''
      }
    },
    getCountryName(){
      if(this.store.userDetail.locationInformations){
        const countryName = this.store.userDetail.locationInformations.details.country
        return countryName
      }else{
        return ''
      }
    },
    showGeoCode(){
      console.log(this.store.userDetail.locationInformations.details)
    },
    removeCurrentLocation(){
      const url = 'http://localhost:8000';
      axios.delete(`${this.store.baseUrl}/bbc/users/${this.store.userDetail._id}/locationInformations`)
      .then(response => {
        console.log(response.data);
        this.getCurrentUserInfo()
      })
      .catch(error => {
        console.error(error);
      });
    },
    checkLocationInformations(){
      if(this.store.userDetail.locationInformations){
        return true
      }else{
        return false
      }
    },
    updateLocationOnDb(){
      const url = 'http://localhost:8000';
      const updatedLocationDetails = {
        details: {
          city: this.currentLocation.city,
          country: this.currentLocation.country,
          fullAddress: this.currentLocation.fullAddress,
          lat: this.currentLocation.lat,
          lng:this.currentLocation.lng,
        }
      };
      axios.put(`${this.store.baseUrl}/bbc/users/${this.store.userDetail._id}/locationInformations`, updatedLocationDetails)
        .then((response) => {
          console.log(response.data);
          // do something with updated user data
          this.getCurrentUserInfo()
        })
        .catch((error) => {
          console.error(error);
          // handle error
        });
    },
    async getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.currentLocation.lat = position.coords.latitude
            this.currentLocation.lng = position.coords.longitude
          },
          error => {
            console.log(error)
          }
        )
        if(this.currentLocation.lat && this.currentLocation.lng){
          const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${this.currentLocation.lat}+${this.currentLocation.lng}&key=a7ac3cc8ba514f0287f82a6a306eabc8`);
          const data = await response.json();
          console.log(data)
          this.currentLocation.city = data.results[0].components.province
          this.currentLocation.country = data.results[0].components.country
          this.currentLocation.fullAddress =  data.results[0].formatted
          console.log(this.currentLocation)
          this.updateLocationOnDb()
        }else{
          this.$q.notify({
            type:'negative',
            message:'Tekrar Deneyiniz !',
            timeout:700,
            position:'center'
          })
        }
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    },
    zoomOwnImage(data){
      const imageData = {
        id:data._id,
        image:data.image.image
      }
      if(imageData.image){
        this.store.selectedImage = imageData
        this.store.zoomImageActive = true
      }
    },
    zoomProfilePic(){
      const imageData = {
        id:0,
        image:this.store.userDetail.userImage
      }
      if(imageData.image){
        this.store.selectedImage = imageData
        this.store.zoomImageActive = true
      }
    },
    selectGoogleProfilePic(){
      console.log(this.store.firebaseInfoUser)
      const imageData = {
        id:0,
        image:this.store.firebaseInfoUser.photoURL
      }
      if(imageData.image){
        this.store.selectedImage = imageData
        this.store.zoomImageActive = true
      }
    },
    findMe(){
      const result = this.store.allUser.find(object => object.userId === this.store.firebaseInfoUser.uid)
      if(result){
        this.store.userDetail = result
        console.log('userDetail from mongo',this.store.userDetail)
      }
    },
    getCurrentUserInfo(){
      const url = 'http://localhost:8000';
      axios.get(`${this.store.baseUrl}/bbc/users`)
        .then(response => {
          this.store.allUser = response.data
          console.log(response.data);
          console.log(this.store.allUser)
          this.findMe()
        })
        .catch(error => {
          console.error(error);
        });
    },
    removeCurrentProfilePic(){
      console.log('yo',this.store.userDetail._id)
      const newImage = ''
      const url  = 'http://localhost:8000';
        axios.put(`${this.store.baseUrl}/bbc/users/${this.store.userDetail._id}`,{userImage : newImage})
        .then(
          ({data}) =>{
            //
            this.store.userDetail.userImage = ''
          }
        )
    },
    updateProfilePic(){
      const userData = {
        userImage:this.selectedImage.image,
      }
      const url  = 'http://localhost:8000';
        axios.put(`${this.store.baseUrl}/bbc/users/${this.store.userDetail._id}`,userData)
        .then(
          ({data}) =>{
            //
            this.store.userDetail.userImage = userData.userImage
            this.selectedImage = {}
          }
        )
    },
    selectForProfilePic(data){
      this.selectedImage = data
    },
    removeImageFromDb(data){
      console.log(data)
      const imageId = data._id
      const url  = 'http://localhost:8000';
        axios.delete(`${this.store.baseUrl}/bbc/users/${this.store.userDetail._id}/userImages/${imageId}`)
        .then(
          ({data}) =>{
            //
            this.userCurrentImages = this.userCurrentImages.filter(object => object._id !== imageId)
          }
        )
    },
    addToDb(){
      this.imageList.forEach(element => {
        const imageData = {
          image:element.image,
          inDb:true
        }
        //for push currentList
        const currentImageData ={
          id:element.id,
          image:element.image
        }

        const url  = 'http://localhost:8000';
        axios.post(`${this.store.baseUrl}/bbc/users/${this.store.userDetail._id}/userImages`,imageData)
        .then(
          ({data}) =>{
            //
            this.imageList = this.imageList.filter(object => object.id !== element.id)
           // this.userCurrentImages.push(currentImageData) buna daha sonra bak
           this.getCurrentUserInfo()
          }
        )
      });
    },
    removeImage(data){
      this.imageList = this.imageList.filter(object => object.id !== data.id)
    },
    getcurrentImageData(data){
      if(data){
        if(!this.selectedImage.id){
          this.$q.dialog({
            dark:true,
            title:'Warning',
            message:'Profil Fotoğrafını Güncellemek İstiyor musunuz ?',
            cancel:true
          }).onOk(()=>{
            this.selectedImage = data
            this.updateProfilePic()
          }).onCancel(()=>{
            //
          })
          this.imageList.push(data)
        }else{
          this.imageList.push(data)
        }
      }
    },
    findUserImage(){
      if(this.store.firebaseInfoUser.photoURL){

      }
    }
  },
  created(){

  },
  watch:{
    selectedImage:{
      handler(newValue,oldValue){
        if(newValue.image){
          //
        }
      },
      immediate:true,
      deep:true
    },
    'store.userDetail.userImages':{
      handler(newValue,oldValue){
        if(newValue){
          this.userCurrentImages = newValue
          console.log('userCurrentImages',this.userCurrentImages)
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
