<template>
    <div class="row config" >
        <div class="col s12">
            <div class="row">
                <h4>Config</h4>
                <p style="color: white;"><strong>MAKE SURE YOU KNOW WHAT YOU ARE DOING HERE !</strong></p>
                <textarea name="config" id="config" rows="80" v-model="config"></textarea>
            </div>
            <div class="row">
                <button @click="backToLogin">Cancel</button>
                <button @click="saveConfig">Save</button>
            </div>
        </div>
    </div>
</template>

<script lang="babel">
    const fs       = require('fs-extra'),
          electron = require('electron').remote,
          path     = require('path'),
          botPath  = electron.getGlobal('botPath');

    export default {
        data() {
            return {
                config: ""
            }
        },
        props: {
            loginstate: {
                twoWay: true
            }
        },
        ready() {

            let setting_path = path.join(botPath, '/configs/config.json');
            try {
                fs.openSync(setting_path, 'r+');
            } catch (err) {
                fs.renameSync(path.join(botPath, '/configs/config.json.example'), setting_path);
            }

            this.config = `${fs.readFileSync(setting_path)}`;

            this.$nextTick(() => {
                require("codemirror/mode/javascript/javascript");
                require("codemirror/lib/codemirror.css");
                this.editor = require("codemirror").fromTextArea(document.getElementById("config"), {
                    lineNumbers: true,
                    mode: "application/json",
                    tabSize: 4,
                    indentUnit: 4
                })
            });
        },
        methods: {
            backToLogin: function () {
                this.loginstate = 'login'
            },
            saveConfig: function () {
                let configObject = {};
                try {
                    configObject = JSON.parse(this.editor.getValue());
                } catch (err) {
                    alert(`Your config file is invalid : ${err}`);
                    return;
                }

                try {
                    fs.writeFileSync(path.join(botPath, '/configs/config.json'), JSON.stringify(configObject, null, 4), 'utf-8');
                } catch (err) {
                    alert(`Unable to write config file : ${err}`);
                    return;
                }

                this.backToLogin();
            }
        }
    }
</script>
