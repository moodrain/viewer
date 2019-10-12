import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App.vue'
import router from './router'
import '../public/icon/iconfont.css'

const axios = require('axios')
axios.defaults.baseURL = '/api/'

Vue.config.productionTip = false
Vue.use(MintUI)

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
