<template>
  <div id="app">
    <!-- router-view定义页面中显示部分 -->
    <!-- <router-link to="{name:'Discover',query:{t:'rating'}}"/> -->
    <router-view v-if="isRouterAlive" :key="$route.path"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
#app {
}
</style>
