<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import FormDesigner from '@/components/FormDesigner/index.vue'

const formDesignerRef = ref<InstanceType<typeof FormDesigner> | null>(null)

function handleGetData() {
  const data = formDesignerRef.value?.getData()
  console.log('表单设计数据：', data)
  ElMessage.success(`已导出 ${data?.length || 0} 个组件`)
}
</script>

<template>
  <div class="demo-container">
    <h2>表单设计器示例</h2>

    <div class="demo-actions">
      <el-button type="primary" @click="handleGetData">
        导出设计数据
      </el-button>
    </div>

    <div class="designer-wrapper">
      <FormDesigner ref="formDesignerRef" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-container {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #303133;
}

.demo-actions {
  margin-bottom: 16px;
}

.designer-wrapper {
  flex: 1;
  min-height: 0;
}
</style>
