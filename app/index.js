// Imports
const constants = require('./modules/const.js');
let User = require('./modules/User.js'),
    Ipc = require('./modules/Ipc.js'),
    Logger = require('./modules/Logger.js'),
    Materialize = require('./modules/Materialize.js'),
    GoogleMap = require('./modules/GoogleMap.js'),
    ProfileMenu = require('./modules/ProfileMenu.js')

// Global vars
let user,
    googleMap,
    omap,
    forts = [],
    info_windows = [], // windows that appear when you click on fort
    ipc,
    logger,
    profileMenu;

// Main
$(document).ready(function() {
    // Init User 
    user = new User(userInfo.users[0]);

    // Init map
    googleMap = new GoogleMap(userInfo, user);

    // Init logger
    logger = new Logger();

    // Init Ipc
    ipc = new Ipc();
    ipc.enableLogging(logger);

    // Logout listener
    $('#logout').click(function() {
        ipc.send('logout');
    });

    profileMenu = new ProfileMenu(user);

    // Materialize init
    Materialize.init();

});

$('#btn-info').click(function() {
    fillInventory();
});

var updateData = function() {
    document.getElementById('username').innerHTML = userInfo.users[0];
    document.getElementById('level').innerHTML = "Level " + stats[0].inventory_item_data.player_stats.level;
};

var errorFunc = function(xhr) {
    console.error(xhr);
};

var getCandy = function(p_num) {
    for (var i = 0; i < user.bagCandy.length; i++) {
        var checkCandy = user.bagCandy[i].inventory_item_data.candy.family_id;
        if (pokemoncandyArray[p_num] === checkCandy) {
            return (user.bagCandy[i].inventory_item_data.candy.candy || 0);
        }
    }
};

var invSuccess = function(data, user_index) {
    bagCandy = filter(data, 'candy');
    bagItems = filter(data, 'item');
    bagPokemon = sortPokemonsByKey(filter(data, 'pokemon_data'), 'cp');
    pokedex = filter(data, 'pokedex_entry');
    stats = filter(data, 'player_stats');
    user.bagCandy = bagCandy;

    if (!stats_at_start.saved) {
        stats_at_start.bagCandy = filter(data, 'pokemon_family');
        stats_at_start.bagItems = filter(data, 'item');
        stats_at_start.bagPokemon = sortPokemonsByKey(filter(data, 'pokemon_data'), 'cp');
        stats_at_start.pokedex = filter(data, 'pokedex_entry');
        stats_at_start.stats = filter(data, 'player_stats');
        stats_at_start.saved = true;
    }
};

