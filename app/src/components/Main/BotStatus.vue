<template>
<!-- Bot indicator -->
    <div id="bot-indicator" class="z-depth-1">
        <b>Bot status</b>
        <p>{{ msg }}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: "Loading"
            }
        },
        ready() {},
        events: {
            'bot_log': function (obj) {
                let log = {};
                let message = obj.msg;

                let bracket_data = message.match(/\[(.*?)\]/g);
                if (!bracket_data || bracket_data.length < 3) {
                    return true;
                }



                log.worker = bracket_data[0].replace(/[\[\]]/g, "");
                log.action = bracket_data[2].replace(/[\[\]]/g, "");
                log.message = message.split("[" + log.action + "] ")[1];

                if (log.worker == "MoveToFort") {
                    this.msg = log.message
                }

                return true;
            }
        }
    }
</script>
