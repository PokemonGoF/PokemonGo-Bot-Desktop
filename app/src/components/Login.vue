<template>
    <div class="login-topbar center">
        <h1>
            <img id="logo" src="../assets/image/icons/logo.png">
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
                    <ul class="" data-collapsible="accordion">
                        <li>
                            <div class="collapsible-header" id="google-login-title" @click="showLogin = 'google'">
                                Google
                            </div>
                            <div class="collapsible-body" v-show="showLogin == 'google'">
                                <form id="google_form" @submit="doGoogleLogin">
                                    <input v-model="credentialsForm.google_username" class="form-control" type="text"
                                           placeholder="Username" required>
                                    <input v-model="credentialsForm.google_password" class="form-control"
                                           type="password"
                                           placeholder="Password" required>
                                    <button type="submit" class="btn login"  :disabled="!validateLoginInputs">
                                        Login with Google
                                    </button>
                                </form>
                            </div>
                        </li>
                        <li>
                            <div class="collapsible-header" id="ptc-login-title" @click="showLogin = 'ptc'">PTC</div>
                            <div class="collapsible-body" v-show="showLogin == 'ptc'">
                                <form id="ptc_form" @submit="doPTCLogin">
                                    <input v-model="credentialsForm.ptc_username" class="form-control" type="text"
                                           placeholder="Username" required>
                                    <input v-model="credentialsForm.ptc_password" class="form-control" type="password"
                                           placeholder="Password" required>
                                    <button type="submit" class="btn login" :disabled="!validateLoginInputs">
                                        Login with PTC
                                    </button>
                                </form>
                            </div>
                        </li>
                    </ul>

                    <br>
                    <span id="ptc_errors" style="color: #f00" v-if="ptc_errors != ''">{{ ptc_errors }}</span>
                    <br>
                </div>
                <div class="col s8">
                    <div class="row">
                        <h4>Options
                            <div class="switch">
                                <p>Remember Info</p>
                                <label>
                                    Off
                                    <input v-model="remember" checked type="checkbox">
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
                                        <input v-model="loginForm.last_location" class="form-control"
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
                                        <input v-model="loginForm.google_maps_api" class="form-control"
                                               type="text" placeholder="Google Maps API" required>
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
                                        <input v-model="loginForm.walk_speed" class="form-control"
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
                                <div :class="[{hide : encryptionFilePresent}]">
                                    <div class="row">
                                        <div class="">
                                            <a @click="openFile" class="waves-effect waves-light btn">Select</a>
                                            <p v-show="!!loginForm.file_path && loginForm.file_path.length > 0">{{
                                                loginForm.file_path }}</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <p>
                                            Choose encrypt file.
                                        </p>
                                    </div>
                                </div>
                                <div :class="[{hide : !encryptionFilePresent}]">
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
</template>

