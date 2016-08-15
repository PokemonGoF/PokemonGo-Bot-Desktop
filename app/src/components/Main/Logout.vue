<template>
    <a class="waves-effect waves-light btn s10 col offset-s1" @click.prevent="logout">Logout</a>
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
