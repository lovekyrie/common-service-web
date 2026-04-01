<script lang="ts" setup>
import type { WidgetKey } from './types'
import { ArrowDown, Calendar, Coin, Document, Edit, Odometer } from '@element-plus/icons-vue'
import { WIDGET_KEYS, WIDGET_REGISTRY } from './widgetRegistry'

defineProps<{
  drag?: boolean
}>()

const iconMap: Record<string, any> = {
  Edit,
  Document,
  Coin,
  Odometer,
  Calendar,
  ArrowDown,
}

function handleDragStart(event: DragEvent, type: WidgetKey) {
  event.dataTransfer?.setData('componentType', type)
}
</script>

<template>
  <div class="left-panel">
    <div class="left-panel__title">
      组件库
    </div>
    <div class="left-panel__list">
      <div
        v-for="type in WIDGET_KEYS"
        :key="type"
        class="component-item"
        draggable="true"
        @dragstart="handleDragStart($event, type)"
      >
        <el-icon class="component-item__icon">
          <component :is="iconMap[WIDGET_REGISTRY[type].icon]" />
        </el-icon>
        <span class="component-item__name">{{ WIDGET_REGISTRY[type].displayName }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.left-panel {
  width: 200px;
  background: #ffffff;
  border-right: 1px solid #eef1fb;
  padding: 16px;
  overflow-y: auto;
}

.left-panel__title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef1fb;
}

.left-panel__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f6f8fb;
  border-radius: 8px;
  cursor: move;
  transition: all 0.2s ease;
}

.component-item:hover {
  background: #eef1fb;
  box-shadow: 0 2px 8px rgba(15, 35, 95, 0.1);
}

.component-item__icon {
  font-size: 16px;
  color: #6a7cb4;
}

.component-item__name {
  font-size: 13px;
  color: #1f2333;
}
</style>
