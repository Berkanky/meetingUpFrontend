<template>
  <div>

  </div>
</template>

<script>
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
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
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log(to,from,vm.store.firebaseInfoUser)
      if(from.path === '/login' && vm.store.firebaseInfoUser.uid){
        vm.helloFirstLogin()
     //   vm.welcomeEmail()
      }
    })
  },
  methods:{
    welcomeEmail(){
      const url = 'http://localhost:8000';
      const email = this.store.firebaseInfoUser.email;
      axios.post(`${this.store.baseUrl}/sendEmail`, { email })
        .then(response => {
          // Handle success response
          console.log('Email sent successfully');
        })
        .catch(error => {
          // Handle error response
          console.error('Error sending email:', error);
        });
    },
    helloFirstLogin(){
      this.$q.notify({
          message: `${this.store.firebaseInfoUser.email} Hoşgeldiniz !`,
          color: 'orange',
          multiLine: true,
          position: 'top',
          size: 'large',
          avatar:this.store.firebaseInfoUser.photoURL,
          actions: [
            { label: 'Close', color: 'white', handler: () => { /* ... */ } }
          ]
        })
    },
  }
}
</script>

<style>

</style>
