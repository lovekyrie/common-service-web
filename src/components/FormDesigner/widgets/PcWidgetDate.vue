<script lang="ts" setup>
import type { FormFieldConfig } from '../types'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  widget: FormFieldConfig
  mode?: 'design' | 'preview'
}>(), { mode: 'design' })

const inner = ref<string | Date | null>(null)

const pickerType = computed(() =>
  props.widget.dateType === 'datetime' ? 'datetime' : 'date',
)

const valueFormat = computed(() =>
  pickerType.value === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
)

const displayFormat = computed(() =>
  pickerType.value === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
)

const placeholder = computed(() =>
  props.widget.placeholder || (props.widget.label ? `选择${props.widget.label}` : '选择日期'),
)
</script>

<template>
  <el-date-picker
    :model-value="inner"
    :type="pickerType"
    :placeholder="placeholder"
    :value-format="valueFormat"
    :format="displayFormat"
    style="width: 100%"
    @update:model-value="(v) => { inner = v }"
  />
</template>
