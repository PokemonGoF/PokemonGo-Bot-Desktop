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
    }

    export default {
        data() {
            return {
                currentState: null,
                AppState,
                botStarted: false,
                proc: null,
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

                this.botStarted = true
                this.currentState = AppState.Main
            },
            'logout': function () {
                this.killBot();
            },
            'bot_closed': function () {
                //this.logout();
            }
        },
        components: {Login, Main},
        methods: {
            logout() {
                this.currentState = AppState.Login
            },
            startBot: startBot,
            'killBot': function () {
                if (this.botStarted && this.proc && this.proc.pid) {
                    try {
                        process.kill(-this.proc.pid, 'SIGINT');
                        process.kill(-this.proc.pid, 'SIGTERM');
                    } catch (e) {
                        try {
                            process.kill(this.proc.pid, 'SIGTERM');
                        } catch (e) {
                            console.error("Unable to stop proccess..." + JSON.stringify(e))
                        }
                    }
                }
                this.proc = null
                this.botStarted = false;
            }
        }
    }
</script>
