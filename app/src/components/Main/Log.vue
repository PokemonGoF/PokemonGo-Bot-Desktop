<template>
    <div id="log-container">
        <h6><i class="material-icons"
               style="float: left; line-height: 14px; padding-right: 15px; color: #FFF">list</i>Logs</h6>
        <div id="log-text">
            <p id="log">
                {{{ logs }}}
            </p>
        </div>
    </div>
</template>

<script>

    const constants = require('./const.js'),
          path      = require('path');


    export default {
        data() {
            return {
                logs: ""
            }
        },
        ready() {},
        events: {
            'bot_log': function (obj) {
                var lines = obj.msg.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    let message = lines[i]

                    if (message.length < 1) {
                        return true;
                    }
                    let log = {};

                    let bracket_data = message.match(/\[(.*?)\]/g);
                    if (!bracket_data || bracket_data.length < 3) {
                        return true;
                    }
                    log.worker = bracket_data[0].replace(/[\[\]]/g, "");
                    log.type = bracket_data[1].replace(/[\[\]]/g, "");
                    log.action = bracket_data[2].replace(/[\[\]]/g, "");
                    log.message = message.split("[" + log.action + "] ")[1];
                    log.images = [];

                    if (log.worker == "MoveToFort" || log.worker == "UpdateLiveStats") {
                        return true;
                    }

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

                    var log_item = "";
                    if (log.images.length > 0) {
                        log_item = '<div class="log-item">\
                               <span class="log-date">' + log.date.toTimeString().split(" ")[0] + "</span>\
                               <p class='log-message log-message-narrow'>" + log.message + "</p>\
                               <div class='log-image-container'>" + log.images.join("") + "</div>\
                            </div>";
                    } else {
                        log_item = '<div class="log-item">\
                               <span class="log-date">' + log.date.toTimeString().split(" ")[0] + "</span>\
                               <p class='log-message'>" + log.message + "</p>\
                            </div>";
                    }

                    this.logs += log_item

                    return true;
            }
        }
    }
}
</script>
