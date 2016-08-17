<template>
    <login v-if="currentState == AppState.Login"></login>
    <main v-if="currentState == AppState.Main" :user-info="userInfo"></main>
</template>

<script>
    import Login from './components/Login'
    import Main from './components/Main'
    import startBot from './startBot'

    const AppState = {
        Login: "Login",
        Main: "Main"
    };

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
        },
        events: {
            'login': function (obj) {
                if (!this.botStarted) {
                    this.startBot(obj);
                }

                this.botStarted   = true;
                this.currentState = AppState.Main
            },
            'logout': function () {
                console.log('receiving logout, killing bot');
                this.killBot();
            },
            'bot_closed': function () {
                console.log('receiving bot_closed, killing logging out');
                this.logout();
            }
        },
        components: {Login, Main},
        methods: {
            logout() {
                this.currentState = AppState.Login
            },
            startBot: startBot,
            killBot: function () {
                if (this.procs.length > 0) {
                    for (var i in this.procs) {
                        let proc = this.procs[i]
                        if (proc.pid) {
                            try {
                                process.kill(-proc.pid, 'SIGINT');
                                process.kill(-proc.pid, 'SIGTERM');
                            } catch (e) {
                                try {
                                    process.kill(proc.pid, 'SIGTERM');
                                } catch (e) {
                                    console.error("Unable to stop proccess..." + JSON.stringify(e))
                                }
                            }
                        }
                        this.procs.$remove(proc)
                    }
                }
            }
        }
    }
</script>
