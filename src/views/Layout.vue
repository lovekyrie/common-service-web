<script lang="ts" setup>
import type { TabItem } from '@/store/tabs'
import { useTabs } from '@/store/tabs'
import { getCurrentInstance, watch } from 'vue'

const { proxy } = getCurrentInstance()!
const { tabs, activeTab, addTab, removeTab } = useTabs()

// 路由 name → tab 标题映射
const routeTitleMap: Record<string, string> = {
  service: '服务信息',
  productList: '产品信息',
  productEdit: '新增产品',
  expenseType: '费用类型',
  accounting: '记账管理',
  about: '关于我们',
}

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
    text: '费用管理',
    icon: 'el-icon-money',
    subMenus: [
      { text: '费用类型', routerName: 'expenseType' },
    ],
  },
  {
    text: '记账管理',
    icon: 'el-icon-money',
    subMenus: [
      { text: '记账管理', routerName: 'accounting' },
    ],
  },
  {
    text: '关于我们',
    icon: 'el-icon-message',
    routerName: 'about',
  },
].map((p, i) => ({
  ...p,
  subMenus: (p.subMenus || []).map((s, j) => ({ ...s, index: `${i}-${j}` })),
  index: `${i}`,
}))

// 监听路由变化 → 自动添加 tab
// immediate: true 保证直接访问 URL 时也能正确初始化
watch(
  () => proxy.$route.name as string,
  (name) => {
    const title = routeTitleMap[name]
    if (name && title) {
      addTab({
        title,
        name,
        path: proxy.$route.fullPath,
      })
    }
  },
  { immediate: true },
)

// 点击 tab 标签 → 切换 URL
function handleTabChange(name: string) {
  const tab = tabs.find((t: TabItem) => t.name === name)
  if (tab && proxy.$route.name !== name) {
    proxy.$router.push(tab.path)
  }
}

// 关闭 tab → 如果关闭的是当前页则跳转到相邻 tab
function handleTabRemove(name: string) {
  const nextTab = removeTab(name)
  if (nextTab) {
    proxy.$router.push(nextTab.path)
  }
}
</script>

<template>
  <div class="home">
    <el-container style="height: 100%; padding: 8px;">
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="$route.name">
            <template v-for="menu in menus">
              <el-submenu
                v-if="menu.subMenus && menu.subMenus.length"
                :key="menu.index"
                :index="menu.index"
              >
                <template #title>
                  <i :class="menu.icon" />
                  <span>{{ menu.text }}</span>
                </template>
                <el-menu-item-group>
                  <router-link
                    v-for="sub in menu.subMenus"
                    :key="sub.index"
                    :to="{ name: sub.routerName }"
                  >
                    <el-menu-item :index="sub.routerName">
                      {{ sub.text }}
                    </el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
              <router-link v-else :key="menu.index" :to="{ name: menu.routerName }">
                <el-menu-item :index="menu.routerName">
                  <i :class="menu.icon" />
                  <span>{{ menu.text }}</span>
                </el-menu-item>
              </router-link>
            </template>
          </el-menu>
        </el-aside>

        <el-container>
          <el-main>
            <!-- 自定义多页签栏 -->
            <div class="tab-bar">
              <div
                v-for="tab in tabs"
                :key="tab.name"
                class="tab-item"
                :class="{ 'is-active': activeTab === tab.name }"
                @click="handleTabChange(tab.name)"
              >
                <span class="tab-item__title">{{ tab.title }}</span>
                <span class="tab-item__close" @click.stop="handleTabRemove(tab.name)">×</span>
              </div>
            </div>

            <!-- 页面内容 -->
            <keep-alive>
              <router-view :key="$route.fullPath" />
            </keep-alive>
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
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: calc(100vh - 176px);
  display: flex;
  flex-direction: column;
  padding: 0;
}

/* 自定义页签栏 */
.tab-bar {
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  overflow-x: auto;
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 8px;
  gap: 4px;
}

.tab-bar::-webkit-scrollbar {
  height: 4px;
}

.tab-bar::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 36px;
  font-size: 13px;
  color: #606266;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: color 0.2s, background 0.2s;
  margin-top: 4px;
}

.tab-item:hover {
  color: #409eff;
}

.tab-item.is-active {
  color: #409eff;
  background: #fff;
  border-color: #e4e7ed;
  margin-bottom: -1px;
}

.tab-item__title {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-item__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 14px;
  line-height: 1;
  border-radius: 50%;
  color: #909399;
  transition: background 0.2s, color 0.2s;
}

.tab-item__close:hover {
  background: #c0c4cc;
  color: #fff;
}

/* router-view 区域自适应剩余高度 */
.el-main > .tab-bar + * {
  flex: 1;
  overflow: auto;
  padding: 12px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-menu > a {
  text-decoration: none;
}
</style>
