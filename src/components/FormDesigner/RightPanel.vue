<script lang="ts" setup>
import type { FormFieldConfig, SelectOption } from './types'
import { Plus, Setting } from '@element-plus/icons-vue'

defineProps<{
  component: FormFieldConfig | null
}>()

const emit = defineEmits<{
  updateField: [id: string, patch: Partial<FormFieldConfig>]
}>()

function patch(id: string, partial: Partial<FormFieldConfig>) {
  emit('updateField', id, partial)
}

function addOption(component: FormFieldConfig) {
  const next = [...(component.options ?? []), { label: `选项${(component.options?.length ?? 0) + 1}`, value: '' }]
  patch(component.id, { options: next })
}

function removeOption(component: FormFieldConfig, index: number) {
  const next = (component.options ?? []).filter((_, i) => i !== index)
  patch(component.id, { options: next })
}

function setOption(component: FormFieldConfig, index: number, key: keyof SelectOption, value: string) {
  const next = (component.options ?? []).map((o, i) =>
    i === index ? { ...o, [key]: value } : o,
  )
  patch(component.id, { options: next })
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
          @update:model-value="patch(component.id, { fieldName: $event })"
        />
      </div>

      <div class="property-item">
        <label class="property-item__label">标题（中文）</label>
        <el-input
          :model-value="component.label"
          placeholder="请输入中文标题"
          @update:model-value="patch(component.id, { label: $event })"
        />
      </div>

      <div class="property-item">
        <label class="property-item__label">占位提示</label>
        <el-input
          :model-value="component.placeholder"
          placeholder="请输入占位提示"
          @update:model-value="patch(component.id, { placeholder: $event })"
        />
      </div>

      <div class="property-item">
        <label class="property-item__label">
          <el-checkbox
            :model-value="component.required"
            @update:model-value="patch(component.id, { required: $event })"
          >
            必填
          </el-checkbox>
        </label>
      </div>

      <template v-if="component.type === 'number'">
        <div class="property-item">
          <label class="property-item__label">最小值</label>
          <el-input-number
            :model-value="component.min"
            controls-position="right"
            placeholder="可选"
            style="width: 100%"
            @update:model-value="patch(component.id, { min: $event ?? undefined })"
          />
        </div>
        <div class="property-item">
          <label class="property-item__label">最大值</label>
          <el-input-number
            :model-value="component.max"
            controls-position="right"
            placeholder="可选"
            style="width: 100%"
            @update:model-value="patch(component.id, { max: $event ?? undefined })"
          />
        </div>
        <div class="property-item">
          <label class="property-item__label">步长</label>
          <el-input-number
            :model-value="component.step ?? 1"
            :min="0"
            controls-position="right"
            style="width: 100%"
            @update:model-value="patch(component.id, { step: $event ?? 1 })"
          />
        </div>
      </template>

      <div v-if="component.type === 'date'" class="property-item">
        <label class="property-item__label">日期类型</label>
        <el-radio-group
          :model-value="component.dateType ?? 'date'"
          @update:model-value="patch(component.id, { dateType: $event as 'date' | 'datetime' })"
        >
          <el-radio-button label="date">
            日期
          </el-radio-button>
          <el-radio-button label="datetime">
            日期时间
          </el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="component.type === 'select'" class="property-item options-block">
        <div class="options-block__head">
          <label class="property-item__label">下拉选项</label>
          <el-button type="primary" link :icon="Plus" @click="addOption(component)">
            添加
          </el-button>
        </div>
        <div
          v-for="(opt, idx) in component.options ?? []"
          :key="idx"
          class="option-row"
        >
          <el-input
            :model-value="opt.label"
            placeholder="显示文本"
            @update:model-value="setOption(component, idx, 'label', $event)"
          />
          <el-input
            :model-value="opt.value"
            placeholder="值"
            @update:model-value="setOption(component, idx, 'value', $event)"
          />
          <el-button type="danger" link @click="removeOption(component, idx)">
            删除
          </el-button>
        </div>
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

.options-block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #ebeef5;
}

.option-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
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
