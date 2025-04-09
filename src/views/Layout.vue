<script lang="ts" setup>
const menus = [
  {
    text: '服务管理',
    icon: 'el-icon-setting',
    subMenus: [
      { text: '服务信息', routerName: 'service' },
    ],
  },
  {
    text: '产品管理',
    icon: 'el-icon-menu',
    subMenus: [
      { text: '产品信息', routerName: 'productList' },
      { text: '新增', routerName: 'productEdit' },
    ],
  },
  {
    text: '关于我们',
    icon: 'el-icon-message',
    routerName: 'about',
  },
].map((p, i) => {
  return {
    ...p,
    subMenus: (p.subMenus || []).map((s, j) => {
      return { ...s, index: `${i}-${j}` }
    }),
    index: `${i}`,
  }
})
</script>

<template>
  <div class="home">
    <el-container style="height: 100%;padding: 8px;">
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu>
            <template v-for="menu in menus">
              <el-submenu v-if="menu.subMenus && menu.subMenus.length" :key="menu.index" :index="menu.index">
                <template #title>
                  <i :class="menu.icon" />
                  <span>{{ menu.text }}</span>
                </template>
                <el-menu-item-group>
                  <router-link v-for="sub in menu.subMenus" :key="sub.index" :to="{ name: sub.routerName }">
                    <el-menu-item :index="sub.index">
                      {{ sub.text }}
                    </el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
              <router-link v-else :key="menu.index" :to="{ name: menu.routerName }">
                <el-menu-item :index="menu.index">
                  <i :class="menu.icon" />
                  <span slot="title">{{ menu.text }}</span>
                </el-menu-item>
              </router-link>
            </template>
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
  text-align: left;
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
  height: calc(100vh - 176px);
}

body>.el-container {
  margin-bottom: 40px;
}

.el-menu > a {
  text-decoration: none;
}
</style>
