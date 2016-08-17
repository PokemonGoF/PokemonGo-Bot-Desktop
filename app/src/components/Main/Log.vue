<template>
    <div id="log-container">
        <h6><i class="material-icons"
               style="float: left; line-height: 14px; padding-right: 15px; color: #FFF">list</i>Logs</h6>
        <div id="log-text">
            <p id="log">
                <template v-for="log in logs | orderBy 'date' desc">
                    <div class="log-item" v-if="log.images.length > 0">
                        <span class="log-date">{{ log.date.toTimeString().split(" ")[0] }}</span>
                        <p class='log-message log-message-narrow'>{{  log.message }} </p>
                        <div class='log-image-container'>
                            {{{  log.images.join("") }}}
                        </div>
                    </div>
                    <div class="log-item" v-else>
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
                logs: []
            }
        },
        events: {
            'websocket_broadcast': function (obj) {

                let log = {
                    message: obj.data.msg,
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

</style>
