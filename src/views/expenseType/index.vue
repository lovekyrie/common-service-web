<script>
import ExpenseTypeConfig from './components/ExpenseTypeConfig.vue'
import ExpenseTypeTree from './components/ExpenseTypeTree.vue'

export default {
  name: 'ExpenseType',
  components: {
    ExpenseTypeTree,
    ExpenseTypeConfig,
  },
  data() {
    return {
      selectedTypeId: null,
      formErrors: {
        name: false,
        code: false,
      },
      expenseTypes: [
        {
          id: 1,
          name: '住宿费',
          description: '',
          code: '',
          isSystem: true,
          children: [],
          fields: [
            { id: 1, name: '消费金额', type: '金额', required: true, isSystem: true },
            { id: 2, name: '消费日期', type: '日期', required: true, isSystem: true },
          ],
        },
        {
          id: 2,
          name: '出行费',
          description: '',
          code: '',
          isSystem: true,
          children: [],
          fields: [
            { id: 3, name: '消费金额', type: '金额', required: true, isSystem: true },
            { id: 4, name: '消费日期', type: '日期', required: true, isSystem: true },
          ],
        },
        {
          id: 3,
          name: '餐饮费',
          description: '',
          code: '',
          isSystem: true,
          children: [],
          fields: [
            { id: 5, name: '消费金额', type: '金额', required: true, isSystem: true },
            { id: 6, name: '消费日期', type: '日期', required: true, isSystem: true },
          ],
        },
        {
          id: 4,
          name: '补助费',
          description: '',
          code: '',
          isSystem: true,
          children: [],
          fields: [
            { id: 7, name: '消费金额', type: '金额', required: true, isSystem: true },
            { id: 8, name: '消费日期', type: '日期', required: true, isSystem: true },
          ],
        },
      ],
    }
  },
  computed: {
    selectedType() {
      return this.findNodeById(this.expenseTypes, this.selectedTypeId)
    },
  },
  methods: {
    // 选择类型
    onSelectType(type) {
      if (this.selectedType) {
        this.validateCurrentType()
      }
      this.selectedTypeId = type.id
      this.clearFormErrors()
    },

    // 新增类型
    onAddType(newType) {
      this.expenseTypes.push(newType)
      this.selectedTypeId = newType.id
    },

    // 更新类型
    onUpdateType(updatedType) {
      // 找到并更新对应的类型数据
      const updateNodeInTree = (nodes, nodeId, updatedData) => {
        for (const node of nodes) {
          if (node.id === nodeId) {
            Object.assign(node, updatedData)
            return true
          }
          if (node.children && node.children.length > 0) {
            if (updateNodeInTree(node.children, nodeId, updatedData)) {
              return true
            }
          }
        }
        return false
      }

      updateNodeInTree(this.expenseTypes, updatedType.id, updatedType)
    },

    // 新增子类型
    onAddChildType({ parentData, newChildType }) {
      if (!parentData.children) {
        parentData.children = []
      }
      parentData.children.push(newChildType)
      this.selectedTypeId = newChildType.id

      // 自动展开父节点
      this.$refs.expenseTypeTree.expandNode(parentData.id)
    },

    // 删除类型
    onDeleteType(data) {
      this.removeNodeFromTree(this.expenseTypes, data.id)
      if (this.selectedTypeId === data.id) {
        this.selectedTypeId = null
      }
    },

    // 验证表单
    onValidateForm(errors) {
      this.formErrors = errors
    },

    // 保存修改
    onSaveChanges(_type) {
      this.clearFormErrors()
    },

    // 取消修改
    onCancelChanges(_type) {
      _type.name = ''
      _type.description = ''
      _type.code = ''
      this.clearFormErrors()
    },

    // 新增字段
    onAddField({ type, field }) {
      type.fields.push(field)
    },

    // 删除字段
    onDeleteField({ type, field }) {
      const index = type.fields.findIndex(f => f.id === field.id)
      if (index > -1) {
        type.fields.splice(index, 1)
      }
    },

    // 批量删除字段
    onBatchDeleteFields({ type, fieldIds }) {
      type.fields = type.fields.filter(
        field => !fieldIds.includes(field.id) || field.isSystem,
      )
    },

    // 验证当前类型
    validateCurrentType() {
      if (!this.selectedType)
        return

      this.formErrors.name = !this.selectedType.name
      this.formErrors.code = !this.selectedType.code

      return !this.formErrors.name && !this.formErrors.code
    },

    // 清除表单错误
    clearFormErrors() {
      this.formErrors = {
        name: false,
        code: false,
      }
    },

    // 递归删除树节点
    removeNodeFromTree(nodes, nodeId) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
          nodes.splice(i, 1)
          return true
        }
        if (nodes[i].children && nodes[i].children.length > 0) {
          if (this.removeNodeFromTree(nodes[i].children, nodeId)) {
            return true
          }
        }
      }
      return false
    },

    // 递归查找树节点
    findNodeById(nodes, nodeId) {
      for (const node of nodes) {
        if (node.id === nodeId) {
          return node
        }
        if (node.children && node.children.length > 0) {
          const found = this.findNodeById(node.children, nodeId)
          if (found) {
            return found
          }
        }
      }
      return null
    },
  },
}
</script>

<template>
  <div class="expense-type-container">
    <div class="main-content">
      <!-- 左侧费用类型树组件 -->
      <ExpenseTypeTree
        ref="expenseTypeTree"
        :expense-types="expenseTypes"
        :selected-type-id="selectedTypeId"
        @select-type="onSelectType"
        @add-type="onAddType"
        @update-type="onUpdateType"
        @add-child-type="onAddChildType"
        @delete-type="onDeleteType"
      />

      <!-- 右侧配置面板组件 -->
      <ExpenseTypeConfig
        :selected-type="selectedType"
        :form-errors="formErrors"
        @validate-form="onValidateForm"
        @save-changes="onSaveChanges"
        @cancel-changes="onCancelChanges"
        @add-field="onAddField"
        @delete-field="onDeleteField"
        @batch-delete-fields="onBatchDeleteFields"
        @update-type="onUpdateType"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.expense-type-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.main-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
}
</style>
