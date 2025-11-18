<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  // 初始选中的部门ID列表
  defaultDeptIds: {
    type: Array,
    default: () => [],
  },
  // 初始选中的用户ID列表
  defaultUserIds: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

// 对话框显示状态
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})

// 当前激活的标签页
const activeTab = ref('dept')

// 搜索关键词
const deptSearchKeyword = ref('')
const userSearchKeyword = ref('')

// 选中的部门和用户ID
const selectedDeptIds = ref([])
const selectedUserIds = ref([])

// 树形控件和表格引用
const deptTreeRef = ref(null)
const userTableRef = ref(null)

// 树形配置
const treeProps = {
  children: 'children',
  label: 'label',
}

// 模拟部门树数据
const deptTree = ref([
  {
    id: 'company-1',
    label: '某某某某公司',
    children: [
      {
        id: 'dept-1-1',
        label: '某某一级部门',
        children: [
          { id: 'dept-2-1', label: '某某二级部门' },
          {
            id: 'dept-2-2',
            label: '某某二级部门',
            children: [
              { id: 'dept-3-1', label: '某某三级部门' },
            ],
          },
        ],
      },
      {
        id: 'dept-1-2',
        label: '华东项目管理二部',
        children: [],
      },
      {
        id: 'dept-1-3',
        label: '某某一级部门',
        children: [],
      },
      {
        id: 'dept-1-4',
        label: '某某一级部门',
        children: [],
      },
    ],
  },
])

// 模拟用户数据
const userList = ref([
  { id: '1', name: '张小小', employeeId: '0001', deptId: 'dept-1-2', deptName: '人事部门' },
  { id: '2', name: '马明', employeeId: '0002', deptId: 'dept-1-2', deptName: '人事部门' },
  { id: '3', name: '张华伟', employeeId: '0003', deptId: 'dept-1-2', deptName: '人事部门' },
  { id: '4', name: '陈一凡', employeeId: '0004', deptId: 'dept-2-1', deptName: '人事部门' },
  { id: '5', name: '张三', employeeId: '0005', deptId: 'dept-2-1', deptName: '人事部门' },
  { id: '6', name: '李四', employeeId: '0006', deptId: 'dept-2-2', deptName: '人事部门' },
  { id: '7', name: '王二', employeeId: '0007', deptId: 'dept-2-2', deptName: '人事部门' },
  { id: '8', name: '王一', employeeId: '0008', deptId: 'dept-3-1', deptName: '人事部门' },
])

// 过滤部门树（根据搜索关键词）
const filteredDeptTree = computed(() => {
  if (!deptSearchKeyword.value) {
    return deptTree.value
  }
  return filterTree(deptTree.value, deptSearchKeyword.value)
})

// 递归过滤树形数据
function filterTree(tree, keyword) {
  const result = []
  tree.forEach((node) => {
    if (node.label.includes(keyword)) {
      result.push(node)
    }
    else if (node.children && node.children.length > 0) {
      const filteredChildren = filterTree(node.children, keyword)
      if (filteredChildren.length > 0) {
        result.push({ ...node, children: filteredChildren })
      }
    }
  })
  return result
}

// 过滤用户列表（根据搜索关键词）
const filteredUserList = computed(() => {
  if (!userSearchKeyword.value) {
    return userList.value
  }
  const keyword = userSearchKeyword.value.toLowerCase()
  return userList.value.filter(
    user =>
      user.name.toLowerCase().includes(keyword)
      || user.employeeId.includes(keyword)
      || user.deptName.toLowerCase().includes(keyword),
  )
})

// 已选部门列表（用于显示标签）
const selectedDepts = computed(() => {
  const result = []
  const findDepts = (tree) => {
    tree.forEach((node) => {
      if (selectedDeptIds.value.includes(node.id)) {
        result.push({ id: node.id, label: node.label })
      }
      if (node.children && node.children.length > 0) {
        findDepts(node.children)
      }
    })
  }
  findDepts(deptTree.value)
  return result
})

// 已选用户列表（用于显示标签）
const selectedUsers = computed(() => {
  return userList.value.filter(user => selectedUserIds.value.includes(user.id))
})

// 总选中数量
const totalSelectedCount = computed(() => {
  if (activeTab.value === 'dept') {
    return selectedDeptIds.value.length
  }
  else {
    return selectedUserIds.value.length
  }
})

// 处理部门树选择变化
function handleDeptCheck(data, checked) {
  selectedDeptIds.value = checked.checkedKeys
}

// 处理用户表格选择变化
function handleUserSelectionChange(selection) {
  selectedUserIds.value = selection.map(user => user.id)
}

// 移除已选部门
function removeDept(deptId) {
  selectedDeptIds.value = selectedDeptIds.value.filter(id => id !== deptId)
  // 更新树形控件的选中状态
  nextTick(() => {
    deptTreeRef.value?.setCheckedKeys(selectedDeptIds.value)
  })
}

