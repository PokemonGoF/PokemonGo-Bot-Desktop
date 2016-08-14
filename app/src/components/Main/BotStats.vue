<template>
    <div id="bot-stats" class="z-depth-1">
        <b>Running Stats</b>
        <p>{{ msg }}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: "Not working yet"
            }
        },
        ready() {},
        events: {
            'bot_log': function (obj) {}
        }
    }
</script>
