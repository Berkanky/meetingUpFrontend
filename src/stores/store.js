import { defineStore } from 'pinia';
import axios from 'axios'
import { getDatabase, ref, onValue, query, orderByChild } from "firebase/database";
export const useCounterStore = defineStore('counter', {
  state: () => ({
    firebaseInfoUser:{},
    userDetail:{},

    //pexelID
    pexelId:'563492ad6f917000010000018990b39d61f845559dab3acb2c9dd16d',

    //all users
    allUser:[],

    //myFriendList
    myFriendList:[],
    updatedMyFriendList:[],
    //windowMobile or not
    window:{},
    newHeight:'',
    mobileActive:false,

    //zoomImageActive
    zoomImageActive:false,
    selectedImage:{},

    //selectedUserDetailActive
    selectedUserDetailActive:false,
    selectedUserForDetail:{},

    //url
    //https://newapp-eb613.web.app/#/
    //http://localhost:8000
    //baseUrl:'http://localhost:8000',
    baseUrl:'https://huddlehubfrontend.herokuapp.com/',
    //baseUrl:'https://newapp-eb613.firebaseapp.com',
    //chat DAta
    chatMessages:[],
    pureChatMessages:[],
    chatMessagesFindFilterActive:false,

    //blockedList
    blockedList:[],

    //eventlist
    eventList:[],
    myEvents:[],
    mySavedEvents:[],
    myMemberedEvents:[],

    //search group or friend active
    searchBarActive:false,
    allEventsFilterActive:false,

    //selected event
    currentEvent:{},
    currentEventMembersList:[],
    currentEventDetailCompActive:false,

    //screen width
    screenWidth: window.innerWidth,
    randomKeyForMap:'',
    showMoreOptionActive:false,

    //eventDetail
    selectedEventData:{},
    selectedEventMembersList:[],
    eventDetailVueActive:false,
    mapActive:false,
    locationLatLng:[],

    //profileDetail
    profileDetailActive:false,

    //oldmembers
    oldMembersActive:false,

    //sharecomp
    shareCompActive:false,

    //notifies
    notifyCompActive:false,

    //profile comp
    profileImgChangeCompActive:false,

    //event notifymessage comp
    eventNotifyMessageCompActive:false,

    //blocked event active
    eventBlockedCompActive:false,

    //advie friend to group active
    adviceFrientToGroupCompActive:false
  }),
  getters: {

  },
  actions: {
    getSelectedEventMembers(){
      ///bbc/eventlists/:currentEventId/eventMembers/:currentUserId
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/eventlists/${this.currentEvent._id}/eventMembers/${this.userDetail._id}`)
      .then(response => {
        console.log(response)
        this.currentEventMembersList = response.data
        console.log('currentEventMembersList',this.currentEventMembersList)
      })
      .catch(error => {
        console.error(error);
      });
    },
    getGroupMessages(){
      const db = getDatabase();
      const dbRef = query(ref(db, `groupChats/${this.currentEvent._id}`),orderByChild('date','desc'))
      onValue(dbRef, (snapshot) => {
        const groupMessageList = []
        snapshot.forEach((childSnapshot) => {
          groupMessageList.push(childSnapshot.val())
        });
        if(groupMessageList.length){
          this.chatMessages = groupMessageList
          this.pureChatMessages = groupMessageList
        }else{
          this.chatMessages = []
          this.pureChatMessages = []
        }
        console.log('groupMessageList',this.chatMessages)
      });
    },
    getEventsIfMember(){
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/eventlists/onlyMembered/${this.userDetail._id}`)
      .then(response => {
        console.log(response)
        this.myMemberedEvents = response.data
        console.log('myMemberedEvents',this.myMemberedEvents)
      })
      .catch(error => {
        console.error(error);
      });
    },
    getAllMySavedEvents(){
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/savedeventlists/${this.userDetail._id}`)
      .then(response => {
        console.log('mySavedEvents',response)
        this.mySavedEvents = response.data
        console.log('mySavedEvents',this.mySavedEvents)
      })
      .catch(error => {
        console.error('mySavedEvents',error);
      });
    },
    findUserDescription(data){
      const result = this.allUser.find(object => object._id === data.userId)
      if(result){
        const name = result.userDescription ?? 'No Info'
        return name
      }
    },
    findUserImage(data){
      const result = this.allUser.find(object => object._id === data.userId)
      if(result){
        const name = result.userImage ?? ''
        return name
      }
    },
    findUserName(data){
      const result = this.allUser.find(object => object._id === data.userId)
      if(result){
        if(result._id === this.userDetail._id){
          const name = 'Siz'
          return name
        }else{
          const name = result.userName ?? result.email
          return name
        }
      }
    },
    getMyEvents(){
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/eventlists/${this.userDetail._id}`)
      .then(response => {
        console.log(response)
        if(response.data.length){
          this.myEvents = response.data
          console.log('myEvents',this.myEvents)
        }else{
          this.myEvents = []
        }
      })
      .catch(error => {
        console.error(error);
      });
    },
    getEvents(){
      this.eventList = []
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/eventlists`)
      .then(response => {
        console.log('eventresponse',response)
        if(response.data.length){
          this.eventList = response.data
          console.log('eventList',this.eventList)
        }else{
          this.eventList = []
        }
      })
      .catch(error => {
        console.error(error);
      });
    },
    getBlockedUsers(){
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/blockedlists/${this.userDetail._id}/blockeds`)
        .then(response => {
          console.log(response)
          if(response.data.length){
            this.blockedList = response.data
            console.log('blockedList',this.blockedList)
          }else{
            this.blockedList = []
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    getSelectedUserInfo(){
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/users/${this.selectedUserForDetail._id}`)
        .then(response => {
          console.log(response)
          this.selectedUserForDetail = response.data
        })
        .catch(error => {
          console.error(error);
        });
    },
    globalSetDate(){
      const date = new Date();
      const dateString = date.toString();
      return dateString
    },
    getChat(){
      const db = getDatabase()
      const dbRef = query(ref(db,`chats/${this.userDetail._id}/${this.selectedUserForDetail._id}`),orderByChild('date','desc'))
      onValue(dbRef, (snapshot) => {
        const chatMessages = []
        snapshot.forEach((childSnapshot) => {
          chatMessages.push(childSnapshot.val())
        });
        if(chatMessages.length){
          this.pureChatMessages = chatMessages
          this.chatMessages = chatMessages
          console.log('chatMessages',this.chatMessages)
        }else{
          this.chatMessages = []
        }
      });
    },
    findMe(){
      const result = this.allUser.find(object => object.userId === this.firebaseInfoUser.uid)
      if(result){
        this.userDetail = result
        console.log('userDetail from mongo',this.userDetail)
      }
    },
    getFriendList(){
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/friendlists/${this.userDetail._id}/friends`)
        .then(response => {
          this.myFriendList = response.data.friends
          this.updatedMyFriendList = response.data.friendListUpdated
          console.log('getfriendlist',response.data);
          console.log('myFriendList',this.myFriendList)
          console.log('updatedMyFriendList',this.updatedMyFriendList)
        })
        .catch(error => {
          console.error(error);
        });
    },
    getCurrentUserInfo(){
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/users`)
        .then(response => {
          this.allUser = response.data
          console.log(response.data);
          console.log('allUser',this.allUser)
          this.findMe()
        })
        .catch(error => {
          console.error(error);
        });
    },
    getOnlyUsers(){
      const url = 'http://localhost:8000';
      axios.get(`${this.baseUrl}/bbc/users`)
        .then(response => {
          this.allUser = response.data
          console.log(response.data);
          console.log('allUser',this.allUser)
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
});
