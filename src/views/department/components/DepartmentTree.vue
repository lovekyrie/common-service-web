<script lang="ts" setup>
import { ref } from 'vue'

interface Department {
  id: number | string
  name: string
  code?: string
  parent_id?: number | string | null
  leader?: string
  phone?: string
  sort?: number
  status?: number
  children?: Department[]
}

const props = defineProps<{
  departments: Department[]
  selectedId?: number | string | null
}>()

const emit = defineEmits<{
  (e: 'select', data: Department): void
  (e: 'add', parentData?: Department): void
  (e: 'edit', data: Department): void
  (e: 'delete', data: Department): void
}>()

const expandedKeys = ref<(number | string)[]>([])
const editText = ref('')
const editingNode = ref<{ id: number | string, name: string, isNew?: boolean } | null>(null)

function handleNodeClick(data: Department) {
  emit('select', data)
}

function addRootDepartment() {
  emit('add')
}

function addChildDepartment(parent: Department) {
  if (!expandedKeys.value.includes(parent.id)) {
    expandedKeys.value.push(parent.id)
  }
  emit('add', parent)
}

function editDepartment(data: Department) {
  editingNode.value = { id: data.id, name: data.name }
  editText.value = data.name
}

function saveEdit() {
  if (editingNode.value) {
    const item = props.departments.find(d => d.id === editingNode.value?.id)
    if (item && editText.value.trim()) {
      item.name = editText.value.trim()
      emit('edit', item)
    }
    editingNode.value = null
    editText.value = ''
  }
}

function cancelEdit() {
  editingNode.value = null
  editText.value = ''
}

function deleteDepartment(data: Department) {
  emit('delete', data)
}

function handleCommand(command: { action: string, data: Department }) {
  const { action, data } = command
  switch (action) {
    case 'edit':
      editDepartment(data)
      break
    case 'addChild':
      addChildDepartment(data)
      break
    case 'delete':
      deleteDepartment(data)
      break
  }
}
</script>

<template>
  <div class="department-tree-container">
    <div class="sidebar-header">
      <el-button type="primary" size="small" @click="addRootDepartment">
        + 新增部门
      </el-button>
    </div>

    <div class="type-tree">
      <el-tree
        :data="departments"
        :props="{ children: 'children', label: 'name' }"
        :default-expanded-keys="expandedKeys"
        node-key="id"
        highlight-current
        class="department-tree"
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <span class="tree-node">
            <span v-if="editingNode?.id === data.id" class="node-edit">
              <el-input
                v-model="editText"
                size="mini"
                class="edit-input"
                @blur="saveEdit"
                @keyup.enter="saveEdit"
                @keyup.escape="cancelEdit"
              />
            </span>
            <span v-else class="node-content">
              <div class="node-left">
                <span class="type-name">{{ data.name }}</span>
                <span v-if="data.code" class="type-code">{{ data.code }}</span>
              </div>
              <div class="node-right">
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more" />
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{ action: 'edit', data }">编辑</el-dropdown-item>
                      <el-dropdown-item :command="{ action: 'addChild', data }">新增子部门</el-dropdown-item>
                      <el-dropdown-item :command="{ action: 'delete', data }" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style scoped lang="scss">
.department-tree-container {
  width: 280px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(15, 35, 95, 0.08);
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 16px;

  .el-button {
    width: 100%;
    border-radius: 20px;
    background: #ff8714;
    border-color: #ff8714;
  }

  .el-button:hover {
    background: #ff7714;
    border-color: #ff7714;
  }
}

.type-tree {
  flex: 1;
  overflow-y: auto;
}

.department-tree {
  :deep(.el-tree-node__content) {
    padding: 12px 0;
    margin-bottom: 4px;
  }

  :deep(.el-tree-node__content:hover) {
    background: #fff8f0;
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background: #fff8f0;
  }
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  min-height: 36px;
  width: 100%;
}

.node-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;

}

.node-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-name {
  font-weight: 500;
  font-size: 14px;
  color: #1f2333;
}

.type-code {
  font-size: 12px;
  color: #6a7cb4;
  background: #eef1fb;
  padding: 2px 8px;
  border-radius: 4px;
}

.node-right {
  display: flex;
  align-items: center;
}

.node-edit {
  flex: 1;
  display: flex;
  align-items: center;
}

.edit-input {
  width: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: #6a7cb4;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.el-dropdown-link:hover {
  color: #ff8714;
  background: #fff8f0;
}
</style>
