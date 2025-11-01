<script setup>
import { ref } from 'vue'

defineProps({
  records: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'delete'])

const typeOptions = ref({
  income: { label: '收入', color: '#67c23a', icon: 'Plus' },
  expense: { label: '支出', color: '#f56c6c', icon: 'Minus' },
})

const categoryOptions = ref({
  // 收入分类
  salary: '工资',
  bonus: '奖金',
  investment: '投资收益',
  gift: '礼金',
  other_income: '其他收入',
  // 支出分类
  food: '餐饮',
  transport: '交通',
  shopping: '购物',
  entertainment: '娱乐',
  rent: '房租',
  utilities: '水电费',
  healthcare: '医疗',
  education: '教育',
  other_expense: '其他支出',
})

const paymentMethodOptions = ref({
  cash: '现金',
  alipay: '支付宝',
  wechat: '微信',
  bank_card: '银行卡',
  credit_card: '信用卡',
  bank_transfer: '银行转账',
})

function getTypeConfig(type) {
  return typeOptions.value[type] || { label: type, color: '#909399', icon: 'QuestionFilled' }
}

function getCategoryLabel(category) {
  return categoryOptions.value[category] || category
}

function getPaymentMethodLabel(method) {
  return paymentMethodOptions.value[method] || method
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function handleEdit(record) {
  emit('edit', record)
}

function handleDelete(record) {
  emit('delete', record)
}
</script>

<template>
  <div class="accounting-list-container">
    <el-card>
      <el-table
        :data="records"
        :loading="loading"
        stripe
        style="width: 100%"
        empty-text="暂无记账记录"
      >
        <el-table-column label="类型" width="100" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.type === 'income' ? 'success' : 'danger'"
              size="small"
            >
              <i :class="getTypeConfig(scope.row.type).icon" />
              {{ getTypeConfig(scope.row.type).label }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="金额" prop="amount" width="120" align="right">
          <template #default="scope">
            <span
              class="amount"
              :class="scope.row.type === 'income' ? 'income' : 'expense'"
            >
              {{ scope.row.type === 'income' ? '+' : '-' }}¥{{ scope.row.amount }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="分类" prop="category" width="120">
          <template #default="scope">
            <span>{{ getCategoryLabel(scope.row.category) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="描述" prop="description" min-width="150">
          <template #default="scope">
            <span :title="scope.row.description">
              {{ scope.row.description || '-' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="交易日期" prop="transaction_date" width="120">
          <template #default="scope">
            <span>{{ formatDate(scope.row.transaction_date) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="支付方式" prop="payment_method" width="120">
          <template #default="scope">
            <span>{{ getPaymentMethodLabel(scope.row.payment_method) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="created_at" width="150">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              class="danger-btn"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.accounting-list-container {
  .amount {
    font-weight: 600;

    &.income {
      color: #67c23a;
    }

    &.expense {
      color: #f56c6c;
    }
  }

  .danger-btn {
    color: #f56c6c;

    &:hover {
      color: #f56c6c;
      background-color: rgba(245, 108, 108, 0.1);
    }
  }

  ::v-deep(.el-table) {
    .el-table__empty-text {
      color: #909399;
    }
  }

  ::v-deep(.el-tag) {
    .el-icon-plus,
    .el-icon-minus {
      margin-right: 4px;
    }
  }
}
</style>
