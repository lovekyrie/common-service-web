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
        <router-link exact to="/">
          首页
        </router-link>
        <router-link to="/subapp/vue2">
          子应用 Vue2
        </router-link>
        <router-link to="/subapp/vue3">
          子应用 Vue3
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
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.main-header {
  flex-shrink: 0;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 20px 28px;
  background: #2c3e50;
  color: white;
  padding: 12px 24px;
}

.main-header h1 {
  margin: 0;
  font-size: 18px;
  white-space: nowrap;
  flex-shrink: 0;
}

.main-nav {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;
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
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.subapp-container {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f5f5;
}
</style>
