const os = require('os'),
    fs = require('fs-extra'),
    path = require('path');

function ensureConfigFilePresent() {

    let setting_path = path.join(botPath, '/configs/config.json');
    try {
        //test to see if settings exist
        fs.openSync(setting_path, 'r+');
    } catch (err) {
        fs.renameSync(path.join(botPath, '/configs/config.json.example'), setting_path);
    }

}

function ensureUserdataFilePresent() {
    let user_path = path.join(botPath, '/web/config/userdata.js');
    try {
        fs.openSync(user_path, 'r+');
    } catch (err) {
        fs.renameSync(path.join(botPath, '/web/config/userdata.js.example'), user_path);
    }
}


const startBot = function (botPath, options) {
    // Rename config.json if needed
    ensureConfigFilePresent();


    // Load user config
    let data = fs.readFileSync(path.join(botPath, '/configs/config.json'));
    let settings = JSON.parse(data);

    // activate web_socket
    settings.websocket_server = true;
    settings.websocket = {
        "start_embedded_server": true,
        "server_url": "0.0.0.0:7894",
        "remote_control": true
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
            "type": "UpdateLiveStats",
            "config": {
                "min_interval": 1,
                "enabled": true,
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

    // force enabling of update live stat and force terminal title to false
    for (let i = 0; i < settings.tasks.length; i++) {
        if (settings.tasks[i].type == "UpdateLiveStats") {
            settings.tasks[i].config.enabled = true;
            settings.tasks[i].config.terminal_title = false;
        }
    }


    // Save user config
    fs.writeFileSync(path.join(botPath, '/configs/config.json'), JSON.stringify(settings, null, 4), 'utf-8');

    // Rename userdata.js if needed
    ensureUserdataFilePresent();


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


    let cmdLine = [
        './pokecli.py',
    ];

    let pythonCmd = 'python';
    if (os.platform() == 'win32') {
        pythonCmd = path.join(appRoot, 'pywin', 'python.exe');
    }

    // Create python bot process
    let subpy = require('child_process').spawn(pythonCmd, cmdLine, {
        cwd: botPath,
        detached: true
    });

    return {
        userInfos: {
            users: [settings.username],
            zoom: 16,
            userZoom: true,
            userFollow: true,
            botPath: true,
            imageExt: ".png",
            gMapsAPIKey: settings.gmapkey,
            actionsEnabled: false,
            strokeOn: true
        },
        process: subpy
    }
};

module.exports = startBot;


