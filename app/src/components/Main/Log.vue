<template>
    <div id="log-container">
        <a class='dropdown-button-logsettings waves-effect waves-light' href='#' data-activates='logsettings'>
            <h6>
                <i class="material-icons" style="float: left; line-height: 14px; padding-right: 15px; color: #FFF">list</i>Logs
            </h6>
        </a>

        <ul id='logsettings' class='dropdown-content'>
            <li v-for="type in types">
                {{ $key }}
                <div class="switch">
                    <label>
                        Off
                        <input type="checkbox" v-model="type.active">
                        <span class="lever"></span>
                        On
                    </label>
                </div>
                <br>
            </li>
        </ul>

        <div id="log-text">
            <p id="log">
                <template v-for="log in logs | orderBy 'date' -1" >

                    <div class="log-item" v-if="log.images.length > 0" v-show="types[log.type].active">
                        <span class="log-date">{{ log.date.toTimeString().split(" ")[0] }}</span>
                        <p class='log-message log-message-narrow'>{{  log.message }} </p>
                        <div class='log-image-container'>
                            {{{  log.images.join("") }}}
                        </div>
                    </div>
                    <div class="log-item" v-else v-show="types[log.type].active">
                        <span class="log-date">{{ log.date.toTimeString().split(" ")[0] }}</span>
                        <p class='log-message'>{{ log.message }}</p>
                    </div>
                </template>
            </p>
        </div>
    </div>
</template>

<script>

    const constants = require('./const.js'),
          utils     = require('./Utils'),
          path      = require('path');


    export default {
        data() {
            return {
                logs: [],
                types: {}
            }
        },
        ready() {

            $('.dropdown-button-logsettings').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: true, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: true, // Displays dropdown below the button
                alignment: 'left' // Displays dropdown with edge aligned to the left of button
            });

        },
        events: {
            'websocket_broadcast': function (obj) {

                if (!obj.data.msg || obj.data.msg.trim().length == 0) {
                    return true;
                }

                if (!this.types[obj.event]) {
                    this.$set('types.' + obj.event, {active: true});
                }

                let log = {
                    message: obj.data.msg,
                    type: obj.event,
                    date: new Date(),
                    images: [],
                };

                // Check for item words
                for (var key in constants.itemsArray) {
                    var item_name = constants.itemsArray[key];
                    if (log.message && log.message.indexOf(item_name) > -1) {
                        log.images.push(`<img src="${path.join('/assets/image/items/' + key + '.png')}" class="log-img">`)
                    }
                }

                // Check for pokemon words
                for (var i = 0; i < constants.pokemonArray.length; i++) {
                    if (log.message && log.message.indexOf(constants.pokemonArray[i].Name) > -1) {
                        log.images.push(`<img src=${path.join('/assets/image/pokemon/' + utils.pad_with_zeroes(i + 1, 3) + '.png')} class="log-img log-pokemon">`)
                    }
                }

                log.date = new Date();

                this.logs.push(log)

                return true;
            }
        }
    }
</script>


<style lang="scss">
    #log {
        font-size: 12px;
    }

    #log-container {
        height: calc(100% - 320px);
        margin-bottom: 70px;
    }

    #log-text {
        overflow-y: scroll;
        width: 100%;
        height: 100%;
    &::-webkit-scrollbar {
         display: none;
     }
    }

    .log-img {
        height: 30px;
        float: right;
    }

    .log-date {
        display: block;
        opacity: 0.6;
    }

    .log-pokemon {
        height: 60px;
    }

    .log-message {
        margin-top: 0;
        font-size: 14px;
    }

    .log-item {
        padding: 5px 15px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    &:after {
         content: "";
         display: table;
         clear: both;
     }
    }

    .log-image-container {
        width: 60px;
        float: right;
    }

    .log-message-narrow {
        width: 200px;
        float: left;
    }


    #logsettings {
        width: 100%!important;
        padding: 11px!important;
    }
</style>
