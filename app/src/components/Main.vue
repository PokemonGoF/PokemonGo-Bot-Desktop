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

        <template v-if="user != null">
            <profile :user.sync="user"></profile>
        </template>

        <log></log>

        <logout></logout>
    </div>

    <map :user.sync="user" :user-info.sync="userInfo"></map>

</div>

</template>

<script>

import BotIndicator from './Main/BotIndicator.vue';
import BotStats from './Main/BotStats.vue';
import Log from './Main/Log.vue';
import Options from './Main/Options.vue';
import Logo from './Main/Logo.vue';
import Logout from './Main/Logout.vue';
import Profile from './Main/Profile.vue';
import Map from './Main/Map.vue';
import io from 'socket.io-client/socket.io';

const socketAdress = 'http://127.0.0.1:7894';

    export default {
        data() {
            return {
                user: null,
                socket: null
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
            this.createUser();
            this.startSocket()
        },
        events: {
            'logout': function (evt) {
                let self = this;
                self.stopSocket();
                return true;
            }
        },
        methods: {
            createUser() {
                let user = {
                    name: this.userInfo.users[0],
                    pathcoords: [],
                    bagCandy: [],
                    bagItems: [],
                    bagPokemon: [],
                    pokedex: [],
                    stats: []
                };


                this.$set('user', user);
            },
            startSocket() {
                let self    = this,
                    patch   = require('socketio-wildcard')(io.Manager);
                self.socket = io(socketAdress);
                patch(self.socket);

                console.debug('Trying to connect on ' + socketAdress);

                self.socket.on("*", (evt) => {
                    if (evt.data[1].event) {
                        self.$broadcast(evt.data[1].event, evt.data[1].data);
                        self.$broadcast('websocket_broadcast', evt.data[1]);

                        if (evt.data[1].event == "login_successful") {
                            // start sending get player info after login_successful or it will fail :(
                            self.socket.emit('remote:send_request', {
                                "name": "get_player_info",
                                "account": this.userInfo.users[0]
                            })
                        }
                    }
                });

                setInterval(() => {
                    self.socket.emit('remote:send_request', {"name": "get_player_info", "account": this.userInfo.users[0]})
                }, 5000);

                console.debug("get_player_info:" + this.userInfo.users[0]);
                self.socket.on("get_player_info:" + this.userInfo.users[0], (evt) => {

                    let filter = function (arr, search) {
                        var filtered = [];
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].inventory_item_data[search] != undefined) {
                                filtered.push(arr[i]);
                            }
                        }
                        return filtered;
                    };

                    this.user.bagCandy   = filter(evt.result.inventory.inventory_delta.inventory_items, 'candy');
                    this.user.bagItems   = filter(evt.result.inventory.inventory_delta.inventory_items, 'item');
                    this.user.bagPokemon = filter(evt.result.inventory.inventory_delta.inventory_items, 'pokemon_data');
                    this.user.pokedex    = filter(evt.result.inventory.inventory_delta.inventory_items, 'pokedex_entry');
                    this.user.stats      = filter(evt.result.inventory.inventory_delta.inventory_items, 'player_stats');
                });
            },
            stopSocket() {
                let self = this;
                self.socket.removeAllListeners('*');
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
