import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import axios from 'axios'

// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// App.prototype.$http = axios

import mitt from 'mitt';
const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;

app.use(router)

app.mount('#app')

// app.provide('user', false)
// app.config.unwrapInjectedRef = true
// app.prototype.$user=true;



import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
