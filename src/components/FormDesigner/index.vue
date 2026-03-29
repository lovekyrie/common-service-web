<script lang="ts" setup>
import type { ComponentConfig, ComponentType } from './types'
import { nanoid } from 'nanoid'
import { computed, ref } from 'vue'
import CenterCanvas from './CenterCanvas.vue'
import LeftPanel from './LeftPanel.vue'

import RightPanel from './RightPanel.vue'

// 已放置的组件列表
const components = ref<ComponentConfig[]>([])

// 当前选中的组件 ID
const selectedId = ref<string | null>(null)

// 当前选中的组件
const selectedComponent = computed(() => {
  if (!selectedId.value)
    return null
  return components.value.find(c => c.id === selectedId.value) || null
})

// 添加组件到画布
function handleAddComponent(type: string, index: number) {
  const newComponent: ComponentConfig = {
    id: nanoid(),
    type: type as ComponentType,
    fieldName: '',
    label: '',
    placeholder: '',
    required: false,
  }
  const insertIndex = index < 0 ? components.value.length : index
  components.value.splice(insertIndex, 0, newComponent)
  selectedId.value = newComponent.id
}

// 选择组件
function handleSelectComponent(id: string) {
  selectedId.value = id
}

// 移除组件
function handleRemoveComponent(id: string) {
  const index = components.value.findIndex(c => c.id === id)
  if (index > -1) {
    components.value.splice(index, 1)
    if (selectedId.value === id) {
      selectedId.value = null
    }
  }
}

// 更新组件属性
function handleUpdateProperty(id: string, key: keyof ComponentConfig, value: string | boolean) {
  const component = components.value.find(c => c.id === id)
  if (component) {
    (component as any)[key] = value
  }
}

// 暴露方法给外部使用
defineExpose({
  getData: () => components.value,
  setData: (data: ComponentConfig[]) => { components.value = data },
})
</script>

<template>
  <div class="form-designer">
    <LeftPanel />
    <CenterCanvas
      :components="components"
      :selected-id="selectedId"
      @add="handleAddComponent"
      @select="handleSelectComponent"
      @remove="handleRemoveComponent"
    />
    <RightPanel
      :component="selectedComponent"
      @update="handleUpdateProperty"
    />
  </div>
</template>

<style scoped>
.form-designer {
  display: flex;
  height: 100%;
  background: #f6f8fb;
}
</style>
