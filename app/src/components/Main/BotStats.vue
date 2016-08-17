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
            'log_stats': function (obj) {
                this.msg = obj.msg;
                return true;
            }
        }
    }
</script>

<style lang="scss">
#bot-stats {
  z-index: 1;
  height: 93px;
  width: 300px;
  position: absolute;
  right: 350px;
  bottom: 24px;
  background: #FFF;
  font-size: 12px;
  padding: 12px;
  overflow: hidden;
}
</style>
