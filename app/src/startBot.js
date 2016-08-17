const electron = require('electron').remote,
      dialog   = electron.dialog,
      os       = require('os'),
      fs       = require('fs-extra'),
      path     = require('path'),
      botPath  = electron.getGlobal('botPath');


const startPython = function (options) {
  let self = this;

  let cmdLine = [
    './pokecli.py',
  ];

  let pythonCmd = 'python';
  if (os.platform() == 'win32') {
    pythonCmd = path.join(appRoot, 'pywin', 'python.exe');
  }

  // Rename config.json if needed
  let setting_path = ""
  try {
    //test to see if settings exist
    setting_path = path.join(botPath, '/configs/config.json');
    fs.openSync(setting_path, 'r+');
  } catch (err) {
    fs.renameSync(path.join(botPath, '/configs/config.json.example'), setting_path);
  }

  // Rename userdata.js if needed
  let user_path = ""
  try {
    //test to see if settings exist
    user_path = path.join(botPath, '/web/config/userdata.js');
    fs.openSync(user_path, 'r+');
  } catch (err) {
    fs.renameSync(path.join(botPath, '/web/config/userdata.js.example'), user_path);
  }

  // Load user config
  let data     = fs.readFileSync(path.join(botPath, '/configs/config.json'));
  let settings = JSON.parse(data);

  // activate web_socket
  settings.websocket_server = true;
  settings.websocket = {
    "start_embedded_server": true,
    "server_url":            "0.0.0.0:7894",
    "remote_control":        true
  };

  // Load settings
  settings.auth_service = options.auth;
  if (settings.auth_service == 'google') {
    settings.password = options.options.google_password;
    settings.username = options.options.google_username;
  } else {
    settings.password = options.options.ptc_password;
    settings.username = options.options.ptc_username;
  }
  settings.gmapkey = options.options.google_maps_api;
  if (!!options.options.walk_speed) {
    settings.walk = parseFloat(options.options.walk_speed);
  }

  settings.location = options.location;

  let titleWorker = false;
  for (let i = 0; i < settings.tasks.length; i++) {
    if (settings.tasks[i].type == "UpdateLiveStats") {
      titleWorker = true;
    }
  }
  if (!titleWorker) {
    settings.tasks.unshift({
      "type":   "UpdateLiveStats",
      "config": {
        "min_interval":   1,
        "enabled":        true,
        "stats":          [
          "login",
          "uptime",
          "km_walked",
          "level_stats",
          "xp_earned",
          "xp_per_hour"
        ],
        "terminal_log":   true,
        "terminal_title": false
      }
    });
  }

  self.userInfo = {
    users:          [settings.username],
    zoom:           16,
    userZoom:       true,
    userFollow:     true,
    botPath:        true,
    imageExt:       ".png",
    gMapsAPIKey:    settings.gmapkey,
    actionsEnabled: false
  }

  let userdata_code = [
    'var userInfo = {',
    `    users: ["${settings.username}"],`,
    `    zoom: 16,`,
    `    userZoom: true,`,
    `    userFollow: true,`,
    `    imageExt: ".png",`,
    `    gMapsAPIKey: "${settings.gmapkey}",`,
    `    actionsEnabled: false`,
    `};`,
    '',
    `var dataUpdates = {`,
    `    updateTrainer: 1000,`,
    `    addCatchable: 1000,`,
    `    addInventory: 5000`,
    `};`
  ];

  // Write userdata for map
  fs.writeFileSync(path.join(botPath, '/web/config/userdata.js'), userdata_code.join('\n'), 'utf-8');

  //temporary fix for location/catchable bug in PokemonGo-Bot
  let location_path = ""
  try {
    //test to see if settings exist
    location_path = path.join(botPath, '/web/location-' + settings.username + '.json');
    fs.openSync(location_path, 'r+');
  } catch (err) {
    fs.writeFileSync(location_path, "{}");
  }
  try {
    //test to see if settings exist
    let location_path = path.join(botPath, '/web/catchable-' + settings.username + '.json');
    fs.openSync(location_path, 'r+');
  } catch (err) {
    fs.writeFileSync(location_path, "{}");
  }

  // Save user config
  fs.writeFileSync(path.join(botPath, '/configs/config.json'), JSON.stringify(settings, null, 4), 'utf-8');

  // Create python bot process
  let subpy = require('child_process').spawn(pythonCmd, cmdLine, {
    cwd:      botPath,
    detached: true
  });

  // Send bot log to web page
  //subpy.stdout.on('data', (data) => {
  //  console.log(`Python : ${data}`);
  //});


  subpy.stderr.on('data', (data) => {
    //console.log(`Pythonerr : ${data}`)
    if (data.indexOf("ERROR") > -1) {
      dialog.showMessageBox({
        type:    "error",
        title:   "Whoops",
        message: "Error in python bot",
        detail:  "" + data,
        buttons: ["Yes I read carefully error message"]
      });
    }
  });


  subpy.on('exit', () => {
    console.log(arguments);
    self.$emit('bot_closed');
  });

  self.procs.push(subpy);
}

export default startPython
