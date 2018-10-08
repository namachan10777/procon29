import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';
import Board from './components/Board';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

Vue.component('board', Board);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
