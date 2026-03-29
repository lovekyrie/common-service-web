<script setup lang="ts">
import type { ComponentConfig } from './types'

defineProps<{
  component: ComponentConfig
  mode?: 'design' | 'preview'
}>()

// 千分位输入处理
function handleCurrencyInput(event: Event) {
  const input = event.target as HTMLInputElement
  // 只允许数字和小数点
  let value = input.value.replace(/[^\d.]/g, '')
  // 确保只有一个小数点
  const parts = value.split('.')
  if (parts.length > 2) {
    value = `${parts[0]}.${parts.slice(1).join('')}`
  }
  // 小数点后最多两位
  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2)
    value = `${parts[0]}.${parts[1]}`
  }
  const num = Number(value)
  if (!Number.isNaN(num) && value !== '') {
    // 显示千分位格式
    const [intPart, decPart] = value.split('.')
    input.value = Number(intPart).toLocaleString('zh-CN') + (decPart ? `.${decPart}` : '')
  }
  else if (value === '') {
    input.value = ''
  }
}
</script>

<template>
  <div class="render-widget">
    <!-- 单行文本 -->
    <template v-if="component.type === 'input'">
      <input
        type="text"
        class="widget-input"
        :placeholder="component.placeholder || `请输入${component.label}`"
        :value="component.fieldName"
        :disabled="mode === 'design'"
      >
    </template>

    <!-- 多行文本 -->
    <template v-else-if="component.type === 'textarea'">
      <textarea
        class="widget-textarea"
        :placeholder="component.placeholder || `请输入${component.label}`"
        :disabled="mode === 'design'"
      />
    </template>

    <!-- 千分位输入 -->
    <template v-else-if="component.type === 'currency'">
      <input
        type="text"
        class="widget-input widget-input--currency"
        :placeholder="component.placeholder || `请输入${component.label}`"
        :value="component.fieldName"
        :disabled="mode === 'design'"
        @input="handleCurrencyInput"
      >
    </template>

    <!-- 数字输入 -->
    <template v-else-if="component.type === 'number'">
      <input
        type="number"
        class="widget-input widget-input--number"
        :placeholder="component.placeholder || `请输入${component.label}`"
        :disabled="mode === 'design'"
      >
    </template>

    <!-- 日期选择 -->
    <template v-else-if="component.type === 'date'">
      <input
        type="date"
        class="widget-input widget-input--date"
        :disabled="mode === 'design'"
      >
    </template>

    <!-- 下拉选择 -->
    <template v-else-if="component.type === 'select'">
      <select class="widget-select" :disabled="mode === 'design'">
        <option value="">
          {{ component.placeholder || `请选择${component.label}` }}
        </option>
      </select>
    </template>

    <!-- 兜底 -->
    <template v-else>
      <input
        type="text"
        class="widget-input"
        :placeholder="component.placeholder || component.label"
        :disabled="mode === 'design'"
      >
    </template>
  </div>
</template>

<style scoped>
.render-widget {
  flex: 1;
}

.widget-input,
.widget-textarea,
.widget-select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: #303133;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.widget-input:focus,
.widget-textarea:focus,
.widget-select:focus {
  border-color: #409eff;
}

.widget-input:disabled,
.widget-textarea:disabled,
.widget-select:disabled {
  background: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}

.widget-textarea {
  min-height: 80px;
  resize: vertical;
}

.widget-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236a7cb4' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.widget-input--currency {
  text-align: right;
}

.widget-input--number {
  text-align: right;
}
</style>
