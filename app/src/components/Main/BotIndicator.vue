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
            'moving_to_fort': function (obj) {
                this.msg = obj.msg;
                return true;
            },
        }
    }
</script>

<style lang="scss">
#bot-indicator {
  z-index: 1;
  height: 93px;
  width: 300px;
  position: absolute;
  right: 48px;
  bottom: 24px;
  background: #FFF;
  font-size: 12px;
  padding: 12px;
  overflow: hidden;
}
</style>
