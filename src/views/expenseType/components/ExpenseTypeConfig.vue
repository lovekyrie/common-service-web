<script>
export default {
  name: 'ExpenseTypeConfig',
  props: {
    selectedType: {
      type: Object,
      default: null,
    },
    formErrors: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectedFieldIds: [],
      formRules: {
        name: [
          { required: true, message: '请填写类型名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请填写类型编码', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    typeName: {
      get() {
        return this.selectedType?.name || ''
      },
      set(value) {
        if (this.selectedType) {
          this.$emit('update-type', { ...this.selectedType, name: value })
        }
      },
    },
    typeCode: {
      get() {
        return this.selectedType?.code || ''
      },
      set(value) {
        if (this.selectedType) {
          this.$emit('update-type', { ...this.selectedType, code: value })
        }
      },
    },
    typeDescription: {
      get() {
        return this.selectedType?.description || ''
      },
      set(value) {
        if (this.selectedType) {
          this.$emit('update-type', { ...this.selectedType, description: value })
        }
      },
    },
  },
  methods: {
    validateCurrentType() {
      if (!this.selectedType)
        return

      const errors = {
        name: !this.selectedType.name,
        code: !this.selectedType.code,
      }

      this.$emit('validate-form', errors)
      return !errors.name && !errors.code
    },

    saveChanges() {
      if (!this.validateCurrentType()) {
        this.$message.error('请填写必填内容')
        return
      }

      this.$emit('save-changes', this.selectedType)
      this.$message.success('保存成功')
    },

    cancelChanges() {
      if (this.selectedType) {
        this.$emit('cancel-changes', this.selectedType)
      }
      this.$message.info('已撤销修改')
    },

    addNewField() {
      if (!this.selectedType)
        return

      const newField = {
        id: Date.now(),
        name: '',
        type: '文本',
        required: false,
        isSystem: false,
      }

      this.$emit('add-field', { type: this.selectedType, field: newField })
    },

    editField(_field) {
      this.$message.info('编辑字段功能待实现')
    },

    deleteField(field) {
      if (field.isSystem) {
        this.$message.warning('系统字段不能删除')
        return
      }

      this.$confirm('确定要删除这个字段吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('delete-field', { type: this.selectedType, field })
        this.$message.success('删除成功')
      })
    },

    handleFieldSelectionChange(selection) {
      this.selectedFieldIds = selection.map(field => field.id)
    },

    batchDeleteFields() {
      if (this.selectedFieldIds.length === 0) {
        this.$message.warning('请选择要删除的字段')
        return
      }

      this.$confirm('确定要删除选中的字段吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('batch-delete-fields', {
          type: this.selectedType,
          fieldIds: this.selectedFieldIds,
        })
        this.selectedFieldIds = []
        this.$message.success('批量删除成功')
      })
    },

    importFields() {
      this.$message.info('导入功能待实现')
    },
  },
}
</script>

<template>
  <div class="expense-type-config-container">
    <div v-if="selectedType" class="config-panel">
      <!-- 基本信息 -->
      <div class="basic-info-section">
        <h3>基本信息</h3>
        <el-form :model="selectedType" :rules="formRules" label-width="100px" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="类型名称" prop="name">
                <el-input
                  v-model="typeName"
                  placeholder="请输入类型名称"
                  :class="{ 'error-input': formErrors.name }"
                />
                <div v-if="formErrors.name" class="error-message">
                  请填写类型名称
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="float: right;">
              <el-form-item label="类型编码" prop="code">
                <el-input
                  v-model="typeCode"
                  placeholder="请输入类型编码"
                  :class="{ 'error-input': formErrors.code }"
                />
                <div v-if="formErrors.code" class="error-message">
                  请填写类型编码
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="类型描述" prop="description">
            <el-input
              v-model="typeDescription"
              type="textarea"
              placeholder="请输入类型描述"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 字段配置 -->
      <div class="field-config-section">
        <div class="section-header">
          <h3>字段配置</h3>
          <div class="action-buttons">
            <el-button size="small" @click="batchDeleteFields">
              批量删除
            </el-button>
            <el-button size="small" @click="importFields">
              导入
            </el-button>
            <el-button type="primary" size="small" @click="addNewField">
              + 新增
            </el-button>
          </div>
        </div>

        <el-table
          :data="selectedType.fields"
          class="field-table"
          @selection-change="handleFieldSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="字段名称" prop="name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <span v-if="scope.row.isSystem" class="system-tag">系统</span>
            </template>
          </el-table-column>
          <el-table-column label="字段类型" prop="type" />
          <el-table-column label="是否必填" prop="required">
            <template slot-scope="scope">
              <el-icon v-if="scope.row.required" class="check-icon">
                ✓
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="editField(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteField(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 底部操作按钮 -->
      <div class="bottom-actions">
        <el-button type="primary" @click="saveChanges">
          保存修改
        </el-button>
        <el-button @click="cancelChanges">
          撤销修改
        </el-button>
      </div>
    </div>

    <div v-else class="no-selection">
      <p>请选择费用类型进行配置</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.expense-type-config-container {
  flex: 1;
  background: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow-y: auto;
}

.config-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.basic-info-section {
  margin-bottom: 30px;
}

.basic-info-section h3 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.error-input {
  border-color: #f56c6c !important;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}

.field-config-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.field-table {
  flex: 1;
}

.system-tag {
  background-color: #67c23a;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-left: 8px;
}

.check-icon {
  color: #67c23a;
  font-weight: bold;
}

.bottom-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  gap: 12px;
}

.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;
  font-size: 16px;
}
</style>
