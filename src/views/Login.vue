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
          await store.login(form.username, form.password)
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
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>后端管理系统</h1>
        <p class="subtitle">
          欢迎回来，请登录您的账户
        </p>
      </div>
      <el-form
        ref="formRef"
        :rules="formRules"
        :model="form"
        label-width="0"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名" size="large" prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password" placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="submit"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="submit"
          >
            立即登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
  font-weight: 400;
}

.login-form {
  margin-top: 24px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.login-btn {
  width: 100%;
  border-radius: 8px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    padding: 32px 24px;
    max-width: 100%;
  }

  h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 13px;
  }
}
</style>
