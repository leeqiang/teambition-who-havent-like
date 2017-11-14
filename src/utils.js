import _ from 'lodash'
import * as tb from 'tb-apps-sdk'

export default {
  install (Vue) {
    // Import TB styles
    require('tb-styles/dist/styles/ui.min.css')

    Vue._ = _
    Vue.tb = tb
    Vue.api = (options) => {
      options.url = '/api' + options.url
      if (process.env.NODE_ENV === 'production') {
        Vue.http.options.credentials = true
        options.url = 'https://api.teambition.com' + options.url
      } else {
        options.headers = _.assign(options.headers, {
          Authorization: 'OAuth2 ' + process.env.ACCESS_TOKEN
        })
      }
      return Vue.http(options)
    }

    Object.defineProperties(Vue.prototype, {
      '$_': { value: Vue._ },
      '$tb': { value: Vue.tb },
      '$api': { value: Vue.api }
    })
  }
}
