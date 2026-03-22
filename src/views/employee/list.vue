<script lang="ts" setup>
import type { EmployeeListItem } from '@/api/employee'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteEmployee, getEmployeeList } from '@/api/employee'

const router = useRouter()
const loading = ref(false)
const employeeList = ref<EmployeeListItem[]>([])
const total = ref(0)

// 搜索表单
const searchForm = reactive({
  name: '',
  employeeNo: '',
  department: '',
  position: '',
})

const pagination = reactive({
  page: 1,
  limit: 10,
})

// 性别格式化
function formatGender(gender?: string) {
  const map: Record<string, string> = {
    male: '男',
    female: '女',
  }
  return map[gender || ''] || '-'
}

// 状态格式化
function formatStatus(status?: string) {
  return status === 'active' ? '在职' : '离职'
}

// 获取列表
async function fetchList() {
  loading.value = true
  try {
    const res = await getEmployeeList({
      ...searchForm,
      page: pagination.page,
      limit: pagination.limit,
    })
    if (res.code === 200) {
      employeeList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  }
  catch (error) {
    console.error('获取员工列表失败', error)
    ElMessage.error('获取员工列表失败')
  }
  finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchList()
}

// 重置
function handleReset() {
  searchForm.name = ''
  searchForm.employeeNo = ''
  searchForm.department = ''
  searchForm.position = ''
  pagination.page = 1
  fetchList()
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchList()
}

function handleSizeChange(size: number) {
  pagination.limit = size
  pagination.page = 1
  fetchList()
}

// 新增员工
function handleAdd() {
  router.push({ name: 'employeeAdd' })
}

// 编辑员工
function handleEdit(row: EmployeeListItem) {
  router.push({ name: 'employeeEdit', params: { id: row.id } })
}

// 删除员工
async function handleDelete(row: EmployeeListItem) {
  try {
    await ElMessageBox.confirm(`确定要删除员工"${row.basic?.name || row.id}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteEmployee(row.id)
    ElMessage.success('删除成功')
    fetchList()
  }
  catch {
    // 用户取消
  }
}

// 初始化
fetchList()
</script>

<template>
  <div class="employee-list">
    <!-- 搜索区域 -->
    <div class="search-bar">
      <el-form :model="searchForm" inline>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="searchForm.employeeNo" placeholder="请输入工号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="searchForm.department" placeholder="请输入部门" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="岗位">
          <el-input v-model="searchForm.position" placeholder="请输入岗位" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="操作区域">
      <el-button type="primary" @click="handleAdd">
        + 新增员工
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="employeeList" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="姓名" min-width="100">
        <template #default="{ row }">
          {{ row.basic?.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80">
        <template #default="{ row }">
          {{ formatGender(row.basic?.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="工号" width="120">
        <template #default="{ row }">
          {{ row.job?.employeeNo || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="部门" min-width="120">
        <template #default="{ row }">
          {{ row.job?.department || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="岗位" min-width="100">
        <template #default="{ row }">
          {{ row.job?.position || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="120">
        <template #default="{ row }">
          {{ row.basic?.phone || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="入职日期" width="120">
        <template #default="{ row }">
          {{ row.job?.entryDate || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ formatStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.employee-list {
  padding: 24px;
}

.search-bar {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 20px 40px rgba(15, 35, 95, 0.08);
}

.操作区域 {
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
