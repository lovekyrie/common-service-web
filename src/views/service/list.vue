<script lang="ts" setup>
import type { Service } from '@/utils/types/service'
import { onMounted, ref } from 'vue'
import { queryServiceList } from '@/api/services'
import edit from './components/edit.vue'

const { create, batchDel, showDialog, handleCloseDialog, handleSubmit } = useOperator()
const { selectionChange, chooseList } = useCheckbox()
const { deleteSingle } = useTableOperator()
const { page, limit, total, handleSizeChange, handleCurrentChange } = usePagination()

const tableData = ref<Service[]>([])

async function getServiceList() {
  const res = await queryServiceList({
    page: page.value,
    limit: limit.value,
  })
  tableData.value = res.data.list
  // 如果后端返回了 total，可以设置 total.value = res.total
  // 暂时使用模拟数据
  total.value = res.data.total
}

onMounted(() => {
  getServiceList()
})

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
  const showDialog = ref<boolean>(false)
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

  function handleSubmit(e: Service) {
    tableData.value.push(e)
    handleCloseDialog()
  }

  return { create, batchDel, showDialog, handleCloseDialog, handleSubmit }
}

function useTableOperator() {
  function deleteSingle(id: string) {
    tableData.value = tableData.value.filter(k => k.id !== id)
  }

  return { deleteSingle }
}

function useCheckbox() {
  const chooseList = ref<Service[]>([])

  function selectionChange(val: Service[]) {
    chooseList.value = val
  }

  return { selectionChange, chooseList }
}

function usePagination() {
  const page = ref<number>(1)
  const limit = ref<number>(10)
  const total = ref<number>(0)

  function handleSizeChange(val: number) {
    limit.value = val
    page.value = 1
    getServiceList()
  }

  function handleCurrentChange(val: number) {
    page.value = val
    getServiceList()
  }

  return { page, limit, total, handleSizeChange, handleCurrentChange }
}
</script>

<template>
  <el-card class="hello-container">
    <div class="button-bar">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="create">
            新增
          </el-button>
          <el-button type="danger" @click="batchDel">
            删除
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-wrapper">
      <el-table :data="tableData" class="service-table" @selection-change="selectionChange">
        <el-table-column v-for="item, index in tableColumns" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :type="item.type">
          <template v-if="item.prop" #default="scope">
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
    </div>
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <edit :show="showDialog" @close-dialog="handleCloseDialog" @submit="handleSubmit" />
  </el-card>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello-container {
  height: 100%;
  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.button-bar {
  flex-shrink: 0;
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
  min-height: 0;
}

.service-table {
  border-radius: 3px;
  border: 1px solid #ebebeb;
}

.pagination-bar {
  flex-shrink: 0;
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
