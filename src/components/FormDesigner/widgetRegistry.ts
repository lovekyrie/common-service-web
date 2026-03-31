import type { Component } from 'vue'
import type { FormFieldConfig, WidgetKey } from './types'
import PcWidgetCurrency from './widgets/PcWidgetCurrency.vue'
import PcWidgetDate from './widgets/PcWidgetDate.vue'
import PcWidgetInput from './widgets/PcWidgetInput.vue'
import PcWidgetNumber from './widgets/PcWidgetNumber.vue'
import PcWidgetSelect from './widgets/PcWidgetSelect.vue'
import PcWidgetTextarea from './widgets/PcWidgetTextarea.vue'

export interface WidgetRegistryEntry {
  displayName: string
  icon: string
  pcComponent: Component
  defaults: Partial<Pick<FormFieldConfig, 'placeholder' | 'options' | 'min' | 'max' | 'step' | 'dateType'>>
}

export const WIDGET_REGISTRY: Record<WidgetKey, WidgetRegistryEntry> = {
  input: {
    displayName: '单行文本',
    icon: 'Edit',
    pcComponent: PcWidgetInput,
    defaults: {},
  },
  textarea: {
    displayName: '多行文本',
    icon: 'Document',
    pcComponent: PcWidgetTextarea,
    defaults: {},
  },
  currency: {
    displayName: '千分位输入',
    icon: 'Coin',
    pcComponent: PcWidgetCurrency,
    defaults: {},
  },
  number: {
    displayName: '数字输入',
    icon: 'Odometer',
    pcComponent: PcWidgetNumber,
    defaults: { min: undefined, max: undefined, step: 1 },
  },
  date: {
    displayName: '日期选择',
    icon: 'Calendar',
    pcComponent: PcWidgetDate,
    defaults: { dateType: 'date' },
  },
  select: {
    displayName: '下拉选择',
    icon: 'ArrowDown',
    pcComponent: PcWidgetSelect,
    defaults: {
      options: [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
      ],
    },
  },
}

export const WIDGET_KEYS = Object.keys(WIDGET_REGISTRY) as WidgetKey[]

export function getPcWidgetComponent(type: WidgetKey): Component {
  return WIDGET_REGISTRY[type]?.pcComponent ?? WIDGET_REGISTRY.input.pcComponent
}

export function createDefaultFieldPartial(type: WidgetKey): Partial<FormFieldConfig> {
  const defaults = WIDGET_REGISTRY[type]?.defaults ?? {}
  return {
    ...defaults,
    options: defaults.options?.map(option => ({ ...option })),
  }
}
