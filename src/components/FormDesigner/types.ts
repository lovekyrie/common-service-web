/** 跨端控件键：PC 用 Element Plus，UniApp 按同 key 映射到 u- / uni- 组件 */
export type WidgetKey = 'input' | 'textarea' | 'currency' | 'number' | 'date' | 'select'

/** @deprecated 使用 WidgetKey，保留别名避免外部引用大面积改名 */
export type ComponentType = WidgetKey

export interface SelectOption {
  label: string
  value: string
}

/** 单字段 schema（设计与运行共用；Uni 只读 type + 扩展字段） */
export interface FormFieldConfig {
  id: string
  type: WidgetKey
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
  dateType?: 'date' | 'datetime'
}

/** @deprecated 使用 FormFieldConfig */
export type ComponentConfig = FormFieldConfig

export const FORM_SCHEMA_VERSION = 1

export interface FormSchema {
  schemaVersion: typeof FORM_SCHEMA_VERSION
  fields: FormFieldConfig[]
}

/** 左侧面板元数据（与 widgetRegistry 对齐） */
export interface WidgetPaletteItem {
  type: WidgetKey
  name: string
  icon: string
}
