// Imports
const constants = require('./modules/const.js');
let User = require('./modules/User.js'),
    Ipc = require('./modules/Ipc.js'),
    Logger = require('./modules/Logger.js'),
    Materialize = require('./modules/Materialize.js'),
    GoogleMap = require('./modules/GoogleMap.js'),
    ProfileMenu = require('./modules/ProfileMenu.js')

// Global vars
let user,
    googleMap,
    omap,
    forts = [],
    info_windows = [], // windows that appear when you click on fort
    ipc,
    logger,
    profileMenu;

// Main
$(document).ready(function() {
  // Init User 
  user = new User(userInfo.users[0]);

  // Init map
  googleMap = new GoogleMap(userInfo, user);

  // Init logger
  logger = new Logger();

  // Init Ipc
  ipc = new Ipc();
  ipc.enableLogging(logger);

  // Logout listener
  $('#logout').click(function() {
    ipc.send('logout');
  });

  profileMenu = new ProfileMenu(user);

  // Materialize init
  Materialize.init();

});

// Callback for google maps
function mapCallback() {
  googleMap.init();
}