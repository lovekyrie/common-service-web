<script lang="ts" setup>
import type { FormFieldConfig } from '../types'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  widget: FormFieldConfig
  mode?: 'design' | 'preview'
}>(), { mode: 'design' })

const inner = ref<string | number | ''>('')

const options = computed(() => props.widget.options ?? [])

const placeholder = computed(() =>
  props.widget.placeholder || (props.widget.label ? `请选择${props.widget.label}` : '请选择'),
)
</script>

<template>
  <el-select
    :model-value="inner"
    :placeholder="placeholder"
    clearable
    filterable
    style="width: 100%"
    @update:model-value="(v) => { inner = v }"
  >
    <el-option
      v-for="opt in options"
      :key="String(opt.value)"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>
