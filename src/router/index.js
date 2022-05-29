import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Compose from '../components/Compose.vue'
import Sheets from '../components/Sheets.vue'
import AllSheets from '../components/AllSheets.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/allsheets',
      name: 'allsheets',
      component: AllSheets
    },
    {
      path: '/sheets',
      name: 'sheets',
      component: Sheets
    },
    {
      path: '/compose',
      name: 'compose',
      component: Compose
    },
    {
      path: '/',
      component: Home
    },
    
  ]
})

export default router
