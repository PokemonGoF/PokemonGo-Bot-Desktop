'use strict';

const electron = require('electron'),
    startBot = require('./start-bot'),
    path = require('path'),
    app = electron.app,
    dialog = electron.dialog,
    BrowserWindow = electron.BrowserWindow,
    ipcMain = electron.ipcMain;

let mainWindow,
    config = {
        port: 8080
    };

if (process.env.NODE_ENV === 'development') {
    config.url = `http://localhost:${config.port}`;
} else {
    config.devtron = false;
    config.url = `file://${__dirname}/index.html`;
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
    if (botProcess != null) {
        killBot()
    }
    app.quit()
});

app.on('will-quit', () => {
    if (botProcess != null) {
        killBot()
    }
});


app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});

let botProcess = null;

ipcMain.on('start-bot', function (event, loginInfos) {
    console.log('start bot received, starting the bot...');
    let infos = startBot(global.botPath, loginInfos);

    botProcess = infos.process;

    botProcess.stderr.on('data', (data) => {
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

    botProcess.on('exit', () => {
        event.sender.send('bot-killed')
    });


    event.sender.send('bot-started', infos.userInfos)
});


let killBot = () => {
    console.log('Killing bot...');

    try {
        process.kill(-botProcess.pid, 'SIGINT');
        process.kill(-botProcess.pid, 'SIGTERM');
    } catch (e) {
        try {
            process.kill(botProcess.pid, 'SIGTERM');
        } catch (e) {
        }
    }

    botProcess = null;
    try {
        mainWindow.webContents.send('bot-killed')
    } catch (err) {
    }
}


ipcMain.on('kill-bot', killBot);

