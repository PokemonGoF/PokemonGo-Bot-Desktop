<template>
    <a class="waves-effect waves-light btn s10 col offset-s1" @click.prevent="logout" id="logout">Logout</a>
</template>

<script>
export default {
    methods: {
        logout() {
            console.log('dispatching logout...');
            this.$dispatch('logout');
        }
    }
}
</script>

<style lang="scss">
    #logout {
        width: 250px;
        margin: 0 25px;
        box-sizing: border-box;
        background-color: #4E342E;
    }

    a#logout:hover {
        background-color: #5D4037;
    }


</style>
