const path      = require('path'),
      botPath   = require('electron').remote.getGlobal('botPath'),
      fs   = require('fs-extra');


class User {
    constructor(name) {
        this.name = name;
        this.pathcoords = [];
        console.log("[ USER ] Created user " + name);
        this.loadData();
    }
    loadData() {
        var data = fs.readJSONSync(path.join(botPath, '/web/inventory-' + this.name + '.json'));
        this.bagCandy = this.filter(data, 'candy');
        this.bagItems = this.filter(data, 'item');
        this.bagPokemon = this.filter(data, 'pokemon_data');
        this.pokedex = this.filter(data, 'pokedex_entry');
        this.stats = this.filter(data, 'player_stats');
        console.log("[ USER ] Loaded data, length = "+data.length);
    }
    filter(arr, search) {
        var filtered = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].inventory_item_data[search] != undefined) {
            filtered.push(arr[i]);
            }
        }
        return filtered;
    }
}

module.exports = User;
