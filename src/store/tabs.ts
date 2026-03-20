import { reactive, ref } from 'vue'

export interface TabItem {
  title: string
  name: string // 路由 name，作为 tab 唯一 key
  path: string // 完整路径，用于 $router.push
}

// 模块级共享状态（Vue 2.7 支持，相当于轻量 store）
const tabs = reactive<TabItem[]>([])
const activeTab = ref<string>('')

export function useTabs() {
  function addTab(tab: TabItem) {
    const exists = tabs.find(t => t.name === tab.name)
    if (!exists) {
      tabs.push(tab)
    }
    activeTab.value = tab.name
  }

  // 关闭 tab，返回需要跳转的相邻 tab（关闭的是当前激活项时）
  function removeTab(name: string): TabItem | null {
    const index = tabs.findIndex(t => t.name === name)
    if (index === -1)
      return null

    tabs.splice(index, 1)

    if (activeTab.value === name) {
      const nextTab = tabs[index] ?? tabs[index - 1]
      if (nextTab) {
        activeTab.value = nextTab.name
        return nextTab
      }
    }
    return null
  }

  return { tabs, activeTab, addTab, removeTab }
}
