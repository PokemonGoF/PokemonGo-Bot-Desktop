import Vue from 'vue';
import electron from 'vue-electron';
import resource from 'vue-resource';
import App from './app.vue';

Vue.use(electron);
Vue.use(resource);
Vue.config.debug = true;


/* eslint-disable no-new */
new Vue({
    el: 'body',
    components: {App}
});
