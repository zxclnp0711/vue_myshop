import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './api'
import TableTree from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.component('table-tree', TableTree)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
