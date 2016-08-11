// Inner proccess communication

class Ipc {
    constructor() {
        this.ipcRenderer = require('electron').ipcRenderer;
    }
    enableLogging(logSystem) {
        this.ipcRenderer.on('pythonLog', function(evt, data) {
            var lines = data.msg.split("\n")
            for (let i = 0; i < lines.length; i++) {
                logSystem.log(lines[i]);
            }
            console.log(data.msg);
        });
    }
    send(message) {
        this.ipcRenderer.send(message);
    }
}

module.exports = Ipc;