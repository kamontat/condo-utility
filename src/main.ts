import Vue from 'vue';

import './firebase';

import App from './App.vue';
import store from './store';
import './registerServiceWorker';
import router from './router';

import Buefy from 'buefy';
import './assets/scss/app.scss';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
