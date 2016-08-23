const Vue = require('vue');
const electron = require('vue-electron');
const resource = require('vue-resource');
const App = require('./app.js');

Vue.use(electron);
Vue.use(resource);
Vue.config.debug = true;


/* eslint-disable no-new */
new Vue({
    el: 'body',
    components: {App}
});
