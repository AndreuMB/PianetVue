import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import axios from 'axios'

// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// App.prototype.$http = axios

const app = createApp(App)

app.use(router)

app.mount('#app')

app.provide('user', false)


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
