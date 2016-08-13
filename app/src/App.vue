<style lang="scss">
    h1 {
        margin: 0;
    }

    h4 {
        color: white;
    }

    body {
        background-color: #3E2723;
    }

    p {
        font-size: 0.7em;
        opacity: 0.7;
    }

    #options > div {
        min-height: 130px;
    }

    #logo {
        height: 50px;
    }

    .hide {
        display: none;
    }

    .btn {
        background: #FFEB3B;
        color: #000;
        width: 100%;
        font-size: 1.2vw;
        &:hover {
            background: #FDD835;
        }
    }

    #mode-radio {
        border-bottom: .5px solid #9e9e9e;
        margin-top: 15px;
        padding-bottom: 11px;
        margin-bottom: 0px;
    }

    .select-dropdown {
        color: #d1d1d1;
    }

    #options > div > div {
        margin-bottom: 0px;
        > div > input {
            margin-bottom: 0px;
        }
    }

    .switch {
        label input[type=checkbox]:checked + .lever {
            background-color: #f0de23;
            &:after {
                background-color: #d7c60f;
            }
        }
        float: right;
        p {
            font-size: 12px;
            color: #fff;
            margin: 0;
            margin-bottom: -12px;
            line-height: 12px;
        }
    }

    .collapsible-body {
        background-color: #fff;
        padding: 1.2em;
    }

    .login-topbar {
        padding: 1em;
        color: white;
    }

    #options {
        padding: 0.7em;
        margin: 0;
    }

    .login-footer {
        padding: 20px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        a {
            padding: 10px;
            color: white;
            font-size: 12px;
        }
    }

    #encryptionFileExistsDiv {
        display: none;
    }
</style>

<template>
    <div class="login-topbar center">
        <h1>
            <img id="logo" src="./assets/logo.png">
            PikaBot
        </h1>
        <small>{{version}}</small>
    </div>
    <div class="row">
        <div class="col s10 offset-s1">

            <br>
            <div class="row">
                <div class="col s4">
                    <h4>Login</h4>
                    <ul class="collapsible" data-collapsible="accordion">
                        <li>
                            <div class="collapsible-header">Google</div>
                            <div class="collapsible-body">
                                <form id="google_form" onsubmit="doGoogleLogin()">
                                    <input id="google_username" class="form-control" type="text"
                                           placeholder="Username" required>
                                    <input id="google_password" class="form-control" type="password"
                                           placeholder="Password" required>
                                    <button class="btn login"
                                            v-on:click="doGoogleLogin()">Login with Google
                                    </button>
                                </form>
                            </div>
                        </li>
                        <li>
                            <div class="collapsible-header">PTC</div>
                            <div class="collapsible-body">
                                <form id="ptc_form" onsubmit="doPTCLogin()">
                                    <input id="ptc_username" class="form-control" type="text"
                                           placeholder="Username" required>
                                    <input id="ptc_password" class="form-control" type="password"
                                           placeholder="Password" required>
                                    <button class="btn login"
                                            v-on:click="doPTCLogin()">Login with PTC
                                    </button>
                                </form>
                            </div>
                        </li>
                    </ul>

                    <br>
                    <span id="ptc_errors" style="color: #f00"></span>
                    <br>
                </div>
                <div class="col s8">
                    <div class="row">
                        <h4>Options
                            <div class="switch">
                                <p>Remember Info</p>
                                <label>
                                    Off
                                    <input id="remember" checked type="checkbox">
                                    <span class="lever"></span>
                                    On
                                </label>

                            </div>
                        </h4>
                        <div id="options" class="card col s12">
                            <div class="col s6">
                                <h6>Location</h6>
                                <div class="row">
                                    <div class="">
                                        <input id="location" class="form-control"
                                               type="text" placeholder="Location">
                                    </div>
                                </div>
                                <div class="row">
                                    <p>
                                        Set to override, leave blank to use Geolocation
                                    </p>
                                </div>
                            </div>
                            <div class="col s6">
                                <h6>Google Maps API</h6>
                                <div class="row">
                                    <div class="">
                                        <input id="google_maps_api" class="form-control"
                                               type="text" placeholder="Google Maps API">
                                    </div>
                                </div>
                                <div class="row">
                                    <p>
                                        Insert your personal Google Maps API key
                                    </p>
                                </div>
                            </div>
                            <div class="col s6">
                                <h6>Walk Speed</h6>
                                <div class="row">
                                    <div class="">
                                        <input id="walk_speed" class="form-control"
                                               type="text" placeholder="Walk Speed (m/s)">
                                    </div>
                                </div>
                                <div class="row">
                                    <p>
                                        Larger numbers mean faster walking
                                    </p>
                                </div>
                            </div>
                            <div class="col s6">
                                <h6>Encrypt File</h6>
                                <div v-bind:class="[{hide : encryptionFilePresent}]">
                                    <div class="row">
                                        <div class="">
                                            <a v-on:click="openFile()" class="waves-effect waves-light btn">Select</a>
                                            <p id="file_path"></p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <p>
                                            Choose encrypt file.
                                        </p>
                                    </div>
                                </div>
                                <div v-bind:class="[{hide : !encryptionFilePresent}]">
                                    <div class="row">
                                        <p>
                                            Encryption file is present. <span class="green-text">✓</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container" v-bind:class="[{hide : !debug}]">
        <div class="row">
            <div class="col s2">
                <div class="switch">
                    <p>{{dirname}}</p>
                    <label>
                        Off
                        <input checked type="checkbox" v-model="dirname">
                        <span class="lever"></span>
                        On
                    </label>
                </div>
            </div>
            <input class="col s4" type="text" v-model="debug_dir">
            <a v-on:click="debug(1)" class="waves-effect waves-light blue btn col s1">Debug</a>
            <a v-on:click="debug(2)" class="waves-effect waves-light blue btn col s1">Debug 2</a>
            <a v-on:click="debug(3)" class="waves-effect waves-light blue btn col s1">Debug 3</a>
            <a v-on:click="debug(4)" class="waves-effect waves-light blue btn col s1">Debug 4</a>
        </div>
        <div class="row">
            <textarea class="" style="height: 100px; background-color: white;" v-model="debug_log"></textarea>
        </div>
    </div>
