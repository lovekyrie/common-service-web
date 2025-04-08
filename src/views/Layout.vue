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
            <router-link to="/">
              <el-menu-item>
                <i class="el-icon-setting" />
                <span slot="title">首页</span>
              </el-menu-item>
            </router-link>
            <router-link to="/about">
              <el-menu-item>
                <i class="el-icon-setting" />
                <span slot="title">
                  关于我们
                </span>
              </el-menu-item>
            </router-link>
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
}

body>.el-container {
  margin-bottom: 40px;
}
</style>
