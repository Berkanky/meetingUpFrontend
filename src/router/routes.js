
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/',name:'home',component: () => import('pages/IndexPage.vue') },
      { path:'/login',name:'login',component:()=>import('pages/login.vue')},
      { path:'/profile',name:'profile',component:()=>import('pages/profile.vue')},
      { path:'/chat',name:'chat',component:()=>import('pages/chat.vue')},
      { path:'/createEventGroup',name:'createEventGroup',component:()=>import('pages/createEventGroup.vue')},
      { path:'/myEventPage',name:'myEventPage',component:()=>import('pages/myEventPage.vue')},
      { path:'/updateEvent/:id',props:true,name:'updateEvent',component:()=>import('pages/updateEvent.vue')},
      { path:'/eventControlPanel/:id',props:true,name:'eventControlPanel',component:()=>import('pages/eventControlPanel.vue')},
      { path:'/allEvents',name:'allEvents',component:()=>import('pages/allEvents.vue')},
      { path:'/eventDetail/:id',name:'eventDetail',props:true,component:()=>import('pages/eventDetail.vue')}
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
