<template>
    <div>
        <login v-if="currentState == AppState.Login"></login>
        <main v-if="currentState == AppState.Main" :user-info="userInfo"></main>
    </div>
</template>

<script>
    import Login from './components/login.vue'
    import Main from './components/main.vue'
    import electron from 'electron';

    const AppState = { Login: "Login", Main: "Main" },
        ipcRenderer = electron.ipcRenderer;


    export default {
        data() {
            return {
                currentState: null,
                AppState,
                procs: [],
                userInfo: {}
            }
        },
        ready() {
            this.currentState = AppState.Login


            ipcRenderer.on('bot-started', (event, userInfo) => {
                console.log('bot started received, logging in');

                this.$set('userInfo', userInfo);
                this.currentState = AppState.Main
            });

            ipcRenderer.on('bot-killed', () => {
                console.log('bot killed receive, logging out');
                this.logout();
            });
        },
        events: {
            'login': function (obj) {
                ipcRenderer.send('start-bot', obj);
            },
            'logout': function () {
                ipcRenderer.send('kill-bot');
            }
        },
        components: {Login, Main},
        methods: {
            logout() {
                this.currentState = AppState.Login
            },
            startBot: startBot,
        }
    }
</script>
