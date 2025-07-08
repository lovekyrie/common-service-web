<script lang="ts">
import { defineComponent, ref } from 'vue'
import UploadModal from './UploadModal.vue'

interface UploadResult {
  fileName: string
  success: boolean
  message?: string
  data?: any
}

export default defineComponent({
  name: 'UploadExample',
  components: {
    UploadModal,
  },
  setup() {
    const uploadModalVisible = ref(false)
    const imageUploadModalVisible = ref(false)
    const uploadResults = ref<UploadResult[]>([])

    const showUploadModal = () => {
      uploadModalVisible.value = true
    }

    const closeUploadModal = () => {
      uploadModalVisible.value = false
    }

    const showImageUploadModal = () => {
      imageUploadModalVisible.value = true
    }

    const closeImageUploadModal = () => {
      imageUploadModalVisible.value = false
    }

    const handleUploadSuccess = (result: any) => {
      console.log('Upload success:', result)
      uploadResults.value.push({
        fileName: '批量文件',
        success: true,
        message: '文件上传成功',
        data: result,
      })
    }

    const handleImageUploadSuccess = (result: any) => {
      console.log('Image upload success:', result)
      uploadResults.value.push({
        fileName: '图片文件',
        success: true,
        message: '图片上传成功',
        data: result,
      })
    }

    const handleUploadError = (error: any) => {
      console.error('Upload error:', error)
      uploadResults.value.push({
        fileName: '文件',
        success: false,
        message: error.message || '上传失败',
      })
    }

    return {
      uploadModalVisible,
      imageUploadModalVisible,
      uploadResults,
      showUploadModal,
      closeUploadModal,
      showImageUploadModal,
      closeImageUploadModal,
      handleUploadSuccess,
      handleImageUploadSuccess,
      handleUploadError,
    }
  },
})
</script>

<template>
  <div class="upload-example">
    <h2>文件上传示例</h2>

    <div class="upload-buttons">
      <button class="btn btn-primary" @click="showUploadModal">
        打开上传弹窗
      </button>

      <button class="btn btn-secondary" @click="showImageUploadModal">
        仅上传图片
      </button>
    </div>

    <!-- 通用上传弹窗 -->
    <UploadModal
      :visible="uploadModalVisible"
      :multiple="true"
      :max-file-size="10 * 1024 * 1024"
      :allowed-types="['image/*', 'application/pdf', 'text/*']"
      upload-url="/api/upload"
      @close="closeUploadModal"
      @upload-success="handleUploadSuccess"
      @upload-error="handleUploadError"
    />

    <!-- 仅图片上传弹窗 -->
    <UploadModal
      :visible="imageUploadModalVisible"
      :multiple="false"
      :max-file-size="5 * 1024 * 1024"
      :allowed-types="['image/*']"
      upload-url="/api/upload-image"
      @close="closeImageUploadModal"
      @upload-success="handleImageUploadSuccess"
      @upload-error="handleUploadError"
    />

    <!-- 上传结果展示 -->
    <div v-if="uploadResults.length > 0" class="upload-results">
      <h3>上传结果:</h3>
      <div v-for="(result, index) in uploadResults" :key="index" class="result-item">
        <div class="result-info">
          <span class="result-name">{{ result.fileName }}</span>
          <span class="result-status" :class="result.success ? 'success' : 'error'">
            {{ result.success ? '成功' : '失败' }}
          </span>
        </div>
        <div v-if="result.message" class="result-message">
          {{ result.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.upload-example h2 {
  color: #333;
  margin-bottom: 20px;
}

.upload-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover {
  background-color: #40a9ff;
}

.btn-secondary {
  background-color: #52c41a;
  color: white;
}

.btn-secondary:hover {
  background-color: #73d13d;
}

.upload-results {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.upload-results h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.result-item {
  background: white;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.result-name {
  font-weight: 500;
  color: #333;
}

.result-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.result-status.success {
  background-color: #f6ffed;
  color: #52c41a;
}

.result-status.error {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.result-message {
  font-size: 12px;
  color: #666;
}
</style>
