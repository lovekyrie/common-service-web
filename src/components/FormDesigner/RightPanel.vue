<script lang="ts" setup>
import type { ComponentConfig } from './types'

defineProps<{
  component: ComponentConfig | null
}>()

const emit = defineEmits<{
  update: [id: string, key: keyof ComponentConfig, value: string | boolean]
}>()

function handleChange(id: string, key: keyof ComponentConfig, value: string | boolean) {
  emit('update', id, key, value)
}
</script>

<template>
  <div class="right-panel">
    <div class="right-panel__title">
      属性配置
    </div>

    <div v-if="component" class="property-form">
      <div class="property-item">
        <label class="property-item__label">字段名（英文）</label>
        <el-input
          :model-value="component.fieldName"
          placeholder="请输入英文字段名"
          @update:model-value="handleChange(component.id, 'fieldName', $event)"
        />
      </div>

      <div class="property-item">
        <label class="property-item__label">标题（中文）</label>
        <el-input
          :model-value="component.label"
          placeholder="请输入中文标题"
          @update:model-value="handleChange(component.id, 'label', $event)"
        />
      </div>

      <div class="property-item">
        <label class="property-item__label">占位提示</label>
        <el-input
          :model-value="component.placeholder"
          placeholder="请输入占位提示"
          @update:model-value="handleChange(component.id, 'placeholder', $event)"
        />
      </div>

      <div class="property-item">
        <label class="property-item__label">
          <el-checkbox
            :model-value="component.required"
            @update:model-value="handleChange(component.id, 'required', $event)"
          >
            必填
          </el-checkbox>
        </label>
      </div>
    </div>

    <div v-else class="empty-tip">
      <el-icon :size="40" color="#c0c4cc">
        <Setting />
      </el-icon>
      <p>请选择中间区域的组件</p>
    </div>
  </div>
</template>

<style scoped>
.right-panel {
  width: 280px;
  background: #ffffff;
  border-left: 1px solid #eef1fb;
  padding: 16px;
  overflow-y: auto;
}

.right-panel__title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef1fb;
}

.property-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property-item__label {
  font-size: 13px;
  color: #606266;
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
