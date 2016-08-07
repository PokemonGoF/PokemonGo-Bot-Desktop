var i;
var map;
var menu;
var out1;
var out;
var user_index;

var emptyDex = [];
var forts = [];
var info_windows = [];
var outArray = [];
var numTrainers = [
  177, 
  109
];
var teams = [
  'TeamLess',
  'Mystic',
  'Valor',
  'Instinct'
];
var trainerSex = [
  'm',
  'f'
];

var bagCandy = {};
var bagItems = {};
var bagPokemon = {};
var inventory = {};
var playerInfo = {};
var pokedex = {};
var pokemonArray = {};
var stats = {};
var user_data = {};
var itemsArray = {
  '0': 'Unknown',
  '1': 'Pokeball',
  '2': 'Greatball',
  '3': 'Ultraball',
  '4': 'Masterball',
  '101': 'Potion',
  '102': 'Super Potion',
  '103': 'Hyper Potion',
  '104': 'Max Potion',
  '201': 'Revive',
  '202': 'Max Revive',
  '301': 'Lucky Egg',
  '401': 'Incense',
  '402': 'Spicy Incense',
  '403': 'Cool Incense',
  '404': 'Floral Incense',
  '501': 'Troy Disk',
  '602': 'X Attack',
  '603': 'X Defense',
  '604': 'X Miracle',
  '701': 'Razz Berry',
  '702': 'Bluk Berry',
  '703': 'Nanab Berry',
  '704': 'Wepar Berry',
  '705': 'Pinap Berry',
  '801': 'Special Camera',
  '901': 'Incubator (Unlimited)',
  '902': 'Incubator',
  '1001': 'Pokemon Storage Upgrade',
  '1002': 'Item Storage Upgrade'
};

$(document).ready(function() {
  loadScript("https://maps.googleapis.com/maps/api/js?key=" + gMapsAPIKey + "&libraries=drawing&callback=initMap");

  $('select').material_select();
  $('.modal-trigger').leanModal();
  $(".side-info").sideNav({
    menuWidth: 300, // Default is 240
    edge: 'right', // Choose the horizontal origin
    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
  });
  $('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: true, // Displays dropdown below the button
    alignment: 'left' // Displays dropdown with edge aligned to the left of button
  });
  var ipcRenderer = require('electron').ipcRenderer;
  $('#logout').click(function() {
    ipcRenderer.send('logout');
  });
  ipcRenderer.on('pythonLog', function(evt, data) {
    var lines = data.msg.split("\n")
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].replace(/\[\d\d:\d\d:\d\d\] /, "")
      $('#log').append('<p>' + line + '</p>');
    }
    console.log(data.msg);
  });
});

function loadScript(src) {
  var element = document.createElement("script");
  element.src = src;
  document.body.appendChild(element);
}

function initMap() {
  loadJSON('../resources/data/pokemondata.json', function(data, successData) {
    console.log('Loaded pokemon data..');
    pokemonArray = data;
  }, errorFunc, 'pokemonData');
  for (var i = 0; i < users.length; i++) {
    user_data[users[i]] = {};
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.0902, lng: -95.7129},
    zoom: 3
  });

  document.getElementById('switchPan').checked = userFollow;
  document.getElementById('switchZoom').checked = userZoom;
  document.getElementById('imageType').checked = (imageExt != '.png');
  setTimeout(function(){
    placeTrainer();
    addCatchable();
    setTimeout(function(){
      setInterval(updateTrainer, 1000);
      setInterval(updateData, 1000);
      setInterval(addCatchable, 1000);
      addInventory();
    }, 100);
  }, 1000);
}

$('#switchPan').change(function(){
    if (this.checked) {
      userFollow = true;
    } else {
      userFollow = false;
    }
});

$('#switchZoom').change(function(){
    if (this.checked) {
      userZoom = true;
    } else {
      userZoom = false;
    }
});

$('#imageType').change(function(){
    if (this.checked) {
      imageExt = '.gif';
    } else {
      imageExt = '.png';
    }
});


$('#btn-info').click(function(){
    fillInventory();
});

var updateData = function() {
  document.getElementById('username').innerHTML = users[0];
  document.getElementById('level').innerHTML = "Level "+stats[0].inventory_item_data.player_stats.level;
}

var errorFunc = function(xhr) {
  console.error(xhr);
};

var invSuccess = function(data, user_index) {
  bagCandy = filter(data, 'pokemon_family');
  bagItems = filter(data, 'item');
  bagPokemon = sortPokemonsByKey(filter(data, 'pokemon_data'), 'cp');
  pokedex = filter(data, 'pokedex_entry');
  stats = filter(data, 'player_stats');
};

