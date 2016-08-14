<template>
    <login v-if="currentState == AppState.Login"></login>
    <main v-if="currentState == AppState.Main"></main>
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
                botStarted: false
            }
        },
        ready() {
            this.currentState = AppState.Login
        },
        events: {
            'login': function (obj) {
                console.log('this', this);
                if (!this.botStarted) {
                    this.startBot(obj);
                }

                this.botStarted = true
                this.currentState = AppState.Main
            }
        },
        components: {Login, Main},
        methods: {
            startBot: startBot,
            'exitBot': function () {
                this.botStarted = false;
                this.currentState = AppState.Login
            }
        }
    }
</script>
