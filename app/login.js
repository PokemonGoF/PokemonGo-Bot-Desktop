    var fs = require('fs');
    var url = require('url');
    var request = require('request');
    var querystring = require('querystring');
    var electron = require('electron').remote;
    var BrowserWindow = electron.BrowserWindow;
    var ipcRenderer = require('electron').ipcRenderer;
    var shell = require('electron').shell;

    var ptcJar = request.jar();
    var ptcReq = request.defaults({
        headers: {'User-Agent': 'niantic'},
        jar: ptcJar
    });

    var geoLocation = "34.0432108, -118.2675059";

    $( document ).ready(function(){
        // Show version
        $('#version').html('Version ' + electron.app.getVersion());
        // Get checkbox state
        [
            'remember'
        ].forEach(function(elem){
            if (localStorage.getItem(elem)) {
                document.getElementById(elem).checked = (
                    localStorage.getItem(elem) == "true");
            }
            $('#' + elem).change(function() {
                localStorage.setItem(elem, !!this.checked);
            });
        });

        if (checked('remember')) {
            setupValue('ptc_username', $('#ptc_username'));
            setupValue('ptc_password', $('#ptc_password'));
            setupValue('google_username', $('#google_username'));
            setupValue('google_password', $('#google_password'));
            //Open login section if we have saved username
            if (localStorage.getItem('ptc_username')) {
                $('.collapsible li:eq(1) .collapsible-header').click();
            }else if(localStorage.getItem('google_username')) {
                $('.collapsible li:eq(0) .collapsible-header').click();
            }
        }
        setupValue('google_maps_api', $('#google_maps_api'));
        setupValue('walk_speed', $('#walk_speed'));
        setupValue('last_location', $('#location'));
    });

    function setupValue(key, elem) {
        if (localStorage.getItem(key)) {
            elem.val(localStorage.getItem(key));
        }
    }

    function setupValueAndSetter(key, elem) {
        setupValue(key, elem);
        elem.change(function() {
            localStorage.setItem(key, elem.val());
        });
    }

    function checked(elemId) {
        return document.getElementById(elemId).checked;
    }

    function saveState() {
        if (checked('remember')) {
            localStorage.setItem("ptc_username", $('#ptc_username').val());
            localStorage.setItem("ptc_password", $('#ptc_password').val());
            localStorage.setItem("google_username", $('#google_username').val());
            localStorage.setItem("google_password", $('#google_password').val());
        }
        localStorage.setItem("last_location", $('#location').val());
        localStorage.setItem("google_maps_api", $('#google_maps_api').val());
        localStorage.setItem("walk_speed", $('#walk_speed').val());

    }

    navigator.geolocation.getCurrentPosition(function success(position) {
        geoLat = position.coords.latitude;
        geoLon = position.coords.longitude;
        $('#location').prop('placeholder', ''+geoLat+', '+geoLon);
        console.log("Got location: " + geoLat + ", " + geoLon);
    }, function error(err) {
        console.log("Error getting location, trying second provider", err);
        $.getJSON("http://ipinfo.io", function(ipinfo){
            console.log("Found location ["+ipinfo.loc+"] by ipinfo.io");
            var latLong = ipinfo.loc.split(",");
            geoLat = latLong[0];
            geoLon = latLong[1];
            $('#location').prop('placeholder', ''+geoLat+', '+geoLon);
        });
    });

    ipcRenderer.on('pythonLog', function(evt, data) {
        console.log(data.msg);
    });

    ipcRenderer.on('appLog', function(evt, data) {
        console.log(data.msg);
    });

    function toggleLogin(disabled) {
        saveState();
        jQuery('.login').prop("disabled", disabled);
    }


    function doGoogleLogin() {
        toggleLogin(true);
        var username = jQuery('#google_username').val(),
            password = jQuery('#google_password').val();

        // Reset cookie jar
        ptcJar = request.jar();

        completeLogin('google', '');

        return false;
    }

    function doPTCLogin() {
        toggleLogin(true);
        jQuery('#ptc_errors').html('');
        var username = jQuery('#ptc_username').val(),
            password = jQuery('#ptc_password').val();

        // Reset cookie jar
        ptcJar = request.jar();

        // Get Login session from SSO servers
        ptcReq.get('https://sso.pokemon.com/sso/login?service=https%3A%2F%2Fsso.pokemon.com%2Fsso%2Foauth2.0%2FcallbackAuthorize',
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                doPTCLoginStep2(username, password, JSON.parse(body));
            } else {
                console.log(error);
                toggleLogin(false);
                alert('Oops! Something went wrong and we couldn\'t ' +
                    'log you in. Please try again. Code 6.');
            }
        });

        return false;
    }

    function doPTCLoginStep2(user, pass, session) {
        var loginData = {
            'lt': session.lt,
            'execution': session.execution,
            '_eventId': 'submit',
            'username': user,
            'password': pass
        };

        ptcReq.post(
                'https://sso.pokemon.com/sso/login?service=https%3A%2F%2Fsso.pokemon.com%2Fsso%2Foauth2.0%2FcallbackAuthorize',
                {form: loginData},
                function (error, response, body) {
                    if (!error && response.statusCode == 302) {
                        var rawRedirect = response.headers.location;
                        handlePokemonCallback(rawRedirect);
                    } else {
                        toggleLogin(false);
                        var errors = null;
                        try {
                            errors = JSON.parse(body).errors;
                            errors = errors.join(' ');
                        } catch(e) {}
                        if (errors) {
                            jQuery('#ptc_errors').html(errors);
                        } else {
                            alert('Oops! Something went wrong and we couldn\'t ' +
                                'log you in. Please try again. Code 7.');
                        }
                    }
                }
            );
    }

    function handlePokemonCallback(newUrl) {

      // Login by passing in password to prevent timeouts
      completeLogin('ptc', '');

    }

    function completeLogin(auth, code) {
        var userLocation = $('#location').val();
        if (userLocation != '') {
            geoLocation = userLocation;
        };

        ipcRenderer.send('startPython', auth, code, geoLocation, {
            google_maps_api: $('#google_maps_api').val(),
            walk_speed: $('#walk_speed').val(),
            ptc_username: $('#ptc_username').val(),
            ptc_password: $('#ptc_password').val(),
            mode: $("input[name='mode']:checked").val(),
            google_username: $('#google_username').val(),
            google_password: $('#google_password').val()
        });
    }

    function openURL(url) {
        shell.openExternal(url);
    }