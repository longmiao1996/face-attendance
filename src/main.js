// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import global_ from './../static/config/global'
import $ from 'jquery'
import qs from 'qs'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.GLOBAL = global_
Vue.prototype.$axios = axios
Vue.prototype.$ = $
Vue.prototype.qs = qs

axios.defaults.baseURL = global_.Base_URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
