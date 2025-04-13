<script lang="ts" setup>
import type { Service } from '@/utils/types/service'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import edit from './components/edit.vue'

const { create, batchDel, showDialog, handleCloseDialog, handleSubmit } = useOperator()
const { selectionChange, chooseList } = useCheckbox()
const { deleteSingle } = useTableOperator()

const tableItem: Service = {
  date: '2025-04-08',
  name: 'lovekyrie',
  phone: '18758322412',
  address: '浙江省宁波市海曙区学院路416号',
}
const list = (Array.from({ length: 20 }).fill(tableItem) as Service[]).map((k) => {
  return { id: uuidv4(), ...k }
})
const tableData = ref<Service[]>(list)
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
</script>

<template>
  <el-card class="hello-container">
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
    <edit :show="showDialog" @closeDialog="handleCloseDialog" @submit="handleSubmit" />
  </el-card>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.service-table {
  margin-top: 10px;
  border-radius: 3px;
  border: 1px solid #ebebeb;
}
</style>
