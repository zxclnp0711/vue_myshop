import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './api'
import TableTree from 'vue-table-with-tree-grid'
import moment from 'moment'

Vue.config.productionTip = false
Vue.component('table-tree', TableTree)
Vue.filter('dateFormat', function (originVal) {
  return moment(originVal).format('YYYY-MM-DD hh:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
