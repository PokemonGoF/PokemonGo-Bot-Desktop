<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>

<template>
  <div>
    <img src="LandingPageView/assets/logo.png" alt="electron-vue">
    <h1>Welcome.</h1>
    <versions></versions>
    <links></links>
  </div>
</template>

<script>
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'

  export default {
    components: {
      Links,
      Versions
    },
    name: 'landing-page'
  }
</script>
