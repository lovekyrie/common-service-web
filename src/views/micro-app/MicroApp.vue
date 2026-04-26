<script>
export default {
  name: 'MicroApp',
  data() {
    return {
      loading: false,
    }
  },
  mounted() {
    this.loadMicroApp()
  },
  methods: {
    loadMicroApp() {
      console.log('MicroApp mounted, qiankun will inject content here')
    },
  },
}
</script>

<template>
  <div class="micro-app-container">
    <div v-if="loading" class="loading">
      Loading...
    </div>
    <div id="subapp-container" class="subapp-container">
      <!-- qiankun 子应用会挂载到这里 -->
    </div>
  </div>
</template>

<style scoped>
.micro-app-container {
  width: 100%;
  height: 100%;
}

.subapp-container {
  width: 100%;
  height: 100%;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;
  color: #409eff;
}
</style>
