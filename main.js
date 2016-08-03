const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const path = require('path');
const os = require('os');
const fs = require('fs');
const autoUpdater = electron.autoUpdater;
//electron.crashReporter.start();

var platform = os.platform() + '_' + os.arch();
var version = app.getVersion();

var mainWindow = null;
var procStarted = false;
var subpy = null;
var server = null;
var mainAddr;
var restarting = false;

//try {
//  autoUpdater.setFeedURL('https:///update/'+platform+'/'+version);
//} catch (e) {console.log(e)}

//autoUpdater.on('update-downloaded', function(){
//  mainWindow.webContents.send('update-ready');
//});

//try {
//  autoUpdater.checkForUpdates();
//} catch (e) {}

// Setup menu bar


var template = [{
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
},
{
    label: "Tools",
    submenu: [
      {
        label: "Refresh",
        accelerator: "CmdOrCtrl+R",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.webContents.toggleDevTools();
        }
      }
    ]
}
];


app.on('window-all-closed', function() {
  if (restarting) {
    return;
  }
  if (subpy && subpy.pid) {
    killProcess(subpy.pid);
  }
  if (server && server.pid) {
    killProcess(server.pid);
  }
  app.quit();
});

app.on('ready', function() {

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  setupMainWindow();
});

function setupMainWindow() {
  restarting = false;

  mainWindow = new BrowserWindow({width: 2000, height: 1000, minWidth: 700, minHeight: 500});
  mainWindow.loadURL('file://' + __dirname + '/app/login.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
    if (subpy && subpy.pid) {
      killProcess(subpy.pid);
    }
    if (server && server.pid) {
      killProcess(server.pid);
    }
  });
}

