<script lang="ts" setup>
import type { FormFieldConfig } from '../types'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  widget: FormFieldConfig
  mode?: 'design' | 'preview'
}>(), { mode: 'design' })

/** 展示用字符串（千分位）；底层数值在预览态用 raw 存 */
const display = ref('')
const rawNumber = ref<number | null>(null)

function formatThousands(num: number): string {
  const [intPart, dec = ''] = String(num).split('.')
  const intFmt = Number(intPart).toLocaleString('zh-CN')
  return dec ? `${intFmt}.${dec.slice(0, 2)}` : intFmt
}

function parseInput(s: string): number | null {
  const cleaned = s.replace(/,/g, '').trim()
  if (cleaned === '' || cleaned === '.')
    return null
  const n = Number(cleaned)
  return Number.isNaN(n) ? null : n
}

function onInput(val: string) {
  let v = val.replace(/[^\d.]/g, '')
  const parts = v.split('.')
  if (parts.length > 2)
    v = `${parts[0]}.${parts.slice(1).join('')}`
  if (parts[1])
    v = `${parts[0]}.${parts[1].slice(0, 2)}`
  const n = parseInput(v)
  rawNumber.value = n
  display.value = n === null ? v : formatThousands(n)
}

const placeholder = computed(() =>
  props.widget.placeholder || (props.widget.label ? `请输入${props.widget.label}` : '请输入金额'),
)
</script>

<template>
  <el-input
    :model-value="display"
    :placeholder="placeholder"
    class="pc-widget-currency"
    @update:model-value="onInput"
  />
</template>

<style scoped>
.pc-widget-currency :deep(.el-input__inner) {
  text-align: right;
}
</style>
