<template>
    <NavBarVue></NavBarVue>
    <div class="contenedor-inicio">
        <h2>Inicio</h2>
    </div>
</template>

<script>

import NavBarVue from './Layouts/NavBar.vue';

export default {
    components: {
        NavBarVue,
    }

};
</script>

<style>
    .contenedor-inicio{
        color: white;
        height: 100%;
    }
</style>