import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { mdiCogOutline, mdiTune } from '@mdi/js'

Vue.config.productionTip = false

Vue.prototype.$icons = {
  mdiCogOutline,
  mdiTune
}

window.addEventListener('load', () => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
