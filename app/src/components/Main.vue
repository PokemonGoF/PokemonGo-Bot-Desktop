<template>


<!-- Bot indicator -->
<bot-indicator></bot-indicator>

<!-- Bot Stats -->
<bot-stats></bot-stats>


<!-- Content -->
<div id="content">
    <div id="side-nav">

        <logo></logo>

        <options :user-info.sync="userInfo"></options>

        <template v-if="user != null && user.loaded == true">
            <profile :user.sync="user"></profile>
        </template>

        <log></log>

        <logout></logout>
    </div>

    <map :user.sync="user" :user-info.sync="userInfo"></map>

</div>

</template>

<script>

import User from './Main/User.js'
import BotIndicator from './Main/BotIndicator.vue';
import BotStats from './Main/BotStats.vue';
import Log from './Main/Log.vue';
import Options from './Main/Options.vue';
import Logo from './Main/Logo.vue';
import Logout from './Main/Logout.vue';
import Profile from './Main/Profile.vue';
import Map from './Main/Map.vue';
import io from 'socket.io-client/socket.io';

    export default {
        data() {
            return {
                user: null
            }
        },
        components: {
            BotIndicator,
            BotStats,
            Log,
            Options,
            Logo,
            Logout,
            Profile,
            Map
        },
        props: ['userInfo'],
        ready() {
            this.$set('user', new User(this.userInfo.users[0]));
            this.startSocket()
        },
        methods: {
            startSocket() {
                var self = this;
                var socket = io('http://127.0.0.1:7894');
                var patch = require('socketio-wildcard')(io.Manager);
                patch(socket);

                console.debug('Trying to connect on http://127.0.0.1:7894');

                socket.on("*", function (evt) {
                    self.$broadcast(evt.data[1].event, evt.data[1].data)
                    self.$broadcast('websocket_broadcast', evt.data[1])
                });

                socket.io.on('connect', function(){ console.debug('manager connect', JSON.stringify(arguments)) });
                socket.io.on('connect_error', function(){ console.debug('manager connect_error', JSON.stringify(arguments)) });
                socket.io.on('connect_timeout', function(){ console.debug('manager connect_timeout', JSON.stringify(arguments)) });
                socket.io.on('reconnect', function(){ console.debug('manager reconnect', JSON.stringify(arguments)) });

                socket.on('connect', function(){ console.debug('connect', JSON.stringify(arguments)) });
                socket.on('event', function(data){ console.debug('event', JSON.stringify(arguments)) });
                socket.on('disconnect', function(){ console.debug('disconnect', JSON.stringify(arguments)) });
                socket.on('error', function(){ console.debug('error', JSON.stringify(arguments)) });
                socket.on('reconnect', function(){ console.debug('reconnect', JSON.stringify(arguments)) });
                socket.on('reconnect_attempt', function(){ console.debug('reconnect_attempt', JSON.stringify(arguments)) });
                socket.on('reconnecting', function(){ console.debug('reconnecting', JSON.stringify(arguments)) });
                socket.on('reconnect_error', function(){ console.debug('reconnect_error', JSON.stringify(arguments)) });
                socket.on('reconnect_failed', function(){ console.debug('reconnect_failed', JSON.stringify(arguments)) });

            }
        }
}
</script>

<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}



#content {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;
  margin: 0;
  > div {
    flex: 1;
    align-self: auto;
  }
}

#side-nav {
  height: 100%;
  width: 300px;
  flex: 0 0 auto !important;
  float: left;
  padding: 0;
  background: #3E2723;
  position: relative;
  color: white;
  z-index: 1;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.3);
  border-right: 1px solid rgba(0, 0, 0, 0.3);
}



#side-nav > h5 {
  color: #50483c;
  text-align: center;
  text-decoration: underline;
  margin: 10px 0;
}

.side-nav {
  width: 600px;
}

#close {
  font-size: 40px;
}

#username {
  color: white;
  font-weight: bold;
  width: 100%;
  font-size: .8em;
}

#level {
  margin: 0;
  color: white;
  opacity: 0.7;
  font-size: 11px;
}

.side-account {
  display: block;
  padding: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.btn-settings {
  display: block;
  line-height: 24px;
  color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding: 15px;
}

#side-nav > a:hover {
  background-color: #4E342E;
}

#log-container h6 {
  padding: 15px;
}

.tabs {
  .indicator .stats {
    background-color: #5D4037;
  }
  > .tab > a {
    color: #5D4037;
  }
}

.switch label input[type=checkbox]:checked + .lever {
  background-color: #f0de23;
  &:after {
    background-color: #d7c60f;
  }
}

.tabs .tab a:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #5D4037;
}

.waves-effect.waves-brown .waves-ripple {
  background-color: rgba(121, 85, 72, 0.5);
}

.tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal.modal-fixed-footer {
  max-height: 80%;
  height: 80%;
  .modal-footer {
    background: #FFF;
  }
}

#info {
  margin-bottom: 25px;
  > .col {
    padding: 5px;
    min-height: 100px;
  }
}
</style>
