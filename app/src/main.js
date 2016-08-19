import Vue from 'vue';
import Electron from 'vue-electron';
import Resource from 'vue-resource';

import '../node_modules/materialize-css/dist/css/materialize.min.css';
import '../node_modules/materialize-css/dist/js/materialize.min.js';

Vue.use(Electron);
Vue.use(Resource);
Vue.config.debug = true;

import App from './app'

/* eslint-disable no-new */
new Vue({
    el: 'body',
    components: {App}
});
