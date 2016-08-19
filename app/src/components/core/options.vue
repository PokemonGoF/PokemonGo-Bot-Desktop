<template>
    <a class='dropdown-button btn-settings waves-effect waves-light' href='#' data-activates='options'>
        <i class="material-icons"
           style="float: left;color: #FFF; padding-right: 15px; line-height: 24px;">settings</i>Settings
    </a>
    <!-- Options Dropdown -->
    <ul id='options' class='dropdown-content'>
        <li>
            Pan
            <div class="switch">
                <label>
                    Off
                    <input type="checkbox" v-model="userInfo.userFollow">
                    <span class="lever"></span>
                    On
                </label>
            </div>
            <br>
        </li>
        <li>
            Zoom
            <div class="switch">
                <label>
                    Off
                    <input type="checkbox" v-model="userInfo.userZoom">
                    <span class="lever"></span>
                    On
                </label>
            </div>
            <br>
        </li>
        <li>
            Image Type
            <div class="switch">
                <label>
                    png
                    <input type="checkbox" v-model="userInfo.imageExt" :true-value="'.gif'" :false-value="'.png'">
                    <span class="lever"></span>
                    gif
                </label>
            </div>
            <br>
        </li>
        <li>
            Bot Path
            <div class="switch">
                <label>
                    Off
                    <input type="checkbox" v-model="userInfo.strokeOn">
                    <span class="lever"></span>
                    On
                </label>
            </div>
            <br>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
      userInfo: {
        twoWay: true
      }
  },
  ready() {
      $('.dropdown-button').dropdown({
          inDuration: 300,
          outDuration: 225,
          constrain_width: false, // Does not change width of dropdown to that of the activator
          hover: true, // Activate on hover
          gutter: 0, // Spacing from edge
          belowOrigin: true, // Displays dropdown below the button
          alignment: 'left' // Displays dropdown with edge aligned to the left of button
      });
  }
}
</script>

<style lang="scss">
#options {
  padding: 10px;
}
</style>
