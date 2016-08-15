<template>
    <a class="waves-effect waves-light btn s10 col offset-s1" @click="logout">Logout</a>
</template>

<script>
export default {
    methods: {
        logout($event) {
            $event.preventDefault()
            this.$dispatch('logout');
        }
    }
}
</script>
