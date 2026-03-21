<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import type { CreateDepartmentInput, Department } from '@/api/department'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { departmentApi } from '@/api/department'
import DepartmentTree from './components/DepartmentTree.vue'

const loading = ref(false)
const departments = ref<Department[]>([])
const selectedDepartment = ref<Department | null>(null)
const dialogVisible = ref(false)
const dialogTitle = ref('新增部门')
const isEdit = ref(false)
const editingId = ref<number | string | null>(null)

const form = reactive<CreateDepartmentInput & { id?: number | string }>({
  name: '',
  code: '',
  parent_id: null,
  leader: '',
  phone: '',
  sort: 0,
})

const formRef = ref<FormInstance>()

const formRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
}

// 将树形部门扁平化，用于父级选择
function flattenDepartments(depts: Department[], level = 0): { id: number | string; name: string; label: string }[] {
  const result: { id: number | string; name: string; label: string }[] = []
  for (const dept of depts) {
    result.push({
      id: dept.id,
      name: dept.name,
      label: '　'.repeat(level) + dept.name,
    })
    if (dept.children?.length) {
      result.push(...flattenDepartments(dept.children, level + 1))
    }
  }
  return result
}

const flatDepartments = computed(() => flattenDepartments(departments.value))

// 获取部门列表
async function fetchDepartments() {
  loading.value = true
  try {
    const res = await departmentApi.getDepartmentList()
    if (res.data?.list) {
      departments.value = res.data.list
    }
  }
  catch (error) {
    console.error('获取部门列表失败', error)
    ElMessage.error('获取部门列表失败')
  }
  finally {
    loading.value = false
  }
}

// 选择部门
function handleSelectDepartment(data: Department) {
  selectedDepartment.value = data
}

// 新增部门
function handleAdd(parentData?: Department) {
  isEdit.value = false
  editingId.value = null
  // 如果没有传父级参数但当前有选中部门，则以选中部门为父级
  const actualParent = parentData ?? selectedDepartment.value
  dialogTitle.value = actualParent ? '新增子部门' : '新增部门'
  form.name = ''
  form.code = ''
  form.parent_id = actualParent?.id ?? null
  form.leader = ''
  form.phone = ''
  form.sort = 0
  dialogVisible.value = true
}

// 编辑部门
function handleEdit(data: Department) {
  isEdit.value = true
  editingId.value = data.id
  dialogTitle.value = '编辑部门'
  form.name = data.name
  form.code = data.code || ''
  form.parent_id = data.parent_id ?? null
  form.leader = data.leader || ''
  form.phone = data.phone || ''
  form.sort = data.sort || 0
  dialogVisible.value = true
}

// 删除部门
async function handleDelete(data: Department) {
  try {
    await ElMessageBox.confirm(`确定要删除部门"${data.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await departmentApi.deleteDepartment(data.id)
    ElMessage.success('删除成功')
    fetchDepartments()
  }
  catch {
    // 用户取消
  }
}

// 提交表单
async function submitForm() {
  try {
    if (isEdit.value && editingId.value) {
      await departmentApi.updateDepartment(editingId.value, form)
      ElMessage.success('更新成功')
    }
    else {
      await departmentApi.createDepartment(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchDepartments()
  }
  catch (error) {
    console.error('操作失败', error)
    ElMessage.error('操作失败')
  }
}

// 初始化
fetchDepartments()
</script>

<template>
  <div class="department-page">
    <!-- 左侧部门树 -->
    <DepartmentTree
      :departments="departments"
      :selected-id="selectedDepartment?.id"
      @select="handleSelectDepartment"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- 右侧部门详情 -->
    <main class="department-detail">
      <div v-if="selectedDepartment" class="detail-card">
        <div class="detail-header">
          <h3 class="detail-title">
            {{ selectedDepartment.name }}
          </h3>
          <el-button type="primary" size="small" @click="handleEdit(selectedDepartment)">
            编辑
          </el-button>
        </div>
        <div class="detail-info">
          <div class="info-item">
            <span class="info-label">部门编码</span>
            <span class="info-value">{{ selectedDepartment.code || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">部门负责人</span>
            <span class="info-value">{{ selectedDepartment.leader || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系电话</span>
            <span class="info-value">{{ selectedDepartment.phone || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">排序</span>
            <span class="info-value">{{ selectedDepartment.sort ?? 0 }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">状态</span>
            <span class="info-value">{{ selectedDepartment.status === 0 ? '禁用' : '启用' }}</span>
          </div>
        </div>
      </div>
      <div v-else class="detail-empty">
        <p>请从左侧选择部门查看详情</p>
      </div>
    </main>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码">
          <el-input v-model="form.code" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="父级部门">
          <el-select
            v-model="form.parent_id"
            placeholder="请选择父级部门（不选则为顶级）"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in flatDepartments"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              :disabled="item.id === editingId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门负责人">
          <el-input v-model="form.leader" placeholder="请输入部门负责人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="9999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.department-page {
  display: flex;
  gap: 16px;
  height: 100%;
  background: #f6f8fb;
}

.department-detail {
  flex: 1;
  overflow-y: auto;
}

.detail-card {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(15, 35, 95, 0.08);
  padding: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eef1fb;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2333;
  margin: 0;
}

.detail-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #6a7cb4;
}

.info-value {
  font-size: 14px;
  color: #1f2333;
  font-weight: 500;
}

.detail-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(15, 35, 95, 0.08);

  p {
    color: #6a7cb4;
    font-size: 14px;
  }
}
</style>
