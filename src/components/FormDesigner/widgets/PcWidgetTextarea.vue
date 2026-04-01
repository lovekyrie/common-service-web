<script lang="ts" setup>
import type { FormFieldConfig } from '../types'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  widget: FormFieldConfig
  mode?: 'design' | 'preview'
}>(), { mode: 'design' })

const inner = ref('')

const placeholder = computed(() =>
  props.widget.placeholder || (props.widget.label ? `请输入${props.widget.label}` : '请输入'),
)
</script>

<template>
  <el-input
    type="textarea"
    :rows="4"
    :model-value="inner"
    :placeholder="placeholder"
    resize="vertical"
    @update:model-value="(v) => { inner = v }"
  />
</template>
