import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import router from './router'

import '@/assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import MyHttpServer from "@/plugins/http.js";
import moment from 'moment'

Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false

//全局过滤器处理日期
Vue.filter(
  'fmtdate',(v)=>{
    return moment(v).format('YYYY-MM-DD')
  }
)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
