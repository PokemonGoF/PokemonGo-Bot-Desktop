'use strict';

const electron      = require('electron'),
      path          = require('path'),
      app           = electron.app,
      BrowserWindow = electron.BrowserWindow;

let mainWindow,
    config = {};

if (process.env.NODE_ENV === 'development') {
    config     = require('../config');
    config.url = `http://localhost:${config.port}`;
} else {
    config.devtron = false;
    config.url     = `file://${__dirname}/dist/index.html`;
}

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
    });


    global.appRoot = path.resolve(__dirname);
    global.botPath = path.join(global.appRoot, 'gofbot');
    if (process.env.NODE_ENV === 'development') {
        global.botPath = path.join(global.appRoot, 'dist/gofbot')
    }

    mainWindow.loadURL(config.url);

    if (process.env.NODE_ENV === 'development') {
        BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'));

        let installExtension = require('electron-devtools-installer');

        installExtension.default(installExtension.VUEJS_DEVTOOLS)
            .then((name) => mainWindow.webContents.openDevTools())
            .catch((err) => console.log('An error occurred: ', err))
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    console.log('mainWindow opened')
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});
