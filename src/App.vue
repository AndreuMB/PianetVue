<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}

</script>

<template>
  <Header></Header>
  <div id="container" class="p-3">
    <router-view></router-view>
  </div>
</template>

<style>

</style>