var trainerFunc = function(data, user_index) {
    for (var i = 0; i < data.cells.length; i++) {
        cell = data.cells[i];
        if (data.cells[i].forts != undefined) {
            for (var x = 0; x < data.cells[i].forts.length; x++) {
                var fort = cell.forts[x];
                if (!forts[fort.id]) {
                    if (fort.type === 1) {
                        forts[fort.id] = new google.maps.Marker({
                            map: map,
                            position: {
                                lat: parseFloat(fort.latitude),
                                lng: parseFloat(fort.longitude)
                            },
                            icon: '../resources/image/forts/img_pokestop.png'
                        });
                    } else {
                        forts[fort.id] = new google.maps.Marker({
                            map: map,
                            position: {
                                lat: parseFloat(fort.latitude),
                                lng: parseFloat(fort.longitude)
                            },
                            icon: '../resources/image/forts/' + teams[fort.owned_by_team] + '.png'
                        });
                    }
                    fortPoints = '';
                    fortTeam = '';
                    fortType = 'PokeStop';
                    pokemonGuard = '';
                    if (fort.guard_pokemon_id != undefined) {
                        fortPoints = 'Points: ' + fort.gym_points;
                        fortTeam = 'Team: ' + teams[fort.owned_by_team] + '<br>';
                        fortType = 'Gym';
                        pokemonGuard = 'Guard Pokemon: ' + pokemonArray[fort.guard_pokemon_id - 1].Name + '<br>';
                    }
                    var contentString = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + pokemonGuard + fortPoints;
                    info_windows[fort.id] = new google.maps.InfoWindow({
                        content: contentString
                    });
                    google.maps.event.addListener(forts[fort.id], 'click', (function(marker, content, infowindow) {
                        return function() {
                            infowindow.setContent(content);
                            infowindow.open(map, marker);
                        };
                    })(forts[fort.id], contentString, info_windows[fort.id]));
                }
            }
        }
    }
    if (pathcoords[userInfo.users[user_index]][pathcoords[userInfo.users[user_index]].length] > 1) {
        var tempcoords = [{
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng)
        }];
        if (tempcoords.lat != pathcoords[userInfo.users[user_index]][pathcoords[userInfo.users[user_index]].length - 1].lat && tempcoords.lng != pathcoords[userInfo.users[user_index]][pathcoords[userInfo.users[user_index]].length - 1].lng || pathcoords[userInfo.users[user_index]].length === 1) {
            pathcoords[userInfo.users[user_index]].push({
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            })
        }
    } else {
        pathcoords[userInfo.users[user_index]].push({
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng)
        })
    }
    if (user[userInfo.users[user_index]].hasOwnProperty('marker') === false) {
        randomSex = Math.round(Math.random());
        user[userInfo.users[user_index]].marker = new google.maps.Marker({
            map: map,
            position: {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            },
            icon: '../resources/image/trainer/' + trainerSex[randomSex] + Math.floor(Math.random() * numTrainers[randomSex]) + '.png',
            zIndex: 2,
            label: userInfo.users[user_index]
        });
    } else {
        user[userInfo.users[user_index]].marker.setPosition({
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng)
        });
        if (pathcoords[userInfo.users[user_index]].length === 2) {
            user[userInfo.users[user_index]].trainerPath = new google.maps.Polyline({
                map: map,
                path: pathcoords[userInfo.users[user_index]],
                geodisc: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.7,
                strokeWeight: 2
            });
        } else {
            user[userInfo.users[user_index]].trainerPath.setPath(pathcoords[userInfo.users[user_index]]);
        }
    }
    if (userInfo.users.length === 1 && userInfo.userZoom === true) {
        map.setZoom(16);
    }
    if (userInfo.users.length === 1 && userInfo.userFollow === true) {
        map.panTo({
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng)
        });
    }
};

function placeTrainer() {
    for (var i = 0; i < userInfo.users.length; i++) {
        loadJSON('../gofbot/web/location-' + userInfo.users[i] + '.json', trainerFunc, errorFunc, i);
    }
}

function updateTrainer() {
    for (var i = 0; i < userInfo.users.length; i++) {
        loadJSON('../gofbot/web/location-' + userInfo.users[i] + '.json', trainerFunc, errorFunc, i);
    }
}

var catchSuccess = function(data, user_index) {
    if (data !== undefined && Object.keys(data).length > 0) {
        if (user[userInfo.users[user_index]].catchables === undefined) {
            user[userInfo.users[user_index]].catchables = {};
        }
        if (data.latitude !== undefined) {
            if (user[userInfo.users[user_index]].catchables.hasOwnProperty(data.spawnpoint_id) === false) {
                let poke_name = pokemonArray[data.pokemon_id - 1].Name;
                user[userInfo.users[user_index]].catchables[data.spawnpoint_id] = new google.maps.Marker({
                    map: map,
                    position: {
                        lat: parseFloat(data.latitude),
                        lng: parseFloat(data.longitude)
                    },
                    icon: '../resources/image/pokemon/' + pad_with_zeroes(data.pokemon_id, 3) + userInfo.imageExt,
                    zIndex: 4,
                    optimized: false
                });
                if (userInfo.userZoom === true) {
                    map.setZoom(16);
                }
                if (userInfo.userFollow === true) {
                    map.panTo({
                        lat: parseFloat(data.latitude),
                        lng: parseFloat(data.longitude)
                    });
                }
            } else {
                user[userInfo.users[user_index]].catchables[data.spawnpoint_id].setPosition({
                    lat: parseFloat(data.latitude),
                    lng: parseFloat(data.longitude)
                });
                user[userInfo.users[user_index]].catchables[data.spawnpoint_id].setIcon('../resources/image/pokemon/' + pad_with_zeroes(data.pokemon_id, 3) + userInfo.imageExt);
            }
        }
    } else {
        if (user[userInfo.users[user_index]].catchables !== undefined && Object.keys(user[userInfo.users[user_index]].catchables).length > 0) {
            for (var key in user[userInfo.users[user_index]].catchables) {
                user[userInfo.users[user_index]].catchables[key].setMap(null);
            }
            user[userInfo.users[user_index]].catchables = undefined;
        }
    }
};

