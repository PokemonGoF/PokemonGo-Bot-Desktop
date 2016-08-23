// Takes logs and prints them
const utils = require('./Utils.js');

class Logger {
    log(message) {
        if (message.length < 1) {
            return;
        }
        var log = {};

        var bracket_data = message.match(/\[(.*?)\]/g);
        if (!bracket_data || !bracket_data[0]) {
            console.log("Error while parsing message: " + message);
            return;
        }
        log.worker = bracket_data[0].replace(/[\[\]]/g, "");
        log.type = bracket_data[1].replace(/[\[\]]/g, "");
        log.action = bracket_data[2].replace(/[\[\]]/g, "");
        log.message = message.split("[" + log.action + "] ")[1];
        // Transform typical json strings into user friendly text
        log.message = log.message.replace(/\[?{(?:'item_id': [0-9]+, 'name': )?(u'[^}]*)}\]?/g, function(m,x) { return x.replace(/u'([^']*)'(?:, 'item_count') ?: ([0-9]+)/g,'$2x $1'); });
        log.images = [];

        // Check for item words
        // ... by descending length (because 'Super Potion' contains 'Potion')
        if (!constants.itemsSorted)
            constants.itemsSorted = Object.keys(constants.itemsArray).map( function(x) { return { "key":x, "name":constants.itemsArray[x]};}).sort(function(a,b) { return b.name.length-a.name.length;});
        var msg = log.message;
        for (var item in constants.itemsSorted) {
            var key = constants.itemsSorted[item].key;
            var item_name = constants.itemsSorted[item].name;
            if (msg.indexOf(item_name) < 0)  continue;
            var item_count = 1;
            var item_data = new RegExp("([0-9]+)x " + item_name,"g").exec(msg);
            if (item_data && item_data[0]) item_count = parseInt(item_data[1]);
            if (log.action == "item_discarded") item_count = -item_count;
            if (item_count < 0 || item_count > 1)
            {
                log.images.push('<div class="log-img-count"><img src="${path.join(appRoot, assets/image/items/' + key + '.png)}"><div>'+item_count+'x</div></div>')
            }
            else if (item_count == 1)
            {
                log.images.push('<img src="${path.join(appRoot, assets/image/items/' + key + '.png)}" class="log-img">')
            }
            msg = msg.replace(new RegExp(item_name,"g"),""); // .. marked as done
        }

        // Check for pokemon words
        for (var i = 0; i < constants.pokemonArray.length; i++) {
            if (log.message.indexOf(constants.pokemonArray[i].Name) > -1) {
                log.images.push(`<img src=${path.join(appRoot, 'assets/image/pokemon/' + utils.pad_with_zeroes(i + 1, 3) + '.png')} class="log-img log-pokemon">`)
            }
        }
        
        // Specific icons for specific actions
        if (log.action == "egg_hatched")
        {
            log.images.push('<img src="${path.join(appRoot, assets/image/items/Egg.png)}" class="log-img">')
        }
        else if (log.action == "incubate")
        {
            log.images.push('<img src="${path.join(appRoot, assets/image/items/EggIncubator.png)}" class="log-img">')
        }
          
        log.date = new Date();
        if (log.worker == "MoveToFort") {
            $("#bot-indicator").html("<b><div id='indicator'></div>Bot Status</b><br>" + log.message);
            this.pingIndicator();
            return;
        }
        if (log.worker == "UpdateTitleStats") {
            $("#bot-stats").html("<b><div id='stats'></div>Stats</b><br>" + log.message);
            this.pingStats();
            return;
        }
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
        $('#log').append(log_item);
        $('#log-text').animate({
            scrollTop: $('#log-text')[0].scrollHeight
        }, 100);
    }

    pingIndicator() {
        $("#indicator").css("background-color", "#0a0");
        setTimeout(function() {
            $("#indicator").css("background-color", "#eee");
        }, 250);
    }

    pingStats() {
        $("#stats").css("background-color", "#0a0");
        setTimeout(function() {
            $("#stats").css("background-color", "#eee");
        }, 250);
    }
}

module.exports = Logger;
