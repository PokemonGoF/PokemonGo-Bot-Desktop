<template>
    <a class="modal-trigger side-account waves-effect waves-light" href="#modal-info" id="btn-info">
        <i class="material-icons"
           style="float: left; line-height: 34px; padding-right: 15px; color: #FFF">person</i>
        <p id="username">{{ user.name }}</p>
        <p id="level">{{ current_user_stats.level }}</p>
    </a>


    <div id="modal-info" class="">

        <div class="col s12">
        <ul class="tabs">
          <li class="tab col s3"><a class="waves-effect waves-brown active" href="#info">Info</a></li>
          <li class="tab col s3"><a class="waves-effect waves-brown" href="#items">Items ( {{ user.bagItems.length }} )</a></li>
          <li class="tab col s3"><a class="waves-effect waves-brown" href="#pokemon">Pokemon ( {{ user.bagPokemon.length }} )</a></li>
          <li class="tab col s3"><a class="waves-effect waves-brown" href="#pokedex">Pokedex</a></li>
          <li class="tab col s3"><a class="waves-effect waves-brown" href="#session">Session</a></li>
        </ul>
        </div>
        <div class="modal-content">
            <div id="info" class="row">
                <div class="col s12 center" style="margin-bottom: 25px;">
                    <img v-if="!!user.marker" :src="user.marker.icon">
                    <h5>{{ user.name }}</h5>
                    Level {{ current_user_stats.level }} <br>
                    {{ current_user_stats.experience }}  /  {{ current_user_stats.next_level_xp }}<br>
                </div>
                <div class="col s3 center">
                    <b>Exp to level {{ nextLevel }}</b><br>
                    {{ parseInt(current_user_stats.next_level_xp, 10) - current_user_stats.experience }}
                </div>
                <div class="col s3 center">
                    <b>Pokemon Encountered</b><br>
                    {{ current_user_stats.pokemons_encountered || 0 }}
                </div>
                <div class="col s3 center">
                    <b>Pokeballs Thrown</b><br>
                    {{ current_user_stats.pokeballs_thrown || 0 }}
                </div>
                <div class="col s3 center">
                    <b>Pokemon Caught</b><br>
                    {{ current_user_stats.pokemons_captured || 0 }}
                </div>
                <div class="col s3 center">
                    <b>Small Ratata Caught</b><br>
                    {{ current_user_stats.small_rattata_caught || 0 }}
                </div>
                <div class="col s3 center">
                    <b>Pokemon Evolved</b><br>
                    {{ current_user_stats.evolutions || 0 }}
                </div><div class="col s3 center">
                    <b>Eggs Hatched</b><br>
                    {{ current_user_stats.eggs_hatched || 0 }}
                </div>
                <div class="col s3 center">
                    <b>Unique Pokedex Entries</b><br>
                    {{ current_user_stats.unique_pokedex_entries || 0 }}
                </div>
                <div class="col s3 center">
                    <b>PokeStops Visited</b><br>
                    {{ current_user_stats.poke_stop_visits || 0 }}
                </div>
                <div class="col s3 center">
                    <b>Kilometers Walked</b><br>
                    {{ parseFloat(current_user_stats.km_walked).toFixed(2) || 0}}
                </div>
            </div>

            <div id="items" class="row">
                <div class="row items">
                    <div class="col s12 m4 l3 center" style="float: left; height: 144px;" v-for="item in current_user_bag_items">
                        <img :src="'/assets/image/items/' + item.inventory_item_data.item.item_id + '.png'" class="item_img"><br>
                        <b>{{ constants.itemsArray[item.inventory_item_data.item.item_id] }}</b><br>
                        Count:  {{ item.inventory_item_data.item.count || 0}}
                    </div>
                </div>
            </div>

            <div id="pokemon" class="row">
                <div class="row item-filter">
                    <input type="text" placeholder="Search Pokemons" v-model="filterPokemonName"/>
                </div>
                <div class="row items">
                    <div class="col s12 m4 l3 center pokemon-list-item" style="float: left;" v-for="pokemon in pokemons | filterBy filterPokemonName in 'Name'">
                      <img :src="'/assets/image/pokemon/'+  pokemon.Image + '.png'" class="png_img"><br>
                      <b><span class="pokemon-name">{{ pokemon.Name }}</span></b><br>
                      <b>CP: </b>{{ pokemon.CP  }} | <b>IV:</b> {{ pokemon.IV }}<br>
                      <b>A/D/S: </b>{{ pokemon.IVA }}/{{ pokemon.IVD }}/{{ pokemon.IVS }}<br>
                      <b>Candies: </b>{{ pokemon.Candy }}
                    </div>
                </div>
            </div>

            <div id="pokedex" class="row">
                <div class="row item-filter">
                    <input type="text" placeholder="Search Pokemons" v-model="filterPokemonName"/>
                </div>
                <div class="col s6 m6 l3 center" v-for="pokemon in pokedex | filterBy filterPokemonName in 'Name'">
                  <img :src="'/assets/image/pokemon/' + pokemon.Image +'.png'" class="png_img"><br>
                  <b>{{ pokemon.Num }} {{ pokemon.Name }}</b><br>
                  Times Seen: {{ pokemon.Enc }}<br>
                  Times Caught: {{ pokemon.Cap }}<br>
                  Candy: {{ pokemon.Candy || 0}}
                </div>
            </div>

            <div id="session" class="row">
                {{ session_stats }}
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <a href="#!" class="info-close modal-action modal-close waves-effect waves-brown btn-flat">Close</a>
    </div>

