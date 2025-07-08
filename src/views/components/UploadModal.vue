<script lang="ts">
import { showMessage } from '@/utils/utils'
import { computed, defineComponent, ref } from 'vue'

interface UploadFile {
  file: File
  name: string
  size: number
  type: string
}

export default defineComponent({
  name: 'UploadModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024, // 10MB
    },
    allowedTypes: {
      type: Array as () => string[],
      default: () => ['image/*', 'application/pdf', 'text/*'],
    },
    uploadUrl: {
      type: String,
      default: '/api/upload',
    },
  },
  emits: ['close', 'uploadSuccess', 'uploadError'],
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement>()
    const isDragOver = ref(false)
    const uploadedFiles = ref<UploadFile[]>([])
    const isUploading = ref(false)

    const acceptTypes = computed(() => {
      return props.allowedTypes.join(',')
    })

    const closeModal = () => {
      emit('close')
      resetState()
    }

    function resetState() {
      uploadedFiles.value = []
      isDragOver.value = false
      isUploading.value = false
    }

    const handleOverlayClick = (event: Event) => {
      if (event.target === event.currentTarget) {
        closeModal()
      }
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
      isDragOver.value = true
    }

    const handleDragEnter = (event: DragEvent) => {
      event.preventDefault()
      isDragOver.value = true
    }

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault()
      isDragOver.value = false
    }

    const handleDrop = (event: DragEvent) => {
      event.preventDefault()
      isDragOver.value = false

      const files = event.dataTransfer?.files
      if (files) {
        addFiles(Array.from(files))
      }
    }

    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement
      const files = target.files
      if (files) {
        addFiles(Array.from(files))
      }
    }

    function addFiles(files: File[]) {
      files.forEach((file) => {
        if (validateFile(file)) {
          const uploadFile: UploadFile = {
            file,
            name: file.name,
            size: file.size,
            type: file.type,
          }
          uploadedFiles.value.push(uploadFile)
        }
      })
    }

    function validateFile(file: File): boolean {
      // 检查文件大小
      if (file.size > props.maxFileSize) {
        showMessage(`文件 ${file.name} 超过最大大小限制`)
        return false
      }

      // 检查文件类型
      const isValidType = props.allowedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const baseType = type.replace('/*', '')
          return file.type.startsWith(baseType)
        }
        return file.type === type
      })

      if (!isValidType) {
        showMessage(`文件 ${file.name} 类型不支持`)
        return false
      }

      return true
    }

    const removeFile = (index: number) => {
      uploadedFiles.value.splice(index, 1)
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0)
        return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
    }

    const handleUpload = async () => {
      if (uploadedFiles.value.length === 0)
        return

      isUploading.value = true

      try {
        const formData = new FormData()
        uploadedFiles.value.forEach((uploadFile, index) => {
          formData.append(`file${index}`, uploadFile.file)
        })

        // 这里使用你之前封装的 request 工具
        const response = await fetch(props.uploadUrl, {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          emit('uploadSuccess', result)
          closeModal()
        }
        else {
          throw new Error('上传失败')
        }
      }
      catch (error) {
        console.error('Upload error:', error)
        emit('uploadError', error)
      }
      finally {
        isUploading.value = false
      }
    }

    return {
      fileInput,
      isDragOver,
      uploadedFiles,
      isUploading,
      acceptTypes,
      closeModal,
      handleOverlayClick,
      triggerFileInput,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleDrop,
      handleFileSelect,
      removeFile,
      formatFileSize,
      handleUpload,
    }
  },
})
</script>

<template>
  <div v-if="visible" class="upload-modal-overlay" @click="handleOverlayClick">
    <div class="upload-modal" @click.stop>
      <div class="modal-header">
        <h3>文件上传</h3>
        <button class="close-btn" @click="closeModal">
          &times;
        </button>
      </div>

      <div class="modal-body">
        <div
          class="upload-area"
          :class="{ 'drag-over': isDragOver }"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @click="triggerFileInput"
        >
          <div class="upload-content">
            <div class="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <p class="upload-text">
              拖拽文件到此处或点击上传
            </p>
            <p class="upload-hint">
              支持的文件格式: {{ allowedTypes.join(', ') }}
            </p>
            <p class="upload-hint">
              最大文件大小: {{ formatFileSize(maxFileSize) }}
            </p>
          </div>
        </div>

        <input
          ref="fileInput"
          type="file"
          :accept="acceptTypes"
          :multiple="multiple"
          style="display: none"
          @change="handleFileSelect"
        >

        <div v-if="uploadedFiles.length > 0" class="file-list">
          <h4>已选择的文件:</h4>
          <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </div>
            <button class="remove-btn" @click="removeFile(index)">
              删除
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal">
          取消
        </button>
        <button
          class="btn btn-primary"
          :disabled="uploadedFiles.length === 0 || isUploading"
          @click="handleUpload"
        >
          {{ isUploading ? '上传中...' : '开始上传' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.upload-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.upload-area:hover {
  border-color: #1890ff;
  background-color: #f0f8ff;
}

.upload-area.drag-over {
  border-color: #1890ff;
  background-color: #e6f7ff;
  transform: scale(1.02);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  color: #999;
}

.upload-text {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.file-list {
  margin-top: 20px;
}

.file-list h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 14px;
  color: #333;
}

.file-size {
  font-size: 12px;
  color: #999;
}

.remove-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

.remove-btn:hover {
  background: #ff7875;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #40a9ff;
}

.btn-primary:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e8e8e8;
}
</style>
