import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueRx from "vue-rx";
import {Observable, Subject} from "rxjs";

Vue.config.productionTip = false;

Vue.use(VueRx,{
  Observable,
  Subject,
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
