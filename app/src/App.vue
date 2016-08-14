<template>
    <login v-if="currentState == AppState.Login"></login>
    <main v-if="currentState == AppState.Main" :login-data="loginData"></main>
</template>

<script>
    import Login from './components/Login'
    import Main from './components/Main'

    const AppState = {
        Login: "Login",
        Main: "Main"
    }

    export default {
        data() {
            return {
                currentState: null,
                AppState,
                loginData: {}
            }
        },
        ready() {
            this.currentState = AppState.Login
        },
        events: {
            'login': function (obj) {
                this.loginData = obj;
                this.currentState = AppState.Main
            }
        },
        components: {Login, Main}
    }
</script>
