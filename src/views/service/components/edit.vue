<script lang="ts" setup>
import type { ElForm } from 'element-ui/types/form'
import { phoneValid } from '@/utils/validator'
import { Message } from 'element-ui'
import { v4 as uuidv4 } from 'uuid'
import { defineProps, reactive, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close-dialog', 'submit'])

const dialogVisible = ref<boolean>(props.show)
watch(() => props.show, (val) => {
  dialogVisible.value = val
})

const form = reactive({
  date: '',
  name: '',
  phone: '',
  address: '',
})

const formRules = {
  date: [
    { type: 'string', required: true, message: '请选择日期', trigger: 'change' },
  ],
  name: [
    { required: true, message: '请输入名字', trigger: 'change' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字', trigger: 'blur' },
  ],
  phone: [
    { required: true, validator: phoneValid, trigger: 'blur' },
  ],
}

function closeDialog() {
  emit('close-dialog')
}
const formRef = ref<ElForm>()
async function submit() {
  try {
    if (formRef.value) {
      const res = await formRef.value.validate()
      if (res) {
        emit('submit', { ...form, id: uuidv4() })
      }
    }
  }
  catch (error: any) {
    Message({
      message: `请输入正确的内容再提交`,
      type: 'warning',
    })
    throw new Error(error)
  }
}

</script>

<template>
  <div class="service-edit">
    <el-dialog :visible="dialogVisible" title="新增" :before-close="closeDialog">
      <ElForm ref="formRef" :model="form" label-width="120px" :rules="formRules">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" type="tel" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">
            取消
          </el-button>
          <el-button type="primary" @click="submit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>
