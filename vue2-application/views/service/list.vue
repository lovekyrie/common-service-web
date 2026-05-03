<script setup>
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import edit from './components/edit.vue'

const { create, batchDel, showDialog, handleCloseDialog, handleSubmit } = useOperator()
const { selectionChange, chooseList } = useCheckbox()
const { deleteSingle } = useTableOperator()
const { viewMode, toggleViewMode } = useViewMode()

const tableItem = {
  date: '2025-04-08',
  name: 'lovekyrie',
  phone: '18758322412',
  address: '浙江省宁波市海曙区学院路416号',
}
const list = (Array.from({ length: 20 }).fill(tableItem)).map((k) => {
  return { id: uuidv4(), ...k }
})
const tableData = ref(list)
const tableColumns = [
  { type: 'selection', width: '55' },
  { type: 'index', width: '55', label: '序号' },
  { prop: 'date', label: '日期' },
  { prop: 'name', label: '姓名' },
  { prop: 'phone', label: '电话' },
  { prop: 'address', label: '地址' },
  { prop: 'opreator', label: '操作' },
]

function useOperator() {
  const showDialog = ref(false)
  function create() {
    showDialog.value = true
  }

  function batchDel() {
    const chooseIdList = chooseList.value.map(k => k.id)
    tableData.value = tableData.value.filter(k => !chooseIdList.includes(k.id))
  }

  function handleCloseDialog() {
    showDialog.value = false
  }

  function handleSubmit(e) {
    tableData.value.push(e)
    handleCloseDialog()
  }

  return { create, batchDel, showDialog, handleCloseDialog, handleSubmit }
}

function useTableOperator() {
  function deleteSingle(id) {
    tableData.value = tableData.value.filter(k => k.id !== id)
  }

  return { deleteSingle }
}

function useCheckbox() {
  const chooseList = ref([])

  function selectionChange(val) {
    chooseList.value = val
  }

  return { selectionChange, chooseList }
}

function useViewMode() {
  const viewMode = ref('list')

  function toggleViewMode() {
    viewMode.value = viewMode.value === 'list' ? 'card' : 'list'
  }

  return { viewMode, toggleViewMode }
}
</script>

<template>
  <el-card class="hello-container">
    <div class="button-row">
      <el-row style="width: 100%;">
        <el-col :span="24" style="display: flex;justify-content: space-between;">
          <div class="button-group">
            <el-button type="primary" @click="create">
              新增
            </el-button>
            <el-button type="danger" @click="batchDel">
              删除
            </el-button>
          </div>
          <div class="view-toggle">
            <el-button-group>
              <el-button
                :type="viewMode === 'list' ? 'primary' : 'default'"
                :icon="viewMode === 'list' ? 'el-icon-menu' : 'el-icon-s-grid'"
                @click="toggleViewMode"
              >
                {{ viewMode === 'list' ? '列表视图' : '卡片视图' }}
              </el-button>
            </el-button-group>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <!-- 列表视图 -->
      <el-table v-if="viewMode === 'list'" :data="tableData" class="service-table" @selection-change="selectionChange">
        <el-table-column v-for="item, index in tableColumns" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :type="item.type">
          <template v-if="item.prop" slot-scope="scope">
            <div v-if="item.prop === 'opreator'">
              <el-button type="info" size="small">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="deleteSingle(scope.row.id)">
                删除
              </el-button>
            </div>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 卡片视图 -->
      <div v-else class="card-container">
        <div v-for="item in tableData" :key="item.id" class="card-item">
          <el-card class="service-card" shadow="hover">
            <template slot="header">
              <div class="card-header">
                <span class="card-title">{{ item.name }}</span>
                <div class="card-actions">
                  <el-button type="info" size="small" icon="el-icon-edit" circle />
                  <el-button type="danger" size="small" icon="el-icon-delete" circle @click="deleteSingle(item.id)" />
                </div>
              </div>
            </template>
            <div class="card-content">
              <div class="card-field">
                <span class="label">日期:</span>
                <span class="value">{{ item.date }}</span>
              </div>
              <div class="card-field">
                <span class="label">电话:</span>
                <span class="value">{{ item.phone }}</span>
              </div>
              <div class="card-field">
                <span class="label">地址:</span>
                <span class="value">{{ item.address }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <edit :show="showDialog" @close-dialog="handleCloseDialog" @submit="handleSubmit" />
  </el-card>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
// 定义变量
$primary-color: #409eff;
$border-color: #ebebeb;
$background-color: #ffffff;
$padding-base: 16px;

.hello-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ::v-deep {
    .el-card__body {
      overflow-y: auto;
    }
  }
  .button-row {
    background-color: $background-color;
    padding: $padding-base;
    border-bottom: 1px solid $border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .button-group {
      .el-button {
        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .view-toggle {
      .el-button-group {
        .el-button {
          margin-right: 0;
        }
      }
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
    padding: 0 $padding-base $padding-base $padding-base;

    .service-table {
      border-radius: 3px;
      border: 1px solid $border-color;

      // 表格行悬停效果
      .el-table__row {
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }

    .card-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      padding-bottom: 20px; // 为最后一行的阴影留出空间

      // 响应式调整
      @media (max-width: 768px) {
        grid-template-columns: 1fr; // 小屏幕单列
        gap: 12px;
      }

      @media (min-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); // 大屏幕更紧凑
      }

      .service-card {
        border-radius: 8px;
        transition: all 0.3s ease;
        border: 1px solid $border-color;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .card-title {
            font-weight: 600;
            font-size: 16px;
            color: #303133;
          }

          .card-actions {
            .el-button {
              margin-left: 8px;

              &:first-child {
                margin-left: 0;
              }
            }
          }
        }

        .card-content {
          .card-field {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;

            &:last-child {
              margin-bottom: 0;
            }

            .label {
              font-weight: 500;
              color: #606266;
              min-width: 60px;
              margin-right: 8px;
            }

            .value {
              color: #303133;
              flex: 1;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}
</style>
