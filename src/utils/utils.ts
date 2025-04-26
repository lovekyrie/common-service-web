import { ElMessage } from 'element-plus'

export function showMessage(message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') {
  ElMessage({
    message,
    type,
  })
}