function addCatchable() {
    for (var i = 0; i < userInfo.users.length; i++) {
        loadJSON('../gofbot/web/catchable-' + userInfo.users[i] + '.json', catchSuccess, errorFunc, i);
    }
}

function addInventory() {
    for (var i = 0; i < userInfo.users.length; i++) {
        loadJSON('../gofbot/web/inventory-' + userInfo.users[i] + '.json', invSuccess, errorFunc, i);
    }
}

function pad_with_zeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

function filter(arr, search) {
    var filtered = [];
    for (i = 0; i < arr.length; i++) {
        if (arr[i].inventory_item_data[search] != undefined) {
            filtered.push(arr[i]);
        }
    }
    return filtered;
}

function loadJSON(path, success, error, successData) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText.replace(/\bNaN\b/g, 'null')), successData);
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
}

function sortPokemonsByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a.inventory_item_data.pokemon_data[key];
        var y = b.inventory_item_data.pokemon_data[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }).reverse();
}

$(document).ready(function() {
    $('.tooltipped').tooltip({
        delay: 50
    });
});

//filter pokemons 
function fuzzy_match(str, pattern) {
    pattern = pattern.split("").reduce(function(a, b) {
        return a + ".*" + b;
    });
    return (new RegExp(pattern)).test(str);
};
var pokemonFilterTimer;

