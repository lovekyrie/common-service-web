<script lang="ts" setup>
import type { FormFieldConfig } from '../types'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  widget: FormFieldConfig
  mode?: 'design' | 'preview'
}>(), { mode: 'design' })

const inner = ref<number | undefined>(undefined)

const placeholder = computed(() =>
  props.widget.placeholder || (props.widget.label ? `请输入${props.widget.label}` : '请输入数字'),
)
</script>

<template>
  <el-input-number
    :model-value="inner"
    :placeholder="placeholder"
    :min="widget.min"
    :max="widget.max"
    :step="widget.step ?? 1"
    controls-position="right"
    class="pc-widget-number"
    style="width: 100%"
    @update:model-value="(v) => { inner = v as number | undefined }"
  />
</template>
