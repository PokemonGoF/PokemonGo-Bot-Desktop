<template>
    <div class="modal-mask" @click="close" v-show="show">
        <div class="modal-container" @click.stop>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
      props: {
          show: {
              twoWay: true,
          },
          onClose: {}
      },
      methods: {
        close: function () {
            this.onClose();
        }
      },
      ready: function () {
        document.addEventListener("keydown", (e) => {
          if (this.show && e.keyCode == 27) {
            this.onClose();
          }
        });
      }
    }
</script>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
}

.modal-container {
    width: 75%;
    margin: 40px auto 0;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
    max-height: 85%;
}
</style>
