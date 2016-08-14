<template>

<!-- Options Dropdown -->
<ul id='options' class='dropdown-content'>
    <li>
        Pan
        <div class="switch">
            <label>
                Off
                <input type="checkbox" id="switchPan">
                <span class="lever"></span>
                On
            </label>
        </div>
        <br>
    </li>
    <li>
        Zoom
        <div class="switch">
            <label>
                Off
                <input type="checkbox" id="switchZoom">
                <span class="lever"></span>
                On
            </label>
        </div>
        <br>
    </li>
    <li>
        Image Type
        <div class="switch">
            <label>
                png
                <input type="checkbox" id="imageType">
                <span class="lever"></span>
                gif
            </label>
        </div>
        <br>
    </li>
    <li>
        Bot Path
        <div class="switch">
            <label>
                Off
                <input type="checkbox" id="strokeOn">
                <span class="lever"></span>
                On
            </label>
        </div>
        <br>
    </li>
    <div class="row" id="trainers">
    </div>
</ul>

<!-- Modal -->
<div id="modal-info" class="modal modal-fixed-footer">
</div>

<!-- Bot indicator -->
<div id="bot-indicator" class="z-depth-1">
    <b>Bot status</b>
    <p>Loading</p>
</div>

<!-- Bot Stats -->
<div id="bot-stats" class="z-depth-1">
    <b>Running Stats</b>
    <p>Loading</p>
</div>

<!-- Content -->
<div id="content">
    <div id="side-nav">
        <div id="nav-logo" class="valign-wrapper">
            <img id="logo" src='../assets/image/icons/logo.png'>
            <p class="center-align valign">
                PikaBot
            </p>
        </div>
        <a class='dropdown-button btn-settings waves-effect waves-light' href='#' data-activates='options'>
            <i class="material-icons"
               style="float: left;color: #FFF; padding-right: 15px; line-height: 24px;">settings</i>Settings
        </a>
        <a class="modal-trigger side-account waves-effect waves-light" href="#modal-info" id="btn-info">
            <i class="material-icons"
               style="float: left; line-height: 34px; padding-right: 15px; color: #FFF">person</i>
            <p id="username">Loading...</p>
            <p id="level">...</p>
        </a>
        <div id="log-container">
            <h6><i class="material-icons"
                   style="float: left; line-height: 14px; padding-right: 15px; color: #FFF">list</i>Logs</h6>
            <div id="log-text">
                <p id="log"></p>
            </div>
        </div>
        <a class="waves-effect waves-light btn s10 col offset-s1" id="logout">Logout</a>
    </div>
    <div id="map-container">
        <div id="map"></div>
    </div>
</div>

</template>

<script>

const constants = require('./Main/const.js');
let User = require('./Main/User.js'),
    Ipc = require('./Main/Ipc.js'),
    Logger = require('./Main/Logger.js'),
    Materialize = require('./Main/Materialize.js'),
    GoogleMap = require('./Main/GoogleMap.js'),
    ProfileMenu = require('./Main/ProfileMenu.js');

    export default {
        data() {
            return {
            }
        },
        ready() {
            console.log(this);
        }
    }
</script>

<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.items {}

.pokemon-card {
  width: calc(100% * (1/4) - 10px - 1px);
  float: left;
  margin: 5px;
  padding: 10px 10px;
  .moves {
    text-align: left;
  }
  .move-name {
    font-weight: bold;
    color: #444444;
  }
  .move-type {
    color: #888888;
  }
  .move-damage {
    float: right;
    font-weight: bold;
    color: #444444;
  }
  .charged-divisions {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .move-type {
      flex-grow: 0;
    }
    .move-divisions {
      display: flex;
      flex-grow: 1;
      padding: 7px 0 7px 10px;
      justify-content: space-between;
      .move-division {
        flex-grow: 1;
        background-color: #43c1fb;
        border: 2px solid #a5d4ff;
        border-radius: 10px;
      }
    }
  }
}

.pokemon-stats {
  text-align: center;
  .cp {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    display: inline-block;
  }
  .iv {
    display: inline-block;
  }
  .value {
    display: block;
    font-size: 20px;
    padding: 0 10px;
  }
  .name {
    display: block;
    font-size: 20px;
    padding: 0 10px;
    font-size: 12px;
  }
}

.pokemon-card .details {
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.1);
  border-width: 1px 0 1px;
  padding: 10px 0;
  margin: 10px 0;
}

.item_img {
  width: 75px;
  height: auto;
}

.gif_img {
  width: 38px;
  height: auto;
}

.png_img {
  width: 96px;
  height: auto;
}

#nav-bar {
  margin: 0;
  height: 9%;
}

#nav-logo {
  height: 70px;
  background: #3E2723;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding: 0;
}

#logo {
  height: 30px;
  padding-left: 15px;
}

#nav-logo > p {
  color: yellow;
  font-family: Arial;
  padding-left: 10px;
  font-size: 20px;
}

#nav-menu {
  padding: 0;
  height: 100%;
  background: #4E342E;
  > div {
    height: 100%;
    margin: 0;
  }
}

