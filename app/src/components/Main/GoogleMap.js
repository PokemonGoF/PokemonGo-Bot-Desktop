const constants = require('./const.js');
const utils = require('./Utils.js');

class GoogleMap {
    constructor(userInfo, user) {
        this.userInfo = userInfo;
        this.user = user;
        this.forts = [];
        const src = "https://maps.googleapis.com/maps/api/js?key=" + userInfo.gMapsAPIKey + "&libraries=drawing&callback=mapCallback";
        let element = document.createElement("script");
        element.src = src;
        document.body.appendChild(element);
        console.log("[ MAP ] Loaded Google Maps");
    }

    init() {
        if (this.map) {
            return;
        }
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 37.0902,
                lng: -95.7129
            },
            zoom: 3
        });

        document.getElementById('switchPan').checked = this.userInfo.userFollow;
        document.getElementById('switchZoom').checked = this.userInfo.userZoom;
        document.getElementById('imageType').checked = (this.userInfo.imageExt != '.png');
        document.getElementById('strokeOn').checked = true;

        setTimeout(() => {
            this.updateMarkers();
            setTimeout(() => {
                setInterval(this.updateMarkers.bind(this), 1000);
            }, 100);
        }, 1000);
    }

    updateMarkers() {
        // Clearing cache
        Object.keys(require.cache).forEach(function(key) {
            delete require.cache[key]
        })
        this.placeCatchable(require(path.join(appRoot, 'gofbot/web/catchable-' + this.userInfo.users[0] + '.json')));
        this.placeTrainer(require(path.join(appRoot, 'web/location-' + this.userInfo.users[0] + '.json')));
        // Update side menu data
        document.getElementById('username').innerHTML = this.user.name;
        document.getElementById('level').innerHTML = "Level " + this.user.stats[0].inventory_item_data.player_stats.level;
    }

    placeCatchable(data) {
        if (data !== undefined && Object.keys(data).length > 0) {
            if (this.user.catchables === undefined) {
                this.user.catchables = {};
            }
            if (data.latitude !== undefined) {
                if (this.user.catchables.hasOwnProperty(data.spawnpoint_id) === false) {
                    let poke_name = constants.pokemonArray[data.pokemon_id - 1].Name;
                    this.user.catchables[data.spawnpoint_id] = new google.maps.Marker({
                        map: this.map,
                        position: {
                            lat: parseFloat(data.latitude),
                            lng: parseFloat(data.longitude)
                        },
                        icon: path.join(appRoot, 'assets/image/pokemon/' + utils.pad_with_zeroes(data.pokemon_id, 3) + userInfo.imageExt),
                        zIndex: 4,
                        optimized: false
                    });
                    if (userInfo.userZoom === true) {
                        googleMap.map.setZoom(16);
                    }
                    if (userInfo.userFollow === true) {
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
                    this.user.catchables[data.spawnpoint_id].setIcon(path.join(appRoot, 'assets/image/pokemon/' + utils.pad_with_zeroes(data.pokemon_id, 3) + userInfo.imageExt));
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
    }

    placeTrainer(data) {
        for (var i = 0; i < data.cells.length; i++) {
            let cell = data.cells[i];
            if (data.cells[i].forts != undefined) {
                for (var x = 0; x < data.cells[i].forts.length; x++) {
                    var fort = cell.forts[x];
                    if (!this.forts[fort.id]) {
                        if (fort.type === 1) {
                            this.forts[fort.id] = new google.maps.Marker({
                                map: this.map,
                                position: {
                                    lat: parseFloat(fort.latitude),
                                    lng: parseFloat(fort.longitude)
                                },
                                icon: path.join(appRoot, 'assets/image/forts/img_pokestop.png')
                            });
                        } else {
                            this.forts[fort.id] = new google.maps.Marker({
                                map: this.map,
                                position: {
                                    lat: parseFloat(fort.latitude),
                                    lng: parseFloat(fort.longitude)
                                },
                                icon: path.join(appRoot, 'assets/image/forts/' + constants.teams[fort.owned_by_team] + '.png')
                            });
                        }
                        let fortPoints = '';
                        let fortTeam = '';
                        let fortType = 'PokeStop';
                        let pokemonGuard = '';
                        if (fort.guard_pokemon_id != undefined) {
                            fortPoints = 'Points: ' + fort.gym_points;
                            fortTeam = 'Team: ' + constants.teams[fort.owned_by_team] + '<br>';
                            fortType = 'Gym';
                            pokemonGuard = 'Guard Pokemon: ' + constants.pokemonArray[fort.guard_pokemon_id - 1].Name + '<br>';
                        }
                        var contentString = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + pokemonGuard + fortPoints;
                        info_windows[fort.id] = new google.maps.InfoWindow({
                            content: contentString
                        });
                        google.maps.event.addListener(this.forts[fort.id], 'click', (function(marker, content, infowindow) {
                            return function() {
                                infowindow.setContent(content);
                                infowindow.open(map, marker);
                            };
                        })(this.forts[fort.id], contentString, info_windows[fort.id]));
                    }
                }
            }
        }
        if (this.user.pathcoords[this.user.pathcoords.length] > 1) {
            var tempcoords = [{
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            }];
            if (tempcoords.lat != this.user.pathcoords[this.user.pathcoords.length - 1].lat && tempcoords.lng != this.user.pathcoords[this.user.pathcoords.length - 1].lng || this.user.pathcoords.length === 1) {
                this.user.pathcoords.push({
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                })
            }
        } else {
            this.user.pathcoords.push({
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            })
        }
        if (this.user.hasOwnProperty('marker') === false) {
            constants.randomSex = Math.round(Math.random());
            this.user.marker = new google.maps.Marker({
                map: this.map,
                position: {
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                },
                icon: path.join(appRoot, 'assets/image/trainer/' + constants.trainerSex[constants.randomSex] + Math.floor(Math.random() * constants.numTrainers[constants.randomSex]) + '.png'),
                zIndex: 2,
                label: this.user.name
            });
        } else {
            this.user.marker.setPosition({
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            });
            if (this.user.pathcoords.length === 2) {
                this.user.trainerPath = new google.maps.Polyline({
                    map: this.map,
                    path: user.pathcoords,
                    geodisc: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.7,
                    strokeWeight: 2
                });
            } else {
                this.user.trainerPath.setPath(this.user.pathcoords);
            }
        }
        if (userInfo.users.length === 1 && userInfo.userZoom === true) {
            this.map.setZoom(16);
        }
        if (userInfo.users.length === 1 && userInfo.userFollow === true) {
            this.map.panTo({
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            });
        }
    }
}

module.exports = GoogleMap;
