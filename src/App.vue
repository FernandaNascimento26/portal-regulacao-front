<template>
  <div id="app">
    <router-view />  <!-- Renderiza o componente com base na rota -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
