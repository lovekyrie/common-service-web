<script>
import { accountingApi } from '@/api'
import AccountingList from './components/AccountingList.vue'
import AddAccountingDialog from './components/AddAccountingDialog.vue'

export default {
  name: 'Accounting',
  components: {
    AccountingList,
    AddAccountingDialog,
  },
  data() {
    return {
      showAddDialog: false,
      accountingRecords: [],
      loading: false,
    }
  },
  computed: {
    totalIncome() {
      return this.accountingRecords
        .filter(record => record.type === 'income')
        .reduce((sum, record) => sum + Number.parseFloat(record.amount), 0)
        .toFixed(2)
    },
    totalExpense() {
      return this.accountingRecords
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + Number.parseFloat(record.amount), 0)
        .toFixed(2)
    },
    balance() {
      return (Number.parseFloat(this.totalIncome) - Number.parseFloat(this.totalExpense)).toFixed(2)
    },
  },
  mounted() {
    this.getAccountingList()
  },
  methods: {
    async getAccountingList() {
      const res = await accountingApi.getAccountingList()
      this.accountingRecords = res.data
    },

    handleAdd() {
      this.showAddDialog = true
    },

    async handleAddConfirm(recordData) {
      // 模拟添加记录
      const newRecord = {
        ...recordData,
        amount: Number.parseFloat(recordData.amount), // 转换为数字
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // 调用api添加记录
      const res = await accountingApi.createAccounting(newRecord)
      if (res.success) {
        this.getAccountingList()
        this.showAddDialog = false
        this.$message.success(res.message)
      }
      else {
        this.$message.error(res.message)
      }
    },

    handleAddCancel() {
      this.showAddDialog = false
    },

    handleEdit(record) {
      this.$message.info('编辑功能待实现')
      console.log(record)
      throw new Error('not implemented')
    },

    handleDelete(record) {
      this.$confirm('确定要删除这条记账记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await accountingApi.deleteAccounting(record.id)
        this.getAccountingList()
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    handleRefresh() {
      this.loading = true
      // 模拟刷新数据
      setTimeout(() => {
        this.loading = false
        this.$message.success('数据刷新成功')
      }, 1000)
    },
  },
}
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
            <div class="stat-value" :class="{ positive: balance >= 0, negative: balance < 0 }">
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