</template>

<script>
    import LandingPage from './components/LandingPageView'
    const fs            = require('fs-extra'),
          url           = require('url'),
          request       = require('request'),
          querystring   = require('querystring'),
          electron      = require('electron').remote,
          BrowserWindow = electron.BrowserWindow,
          ipcRenderer   = require('electron').ipcRenderer,
          shell         = require('electron').shell,
          remote        = require('electron').remote,
          dialog        = require('electron').remote.dialog,
          path          = require('path'),
          os            = require('os'),
          process       = require('process'),
          //            appRoot = path.join(process.cwd(), '/');
          appRoot       = electron.getGlobal('appRoot');

    export default {
        data() {
            return {
                debug: true,
                debug_log: '',
                debug_dir: '',
                dirname: false,
                // Show version
                version: electron.app.getVersion(),
                encryptionFilePresent: false,
                ptcReq: request.defaults({
                    headers: {'User-Agent': 'niantic'},
                    jar: request.jar()
                }),
                geoLocation: "34.0432108, -118.2675059",
            }
        },
        ready() {
            let self = this;
            // Get checkbox state
            ['remember'].forEach(function (elem) {
                if (localStorage.getItem(elem)) {
                    document.getElementById(elem).checked = (
                    localStorage.getItem(elem) == "true");
                }
                $('#' + elem).change(function () {
                    localStorage.setItem(elem, !!this.checked);
                });
            });

            if (checked('remember')) {
                self.setupValue('ptc_username', $('#ptc_username'));
                self.setupValue('ptc_password', $('#ptc_password'));
                self.setupValue('google_username', $('#google_username'));
                self.setupValue('google_password', $('#google_password'));
                //Open login section if we have saved username
                if (localStorage.getItem('ptc_username')) {
                    $('.collapsible li:eq(1) .collapsible-header').click();
                } else if (localStorage.getItem('google_username')) {
                    $('.collapsible li:eq(0) .collapsible-header').click();
                }
            }
            self.setupValue('google_maps_api', $('#google_maps_api'));
            self.setupValue('walk_speed', $('#walk_speed'));
            self.setupValue('last_location', $('#location'));

            self.checkForEncryptionFile();
        },
        methods: {
            checkForEncryptionFile: function () {
                let self     = this,
                    platform = os.platform(),
                    fileName = platform == 'win32' ? 'encrypt.dll' : 'encrypt.so';
                fs.access('gofbot/' + fileName, fs.constants.R_OK, (err) => {
                    console.log(err);
                    if (err === null) {
                        //No error, file exists and is readable.
                        self.encryptionFilePresent = true;
                    }
                    else {
                        //File doesn't exists, let the user select it.
                        self.encryptionFilePresent = false;
                    }
                });
            },
            openFile: function () {
                let self = this,
                    path = self.dirname ? appRoot + self.debug_dir : self.debug_dir;
                dialog.showOpenDialog(function (fileNames) {
                    fs.copySync((fileNames[0]), path.join(path + fileNames[0].match(/\.\w+/)[0]));
                    let file_end = fileNames[0];
                    $('#file_path').val(fileNames[0]);
                });
                self.checkForEncryptionFile();
            },
            setupValue: function (key, elem) {
                if (localStorage.getItem(key)) {
                    elem.val(localStorage.getItem(key));
                }
            },
            setupValueAndSetter: function (key, elem) {
                self.setupValue(key, elem);
                elem.change(function () {
                    localStorage.setItem(key, elem.val());
                });
            },
            checked: function (elemId) {
                return document.getElementById(elemId).checked;
            },
            saveState: function () {
                if (checked('remember')) {
                    localStorage.setItem("ptc_username", $('#ptc_username').val());
                    localStorage.setItem("ptc_password", $('#ptc_password').val());
                    localStorage.setItem("google_username", $('#google_username').val());
                    localStorage.setItem("google_password", $('#google_password').val());
                }
                localStorage.setItem("last_location", $('#location').val());
                localStorage.setItem("google_maps_api", $('#google_maps_api').val());
                localStorage.setItem("walk_speed", $('#walk_speed').val());
            },
            toggleLogin: function (disabled) {
                self.saveState();
                jQuery('.login').prop("disabled", disabled);
            },

            doGoogleLogin: function (event) {
                event.preventDefault();
                self.toggleLogin(true);
                let username = jQuery('#google_username').val(),
                    password = jQuery('#google_password').val();

                // Reset cookie jar
                self.ptcJar = request.jar();

                self.completeLogin('google', '');

                return false;
            },
            doPTCLogin: function (event) {
                event.preventDefault();
                self.toggleLogin(true);
                jQuery('#ptc_errors').html('');
                let username    = jQuery('#ptc_username').val(),
                    password    = jQuery('#ptc_password').val();
                // Reset cookie jar
                self.ptcReq.jar = request.jar();

                // Get Login session from SSO servers
                self.ptcReq.get('https://sso.pokemon.com/sso/login?service=https%3A%2F%2Fsso.pokemon.com%2Fsso%2Foauth2.0%2FcallbackAuthorize',
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                self.doPTCLoginStep2(username, password, JSON.parse(body));
                            } else {
                                console.log(error);
                                self.toggleLogin(false);
                                alert('Oops! Something went wrong and we couldn\'t ' +
                                        'log you in. Please try again. Code 6.');
                            }
                        });

                return false;
            },
            doPTCLoginStep2: function (user, pass, session) {
                let loginData = {
                    'lt': session.lt,
                    'execution': session.execution,
                    '_eventId': 'submit',
                    'username': user,
                    'password': pass
                };

                self.ptcReq.post(
                        'https://sso.pokemon.com/sso/login?service=https%3A%2F%2Fsso.pokemon.com%2Fsso%2Foauth2.0%2FcallbackAuthorize', {
                            form: loginData
                        },
                        function (error, response, body) {
                            if (!error && response.statusCode == 302) {
                                let rawRedirect = response.headers.location;
                                self.handlePokemonCallback(rawRedirect);
                            } else {
                                self.toggleLogin(false);
                                let errors = null;
                                try {
                                    errors = JSON.parse(body).errors;
                                    errors = errors.join(' ');
                                } catch (e) {
                                }
                                if (errors) {
                                    jQuery('#ptc_errors').html(errors);
                                } else {
                                    alert('Oops! Something went wrong and we couldn\'t ' +
                                            'log you in. Please try again. Code 7.');
                                }
                            }
                        }
                );
            },
            handlePokemonCallback: function (newUrl) {
                // Login by passing in password to prevent timeouts
                self.completeLogin('ptc', '');
            },
            completeLogin: function (auth, code) {
                let userLocation = $('#location').val();
                if (userLocation != '') {
                    self.geoLocation = userLocation;
                }

                ipcRenderer.send('startPython', auth, code, geoLocation, {
                    google_maps_api: $('#google_maps_api').val(),
                    walk_speed: $('#walk_speed').val(),
                    ptc_username: $('#ptc_username').val(),
                    ptc_password: $('#ptc_password').val(),
                    mode: $("input[name='mode']:checked").val(),
                    google_username: $('#google_username').val(),
                    google_password: $('#google_password').val()
                });
            },
            openURL: function (url) {
                shell.openExternal(url);
            },
            debug: function (n) {
                let self = this,
                    path = self.dirname ? appRoot + self.debug_dir : self.debug_dir;
                switch (n) {
                    case 1:
                        self.debug_log = path + '\n';
                        self.debug_log += fs.readdirSync(path);
                        break;
                    case 2:
                        self.debug_log = '';
                        self.debug_log = __dirname + __filename;
                        break;
                    case 3:
                        self.debug_log = '';
                        self.debug_log = appRoot;
                        break;
                    case 4:
                        self.debug_log = path + '\n';
                        self.debug_log += process.cwd();
                        break;
                }
            }
        },
        components: {}
    }
</script>
