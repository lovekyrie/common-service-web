// 组件类型
export type ComponentType = 'input' | 'textarea' | 'currency' | 'number' | 'date' | 'select'

// 组件配置
export interface ComponentConfig {
  id: string
  type: ComponentType
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
}

// 组件定义（用于左侧面板展示）
export interface ComponentDefinition {
  type: ComponentType
  name: string
  icon: string
}

// 预定义的组件列表
export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  { type: 'input', name: '单行文本', icon: 'Edit' },
  { type: 'textarea', name: '多行文本', icon: 'Document' },
  { type: 'currency', name: '千分位输入', icon: 'Coin' },
  { type: 'number', name: '数字输入', icon: 'Odometer' },
  { type: 'date', name: '日期选择', icon: 'Calendar' },
  { type: 'select', name: '下拉选择', icon: 'ArrowDown' },
]
