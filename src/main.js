import './assets/styles/main.css'
import './assets/styles/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

let a  = createApp(App)
let b = a.use(router)
b.mount('#app')
