<template>
  <q-dialog
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    dark
    v-model="this.store.profileImgChangeCompActive"
  >
    <q-card

      class="bg-dark text-white"
      :style="{
        'width':this.store.mobileActive ? '100%' : '500px',
        'max-width':this.store.mobileActive ? '100%' : '500px'
      }">
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn icon="person" flat color="white"></q-btn>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle2 text-grey-6">
            <q-icon name="info" size="17px"></q-icon>
            Click Image For Change Profile Picture
          </div>
        </q-card-section>
        <q-card-section class="row" v-if="this.store.userDetail.userImages.length">
          <q-card class="col-4" v-for="(data,key) in this.store.userDetail.userImages" :key="key">
            <q-img :src="data.image.image" style="height:100%;object-fit:Cover;" v-on:click="selectImage(data)"></q-img>
          </q-card>
        </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    goBack(){
      this.store.profileImgChangeCompActive = false
    },
    selectImage(data){
      const selectedImage = data
      axios.put(`${this.store.baseUrl}/bbc/users/${this.store.userDetail._id}/changeProfileImage`,selectedImage)
        .then(res=>{
          console.log(res)
          this.store.profileImgChangeCompActive = false
          this.store.userDetail.userImage = res.data.userImage
          this.$q.notify({
            type:'positive',
            position:'right',
            icon:'check',
            timeout:700
          })
        })
        .catch(err=>{
          console.log(err)
        })
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
