<script>
export default {
  name: 'ExpenseTypeTree',
  props: {
    expenseTypes: {
      type: Array,
      default: () => [],
    },
    selectedTypeId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      editText: '',
      expandedKeys: [],
      treeProps: {
        children: 'children',
        label: 'name',
      },
    }
  },
  computed: {
    treeData() {
      return this.expenseTypes
    },
  },
  methods: {
    handleNodeClick(data, _node) {
      this.$emit('select-type', data)
    },

    addNewType() {
      const newType = {
        id: Date.now(),
        name: '新费用类型',
        description: '',
        code: '',
        isSystem: false,
        isEditing: true,
        children: [],
        fields: [
          { id: Date.now() + 1, name: '消费金额', type: '金额', required: true, isSystem: true },
          { id: Date.now() + 2, name: '消费日期', type: '日期', required: true, isSystem: true },
        ],
      }

      this.$emit('add-type', newType)
      this.editText = newType.name

      this.$nextTick(() => {
        this.focusEditInput()
      })
    },

    editNode(data) {
      if (data.isSystem) {
        this.$message.warning('系统类型不能编辑')
        return
      }

      data.isEditing = true
      this.editText = data.name

      this.$nextTick(() => {
        this.focusEditInput()
      })
    },

    saveEdit(data) {
      if (!this.editText.trim()) {
        this.$message.warning('类型名称不能为空')
        this.focusEditInput()
        return
      }

      data.name = this.editText.trim()
      data.isEditing = false
      this.editText = ''

      this.$emit('update-type', data)
    },

    cancelEdit(data) {
      data.isEditing = false
      this.editText = ''
    },

    focusEditInput() {
      const editInputs = this.$refs.editInput
      if (editInputs && editInputs.length > 0) {
        editInputs[editInputs.length - 1].focus()
      }
      else if (editInputs && editInputs.focus) {
        editInputs.focus()
      }
    },

    handleCommand(command) {
      const { action, data } = command
      switch (action) {
        case 'edit':
          this.editNode(data)
          break
        case 'addChild':
          this.addChildType(data)
          break
        case 'delete':
          this.deleteType(data)
          break
      }
    },

    addChildType(parentData) {
      const newChildType = {
        id: Date.now(),
        name: '新子级类型',
        description: '',
        code: '',
        isSystem: false,
        isEditing: true,
        children: [],
        fields: [
          { id: Date.now() + 1, name: '消费金额', type: '金额', required: true, isSystem: true },
          { id: Date.now() + 2, name: '消费日期', type: '日期', required: true, isSystem: true },
        ],
      }

      this.$emit('add-child-type', { parentData, newChildType })
      this.editText = newChildType.name

      this.$nextTick(() => {
        this.focusEditInput()
      })
    },

    deleteType(data) {
      if (data.isSystem) {
        this.$message.warning('系统类型不能删除')
        return
      }

      this.$confirm('确定要删除这个费用类型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('delete-type', data)
        this.$message.success('删除成功')
      })
    },

    // 展开指定节点
    expandNode(nodeId) {
      if (!this.expandedKeys.includes(nodeId)) {
        this.expandedKeys.push(nodeId)
      }
    },
  },
}
</script>

<template>
  <div class="expense-type-tree-container">
    <div class="sidebar-header">
      <el-button type="primary" size="small" @click="addNewType">
        + 新增类型
      </el-button>
    </div>

    <div class="type-tree">
      <el-tree
        :data="treeData"
        :props="treeProps"
        :current-node-key="selectedTypeId"
        :default-expanded-keys="expandedKeys"
        node-key="id"
        highlight-current
        class="expense-type-tree"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ data }" class="tree-node">
          <span v-if="!data.isEditing" class="node-content" @dblclick="editNode(data)">
            <div class="node-left">
              <span class="type-name">{{ data.name }}</span>
              <span v-if="data.isSystem" class="type-tag">系统</span>
            </div>
            <div class="node-right">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ action: 'edit', data }">编辑</el-dropdown-item>
                  <el-dropdown-item :command="{ action: 'addChild', data }">新增子级</el-dropdown-item>
                  <el-dropdown-item v-if="!data.isSystem" :command="{ action: 'delete', data }" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </span>
          <span v-else class="node-edit">
            <el-input
              ref="editInput"
              v-model="editText"
              size="mini"
              class="edit-input"
              @blur="saveEdit(data)"
              @keyup.enter.native="saveEdit(data)"
              @keyup.esc.native="cancelEdit(data)"
            />
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<style scoped lang="scss">
.expense-type-tree-container {
  width: 250px;
  background: white;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sidebar-header {
  margin-bottom: 16px;
}

.type-tree {
  overflow-y: auto;
}

.expense-type-tree {
  ::v-deep(.el-tree-node__content) {
    padding: 12px 0;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    transition: all 0.3s;
    margin-bottom: 0;
  }
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  min-height: 44px;
  width: 100%;
}

.node-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
}

.node-left {
  display: flex;
  align-items: center;
}

.node-right {
  display: flex;
  align-items: center;
}

.node-edit {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0;
}

.edit-input {
  width: 100%;
}

.edit-input .el-input__inner {
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  padding: 0 8px;
  border: 1px solid #409eff;
  border-radius: 4px;
}

.type-name {
  font-weight: 500;
  font-size: 14px;
}

.type-tag {
  background-color: transparent;
  color: #909399;
  padding: 0;
  border-radius: 0;
  font-size: 12px;
  margin-left: 8px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #606266;
  font-size: 16px;
  padding: 4px;
  border-radius: 2px;
}

.el-dropdown-link:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}
</style>