var trainerFunc = function(data, user_index) {
  for (var i = 0; i < data.cells.length; i++) {
    cell = data.cells[i];
    if (data.cells[i].forts != undefined) {
      for (var x = 0; x < data.cells[i].forts.length; x++) {
        var fort = cell.forts[x];
        if (!forts[fort.id]) {
          if (fort.type === 1 ) {
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
            pokemonGuard = 'Guard Pokemon: ' + pokemonArray[fort.guard_pokemon_id-1].Name + '<br>';
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
  if (user_data[users[user_index]].hasOwnProperty('marker') === false) {
    randomSex = Math.floor(Math.random() * 1);
    user_data[users[user_index]].marker = new google.maps.Marker({
      map: map,
      position: {lat: parseFloat(data.lat), lng: parseFloat(data.lng)},
      icon: '../resources/image/trainer/' + trainerSex[randomSex] + Math.floor(Math.random() * numTrainers[randomSex]) + '.png',
      zIndex: 2,
      label: users[user_index]
    });
  } else {
    user_data[users[user_index]].marker.setPosition({lat: parseFloat(data.lat), lng: parseFloat(data.lng)});
  }
  if (users.length === 1 && userZoom === true) {
    map.setZoom(16);
  }
  if (users.length === 1 && userFollow === true) {
    map.panTo({
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng)
    });
  }
};

function placeTrainer() {
  for (var i = 0; i < users.length; i++) {
    loadJSON('../gofbot/web/location-' + users[i] + '.json', trainerFunc, errorFunc, i);
  }
}
function updateTrainer() {
  for (var i = 0; i < users.length; i++) {
    loadJSON('../gofbot/web/location-' + users[i] + '.json', trainerFunc, errorFunc, i);
  }
}

var catchSuccess = function(data, user_index) {
  if (data !== undefined && Object.keys(data).length > 0) {
    if (user_data[users[user_index]].catchables === undefined) {
      user_data[users[user_index]].catchables = {};
    }
    if (data.latitude !== undefined) {
      if (user_data[users[user_index]].catchables.hasOwnProperty(data.spawnpoint_id) === false) {
        poke_name = pokemonArray[data.pokemon_id-1].Name;
        user_data[users[user_index]].catchables[data.spawnpoint_id] = new google.maps.Marker({
          map: map,
          position: {lat: parseFloat(data.latitude), lng: parseFloat(data.longitude)},
          icon: '../resources/image/pokemon/' + pad_with_zeroes(data.pokemon_id, 3) + imageExt,
          zIndex: 4,
          optimized: false
        });
          if (userZoom === true) {
            map.setZoom(16);
          }
          if (userFollow === true) {
            map.panTo({
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            });
          }
      } else {
        user_data[users[user_index]].catchables[data.spawnpoint_id].setPosition({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        });
        user_data[users[user_index]].catchables[data.spawnpoint_id].setIcon('../resources/image/pokemon/' + pad_with_zeroes(data.pokemon_id, 3) + imageExt);
      }
    }
  } else {
    if (user_data[users[user_index]].catchables !== undefined && Object.keys(user_data[users[user_index]].catchables).length > 0) {
      for (var key in user_data[users[user_index]].catchables) {
        user_data[users[user_index]].catchables[key].setMap(null);
      }
      user_data[users[user_index]].catchables = undefined;
    }
  }
};

function addCatchable() {
  for (var i = 0; i < users.length; i++) {
    loadJSON('../gofbot/web/catchable-' + users[i] + '.json', catchSuccess, errorFunc, i);
  }
}
function addInventory() {
  for (var i = 0; i < users.length; i++) {
    loadJSON('../gofbot/web/inventory-' + users[i] + '.json', invSuccess, errorFunc, i);
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
  for(i=0; i < arr.length; i++) {
    if(arr[i].inventory_item_data[search] != undefined) {
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
        var x = a.inventory_item_data.pokemon_data[key]; var y = b.inventory_item_data.pokemon_data[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }).reverse();
}

$(document).ready(function(){
  $('.tooltipped').tooltip({delay: 50});
});


function fillInventory(){
  addInventory();
            var current_user_stats = stats[0].inventory_item_data.player_stats;
            var text = '<div class="col s12">\
      <ul class="tabs">\
        <li class="tab col s3"><a class="waves-effect waves-brown active" href="#info">Info</a></li>\
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#items">Items</a></li>\
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#pokemon">Pokemon</a></li>\
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#pokedex">Pokedex</a></li>\
      </ul>\
    </div>\
    <div class="modal-content">\
        <div class="row">\
    <div id="info" class="col s12">\
    <h5>' +
              users[0]+
              '</h5><br>Level: ' +
              current_user_stats.level +
              '<br>Exp: ' +
              current_user_stats.experience +
              '<br>Exp to Lvl ' +
              ( parseInt(current_user_stats.level, 10) + 1 ) +
              ': ' +
              (parseInt(current_user_stats.next_level_xp, 10) - current_user_stats.experience) +
              '<br>Pokemon Encountered: ' +
              (current_user_stats.pokemons_encountered || 0) +
              '<br>Pokeballs Thrown: ' +
              (current_user_stats.pokeballs_thrown || 0) +
              '<br>Pokemon Caught: ' +
              (current_user_stats.pokemons_captured || 0) +
              '<br>Small Ratata Caught: ' +
              (current_user_stats.small_rattata_caught || 0) +
              '<br>Pokemon Evolved: ' +
              (current_user_stats.evolutions || 0) +
              '<br>Eggs Hatched: ' +
              (current_user_stats.eggs_hatched || 0) +
              '<br>Unique Pokedex Entries: ' +
              (current_user_stats.unique_pokedex_entries || 0) +
              '<br>PokeStops Visited: ' +
              (current_user_stats.poke_stop_visits || 0) +
              '<br>Kilometers Walked: ' +
              (parseFloat(current_user_stats.km_walked).toFixed(2) || 0) +
              '\
    </div>\
    ';
  //items 
  var current_user_bag_items = bagItems;
  text += '<div id="items" class="col s12"><div class="row items">';
    for (i = 0; i < current_user_bag_items.length; i++) {
      text += '<div class="col s12 m4 l3 center" style="float: left; height: 144px;"><img src="../resources/image/items/' +
              current_user_bag_items[i].inventory_item_data.item.item_id +
              '.png" class="item_img"><br><b>' +
              itemsArray[current_user_bag_items[i].inventory_item_data.item.item_id] +
              '</b><br>Count: ' +
              (current_user_bag_items[i].inventory_item_data.item.count || 0) +
              '</div>';
    }
  text += '</div></div>';
  //pokemon
  pkmnTotal = bagPokemon[0].length;
    
    text += '<div id="pokemon" class="col s12"><div class="row items">';
    bagPokemon.sort(function(a, b){return b.inventory_item_data.pokemon_data.cp - a.inventory_item_data.pokemon_data.cp;});
    for (i = 0; i < bagPokemon.length; i++) {
      var current_pokemon_data = bagPokemon[i].inventory_item_data.pokemon_data;
      if (current_pokemon_data.is_egg) {
        continue;
      } else {
        pkmnNum = current_pokemon_data.pokemon_id;
        pkmnImage = pad_with_zeroes(current_pokemon_data.pokemon_id, 3) + '.png';
        pkmnName = pokemonArray[pkmnNum-1].Name;
        pkmnCP = "CP "+current_pokemon_data.cp;
        pkmnIVA = current_pokemon_data.individual_attack || 0;
        pkmnIVD = current_pokemon_data.individual_defense || 0;
        pkmnIVS = current_pokemon_data.individual_stamina || 0;
        pkmnIV = ((pkmnIVA + pkmnIVD + pkmnIVS) / 45.0).toFixed(2);
      }
      text += '<div class="col s12 m4 l3 center" style="float: left;"><img src="../resources/image/pokemon/' + pkmnImage + '" class="png_img"><br><b>' + pkmnName +
      '</b><br>' + pkmnCP + '<br>IV '+pkmnIV+'</div>';
    }
    text += '</div></div>';

  //pokemon
  var sortedPokedex = [];
  for (i = 0; i < pokedex.length; i++) {
    pkmID = pokedex[i].inventory_item_data.pokedex_entry.pokemon_id;
    pkmnName = pokemonArray[pkmID-1].Name;
    pkmEnc = pokedex[i].inventory_item_data.pokedex_entry.times_encountered;
    pkmCap = pokedex[i].inventory_item_data.pokedex_entry.times_captured;
    sortedPokedex.push({
      "name": pkmnName,
      "id": pkmID,
      "cap": (pkmEnc || 0),
      "enc": (pkmCap || 0)
    });
  }
  text += '<div id="pokedex" class="col s12">';
  for (var i = 0; i < sortedPokedex.length; i++) {
    pkmnNum = sortedPokedex[i].id;
    pkmnImage = pad_with_zeroes(pkmnNum, 3) +'.png';
    pkmnName = pokemonArray[pkmnNum-1].Name;
    pkmnName = pokemonArray[pkmnNum-1].Name;
    pkmnEnc = sortedPokedex[i].enc
    pkmnCap = sortedPokedex[i].cap
    text += '<div class="col s12 m6 l3 center"><img src="../resources/image/pokemon/' +
            pkmnImage +
            '" class="png_img"><br><b> ' +
            pad_with_zeroes(pkmnNum, 3) +
            ' ' +
            pkmnName +
            '</b><br>Times Seen: ' +
            pkmnEnc + 
            '<br>Times Caught: ' +
            pkmnCap +
            '<br>Candy: ' +
            pkmnCap +
            '</div>';
  }
  text += '</div>';
  //pokedex
  text += '</div></div>\
        <div class="modal-footer">\
            <a href="#!" class="info-close modal-action modal-close waves-effect waves-brown btn-flat">Close</a>\
        </div>';
            $('#modal-info').html(text);
            setTimeout(function(){$('.tabs').tabs();},1);
}