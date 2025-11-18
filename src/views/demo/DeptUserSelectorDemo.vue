<script setup>
import { ref } from 'vue'
import DeptUserSelector from '@/components/DeptUserSelector.vue'

const selectorVisible = ref(false)

const selectedResult = ref({
  deptIds: ['dept-1-2'], // 预选部门ID
  userIds: ['1', '2', '3'], // 预选用户ID
  depts: [{ id: 'dept-1-2', label: '华东项目管理二部' }],
  users: [
    { id: '1', name: '张小小', employeeId: '0001' },
    { id: '2', name: '马明', employeeId: '0002' },
    { id: '3', name: '张华伟', employeeId: '0003' },
  ],
})

function openSelector() {
  selectorVisible.value = true
}

function handleSelectorConfirm(result) {
  selectedResult.value = result
  console.log('选择结果：', result)
}

function handleSelectorCancel() {
  console.log('取消选择')
}
</script>

<template>
  <div class="demo-container">
    <h2>部门/人员选择器示例</h2>

    <div class="demo-actions">
      <el-button type="primary" @click="openSelector">
        打开选择器
      </el-button>
    </div>

    <div class="demo-result">
      <h3>已选择结果：</h3>
      <div class="result-section">
        <h4>部门（{{ selectedResult.deptIds.length }}个）：</h4>
        <el-tag
          v-for="dept in selectedResult.depts"
          :key="dept.id"
          size="small"
          style="margin-right: 8px; margin-bottom: 8px;"
        >
          {{ dept.label }}
        </el-tag>
      </div>
      <div class="result-section">
        <h4>人员（{{ selectedResult.userIds.length }}个）：</h4>
        <el-tag
          v-for="user in selectedResult.users"
          :key="user.id"
          type="info"
          size="small"
          style="margin-right: 8px; margin-bottom: 8px;"
        >
          {{ user.name }} ({{ user.employeeId }})
        </el-tag>
      </div>
    </div>

    <!-- 部门人员选择器 -->
    <DeptUserSelector
      v-model:visible="selectorVisible"
      :default-dept-ids="selectedResult.deptIds"
      :default-user-ids="selectedResult.userIds"
      @confirm="handleSelectorConfirm"
      @cancel="handleSelectorCancel"
    />
  </div>
</template>

<style scoped lang="scss">
.demo-container {
  padding: 24px;
}

h2 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #303133;
}

.demo-actions {
  margin-bottom: 32px;
}

.demo-result {
  padding: 20px;
  background: #F5F7FA;
  border-radius: 4px;

  h3 {
    font-size: 18px;
    margin-bottom: 16px;
    color: #303133;
  }

  .result-section {
    margin-bottom: 16px;

    h4 {
      font-size: 14px;
      margin-bottom: 12px;
      color: #606266;
    }
  }
}
</style>