// 移除已选用户
function removeUser(userId) {
  selectedUserIds.value = selectedUserIds.value.filter(id => id !== userId)
  // 更新表格的选中状态
  nextTick(() => {
    const user = userList.value.find(u => u.id === userId)
    if (user) {
      userTableRef.value?.toggleRowSelection(user, false)
    }
  })
}

// 确认选择
function handleConfirm() {
  emit('confirm', {
    deptIds: selectedDeptIds.value,
    userIds: selectedUserIds.value,
    depts: selectedDepts.value,
    users: selectedUsers.value,
  })
  dialogVisible.value = false
}

// 取消选择
function handleCancel() {
  emit('cancel')
  dialogVisible.value = false
}

// 初始化选中状态
watch(() => props.visible, (val) => {
  if (val) {
    selectedDeptIds.value = [...props.defaultDeptIds]
    selectedUserIds.value = [...props.defaultUserIds]

    // 等待DOM更新后设置选中状态
    nextTick(() => {
      // 设置部门树选中状态
      if (deptTreeRef.value) {
        deptTreeRef.value.setCheckedKeys(selectedDeptIds.value)
      }

      // 设置用户表格选中状态
      if (userTableRef.value) {
        userList.value.forEach((user) => {
          if (selectedUserIds.value.includes(user.id)) {
            userTableRef.value.toggleRowSelection(user, true)
          }
        })
      }
    })
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择部门/人员"
    width="900px"
    :close-on-click-modal="false"
  >
    <div class="dept-user-selector">
      <!-- 左侧：部门树 -->
      <div class="left-panel">
        <div class="panel-header">
          部门选择
        </div>
        <div class="search-box">
          <el-input
            v-model="deptSearchKeyword"
            placeholder="搜索部门"
            clearable
            prefix-icon="el-icon-search"
            size="small"
          />
        </div>
        <div class="tree-container">
          <el-tree
            ref="deptTreeRef"
            :data="filteredDeptTree"
            :props="treeProps"
            node-key="id"
            show-checkbox
            :default-expand-all="false"
            :default-checked-keys="selectedDeptIds"
            @check="handleDeptCheck"
          />
        </div>
      </div>

      <!-- 中间：标签切换区 -->
      <div class="middle-panel">
        <div class="tabs">
          <div
            class="tab-item"
            :class="{ active: activeTab === 'dept' }"
            @click="activeTab = 'dept'"
          >
            按部门
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 'user' }"
            @click="activeTab = 'user'"
          >
            按员工
          </div>
        </div>

        <!-- 已选标签展示 -->
        <div class="selected-tags">
          <template v-if="activeTab === 'dept'">
            <el-tag
              v-for="dept in selectedDepts"
              :key="dept.id"
              closable
              size="small"
              @close="removeDept(dept.id)"
            >
              {{ dept.label }}
            </el-tag>
          </template>
          <template v-else>
            <el-tag
              v-for="user in selectedUsers"
              :key="user.id"
              closable
              size="small"
              type="info"
              @close="removeUser(user.id)"
            >
              {{ user.name }}
            </el-tag>
          </template>
        </div>
      </div>

      <!-- 右侧：人员列表 -->
      <div class="right-panel">
        <div class="panel-header">
          人员选择
        </div>
        <div class="search-box">
          <el-input
            v-model="userSearchKeyword"
            placeholder="搜索员工姓名或部门"
            clearable
            prefix-icon="el-icon-search"
            size="small"
          />
        </div>
        <div class="user-table-container">
          <el-table
            ref="userTableRef"
            :data="filteredUserList"
            height="100%"
            @selection-change="handleUserSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="employeeId" label="员工号" width="100" />
            <el-table-column prop="deptName" label="部门" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 底部统计和操作 -->
    <template #footer>
      <div class="dialog-footer">
        <div class="selection-count">
          发票号码连续跨度不得小于
          <span class="count">{{ totalSelectedCount }}</span>
          位
        </div>
        <div class="action-buttons">
          <el-button @click="handleCancel">
            取消
          </el-button>
          <el-button type="primary" @click="handleConfirm">
            确定
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dept-user-selector {
  display: flex;
  height: 500px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  overflow: hidden;
}

.left-panel,
.right-panel {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #EBEEF5;
}

.middle-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
  padding: 16px;
}

.panel-header {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  background: #F5F7FA;
  border-bottom: 1px solid #EBEEF5;
}

.search-box {
  padding: 12px 16px;
  border-bottom: 1px solid #EBEEF5;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.user-table-container {
  flex: 1;
  overflow: hidden;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-item {
  padding: 8px 20px;
  font-size: 14px;
  background: #fff;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #409EFF;
    border-color: #409EFF;
  }

  &.active {
    color: #fff;
    background: #409EFF;
    border-color: #409EFF;
  }
}

.selected-tags {
  flex: 1;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selection-count {
  font-size: 14px;
  color: #606266;

  .count {
    color: #409EFF;
    font-weight: 600;
    font-size: 16px;
    margin: 0 4px;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
}
</style>
