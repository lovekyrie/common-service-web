<script>
export default {
  name: 'MicroMainApp',
}
</script>

<template>
  <div id="micro-main-app">
    <header class="main-header">
      <h1>qiankun 微前端主应用</h1>
      <nav class="main-nav">
        <router-link to="/">
          首页
        </router-link>
        <router-link to="/subapp/vue2">
          子应用 Vue2
        </router-link>
        <router-link to="/subapp/vue3">
          子应用 Vue3 (待配置)
        </router-link>
      </nav>
    </header>
    <main class="main-content">
      <div id="subapp-container" class="subapp-container">
        <!-- 子应用会渲染到这里 -->
      </div>
    </main>
  </div>
</template>

<style scoped>
#micro-main-app {
  width: 100%;
  min-height: 100vh;
}

.main-header {
  background: #2c3e50;
  color: white;
  padding: 16px 24px;
}

.main-header h1 {
  margin: 0 0 12px;
  font-size: 20px;
}

.main-nav {
  display: flex;
  gap: 24px;
}

.main-nav a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: #fff;
  text-decoration: underline;
}

.main-content {
  padding: 0;
}

.subapp-container {
  min-height: calc(100vh - 100px);
  background: #f5f5f5;
}
</style>
