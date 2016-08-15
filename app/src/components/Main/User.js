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
        this.loaded = false;

        let data = {}
        let dataPath = path.join(botPath, '/web/inventory-' + this.name + '.json')
        if (!fs.existsSync(dataPath)) {
            return;

        }

        try {
            data = fs.readJSONSync(dataPath);
        } catch (err) {
            return;
        }

        this.bagCandy = this.filter(data, 'candy');
        this.bagItems = this.filter(data, 'item');
        this.bagPokemon = this.filter(data, 'pokemon_data');
        this.pokedex = this.filter(data, 'pokedex_entry');
        this.stats = this.filter(data, 'player_stats');

        this.loaded = true;

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