#quick-info {
  height: 100%;
  margin: 0;
  margin-left: 10px;
  padding: 0;
  > div {
    margin: 0;
    padding: 0;
    > p {}
  }
}

#caught-div {
  margin: 0;
  margin-left: 10px;
  padding: 0;
  width: 20%;
}

#nav-options {
  margin: 0;
  margin-left: 10px;
  padding: 0;
  > div {
    margin: 0;
    display: flex;
    justify-content: space-between;
    margin-left: 50px;
    > a {
      background: #feffff;
      color: #50483c;
    }
  }
}

#options, #slide-right {
  padding: 10px;
}

#content {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;
  margin: 0;
  > div {
    flex: 1;
    align-self: auto;
  }
}

#side-nav {
  height: 100%;
  width: 300px;
  flex: 0 0 auto !important;
  float: left;
  padding: 0;
  background: #3E2723;
  position: relative;
  color: white;
  z-index: 1;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.3);
  border-right: 1px solid rgba(0, 0, 0, 0.3);
}

#account-option {
  background: #241d14;
  height: 70px;
  padding: 10px;
  margin: 0;
  > div > p:nth-child(1) {
    font-size: 10px;
    color: white;
    margin: 0;
  }
}

#username {
  color: yellow;
  margin: 0;
}

/* label color */

.input-field {
  label {
    color: #000;
  }
  input[type=text] {
    &:focus {
      + label {
        color: #000;
      }
      border-bottom: 1px solid #000;
      box-shadow: 0 1px 0 0 #000;
    }
    &.valid, &.invalid {
      border-bottom: 1px solid #000;
      box-shadow: 0 1px 0 0 #000;
    }
  }
  .prefix.active {
    color: #000;
  }
}

/* label focus color */

/* label underline focus color */

/* valid color */

/* invalid color */

/* icon prefix focus color */

#location, #location-option > label {
  color: black;
}

#walk-option {
  height: 90px;
  padding: 0;
  margin: 0;
  > div {
    color: black;
    > label {
      color: black;
    }
  }
}

#steps-option > {
  input, label {
    color: black;
  }
}

#mode-option {
  height: 90px;
  padding: 0;
  margin: 0;
  > div {
    color: black;
    > label {
      color: black;
    }
  }
}

#apply {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-right: 8.333333333%;
  margin-bottom: 70px;
  background: #f0de23;
  color: black;
  border-width: 1px;
  border-color: #bdb021;
  border-style: solid;
}

#logout {
  width: 250px;
  margin: 0 25px;
  box-sizing: border-box;
  background-color: #4E342E;
}

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

#log {
  font-size: 12px;
}

#log-container {
  height: calc(100% - 320px);
  margin-bottom: 70px;
}

#log-text {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
}

#side-nav > h5 {
  color: #50483c;
  text-align: center;
  text-decoration: underline;
  margin: 10 0 10 0;
}

.side-nav {
  width: 600px;
}

#close {
  font-size: 40px;
}

#username {
  color: white;
  font-weight: bold;
  width: 100%;
  font-size: .8em;
}

#level {
  margin: 0;
  color: white;
  opacity: 0.7;
  font-size: 11px;
}

.side-account {
  display: block;
  padding: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.btn-settings {
  display: block;
  line-height: 24px;
  color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding: 15px;
}

#side-nav > a:hover {
  background-color: #4E342E;
}

a#logout:hover {
  background-color: #5D4037;
}

#log-container h6 {
  padding: 15px;
}

.tabs {
  .indicator .stats {
    background-color: #5D4037;
  }
  > .tab > a {
    color: #5D4037;
  }
}

.switch label input[type=checkbox]:checked + .lever {
  background-color: #f0de23;
  &:after {
    background-color: #d7c60f;
  }
}

.tabs .tab a:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #5D4037;
}

.waves-effect.waves-brown .waves-ripple {
  background-color: rgba(121, 85, 72, 0.5);
}

.tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal.modal-fixed-footer {
  max-height: 80%;
  height: 80%;
  .modal-footer {
    background: #FFF;
  }
}

.log-img {
  height: 30px;
  float: right;
}

.log-date {
  display: block;
  opacity: 0.6;
}

.log-pokemon {
  height: 60px;
}

.log-message {
  margin-top: 0;
}

.log-item {
  padding: 5px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.log-image-container {
  width: 60px;
  float: right;
}

.log-message-narrow {
  width: 200px;
  float: left;
}

#info {
  margin-bottom: 25px;
  > .col {
    padding: 5px;
    min-height: 100px;
  }
}

#bot-indicator {
  z-index: 1;
  height: 93px;
  width: 300px;
  position: absolute;
  right: 48px;
  bottom: 24px;
  background: #FFF;
  font-size: 12px;
  padding: 12px;
  overflow: hidden;
}

#bot-stats {
  z-index: 1;
  height: 93px;
  width: 300px;
  position: absolute;
  right: 350px;
  bottom: 24px;
  background: #FFF;
  font-size: 12px;
  padding: 12px;
  overflow: hidden;
}

#indicator #stats {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #eee;
  display: inline-block;
  margin-right: 5px;
}
</style>
