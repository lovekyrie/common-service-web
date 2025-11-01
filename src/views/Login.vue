<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import router from '@/router'
import { useUserStore } from '@/store'

const { formRef, submit } = useSubmit()

const store = useUserStore()
const form = reactive({
  username: '',
  password: '',
})

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 2, max: 10, message: '长度在2~10个字之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
  ],
}

function useSubmit() {
  const formRef = ref<FormInstance>()
  async function submit() {
    try {
      if (formRef.value) {
        const res = await formRef.value.validate()
        if (res) {
          store.login(form.username, form.password)
          router.push({ name: 'service' })
        }
      }
    }
    catch (error) {
      ElMessage({
        message: `登录失败${error}`,
        type: 'warning',
      })
    }
  }

  return { formRef, submit }
}
</script>

<template>
  <div class="login">
    <h1>焚天后端管理系统</h1>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-card>
          <el-form ref="formRef" :rules="formRules" :model="form">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">
                登录
              </el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
h1 {
  margin: 80px 0 100px;
}
</style>
