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
        <small id="version"></small>
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
                                            onclick="doGoogleLogin()">Login with Google
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
                                            onclick="doPTCLogin()">Login with PTC
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
                                <div id="selectEncryptionFileDiv">
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
                                <div id="encryptionFileExistsDiv">
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
    <div class="container">
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
            <a v-on:click="debug()" class="waves-effect waves-light blue btn col s2">Debug</a>
        </div>
        <div class="row">
            <textarea class="" style="height: 100px; background-color: white;" v-model="debug_log"></textarea>
        </div>
    </div>
</template>

<script>
    import LandingPage from './components/LandingPageView'
    const fs = require('fs-extra'),
            url = require('url'),
            request = require('request'),
            querystring = require('querystring'),
            electron = require('electron').remote,
            BrowserWindow = electron.BrowserWindow,
            ipcRenderer = require('electron').ipcRenderer,
            shell = require('electron').shell,
            remote = require('electron').remote,
            dialog = require('electron').remote.dialog,
            path = require('path'),
            os = require('os'),
            appRoot = path.basename('./');

    export default {
        data() {
            return {
                debug_log : '',
                debug_dir : '',
                dirname: false,
            }
        },
        ready() {
            let self = this;

            self.checkForEncryptionFile();
        },
        methods: {
            checkForEncryptionFile: function () {
                let self = this,
                        platform = os.platform(),
                        fileName = platform == 'win32' ? 'encrypt.dll' : 'encrypt.so';
                fs.access('gofbot/' + fileName, fs.constants.R_OK, (err) => {
                    console.log(err);
                    if (err === null) {
                        //No error, file exists and is readable.
                        $('#selectEncryptionFileDiv').hide();
                        $('#encryptionFileExistsDiv').show();
                    }
                    else {
                        //File doesn't exists, let the user select it.
                        $('#selectEncryptionFileDiv').show();
                        $('#encryptionFileExistsDiv').hide();
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
                    self.checkForEncryptionFile();
                });
            },
            debug: function () {
                let self = this,
                        path = self.dirname ? appRoot + self.debug_dir : self.debug_dir;
                self.debug_log = path + '\n';
                self.debug_log += fs.readdirSync(path);
            }
        },
        components: {
        }
    }
</script>
