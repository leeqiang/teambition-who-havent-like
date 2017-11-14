import Vue from 'vue'
import App from './App'
import Utils from './utils'
import Resource from 'vue-resource'

Vue.use(Utils)
Vue.use(Resource)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
