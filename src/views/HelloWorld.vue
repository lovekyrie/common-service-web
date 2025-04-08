<script lang="ts" setup>
import type Service from '@/utils/types/service'
import { ref } from 'vue'

const { toggleChoose } = useCheckbox()

const tableItem: Service = {
  date: '2025-04-08',
  name: 'lovekyrie',
  phone: '18758322412',
  address: '浙江省宁波市海曙区学院路416号',
}
const list = (Array.from({ length: 20 }).fill(tableItem) as Service[]).map((k, index) => {
  return { id: index + 1, ...k }
})
const tableColumns = [
  { prop: 'id', label: '序号' },
  { prop: 'date', label: '日期' },
  { prop: 'name', label: '姓名' },
  { prop: 'phone', label: '电话' },
  { prop: 'address', label: '地址' },
  { prop: 'opreator', label: '操作' },
]

function useCheckbox() {
  const chooseList = ref<number[]>([])

  function toggleChoose(id: number) {
    const idx = chooseList.value.findIndex(k => k === id)
    if (idx > -1) {
      chooseList.value.splice(idx, 1)
    }
    else {
      chooseList.value.push(id)
    }
  }

  return { toggleChoose }
}
</script>

<template>
  <div class="hello-container">
    <el-row>
      <el-col :span="24">
        <el-button type="primary">
          新增
        </el-button>
        <el-button type="danger">
          删除
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="list" class="service-table">
      <el-table-column v-for="item, index in tableColumns" :key="index" :prop="item.prop" :label="item.label">
        <template #default="scope">
          <div v-if="item.prop === 'id'">
            <el-checkbox @change="toggleChoose" />
            <span>{{ scope.row.id }}</span>
          </div>
          <div v-else-if="item.prop === 'opreator'">
            <span />
          </div>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.service-table {
  margin-top: 10px;
  border-radius: 3px;
  border: 1px solid #ebebeb;
}
</style>