function logData(str){
  console.log(str);
  if (mainWindow){
    mainWindow.webContents.send('appLog', {'msg': `${str}`});
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

ipcMain.on('logout', function(event, auth, code, location, opts) {
  restarting = true;
  if (procStarted) {
    logData('Killing Python process...');
    if (subpy && subpy.pid) {
      killProcess(subpy.pid);
    }
    if (server && server.pid) {
      killProcess(server.pid);
    }
  }
  procStarted = false;
  mainWindow.close();
  setupMainWindow();
});

ipcMain.on('startPython', function(event, auth, code, location, opts) {
  if (!procStarted) {
    logData('Starting Python process...');
    startPython(auth, code, location, opts);
  }
  procStarted = true;
});

ipcMain.on('getServer', function(event) {
  event.sender.send('server-up', mainAddr);
});

ipcMain.on('installUpdate', function(event) {
  autoUpdater.quitAndInstall();
});
function startPython(auth, code, location, opts) {

  mainWindow.loadURL('file://' + __dirname + '/app/main.html');
  // mainWindow.openDevTools();
    

  // Find open port
  var portfinder = require('portfinder');
  portfinder.getPort(function (err, port) {

    logData('Got open port: ' + port);

    // Run python web server
    var cmdLine = [
      './pokecli.py',
    ];

    if (false) {
      cmdLine.push('--username');
      cmdLine.push(opts.username);
      cmdLine.push('--password');
      cmdLine.push(opts.password);
    }

    // logData(opts.username);


    // console.log(cmdLine);
    logData('Bot path: ' + path.join(__dirname, 'gofbot'));
    logData('python ' + cmdLine.join(' '));

    var pythonCmd = 'python';

    var serverCmdLine = [
      'serveit.py',
      port
    ];

    logData('Bot path: ' + path.join(__dirname, 'gofbot/web'));
    logData('python ' + serverCmdLine.join(' '));
    
    var renameFiles = function(){
      //rename config
      try {
        //test to see if settings exist
        var setting_path = path.join(__dirname, 'gofbot/configs/config.json');
        fs.openSync(setting_path, 'r+');
      } catch (err) {
        fs.renameSync(path.join(__dirname, 'gofbot/configs/config.json.example'),setting_path);
      }

      //rename user file
      try {
        //test to see if settings exist
        var user_path = path.join(__dirname, 'gofbot/web/userdata.js');
        fs.openSync(user_path, 'r+');
      } catch (err) {
        fs.renameSync(path.join(__dirname, 'gofbot/web/userdata.js.example'),user_path);
      }
    };

    renameFiles()

    
    var data=fs.readFileSync(path.join(__dirname, 'gofbot/configs/config.json'));

    var settings = JSON.parse(data);
    

    settings.auth_service = auth
    if (auth == 'google') {
      settings.password = opts.google_password;
      settings.username = opts.google_username;
    } else {
      settings.password = opts.ptc_password;
      settings.username = opts.ptc_username;
    }

    settings.gmapkey = opts.google_maps_api;
    
    if (opts.max_steps != '') {
      settings.max_steps = parseInt(opts.max_steps);
    }
    if (opts.walk_speed != '') {
      settings.walk = parseInt(opts.walk_speed);
    }


    var userdata_code = ['var users = ["' + settings.username + '"];',
                            'var userZoom = true;',
                            'var userFollow = true;',
                            'var imageExt = ".png";',
                            'var gMapsAPIKey = "' + settings.gmapkey + '";',
    ]
                            
                            
    fs.writeFileSync(path.join(__dirname, 'gofbot/web/userdata.js'), userdata_code.join('\n'), 'utf-8');

    //temporary fix for location/catchable bug in PokemonGo-Bot
    try {
        //test to see if settings exist
        var location_path = path.join(__dirname, 'gofbot/web/location-' + settings.username + '.json');
        fs.openSync(location_path, 'r+');
      } catch (err) {
        fs.writeFileSync(location_path,"{}");
    }
    try {
        //test to see if settings exist
        var location_path = path.join(__dirname, 'gofbot/web/catchable-' + settings.username + '.json');
        fs.openSync(location_path, 'r+');
      } catch (err) {
        fs.writeFileSync(location_path,"{}");
    }

    settings.location = location;

    fs.writeFileSync(path.join(__dirname, 'gofbot/configs/config.json'), JSON.stringify(settings, null, 4) , 'utf-8');



    server = require('child_process').spawn(pythonCmd, serverCmdLine, {
      cwd: path.join(__dirname, ''),
      detached: true
    });

    // server.stdout.on('data', (data) => {
    //   console.log(`Python: ${data}`);
    //   mainWindow.webContents.send('pythonLog', {'msg': `${data}`});
    // });
    // server.stderr.on('data', (data) => {
    //   console.log(`Python: ${data}`);
    //   mainWindow.webContents.send('pythonLog', {'msg': `${data}`});
    // });


    subpy = require('child_process').spawn(pythonCmd, cmdLine, {
      cwd: path.join(__dirname, 'gofbot'),
      detached: true
    });

    subpy.stdout.on('data', (data) => {
      console.log(`Python: ${data}`);
      mainWindow.webContents.send('pythonLog', {'msg': `${data}`});
    });
    subpy.stderr.on('data', (data) => {
      console.log(`Python: ${data}`);
      mainWindow.webContents.send('pythonLog', {'msg': `${data}`});
    });

    

    var rq = require('request-promise');
    mainAddr = 'http://localhost:' + port + "/app";

    var openWindow = function(){
      mainWindow.webContents.send('server-up', mainAddr);
      mainWindow.webContents.executeJavaScript(
        'serverUp("'+mainAddr+'")');
      mainWindow.on('closed', function() {
        mainWindow = null;
        if (subpy && subpy.pid) {
          killProcess(subpy.pid);
        }
        if (server && server.pid) {
          killProcess(server.pid);
        }
        procStarted = false;
      });
    };

    var startUp = function(){
      rq(mainAddr)
        .then(function(htmlString){
          logData('server started!');
          openWindow();
        })
        .catch(function(err){
          //console.log('waiting for the server start...');
          startUp();
        });
    };

    startUp();

  });

};
