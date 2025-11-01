<script setup lang="ts">
import type { AccountingRecord, CreateAccountingInput } from '@/api/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { createAccounting, deleteAccounting, queryAccountingList } from '@/api/index'
import AccountingList from './components/AccountingList.vue'
import AddAccountingDialog from './components/AddAccountingDialog.vue'

const showAddDialog = ref(false)
const accountingRecords = ref<AccountingRecord[]>([])
const loading = ref(false)

const totalIncome = computed(() => {
  return accountingRecords.value
    .filter(record => record.type === 'income')
    .reduce((sum, record) => {
      return sum + Number.parseFloat(record.amount)
    }, 0)
    .toFixed(2)
})

const totalExpense = computed(() => {
  return accountingRecords.value
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => {
      const amount = typeof record.amount === 'string' ? Number.parseFloat(record.amount) : record.amount
      return sum + amount
    }, 0)
    .toFixed(2)
})

const balance = computed(() => {
  const numBalance = Number.parseFloat(totalIncome.value) - Number.parseFloat(totalExpense.value)
  return numBalance.toFixed(2)
})

const isBalancePositive = computed(() => Number.parseFloat(balance.value) >= 0)

async function getAccountingList() {
  const res = await queryAccountingList()
  accountingRecords.value = res.data
}

function handleAdd() {
  showAddDialog.value = true
}

async function handleAddConfirm(recordData: AccountingRecord) {
  // 转换为创建接口需要的格式
  const createData: CreateAccountingInput = {
    ...recordData,
    amount: Number.parseFloat(recordData.amount),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // 调用api添加记录
  const res = await createAccounting(createData)
  if (res.success) {
    getAccountingList()
    showAddDialog.value = false
    ElMessage.success(res.message)
  }
  else {
    ElMessage.error(res.message)
  }
}

function handleAddCancel() {
  showAddDialog.value = false
}

function handleEdit(record: AccountingRecord) {
  ElMessage.info('编辑功能待实现')
  console.log(record)
  throw new Error('not implemented')
}

function handleDelete(record: AccountingRecord) {
  ElMessageBox.confirm('确定要删除这条记账记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteAccounting(record.id)
    getAccountingList()
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

function handleRefresh() {
  loading.value = true
  // 模拟刷新数据
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

onMounted(() => {
  getAccountingList()
})
</script>

<template>
  <div class="accounting-container">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card income-card">
        <div class="stat-content">
          <div class="stat-icon">
            <i class="el-icon-s-finance" />
          </div>
          <div class="stat-info">
            <div class="stat-label">
              总收入
            </div>
            <div class="stat-value income">
              ¥{{ totalIncome }}
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card expense-card">
        <div class="stat-content">
          <div class="stat-icon">
            <i class="el-icon-shopping-cart-2" />
          </div>
          <div class="stat-info">
            <div class="stat-label">
              总支出
            </div>
            <div class="stat-value expense">
              ¥{{ totalExpense }}
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card balance-card">
        <div class="stat-content">
          <div class="stat-icon">
            <i class="el-icon-wallet" />
          </div>
          <div class="stat-info">
            <div class="stat-label">
              结余
            </div>
            <div class="stat-value" :class="{ positive: isBalancePositive, negative: !isBalancePositive }">
              ¥{{ balance }}
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="action-left">
        <h2>记账记录</h2>
      </div>
      <div class="action-right">
        <el-button
          type="default"
          icon="el-icon-refresh"
          :loading="loading"
          @click="handleRefresh"
        >
          刷新
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
          新增记账
        </el-button>
      </div>
    </div>

    <!-- 记账列表 -->
    <AccountingList
      :records="accountingRecords"
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- 新增记账弹窗 -->
    <AddAccountingDialog
      :visible="showAddDialog"
      @confirm="handleAddConfirm"
      @cancel="handleAddCancel"
    />
  </div>
</template>

<style scoped lang="scss">
.accounting-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.stats-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;

  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
  }

  .stat-info {
    flex: 1;
  }

  .stat-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;

    &.income {
      color: #67c23a;
    }

    &.expense {
      color: #f56c6c;
    }

    &.positive {
      color: #67c23a;
    }

    &.negative {
      color: #f56c6c;
    }
  }
}

.income-card .stat-icon {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.expense-card .stat-icon {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.balance-card .stat-icon {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-left h2 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.action-right {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-cards {
    flex-direction: column;
  }

  .action-bar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .action-right {
    justify-content: center;
  }
}
</style>
