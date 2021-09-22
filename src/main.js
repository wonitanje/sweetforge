import { createApp } from 'vue'
import VueLazyload from '@jambonn/vue-lazyload'
import VueLoading from 'vue-loading-overlay'
// import Clipboard from 'vue3-clipboard'
import { copyText } from 'vue3-clipboard'
import MoshaToast from 'mosha-vue-toastify'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'mosha-vue-toastify/dist/style.css'
import 'material-icons/iconfont/material-icons.css'

window.toClipboard = value => copyText(value, undefined, () => value)

const loadimage = require('/public/images/loading.gif')
const errorimage = require('/public/images/image-broken.png')

window.vue = createApp(App)
  .use(store)
  .use(router)
  .use(VueLazyload, {
    preLoad: 1,
    loading: loadimage,
    error: errorimage,
    attempt: 1
  })
  // .use(Clipboard)
  .use(VueLoading)
  .use(MoshaToast)
  .mount('#app')