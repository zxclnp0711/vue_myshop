import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(function (config) {
  config.headers.common['Authorization'] = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
