<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Layout',
  components: {
  },
})
</script>

<template>
  <div class="home">
    <el-container style="height: 100%;padding: 8px;">
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu>
            <el-menu-item>
              <i class="el-icon-setting" />
              <span slot="title">
                <router-link to="/">首页</router-link>
              </span>
            </el-menu-item>
            <el-menu-item>
              <i class="el-icon-setting" />
              <span slot="title">
                <router-link to="/about">关于我们</router-link>
              </span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.home {
  height: 100vh;
}
.el-header,
.el-footer {
  background-color: #fc0;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

body>.el-container {
  margin-bottom: 40px;
}
</style>
