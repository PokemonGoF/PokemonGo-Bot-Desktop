<template>
    <div id="map-container">
        <div id="map"></div>
    </div>
</template>

<script>

    const constants = require('./const.js'),
          utils     = require('./Utils.js'),
          path      = require('path'),
          botPath   = require('electron').remote.getGlobal('botPath'),
          fs        = require('fs-extra');


    export default {
        props:   {
            user:     {
                twoWay: true
            },
            userInfo: {
                twoWay: true
            }
        },
        ready() {
            this.forts = [];

            // Callback for google maps
            window['mapCallback'] = () => this.init();

            if (document.getElementById("INSERTED_GOOGLE_MAPS") == null) {
                const src   = "https://maps.googleapis.com/maps/api/js?key=" + this.userInfo.gMapsAPIKey + "&libraries=drawing&callback=mapCallback";
                let element = document.createElement("script");
                element.id  = "INSERTED_GOOGLE_MAPS";
                element.src = src;
                document.body.appendChild(element);
                console.log("[ MAP ] Loaded Google Maps");
            } else {
                this.init()
            }
        },
        events:  {
            'position_update': function (data) {
                let lat = data.current_position[0],
                    lng = data.current_position[1];

                if (this.user.pathcoords[this.user.pathcoords.length] > 1) {
                    var tempcoords = [{
                        lat: parseFloat(lat),
                        lng: parseFloat(lng)
                    }];
                    if (tempcoords.lat != this.user.pathcoords[this.user.pathcoords.length - 1].lat && tempcoords.lng != this.user.pathcoords[this.user.pathcoords.length - 1].lng || this.user.pathcoords.length === 1) {
                        this.user.pathcoords.push({
                            lat: parseFloat(lat),
                            lng: parseFloat(lng)
                        })
                    }
                } else {
                    this.user.pathcoords.push({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng)
                    })
                }

                if (this.user.hasOwnProperty('marker') === false) {
                    constants.randomSex = Math.round(Math.random());
                    this.user.marker    = new google.maps.Marker({
                        map:      this.map,
                        position: {
                            lat: parseFloat(lat),
                            lng: parseFloat(lng)
                        },
                        icon:     path.join('/assets/image/trainer/' + constants.trainerSex[constants.randomSex] + Math.floor(Math.random() * constants.numTrainers[constants.randomSex]) + '.png'),
                        zIndex:   2,
                        label:    this.user.name
                    });
                } else {
                    this.user.marker.setPosition({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng)
                    });

                    if (this.user.pathcoords.length === 2) {
                        this.user.trainerPath = new google.maps.Polyline({
                            map:           this.map,
                            path:          this.user.pathcoords,
                            geodisc:       true,
                            strokeColor:   '#FF0000',
                            strokeOpacity: 0.7,
                            strokeWeight:  2
                        });
                    } else {
                        this.user.trainerPath.setPath(this.user.pathcoords);
                    }
                }

                if (this.userInfo.users.length === 1 && this.userInfo.userZoom === true) {
                    this.map.setZoom(16);
                }

                if (this.userInfo.users.length === 1 && this.userInfo.userFollow === true) {
                    this.map.panTo({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng)
                    });
                }

                return true;
            },
        },
        methods: {
            init() {
                if (!this.map) {
                    this.map = new google.maps.Map(document.getElementById('map'), {
                        center: {
                            lat: 37.0902,
                            lng: -95.7129
                        },
                        zoom:   3
                    });
                }

                this.updateMarkers()
            },
            updateMarkers() {

                setInterval(() => {
                    let catchableFile = path.join(botPath, '/web/catchable-' + this.userInfo.users[0] + '.json')
                    if (fs.existsSync(catchableFile)) {
                        try {
                            this.placeCatchable(fs.readJSONSync(catchableFile));
                        } catch (err) {
                        }
                    }
                }, 1000);

                setInterval(() => {
                    let locationFile = path.join(botPath, '/web/location-' + this.userInfo.users[0] + '.json')
                    if (fs.existsSync(locationFile)) {
                        try {
                            this.placeTrainer(fs.readJSONSync(locationFile));
                        } catch (err) {
                        }
                    }
                }, 5000);

            },
            placeCatchable(data) {
                if (data !== undefined && Object.keys(data).length > 0) {
                    if (this.user.catchables === undefined) {
                        this.user.catchables = {};
                    }
                    if (data.latitude !== undefined) {
                        if (this.user.catchables.hasOwnProperty(data.spawnpoint_id) === false) {
                            let poke_name                            = constants.pokemonArray[data.pokemon_id - 1].Name;
                            this.user.catchables[data.spawnpoint_id] = new google.maps.Marker({
                                map:       this.map,
                                position:  {
                                    lat: parseFloat(data.latitude),
                                    lng: parseFloat(data.longitude)
                                },
                                icon:      path.join('assets/image/pokemon/' + utils.pad_with_zeroes(data.pokemon_id, 3) + this.userInfo.imageExt),
                                zIndex:    4,
                                optimized: false
                            });
                            if (this.userInfo.userZoom === true) {
                                googleMap.map.setZoom(16);
                            }
                            if (this.userInfo.userFollow === true) {
                                this.map.panTo({
                                    lat: parseFloat(data.latitude),
                                    lng: parseFloat(data.longitude)
                                });
                            }
                        } else {
                            this.user.catchables[data.spawnpoint_id].setPosition({
                                lat: parseFloat(data.latitude),
                                lng: parseFloat(data.longitude)
                            });
                            this.user.catchables[data.spawnpoint_id].setIcon(path.join('/assets/image/pokemon/' + utils.pad_with_zeroes(data.pokemon_id, 3) + this.userInfo.imageExt));
                        }
                    }
                } else {
                    if (this.user.catchables !== undefined && Object.keys(this.user.catchables).length > 0) {
                        for (var key in this.user.catchables) {
                            this.user.catchables[key].setMap(null);
                        }
                        this.user.catchables = undefined;
                    }
                }
            },

            placeTrainer(data) {
                let info_windows = {}
                for (var i = 0; i < data.cells.length; i++) {
                    let cell = data.cells[i];
                    if (data.cells[i].forts != undefined) {
                        for (var x = 0; x < data.cells[i].forts.length; x++) {
                            var fort = cell.forts[x];
                            if (!this.forts[fort.id]) {
                                if (fort.type === 1) {
                                    this.forts[fort.id] = new google.maps.Marker({
                                        map:      this.map,
                                        position: {
                                            lat: parseFloat(fort.latitude),
                                            lng: parseFloat(fort.longitude)
                                        },
                                        icon:     path.join('/assets/image/forts/img_pokestop.png')
                                    });
                                } else {
                                    this.forts[fort.id] = new google.maps.Marker({
                                        map:      this.map,
                                        position: {
                                            lat: parseFloat(fort.latitude),
                                            lng: parseFloat(fort.longitude)
                                        },
                                        icon:     path.join('/assets/image/forts/' + constants.teams[fort.owned_by_team] + '.png')
                                    });
                                }
                                let fortPoints   = '';
                                let fortTeam     = '';
                                let fortType     = 'PokeStop';
                                let pokemonGuard = '';
                                if (fort.guard_pokemon_id != undefined) {
                                    fortPoints   = 'Points: ' + fort.gym_points;
                                    fortTeam     = 'Team: ' + constants.teams[fort.owned_by_team] + '<br>';
                                    fortType     = 'Gym';
                                    pokemonGuard = 'Guard Pokemon: ' + constants.pokemonArray[fort.guard_pokemon_id - 1].Name + '<br>';
                                }
                                var contentString     = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + pokemonGuard + fortPoints;
                                info_windows[fort.id] = new google.maps.InfoWindow({
                                    content: contentString
                                });
                                google.maps.event.addListener(this.forts[fort.id], 'click', (function (marker, content, infowindow) {
                                    return function () {
                                        infowindow.setContent(content);
                                        infowindow.open(map, marker);
                                    };
                                })(this.forts[fort.id], contentString, info_windows[fort.id]));
                            }
                        }
                    }
                }

            }

        }
    }
</script>

<style lang="scss">
    #map-container {
        height: 100%;
        padding: 0;
        width: calc(100vw - 300px);
        float: left;
    }

    #map {
        width: 100%;
        height: 100%;
    }
</style>
