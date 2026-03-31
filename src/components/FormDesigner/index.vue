<script lang="ts" setup>
import type { FormFieldConfig, FormSchema, WidgetKey } from './types'
import { nanoid } from 'nanoid'
import { computed, ref } from 'vue'
import CenterCanvas from './CenterCanvas.vue'
import LeftPanel from './LeftPanel.vue'
import RightPanel from './RightPanel.vue'
import { FORM_SCHEMA_VERSION } from './types'
import { createDefaultFieldPartial, WIDGET_KEYS } from './widgetRegistry'

const components = ref<FormFieldConfig[]>([])
const selectedId = ref<string | null>(null)

const selectedComponent = computed(() => {
  if (!selectedId.value)
    return null
  return components.value.find(c => c.id === selectedId.value) || null
})

function isWidgetKey(value: string): value is WidgetKey {
  return WIDGET_KEYS.includes(value as WidgetKey)
}

function cloneField(field: FormFieldConfig): FormFieldConfig {
  return {
    ...field,
    options: field.options?.map(option => ({ ...option })),
  }
}

function handleAddComponent(type: string, index: number) {
  if (!isWidgetKey(type))
    return
  const w = type
  const defaults = createDefaultFieldPartial(w)
  const newComponent: FormFieldConfig = {
    id: nanoid(),
    type: w,
    fieldName: '',
    label: '',
    placeholder: '',
    required: false,
    ...defaults,
  }
  const insertIndex = index < 0 ? components.value.length : index
  components.value.splice(insertIndex, 0, newComponent)
  selectedId.value = newComponent.id
}

function handleSelectComponent(id: string) {
  selectedId.value = id
}

function handleRemoveComponent(id: string) {
  const index = components.value.findIndex(c => c.id === id)
  if (index > -1) {
    components.value.splice(index, 1)
    if (selectedId.value === id)
      selectedId.value = null
  }
}

function handleUpdateField(id: string, patch: Partial<FormFieldConfig>) {
  const component = components.value.find(c => c.id === id)
  if (component)
    Object.assign(component, patch)
}

function getSchema(): FormSchema {
  return {
    schemaVersion: FORM_SCHEMA_VERSION,
    fields: components.value.map(cloneField),
  }
}

function setSchema(schema: FormSchema) {
  if (schema.schemaVersion !== FORM_SCHEMA_VERSION) {
    console.warn(`[FormDesigner] schema version ${schema.schemaVersion}, expected ${FORM_SCHEMA_VERSION}`)
  }
  components.value = schema.fields.map(cloneField)
  selectedId.value = null
}

defineExpose({
  /** 导出字段数组（兼容旧用法，给 Uni 建议用 getSchema） */
  getData: () => components.value.map(cloneField),
  setData: (data: FormFieldConfig[]) => {
    components.value = data.map(cloneField)
    selectedId.value = null
  },
  getSchema,
  setSchema,
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
      @update-field="handleUpdateField"
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