</template>


<script>
const constants = require('./const.js'),
      path      = require('path');


export default {
    data() {
        return {
            current_user_stats: {},
            current_user_bag_items: {},
            constants: constants,
            filterPokemonName: null
        }
    },
    props: {
        user: {
            twoWay: true
        }
    },
    computed: {
        nextLevel: function () {
            return this.current_user_stats.level + 1
        },
        pokemons: function () {
            this.user.bagPokemon.sort(function(a, b) {
                return parseInt(b.inventory_item_data.pokemon_data.cp, 10) - parseInt(a.inventory_item_data.pokemon_data.cp, 10);
            });

            let pokemons = [];
            for (var i = 0; i < this.user.bagPokemon.length; i++) {
                var current_pokemon_data = this.user.bagPokemon[i].inventory_item_data.pokemon_data;
                if (current_pokemon_data.is_egg) {
                    continue;
                } else {

                    let IVA = current_pokemon_data.individual_attack || 0,
                        IVD = current_pokemon_data.individual_defense || 0,
                        IVS = current_pokemon_data.individual_stamina || 0,
                        IV = ((IVA + IVD + IVS) / 45.0).toFixed(2);

                    pokemons.push({
                        Num: current_pokemon_data.pokemon_id,
                        Image: require('./Utils').pad_with_zeroes(current_pokemon_data.pokemon_id, 3),
                        Name: constants.pokemonArray[current_pokemon_data.pokemon_id - 1].Name,
                        CP: current_pokemon_data.cp,
                        IVA: IVA,
                        IVD: IVD,
                        IVS: IVS,
                        IV: IV,
                        IV: IV,
                        Candy: this.getCandy(current_pokemon_data.pokemon_id),
                    })
                }
            }

            return pokemons
        },
        pokedex: function () {
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

            sortedPokedex.sort(function(a, b) {
                if (a.id < b.id) {
                  return -1;
              } else if (a.id > b.id) {
                  return 1;
              } else {
                  return 0;
              }
            });

            let pokedex = [];
            for (var i = 0; i < sortedPokedex.length; i++) {
                pokedex.push({
                    Num: require('./Utils').pad_with_zeroes(sortedPokedex[i].id, 3),
                    Image: require('./Utils').pad_with_zeroes(sortedPokedex[i].id, 3),
                    Name: constants.pokemonArray[sortedPokedex[i].id - 1].Name,
                    Enc: sortedPokedex[i].enc,
                    Cap: sortedPokedex[i].cap,
                    Candy: this.getCandy(sortedPokedex[i].id)
                })
            }

            return pokedex
        },
        current_user_stats () {
            return this.user.stats[0].inventory_item_data.player_stats;
        },
        current_user_bag_items () {
            return this.user.bagItems;
        }
    },
    ready() {

        $('.modal-trigger').leanModal({
          in_duration: 0, // Transition in duration
          out_duration: 0 // Transition out duration
        });

        setTimeout(function() {
            $('.tabs').tabs();
        }, 1);

    },
    methods: {
        getCandy(p_num) {
            for (var i = 0; i < this.user.bagCandy.length; i++) {
                var checkCandy = this.user.bagCandy[i].inventory_item_data.candy.family_id;
                if (constants.pokemoncandyArray[p_num] === checkCandy) {
                    return (this.user.bagCandy[i].inventory_item_data.candy.candy || 0);
                }
            }
        }
    }
}

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

}
</script>
