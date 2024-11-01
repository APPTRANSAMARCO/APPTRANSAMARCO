<template>
  <div id="app">
    <router-view />
  </div>
  
</template>

<script>

export default {
  name: 'App',
}
</script>

<style >


#app{
  background-image: url('@/assets/images/fondo.jpg');
  background-size: cover; /*la imagen cubre todo el contenedor */
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;

}

@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
