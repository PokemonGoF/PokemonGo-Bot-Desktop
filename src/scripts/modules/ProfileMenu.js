class ProfileMenu {
    constructor(user) {
        this.user = user;

        this.pokemonFilterTimer;
        $('#pokemon .item-filter input').bind('change blur keyup mouseup', function(event) {
            if (this.pokemonFilterTimer) {
                clearTimeout(this.pokemonFilterTimer);
            }
            var searchTerm = $('#pokemon .item-filter input').val().toLowerCase();
            if (searchTerm != '') {
                this.pokemonFilterTimer = setTimeout(function() {
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
    }
    getCandy(p_num) {
        for (var i = 0; i < this.user.bagCandy.length; i++) {
            var checkCandy = this.user.bagCandy[i].inventory_item_data.candy.family_id;
            if (constants.pokemoncandyArray[p_num] === checkCandy) {
                return (this.user.bagCandy[i].inventory_item_data.candy.candy || 0);
            }
        }
    };


    pad_with_zeroes(number, length) {
        var my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }
        return my_string;
    }


    sortPokemonsByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a.inventory_item_data.pokemon_data[key];
            var y = b.inventory_item_data.pokemon_data[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }).reverse();
    }

    fillInventory() {
        var current_user_stats = this.user.stats[0].inventory_item_data.player_stats
        var text = `
      <div class="col s12">
      <ul class="tabs">
        <li class="tab col s3"><a class="waves-effect waves-brown active" href="#info">Info</a></li>
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#session">Session</a></li>
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#items">Items ( ${this.user.bagItems.length} )</a></li>
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#pokemon">Pokemon ( ${this.user.bagPokemon.length } )</a></li>
        <li class="tab col s3"><a class="waves-effect waves-brown" href="#pokedex">Pokedex</a></li>
      </ul>
   </div>
    <div class="modal-content">
    <div id="info" class="row">
    <div class="col s12 center" style="margin-bottom: 25px;">
      <img src="${this.user.marker.icon}">
      <h5>${this.user.name}</h5>
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
        var current_user_bag_items = this.user.bagItems;
        text += '<div id="items" class="row"><div class="row items">';
        for (i = 0; i < current_user_bag_items.length; i++) {
            text += `
    <div class="col s12 m4 l3 center" style="float: left; height: 144px;">
      <img src="${path.join(appRoot, `assets/image/items/${current_user_bag_items[i].inventory_item_data.item.item_id}.png)`)}" class="item_img"><br>
      <b>${constants.itemsArray[current_user_bag_items[i].inventory_item_data.item.item_id]}</b><br>
      Count:  ${(current_user_bag_items[i].inventory_item_data.item.count || 0)}
    </div>`;
        }
        text += '</div></div>';
        //pokemon
        let pkmnTotal = this.user.bagPokemon.length;

        text += '<div id="pokemon" class="row"><div class="row item-filter"><input type="text" placeholder="Search Pokemons" /></div><div class="row items">';
        this.user.bagPokemon.sort(function(a, b) {
            return b.inventory_item_data.pokemon_data.cp - a.inventory_item_data.pokemon_data.cp;
        });
        for (i = 0; i < this.user.bagPokemon.length; i++) {
            var current_pokemon_data = this.user.bagPokemon[i].inventory_item_data.pokemon_data;
            if (current_pokemon_data.is_egg) {
                continue;
            } else {
                var pkmnNum = current_pokemon_data.pokemon_id,
                pkmnImage = this.pad_with_zeroes(current_pokemon_data.pokemon_id, 3) + '.png',
                pkmnName = constants.pokemonArray[pkmnNum - 1].Name,
                pkmnCP = current_pokemon_data.cp,
                pkmnIVA = current_pokemon_data.individual_attack || 0,
                pkmnIVD = current_pokemon_data.individual_defense || 0,
                pkmnIVS = current_pokemon_data.individual_stamina || 0,
                pkmnIV = ((pkmnIVA + pkmnIVD + pkmnIVS) / 45.0).toFixed(2),
                pkmCandy = this.getCandy(pkmnNum);
            }
            text += `
    <div class="col s12 m4 l3 center pokemon-list-item" style="float: left;">
      <img src="${path.join(appRoot, `assets/image/pokemon/${pkmnImage}`)}" class="png_img"><br>
      <b><span class="pokemon-name">${pkmnName}</span></b><br>
      <b>CP: </b>${pkmnCP } | <b>IV:</b> ${pkmnIV}<br>
      <b>A/D/S: </b>${pkmnIVA}/${pkmnIVD}/${pkmnIVS}<br>
      <b>Candies: </b>${pkmCandy}
    </div>`;
        }
        text += '</div></div>';

        //pokedex
        var sortedPokedex = [];
        for (i = 0; i < this.user.pokedex.length; i++) {
            var pkmID = this.user.pokedex[i].inventory_item_data.pokedex_entry.pokemon_id,
            pkmnName = constants.pokemonArray[pkmID - 1].Name,
            pkmEnc = this.user.pokedex[i].inventory_item_data.pokedex_entry.times_encountered,
            pkmCap = this.user.pokedex[i].inventory_item_data.pokedex_entry.times_captured;
            sortedPokedex.push({
                "name": pkmnName,
                "id": pkmID,
                "cap": (pkmEnc || 0),
                "enc": (pkmCap || 0)
            });
        }
        text += '<div id="pokedex" class="row">';
        for (var i = 0; i < sortedPokedex.length; i++) {
            var pkmnNum = sortedPokedex[i].id,
            pkmnImage = this.pad_with_zeroes(pkmnNum, 3) + '.png',
            pkmnName = constants.pokemonArray[pkmnNum - 1].Name,
            pkmnName = constants.pokemonArray[pkmnNum - 1].Name,
            pkmnEnc = sortedPokedex[i].enc,
            pkmnCap = sortedPokedex[i].cap,
            pkmnCandy = this.getCandy(pkmnNum);

            text += `
    <div class="col s6 m6 l3 center">
      <img src="${path.join(appRoot, `assets/image/pokemon/${pkmnImage}`)}" class="png_img"><br>
      <b>${this.pad_with_zeroes(pkmnNum, 3)} ${pkmnName}</b><br>
      Times Seen: ${pkmnEnc}<br>
      Times Caught: ${pkmnCap}<br>
      Candy: ${(pkmnCandy || 0)}
    </div>`;
        }
        text += '</div>';

        //Session
        let session_stats = $("#bot-stats").html();
        text += `
    <div id="session" class ="row">
    ${session_stats}
    </div>`;


        //Footer
        text += `</div></div>
        <div class="modal-footer">
            <a href="#!" class="info-close modal-action modal-close waves-effect waves-brown btn-flat">Close</a>
        </div>`;
        $('#modal-info').html(text);
        setTimeout(function() {
            $('.tabs').tabs();
        }, 1);
    }


    //filter pokemons 
    fuzzy_match(str, pattern) {
        pattern = pattern.split("").reduce(function(a, b) {
            return a + ".*" + b;
        });
        return (new RegExp(pattern)).test(str);
    };

}

module.exports = ProfileMenu;