function fillInventory() {
    addInventory();
    var current_user_stats = stats[0].inventory_item_data.player_stats;
    var text = `
      <div class="col s12">
      <ul class="tabs">
        <li class="tab col s3"><a class="waves-effect waves-brown active" href="#info">Info</a></li>
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#session">Session</a></li>
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#items">Items ( ${bagItems.length} )</a></li>
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#pokemon">Pokemon ( ${bagPokemon.length } )</a></li>
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#pokedex">Pokedex</a></li>
      </ul>
   </div>
    <div class="modal-content">
    <div id="info" class="row">
    <div class="col s12 center" style="margin-bottom: 25px;">
      <img src="${user[userInfo.users[0]].marker.icon}">
      <h5>${userInfo.users[0]}</h5>
      Level ${current_user_stats.level} <br> 
      ${current_user_stats.experience}  /  ${parseInt(current_user_stats.next_level_xp, 10) }<br>
    </div>
    <div class="col s3 center">
      <b>Exp to level ${( parseInt(current_user_stats.level, 10) + 1 )}</b><br>
      ${(parseInt(current_user_stats.next_level_xp, 10) - current_user_stats.experience)}
    </div>
    <div class="col s3 center">
      <b>Pokemon Encountered</b><br>
      ${(current_user_stats.pokemons_encountered || 0)}
    </div>
    <div class="col s3 center">
      <b>Pokeballs Thrown</b><br>
      ${(current_user_stats.pokeballs_thrown || 0)}
    </div>
    <div class="col s3 center">
      <b>Pokemon Caught</b><br>
      ${(current_user_stats.pokemons_captured || 0)}
    </div>
    <div class="col s3 center">
      <b>Small Ratata Caught</b><br>
      ${(current_user_stats.small_rattata_caught || 0)}
    </div>
    <div class="col s3 center">
      <b>Pokemon Evolved</b><br>
      ${(current_user_stats.evolutions || 0)}
    </div><div class="col s3 center">
      <b>Eggs Hatched</b><br>
      ${(current_user_stats.eggs_hatched || 0)}
    </div>
    <div class="col s3 center">
      <b>Unique Pokedex Entries</b><br>
      ${(current_user_stats.unique_pokedex_entries || 0)}
    </div>
    <div class="col s3 center">
      <b>PokeStops Visited</b><br>
      ${(current_user_stats.poke_stop_visits || 0)}
    </div>
      <div class="col s3 center">
        <b>Kilometers Walked</b><br>
        ${(parseFloat(current_user_stats.km_walked).toFixed(2) || 0)}
      </div>
    </div>`;
    //items 
    var current_user_bag_items = bagItems;
    text += '<div id="items" class="row"><div class="row items">';
    for (i = 0; i < current_user_bag_items.length; i++) {
        text += `
    <div class="col s12 m4 l3 center" style="float: left; height: 144px;">
      <img src="../resources/image/items/${current_user_bag_items[i].inventory_item_data.item.item_id}.png" class="item_img"><br>
      <b>${itemsArray[current_user_bag_items[i].inventory_item_data.item.item_id]}</b><br>
      Count:  ${(current_user_bag_items[i].inventory_item_data.item.count || 0)}
    </div>`;
    }
    text += '</div></div>';
    //pokemon
    pkmnTotal = bagPokemon[0].length;

    text += '<div id="pokemon" class="row"><div class="row item-filter"><input type="text" placeholder="Search Pokemons" /></div><div class="row items">';
    bagPokemon.sort(function(a, b) {
        return b.inventory_item_data.pokemon_data.cp - a.inventory_item_data.pokemon_data.cp;
    });
    for (i = 0; i < bagPokemon.length; i++) {
        var current_pokemon_data = bagPokemon[i].inventory_item_data.pokemon_data;
        if (current_pokemon_data.is_egg) {
            continue;
        } else {
            pkmnNum = current_pokemon_data.pokemon_id;
            pkmnImage = pad_with_zeroes(current_pokemon_data.pokemon_id, 3) + '.png';
            pkmnName = pokemonArray[pkmnNum - 1].Name;
            pkmnCP = current_pokemon_data.cp;
            pkmnIVA = current_pokemon_data.individual_attack || 0;
            pkmnIVD = current_pokemon_data.individual_defense || 0;
            pkmnIVS = current_pokemon_data.individual_stamina || 0;
            pkmnIV = ((pkmnIVA + pkmnIVD + pkmnIVS) / 45.0).toFixed(2);
            pkmCandy = getCandy(pkmnNum);
        }
        text += `
    <div class="col s12 m4 l3 center pokemon-list-item" style="float: left;">
      <img src="../resources/image/pokemon/${pkmnImage}" class="png_img"><br>
      <b><span class="pokemon-name">${pkmnName}</span></b><br>
      <b>CP: </b>${pkmnCP } | <b>IV:</b> ${pkmnIV}<br>
      <b>A/D/S: </b>${pkmnIVA}/${pkmnIVD}/${pkmnIVS}<br>
      <b>Candies: </b>${pkmCandy}
    </div>`;
    }
    text += '</div></div>';

    //pokedex
    var sortedPokedex = [];
    for (i = 0; i < pokedex.length; i++) {
        pkmID = pokedex[i].inventory_item_data.pokedex_entry.pokemon_id;
        pkmnName = pokemonArray[pkmID - 1].Name;
        pkmEnc = pokedex[i].inventory_item_data.pokedex_entry.times_encountered;
        pkmCap = pokedex[i].inventory_item_data.pokedex_entry.times_captured;
        sortedPokedex.push({
            "name": pkmnName,
            "id": pkmID,
            "cap": (pkmEnc || 0),
            "enc": (pkmCap || 0)
        });
    }
    text += '<div id="pokedex" class="row">';
    for (var i = 0; i < sortedPokedex.length; i++) {
        pkmnNum = sortedPokedex[i].id;
        pkmnImage = pad_with_zeroes(pkmnNum, 3) + '.png';
        pkmnName = pokemonArray[pkmnNum - 1].Name;
        pkmnName = pokemonArray[pkmnNum - 1].Name;
        pkmnEnc = sortedPokedex[i].enc;
        pkmnCap = sortedPokedex[i].cap;
        pkmnCandy = getCandy(pkmnNum);

        text += `
    <div class="col s6 m6 l3 center">
      <img src="../resources/image/pokemon/${pkmnImage}" class="png_img"><br>
      <b>${pad_with_zeroes(pkmnNum, 3)} ${pkmnName}</b><br>
      Times Seen: ${pkmnEnc}<br>
      Times Caught: ${pkmnCap}<br>
      Candy: ${(pkmnCandy || 0)}
    </div>`;
    }
    text += '</div>';

    //Session
    var exp_gained = stats[0].inventory_item_data.player_stats.experience - stats_at_start.stats[0].inventory_item_data.player_stats.experience;
    var km_walked = parseFloat(stats[0].inventory_item_data.player_stats.km_walked - stats_at_start.stats[0].inventory_item_data.player_stats.km_walked).toFixed(2);
    var pokemon_caught = bagPokemon.length - stats_at_start.bagPokemon.length;
    var eggs_hatched = stats[0].inventory_item_data.player_stats.eggs_hatched - stats_at_start.stats[0].inventory_item_data.player_stats.eggs_hatched;
    text += `
  <div id="session" class ="row">
    <h3>This session data</h3>
    Experience gained:  ${exp_gained}<br>
    Distance walked:  ${km_walked} km <br>
    Pokemon caught:  ${pokemon_caught} <br>
    Eggs hatched:  ${eggs_hatched} <br>
    </div>`;


    //Footer
    text += `</div></div>
        <div class="modal-footer">
            <a href="#!" class="info-close modal-action modal-close waves-effect waves-brown btn-flat">Close</a>
        </div>`;
    $('#modal-info').html(text);

    $('#pokemon .item-filter input').bind('change blur keyup mouseup', function(event) {
        if (pokemonFilterTimer) {
            clearTimeout(pokemonFilterTimer);
        }
        var searchTerm = $('#pokemon .item-filter input').val().toLowerCase();
        if (searchTerm != '') {
            pokemonFilterTimer = setTimeout(function() {
                $('#pokemon .pokemon-list-item').each(function(i, e) {
                    pokemonName = $(e).find('.pokemon-name').text().toLowerCase();
                    fuzzy_match(pokemonName, searchTerm) && $(e).show() || $(e).hide();
                });
            }, 100);
        } else {
            $('#pokemon .pokemon-list-item').each(function(i, e) {
                $(e).show();
            });
        }
    });

    setTimeout(function() {
        $('.tabs').tabs();
    }, 1);
}

