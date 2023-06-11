<template>
  <q-page class="bg-dark" :style="{'height':this.$q.screen.height + 'px'}">
    <div class="container">
      <q-card
      dark
      :style="{
          'width':this.store.mobileActive ? '100%' : '1100px',
          'height':this.store.mobileActive ? '100%' : '650px'
        }"
        class="bg-white text-dark">
        <q-card-section horizontal>
          <!-- <q-img :src="this.loginPagePhoto" class="col-8" ></q-img> -->
          <q-img
            loading="lazy"
            spinner-color="white"
            class="col-7"
            v-if="this.store.mobileActive === false"
            :src="this.loginPagePhoto"
            style="object-fit:cover;height:650px;object-fit:cover;border-radius:4px;"
            ></q-img>
            <q-card-section class="text-center bg-dark col">
              <q-card-section class="text-center">
    <!--             <div class="text-overline text-primary text-capitalize" style="font-size:18px;">
                  Connectify
                </div> -->
                <q-avatar size="100px">
                  <img :src="image" alt="">
                </q-avatar>
              </q-card-section>
              <q-card class="bg-grey-4 text-dark googleButtonCard">
                <q-card-section horizontal class="q-pa-md">
                  <q-btn icon="login" class="col-2" flat color="dark" v-on:click="loginWithGoogle"></q-btn>
                  <q-card-section class="col">
                    <div class="text-subtitle2 text-weight-bold text-left">
                      Google İle Giriş Yap
                    </div>
                  </q-card-section>
                  <q-btn icon="fa-brands fa-google" color="red" class="col-2" rounded glossy push v-on:click="loginWithGoogle"></q-btn>
                </q-card-section>
              </q-card>
            </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import image from '../logo/group.png'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
export default {
  setup(){
    const store = useCounterStore()
    return{
      store,
      image
    }
  },
  data:function(){
    return{
      loginPagePhoto:'',
    }
  },
  methods:{
    postUserInfoToDb(loginData){
      const url  = 'http://localhost:8000';
      axios.post(`${this.store.baseUrl}/bbc/users`,loginData)
      .then(
        ({data}) =>{
          //
        }
      )
    },
    loginWithGoogle(){

      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
/*           loginData.email = user.email
          loginData.userId = user.uid
          loginData.date = Date.now() */
          const loginData = {
            email:user.email,
            online:true,
            userId:user.uid,
            date:Date.now()
          }
          this.postUserInfoToDb(loginData)
          console.log(user)
          this.$router.push({path:'/'})
        }).catch((error) => {
          console.log(error)
          // ...
        });
    },
    getRandomPhoto(){
      const API_KEY = this.store.pexelId
      const query = 'Vancouver'
      const url = `https://api.pexels.com/v1/search?query=${query}`;
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the data from the API response
          const maxNumber = data.photos.length
          const randomNumber = Math.floor(Math.random() * maxNumber);
          console.log(data)
          const photoUrl = data.photos[randomNumber].src.large;
          console.log(photoUrl);
          if(photoUrl){
            this.loginPagePhoto = photoUrl
            console.log('loginpagephoto',this.loginPagePhoto)
          }else{
            console.log('non photo')
          }
        })
        .catch((error) => {
          // Handle any errors that occur
          console.error(error);
        });
    },
  },
  created(){
    this.getRandomPhoto()
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
.googleButtonCard{
  margin-top: 30%;
}
</style>
