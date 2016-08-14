<template>
    <Login v-if="currentState == AppState.Login"></Login>
</template>

<script>
    import Login from './components/Login'

    const AppState = {
        Login: "login",
        Map: "map"
    }

    export default {
        data() {
            return {
                currentState: null,
                AppState
            }
        },
        ready() {
            this.currentState = AppState.Login
        },
        components: {Login}
    }
</script>

<style lang="scss">
    h1 {
        margin: 0;
    }

    h4 {
        color: white;
    }

    body {
        background-color: #3E2723;
    }

    p {
        font-size: 0.7em;
        opacity: 0.7;
    }

    #options > div {
        min-height: 130px;
    }

    #logo {
        height: 50px;
    }

    .hide {
        display: none;
    }

    .btn {
        background: #FFEB3B;
        color: #000;
        width: 100%;
        font-size: 1.2vw;
        &:hover {
            background: #FDD835;
        }
    }

    #mode-radio {
        border-bottom: .5px solid #9e9e9e;
        margin-top: 15px;
        padding-bottom: 11px;
        margin-bottom: 0px;
    }

    .select-dropdown {
        color: #d1d1d1;
    }

    #options > div > div {
        margin-bottom: 0px;
        > div > input {
            margin-bottom: 0px;
        }
    }

    .switch {
        label input[type=checkbox]:checked + .lever {
            background-color: #f0de23;
            &:after {
                background-color: #d7c60f;
            }
        }
        float: right;
        p {
            font-size: 12px;
            color: #fff;
            margin: 0;
            margin-bottom: -12px;
            line-height: 12px;
        }
    }

    .collapsible-body {
        background-color: #fff;
        padding: 1.2em;
    }

    .login-topbar {
        padding: 1em;
        color: white;
    }

    #options {
        padding: 0.7em;
        margin: 0;
    }

    .login-footer {
        padding: 20px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        a {
            padding: 10px;
            color: white;
            font-size: 12px;
        }
    }

    #encryptionFileExistsDiv {
        display: none;
    }
</style>