<script>
    const fs       = require('fs-extra'),
          url      = require('url'),
          request  = require('request'),
          electron = require('electron').remote,
          shell    = require('electron').shell,
          dialog   = electron.dialog,
          path     = require('path'),
          os       = require('os'),
          platform = os.platform(),
          appRoot  = electron.getGlobal('appRoot'),
          botPath  = electron.getGlobal('botPath');

    const LoginMode = {
        GOOGLE: 'google',
        PTC: 'ptc'
    };

    export default {
        data() {
            return {
                // Show version
                version: electron.app.getVersion(),
                encryptionFilePresent: false,
                ptcReq: request.defaults({
                    headers: {'User-Agent': 'niantic'},
                    jar: request.jar()
                }),
                remember: true,
                credentialsForm: {
                    ptc_username: null,
                    ptc_password: null,
                    google_username: null,
                    google_password: null
                },
                loginForm: {
                    google_maps_api: null,
                    walk_speed: null,
                    last_location: null,
                    file_path: null
                },
                disableLogin: false,
                showLogin: null,
                ptc_errors: ""
            }
        },
        watch: {
            'remember': (newVal, oldVal) => {
                // if the user doesn't want his informations to be remembers,
                // then clear the credentialsForm from localStorage
                if (newVal == false) {
                    localStorage.setItem("remember", "false");
                    localStorage.setItem('credentialsForm', "{}");
                } else {
                    localStorage.setItem("remember", "true");
                    localStorage.setItem('credentialsForm', JSON.stringify(newVal));
                }
            },
            'credentialsForm': {
                deep: true,
                handler: function (newVal, oldVal) { // using classic function to access `this`
                    let self = this;

                    // if the user wants to remember it's credentials
                    if (self.remember) {
                        localStorage.setItem('credentialsForm', JSON.stringify(newVal));
                    }
                }
            },
            'loginForm': {
                deep: true,
                handler: (newVal, oldVal) => {
                    localStorage.setItem('loginForm', JSON.stringify(newVal));
                }
            }
        },
        ready() {
            let self = this;

            // helper to load data from localStorage to a map
            let _loadDataFromlocalStorage = function (itemName, destination) {
                let loadedData = {};
                try {
                    loadedData = JSON.parse(localStorage.getItem(itemName));
                } catch(err) {}

                for (var idx in loadedData) {
                    destination[idx] = loadedData[idx];
                }
            };

            // if remember doesn't exists (== first launch) OR is true,
            // check the checkbox and load credentialsForm from storage
            let remember = localStorage.getItem('remember');
            if (remember == "true" || remember == null) {
                self.remember = true;
                _loadDataFromlocalStorage('credentialsForm', self.credentialsForm);
            } else {
                self.remember = false;
            }

            // load loginForm from storage
            _loadDataFromlocalStorage('loginForm', self.loginForm);

            if (!!self.credentialsForm.ptc_username) {
                self.showLogin = 'ptc'
            } else {
                self.showLogin = 'google'
            }

            // check for encrypt file
            self.checkForEncryptionFile();
        },
        methods: {
            checkForEncryptionFile: function () {
                let self     = this,
                    fileName = platform == 'win32' ? 'encrypt.dll' : 'encrypt.so';
                fs.access(path.join(botPath, fileName), fs.constants.R_OK, (err) => {
                    if (err === null) {
                        //No error, file exists and is readable.
                        self.encryptionFilePresent = true;
                    } else {
                        //File doesn't exists, let the user select it.
                        self.encryptionFilePresent = false;
                        self.loginForm.file_path   = "";
                    }
                });
            },
            openFile: function () {
                let self = this;

                dialog.showOpenDialog(function (fileNames) {
                    try {
                        fs.copySync(fileNames[0], path.join(botPath, 'encrypt' + fileNames[0].match(/\.\w+/)[0]));
                    } catch (err) {
                    }

                    self.loginForm.file_path = fileNames[0];
                    self.checkForEncryptionFile();
                });
            },
            saveForms: function () {
                let self = this;

                if (self.remember) {
                    localStorage.setItem('credentialsForm', JSON.stringify(self.credentialsForm));
                }
                localStorage.setItem('loginForm', JSON.stringify(self.loginForm));
            },
            doGoogleLogin: function (event) {
                let self = this;

                event.preventDefault();
                self.saveForms();
                self.disableLogin = true;

                // Reset cookie jar
                self.ptcJar = request.jar();

                self.completeLogin(LoginMode.GOOGLE);

                return false;
            },
            doPTCLogin: function (event) {
                let self = this;

                event.preventDefault();
                self.saveForms();
                self.disableLogin = true;
                self.ptc_errors   = "";

                // Reset cookie jar
                self.ptcReq.jar = request.jar();

                // Get Login session from SSO servers
                self.ptcReq.get('https://sso.pokemon.com/sso/login?service=https%3A%2F%2Fsso.pokemon.com%2Fsso%2Foauth2.0%2FcallbackAuthorize',
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                self.doPTCLoginStep2(self.credentialsForm.ptc_username, self.credentialsForm.ptc_password, JSON.parse(body));
                            } else {
                                self.disableLogin = false;
                                alert('Oops! Something went wrong and we couldn\'t ' +
                                        'log you in. Please try again. Code 6.');
                            }
                        });

                return false;
            },
            doPTCLoginStep2: function (user, pass, session) {
                let self = this;

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
                                self.completeLogin(LoginMode.PTC);
                            } else {
                                self.disableLogin = false;
                                let errors        = null;
                                try {
                                    errors = JSON.parse(body).errors;
                                    errors = errors.join(' ');
                                } catch (e) {
                                }
                                if (errors) {
                                    self.ptc_errors = errors;
                                } else {
                                    alert('Oops! Something went wrong and we couldn\'t ' +
                                            'log you in. Please try again. Code 7.');
                                }
                            }
                        }
                );
            },
            completeLogin: function (auth) {
                let self = this;

                let opts = {
                    google_maps_api: self.loginForm.google_maps_api,
                    walk_speed: self.loginForm.walk_speed,
                    ptc_username: self.credentialsForm.ptc_username,
                    ptc_password: self.credentialsForm.ptc_password,
                    google_username: self.credentialsForm.google_username,
                    google_password: self.credentialsForm.google_password,
                    mode: false
                };

                self.$dispatch('login', {
                    auth: auth,
                    code: '',
                    location: self.loginForm.last_location,
                    options: opts
                })
            },
            openURL: function (url) {
                shell.openExternal(url);
            }
        },
        computed: {
            validateLoginInputs: function () {
                let self = this;
                if (self.disableLogin === true) {
                    return false;
                }
                else {
                    return self.encryptionFilePresent && self.loginForm.google_maps_api !== "";
                }
            }
        },
        components: {}
    }
</script>

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
        display: block;
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
