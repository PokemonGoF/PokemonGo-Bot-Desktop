const electron = require('electron'),
      dialog = require('electron').dialog,
      app = electron.app,
      BrowserWindow = electron.BrowserWindow,
      ipcMain = electron.ipcMain,
      Menu = electron.Menu,
      path = require('path'),
      os = require('os'),
      fs = require('fs'),
      autoUpdater = electron.autoUpdater;

let platform = os.platform() + '_' + os.arch(),
    mainWindow = null,
    procStarted = false,
    subpy = null,
    mainAddr,

// Menu Template
    template = [{
      label: "Application",
      submenu: [{
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      }, {
        type: "separator"
      }, {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }]
    }, {
      label: "Edit",
      submenu: [{
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      }, {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      }, {
        type: "separator"
      }, {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      }, {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      }, {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      }, {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }]
    }, {
      label: "Tools",
      submenu: [{
        label: "Refresh",
        accelerator: "CmdOrCtrl+R",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.webContents.toggleDevTools();
        }
      }]
    }];

app.setVersion(require('./package.json').version);

// Launch app
app.on('ready', function() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  setupMainWindow();
});

// Handle app closing
app.on('window-all-closed', function() {
  if (subpy && subpy.pid) {
    // Kill python bot
    killProcess(subpy.pid);
  }
  app.quit();
});

// ipc listeners
// Handle logout
ipcMain.on('logout', function(event, auth, code, location, opts) {
  if (procStarted) {
    logData('Killing Python process...');
    if (subpy && subpy.pid) {
      killProcess(subpy.pid);
    }
  }
  procStarted = false;
});

// Start python bot
ipcMain.on('startPython', function(event, auth, code, location, opts) {
  if (!procStarted) {
    logData('Starting Python process...');
    startPython(auth, code, location, opts);
  }
  procStarted = true;
});

// Creates main window and load Login page
function setupMainWindow() {

  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 700,
      minHeight: 500
    });
  }
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
    if (subpy && subpy.pid) {
      killProcess(subpy.pid);
    }
  });
}

// Sends log to web page
function logData(str) {
  console.log(str);
  if (mainWindow) {
    mainWindow.webContents.send('appLog', {
      'msg': `${str}`
    });
  }
}

function killProcess(pid) {
  try {
    process.kill(-pid, 'SIGINT');
    process.kill(-pid, 'SIGTERM');
  } catch (e) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch (e) {}
  }
}

// Starts python bot
function startPython(auth, code, location, opts) {
    let cmdLine,
        pythonCmd,
        setting_path,
        user_path,
        data,
        settings,
        titleWorker,
        userdata_code,
        location_path;

  // Load Index page
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  cmdLine = [
    './pokecli.py',
  ];

  logData('Bot path: ' + path.join(__dirname, 'gofbot'));
  logData('python ' + cmdLine.join(' '));

  pythonCmd = 'python';
  if (os.platform() == 'win32') {
    pythonCmd = path.join(__dirname, 'pywin', 'python.exe');
  }

  // Rename config.json if needed
  try {
    //test to see if settings exist
    setting_path = path.join(__dirname, 'gofbot/configs/config.json');
    fs.openSync(setting_path, 'r+');
  } catch (err) {
    fs.renameSync(path.join(__dirname, 'gofbot/configs/config.json.example'), setting_path);
  }

  // Rename userdata.js if needed
  try {
    //test to see if settings exist
    user_path = path.join(__dirname, 'gofbot/web/config/userdata.js');
    fs.openSync(user_path, 'r+');
  } catch (err) {
    fs.renameSync(path.join(__dirname, 'gofbot/web/config/userdata.js.example'), user_path);
  }

  // Load user config
  data = fs.readFileSync(path.join(__dirname, 'gofbot/configs/config.json'));
  settings = JSON.parse(data);

  // Load settings
  settings.auth_service = auth;
  if (auth == 'google') {
    settings.password = opts.google_password;
    settings.username = opts.google_username;
  } else {
    settings.password = opts.ptc_password;
    settings.username = opts.ptc_username;
  }
  settings.gmapkey = opts.google_maps_api;
  if (opts.walk_speed != '') {
    settings.walk = parseInt(opts.walk_speed);
  }
  settings.location = location;

  titleWorker = false;
  for(let i = 0 ; i < settings.tasks.length; i ++){
    if(settings.tasks[i].type == "UpdateTitleStats") {
      titleWorker = true;
    }
  }
  if(!titleWorker) {
  settings.tasks.unshift({
            "type": "UpdateTitleStats",
            "config": {
                "min_interval": 1,
                "stats": [
                    "login",
                    "uptime",
                    "km_walked",
                    "level_stats",
                    "xp_earned",
                    "xp_per_hour"
                ],
                "terminal_log": true,
                "terminal_title": false
            }
        });
  }

  userdata_code = [
      'var userInfo = {',
      'users : ["' + settings.username + '"],',
      'userZoom : true,',
      'userFollow : true,',
      'imageExt : ".png",',
      'gMapsAPIKey : "' + settings.gmapkey + '"',
      '};'
  ];

  // Write userdata for map
  fs.writeFileSync(path.join(__dirname, 'gofbot/web/config/userdata.js'), userdata_code.join('\n'), 'utf-8');

  //temporary fix for location/catchable bug in PokemonGo-Bot
  try {
    //test to see if settings exist
    location_path = path.join(__dirname, 'gofbot/web/location-' + settings.username + '.json');
    fs.openSync(location_path, 'r+');
  } catch (err) {
    fs.writeFileSync(location_path, "{}");
  }
  try {
    //test to see if settings exist
    location_path = path.join(__dirname, 'gofbot/web/catchable-' + settings.username + '.json');
    fs.openSync(location_path, 'r+');
  } catch (err) {
    fs.writeFileSync(location_path, "{}");
  }

  // Save user config
  fs.writeFileSync(path.join(__dirname, 'gofbot/configs/config.json'), JSON.stringify(settings, null, 4), 'utf-8');

  // Create python bot process
  subpy = require('child_process').spawn(pythonCmd, cmdLine, {
    cwd: path.join(__dirname, 'gofbot'),
    detached: true
  });

  // Send bot log to web page
  subpy.stdout.on('data', (data) => {
    console.log(`Python: ${data}`);
    mainWindow.send('pythonLog', {
      'msg': `${data}`
    });
  });
  subpy.stderr.on('data', (data) => {
    console.log(`Python: ${data}`);
    mainWindow.send('pythonLog', {
      'msg': `${data}`
    });
    if (data.indexOf("ERROR") > -1) {
      dialog.showMessageBox({
        type: "error",
        title: "Whoops",
        message: "Error in python bot",
        detail: "" + data,
        buttons: ["Yes I read carefully error message"]
      });
    }
  });

  subpy.on('exit', () => {
    console.log(`Bot exited`);
    procStarted = false;
    setupMainWindow();
  });

}