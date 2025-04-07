<script lang="ts">
import Vue from 'vue'
import Layout from './views/Layout.vue'

export default Vue.extend({
  name: 'App',
  components: { Layout },
})
</script>

<template>
  <div id="app">
    <Layout />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
