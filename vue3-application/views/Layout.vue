<script lang="ts" setup>
import { Bell } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface SubMenuSource {
  text: string
  routerName: string
}

interface SubMenu extends SubMenuSource {
  index: string
}

interface MenuSource {
  text: string
  icon: string
  routerName?: string
  subMenus?: SubMenuSource[]
}

interface Menu extends MenuSource {
  index: string
  subMenus?: SubMenu[]
}

const baseMenus: MenuSource[] = [
  {
    text: '服务管理',
    icon: 'setting',
    subMenus: [
      { text: '服务信息', routerName: 'service' },
    ],
  },
  {
    text: '产品管理',
    icon: 'menu',
    subMenus: [
      { text: '产品信息', routerName: 'productList' },
      { text: '新增', routerName: 'productEdit' },
    ],
  },
  {
    text: '费用管理',
    icon: 'money',
    subMenus: [
      { text: '费用类型', routerName: 'expenseType' },
    ],
  },
  {
    text: '知识库',
    icon: 'collection',
    routerName: 'knowledge',
  },
  {
    text: '记账管理',
    icon: 'money',
    subMenus: [
      { text: '记账列表', routerName: 'accounting' },
    ],
  },
  {
    text: '关于我们',
    icon: 'message',
    routerName: 'about',
  },
]

const menus: Menu[] = baseMenus.map((menu, i) => ({
  ...menu,
  index: `${i}`,
  subMenus: menu.subMenus
    ? menu.subMenus.map((sub, j) => ({
        ...sub,
        index: `${i}-${j}`,
      }))
    : undefined,
}))

const defaultMenu = menus.find(menu => menu.routerName || (menu.subMenus && menu.subMenus.length))
const defaultActive = defaultMenu?.routerName ?? defaultMenu?.subMenus?.[0]?.routerName ?? ''

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => (route.meta.activeMenu as string) || (route.name?.toString() ?? defaultActive))

const breadcrumbPath = computed(() => {
  const active = activeMenu.value
  const metaBreadcrumb = route.meta?.breadcrumb

  if (Array.isArray(metaBreadcrumb) && metaBreadcrumb.length)
    return metaBreadcrumb.join(' / ')
  if (typeof metaBreadcrumb === 'string' && metaBreadcrumb)
    return metaBreadcrumb

  for (const menu of menus) {
    if (menu.routerName === active)
      return menu.text
    const sub = menu.subMenus?.find(item => item.routerName === active)
    if (sub)
      return `${menu.text} / ${sub.text}`
  }

  return ''
})

function handleMenuClick(name?: string) {
  if (!name || name === activeMenu.value)
    return
  router.push({ name })
}
</script>

<template>
  <div class="layout">
    <aside class="layout__sidebar">
      <div class="layout__brand">
        <div class="layout__brand-text">
          <span class="layout__brand-title">记账管理系统</span>
        </div>
      </div>
      <el-scrollbar class="layout__menu-scroll">
        <el-menu
          class="layout__menu"
          :default-active="activeMenu"
          background-color="transparent"
          text-color="rgba(255,255,255,0.78)"
          active-text-color="#ffffff"
          unique-opened
        >
          <template v-for="menu in menus" :key="menu.index">
            <el-sub-menu
              v-if="menu.subMenus && menu.subMenus.length"
              :index="menu.index"
              class="layout__sub-menu"
            >
              <template #title>
                <span>{{ menu.text }}</span>
              </template>
              <el-menu-item
                v-for="sub in menu.subMenus"
                :key="sub.index"
                :index="sub.routerName"
                @click="handleMenuClick(sub.routerName)"
              >
                {{ sub.text }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item
              v-else
              :index="menu.routerName"
              class="layout__menu-leaf"
              @click="handleMenuClick(menu.routerName)"
            >
              <span>{{ menu.text }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </aside>
    <main class="layout__main">
      <header class="layout__header">
        <div class="layout__header-left">
          <div class="layout__breadcrumb">
            <span class="layout__breadcrumb-path">
              {{ breadcrumbPath || '首页' }}
            </span>
          </div>
        </div>
        <div class="layout__header-right">
          <el-icon class="layout__header-icon">
            <Bell />
          </el-icon>
          <el-avatar class="layout__avatar" size="small">
            金
          </el-avatar>
        </div>
      </header>

      <section class="layout__workspace">
        <div class="layout__content">
          <router-view />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  height: 100%;
  background: #f6f8fb;
  color: #1f2333;
}

.layout__sidebar {
  background: linear-gradient(180deg, #0d2c5f 0%, #1f4696 100%);
  padding: 24px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #ffffff;
}

.layout__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.layout__brand-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
}

.layout__brand-title {
  font-size: 16px;
  font-weight: 600;
}

.layout__brand-subtitle {
  font-size: 12px;
  opacity: 0.75;
}

.layout__company-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.4;
}

.layout__menu-scroll {
  flex: 1;
  margin-right: -12px;
  padding-right: 12px;
}

:deep(.layout__menu.el-menu) {
  background-color: transparent;
  border-right: none;
}

:deep(.layout__menu .el-menu-item),
:deep(.layout__menu .el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  border-radius: 10px;
  margin: 4px 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.78);
  transition: all 0.2s ease;
}

:deep(.layout__menu .el-sub-menu.is-opened > .el-sub-menu__title) {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

:deep(.layout__menu .el-menu-item.is-active) {
  background: #ff8714;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(255, 135, 20, 0.35);
}

:deep(.layout__menu .el-menu-item:hover),
:deep(.layout__menu .el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

.layout__menu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  margin-right: 12px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 13px;
  font-weight: 600;
}

.layout__main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.layout__header {
  background: #ffffff;
  padding: 18px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(15, 35, 95, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.layout__header-left {
  display: flex;
  align-items: center;
  gap: 28px;
}

.layout__breadcrumb {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.layout__breadcrumb-company {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d5e;
}

.layout__breadcrumb-path {
  font-size: 13px;
  color: #6a7cb4;
}

.layout__tabs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.layout__tab {
  padding: 6px 18px;
  border-radius: 18px;
  background: #eef1fb;
  color: #3453aa;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.layout__tab.is-active {
  background: #ff8714;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(255, 135, 20, 0.35);
}

.layout__header-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.layout__search {
  width: 240px;
}

.layout__header-icon {
  font-size: 20px;
  color: #7a8dbf;
  cursor: pointer;
  padding: 6px;
  border-radius: 12px;
  transition: background 0.2s ease, color 0.2s ease;
}

.layout__header-icon:hover {
  background: #eff2fb;
  color: #ff8714;
}

:deep(.layout__avatar.el-avatar) {
  background: linear-gradient(135deg, #ffb347 0%, #ff8640 100%);
  font-weight: 600;
  color: #ffffff;
}

.layout__workspace {
  padding: 24px;
  flex: 1;
  overflow-y: hidden;
}

.layout__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.layout__stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px;
  min-width: 220px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 18px 36px rgba(15, 35, 95, 0.08);
}

.layout__stat-label {
  font-size: 14px;
  color: #46588f;
}

.layout__stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.layout__stat-number {
  font-size: 22px;
  font-weight: 700;
  color: #ff8714;
}

.layout__stat-unit {
  font-size: 13px;
  color: #7f8db8;
}

.layout__content {
  height: 100%;
}

:deep(.layout__content > *) {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(15, 35, 95, 0.08);
}

:deep(.layout__content > .el-card) {
  border: none;
}

:deep(.layout__content > .el-card .el-card__body) {
  padding: 24px;
}
</style>
