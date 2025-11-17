<script setup>
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { formatDate } from '@/utils/utils'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const form = ref({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  transaction_date: '',
  payment_method: 'alipay',
})

const rules = {
  type: [
    { required: true, message: '请选择记账类型', trigger: 'change' },
  ],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的金额格式', trigger: 'blur' },
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' },
  ],
  transaction_date: [
    { required: true, message: '请选择交易日期', trigger: 'change' },
  ],
  payment_method: [
    { required: true, message: '请选择支付方式', trigger: 'change' },
  ],
}

const typeOptions = [
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' },
]

const categoryOptions = {
  income: [
    { label: '工资', value: 'salary' },
    { label: '奖金', value: 'bonus' },
    { label: '投资收益', value: 'investment' },
    { label: '礼金', value: 'gift' },
    { label: '其他收入', value: 'other_income' },
  ],
  expense: [
    { label: '餐饮', value: 'food' },
    { label: '交通', value: 'transport' },
    { label: '购物', value: 'shopping' },
    { label: '娱乐', value: 'entertainment' },
    { label: '房租', value: 'rent' },
    { label: '水电费', value: 'utilities' },
    { label: '医疗', value: 'healthcare' },
    { label: '教育', value: 'education' },
    { label: '其他支出', value: 'other_expense' },
  ],
}

const paymentMethodOptions = [
  { label: '支付宝', value: 'alipay' },
  { label: '微信', value: 'wechat' },
  { label: '现金', value: 'cash' },
  { label: '银行卡', value: 'bank_card' },
  { label: '信用卡', value: 'credit_card' },
  { label: '银行转账', value: 'bank_transfer' },
]

const formRef = ref(null)

const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    if (!value) {
      handleCancel()
    }
  },
})

const currentCategoryOptions = computed(() => {
  return categoryOptions[form.value.type] || []
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
    // 设置默认日期为今天
    form.value.transaction_date = formatDate()
  }
})

watch(() => form.value.type, () => {
  // 当类型改变时，清空分类选择
  form.value.category = ''
})

function handleConfirm() {
  formRef.value.validate((valid) => {
    if (valid) {
      emit('confirm', { ...form.value })
      resetForm()
    }
    else {
      ElMessage.error('请完善表单信息')
    }
  })
}

function handleCancel() {
  emit('cancel')
  resetForm()
}

function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.value = {
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    transaction_date: '',
    payment_method: 'alipay',
  }
}

// 限制金额输入
function handleAmountInput(value) {
  // 只允许数字和小数点
  const cleanValue = value.replace(/[^\d.]/g, '')
  // 确保只有一个小数点
  const parts = cleanValue.split('.')
  if (parts.length > 2) {
    form.value.amount = `${parts[0]}.${parts.slice(1).join('')}`
  }
  else if (parts[1] && parts[1].length > 2) {
    // 限制小数点后最多2位
    form.value.amount = `${parts[0]}.${parts[1].substring(0, 2)}`
  }
  else {
    form.value.amount = cleanValue
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增记账"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="记账类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.value"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="金额" prop="amount">
        <el-input
          v-model="form.amount"
          placeholder="请输入金额"
          @input="handleAmountInput"
        >
          <template #prepend>
            ¥
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="分类" prop="category">
        <el-select
          v-model="form.category"
          placeholder="请选择分类"
          style="width: 100%"
        >
          <el-option
            v-for="option in currentCategoryOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入描述信息（可选）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="交易日期" prop="transaction_date">
        <el-date-picker
          v-model="form.transaction_date"
          type="date"
          placeholder="请选择交易日期"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="支付方式" prop="payment_method">
        <el-select
          v-model="form.payment_method"
          placeholder="请选择支付方式"
          style="width: 100%"
        >
          <el-option
            v-for="option in paymentMethodOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}

::v-deep(.el-dialog__body) {
  padding: 20px;
}

::v-deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}

::v-deep(.el-input-group__prepend) {
  background-color: #f5f7fa;
  color: #909399;
  border-color: #dcdfe6;
}

::v-deep(.el-radio-group) {
  .el-radio {
    margin-right: 20px;
  }
}

::v-deep(.el-textarea__inner) {
  resize: none;
}
</style>
