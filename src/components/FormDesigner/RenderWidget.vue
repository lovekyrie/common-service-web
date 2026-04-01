<script setup lang="ts">
import type { FormFieldConfig } from './types'
import { computed } from 'vue'
import { getPcWidgetComponent } from './widgetRegistry'

const props = withDefaults(defineProps<{
  component: FormFieldConfig
  mode?: 'design' | 'preview'
}>(), { mode: 'design' })

/** PC 端用注册表里注册的 Vue 组件（Uni 端用同 `component.type` 映射到其它组件即可） */
const Resolved = computed(() => getPcWidgetComponent(props.component.type))
</script>

<template>
  <div class="render-widget">
    <component
      :is="Resolved"
      :widget="props.component"
      :mode="props.mode"
    />
  </div>
</template>

<style scoped>
.render-widget {
  flex: 1;
  width: 100%;
}
</style>
