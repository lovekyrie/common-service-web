<script>
export default {
  name: 'WeightFormItem',
  model: { event: 'change' },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    // 重量数值部分
    number() {
      const num = Number.parseFloat(this.value)
      return Number.isNaN(num) ? 0 : num
    },
    // 重量单位部分
    unit() {
      const match = (this.value || '').match(/[a-z]+/)
      return (match && match[0]) || 'g'
    },
  },
  methods: {
    handleNumberChange(value) {
      this.$emit('change', `${value} ${this.unit}`)
    },
    handleUnitChange(value) {
      this.$emit('change', `${this.number} ${value}`)
    },
  },
}
</script>

<template>
  <div>
    <el-input-number :value="number" :min="0" :max="100" @change="handleNumberChange" />
    <el-select :value="unit" @change="handleUnitChange">
      <el-option label="克" value="g" />
      <el-option label="千克" value="kg" />
      <el-option label="吨" value="t" />
    </el-select>
  </div>
</template>
