<script lang="ts" setup>
import type { FormFieldConfig } from './types'
import { Close, Edit } from '@element-plus/icons-vue'
import RenderWidget from './RenderWidget.vue'

defineProps<{
  components: FormFieldConfig[]
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
  add: [type: string, index: number]
  remove: [id: string]
}>()

function handleDrop(event: DragEvent, index: number) {
  event.preventDefault()
  const type = event.dataTransfer?.getData('componentType')
  if (type) {
    emit('add', type, index)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleCanvasDrop(event: DragEvent) {
  event.preventDefault()
  const target = event.target as HTMLElement | null

  if (target?.closest('.drop-zone')) {
    return
  }

  const type = event.dataTransfer?.getData('componentType')
  if (type) {
    emit('add', type, -1)
  }
}
</script>

<template>
  <div class="center-canvas">
    <div class="center-canvas__title">
      表单画布
    </div>
    <div class="canvas-content" @dragover="handleDragOver" @drop="handleCanvasDrop">
      <!-- 拖拽到顶部时的放置区域 -->
      <div
        class="drop-zone"
        @drop.stop="handleDrop($event, 0)"
        @dragover="handleDragOver"
      />

      <template v-for="(component, index) in components" :key="component.id">
        <div
          class="canvas-item"
          :class="{ 'is-selected': selectedId === component.id }"
          @click="emit('select', component.id)"
        >
          <div class="canvas-item__header">
            <span class="canvas-item__label">{{ component.label || '未命名' }}</span>
            <el-icon
              class="canvas-item__remove"
              @click.stop="emit('remove', component.id)"
            >
              <Close />
            </el-icon>
          </div>
          <div class="canvas-item__widget">
            <RenderWidget :component="component" />
          </div>
        </div>
        <!-- 每个组件之间的放置区域 -->
        <div
          class="drop-zone"
          @drop.stop="handleDrop($event, index + 1)"
          @dragover="handleDragOver"
        />
      </template>

      <!-- 空状态提示 -->
      <div v-if="components.length === 0" class="empty-tip">
        <el-icon :size="40" color="#c0c4cc">
          <Edit />
        </el-icon>
        <p>从左侧拖拽组件到这里</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.center-canvas {
  flex: 1;
  background: #f6f8fb;
  padding: 16px;
  overflow-y: auto;
}

.center-canvas__title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef1fb;
  background: #ffffff;
  padding: 16px;
  border-radius: 8px 8px 0 0;
}

.canvas-content {
  background: #ffffff;
  min-height: 500px;
  border-radius: 0 0 8px 8px;
  padding: 16px;
}

.drop-zone {
  height: 4px;
  background: transparent;
  transition: all 0.2s ease;
  margin: 4px 0;
}

.drop-zone:hover {
  height: 20px;
  background: #e6f0ff;
  border: 2px dashed #409eff;
  border-radius: 4px;
}

.canvas-item {
  background: #f6f8fb;
  border: 2px solid transparent;
  border-radius: 8px;
  margin: 8px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.canvas-item:hover {
  border-color: #409eff;
}

.canvas-item.is-selected {
  border-color: #ff8714;
  background: #fff8f0;
}

.canvas-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #eef1fb;
}

.canvas-item__label {
  font-size: 13px;
  color: #1f2333;
  font-weight: 500;
}

.canvas-item__remove {
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.canvas-item:hover .canvas-item__remove {
  opacity: 1;
}

.canvas-item__remove:hover {
  color: #f56c6c;
}

.canvas-item__widget {
  padding: 12px;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #c0c4cc;
}

.empty-tip p {
  margin-top: 12px;
  font-size: 14px;
}
</style>
