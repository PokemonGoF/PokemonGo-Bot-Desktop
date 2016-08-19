const Vue = require('vue'),
    Electron = require('vue-electron'),
    Resource = require('vue-resource'),
    App = require('./app'),
    Materialize = require('materialize-css');

Vue.use(Electron);
Vue.use(Resource);
Vue.config.debug = true;


/* eslint-disable no-new */
new Vue({
    el: 'body',
    components: {App}
});