function log(message) {
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
    log.images = [];

    // Check for item words
    for (var key in itemsArray) {
        var item_name = itemsArray[key];
        if (log.message.indexOf(item_name) > -1) {
            log.images.push('<img src="../resources/image/items/' + key + '.png" class="log-img">')
        }
    }

    // Check for pokemon words
    for (var i = 0; i < pokemonArray.length; i++) {
        if (log.message.indexOf(pokemonArray[i].Name) > -1) {
            log.images.push('<img src="../resources/image/pokemon/' + pad_with_zeroes(i + 1, 3) + '.png" class="log-img log-pokemon">')
        }
    }
    log.date = new Date();
    if (log.worker == "MoveToFort") {
        $("#bot-indicator").html("<b><div id='indicator'></div>Bot Status</b><br>" + log.message);
        pingIndicator();
        return;
    }
    if (log.worker == "UpdateTitleStats") {
        $("#bot-stats").html("<b><div id='stats'></div>Stats</b><br>" + log.message);
        pingStats();
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

function pingIndicator() {
    $("#indicator").css("background-color", "#0a0");
    setTimeout(function() {
        $("#indicator").css("background-color", "#eee");
    }, 250);
}

function pingStats() {
    $("#stats").css("background-color", "#0a0");
    setTimeout(function() {
        $("#stats").css("background-color", "#eee");
    }, 250);
}

function clearLog() {
    $('.log-item').remove();
}
// Callback for google maps
function mapCallback() {
    googleMap.init();
}