<script lang="ts" setup>
import type { ElTable } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import UploadModal from '@/components/UploadModal.vue'

interface KnowledgeLib {
  id: string
  name: string
  children?: KnowledgeLib[]
}

interface KnowledgeFileItem {
  id: string
  name: string
  uploadTime: string
  status: '构建成功' | '构建失败' | '待构建'
  knowledgeLibId: string // 关联的知识库ID
}

// 左侧知识库树（演示数据，可后续替换为接口）
const libs = ref<KnowledgeLib[]>([
  { id: 'case', name: '案例复盘' },
  { id: 'scene', name: '场景语法' },
  { id: 'deep', name: '深度搜索测试' },
  { id: 'guide', name: '操作指南' },
  { id: 'robot', name: '杭小助知识库' },
  { id: 'icon', name: '图标测试' },
  { id: 'agent', name: 'Agent智能编辑指北' },
  { id: 'case2', name: '案例复盘（副本）' },
  { id: 'car', name: '直通车知识库' },
])

// 已选择的知识库
const selectedLibIds = ref<string[]>(['case', 'guide'])

// 右侧文件列表（演示数据，每个文件关联到一个知识库）
const state = reactive({
  keyword: '',
  building: false,
  files: [
    { id: '1', name: '优惠审批.xlsx', uploadTime: '2024-01-20', status: '构建成功' as const, knowledgeLibId: 'case' },
    { id: '2', name: 'e收盈客户标签操作手册.docx', uploadTime: '2024-01-19', status: '构建成功' as const, knowledgeLibId: 'case' },
    { id: '3', name: '杭易联首页欣慰图.pdf', uploadTime: '2024-01-18', status: '构建成功' as const, knowledgeLibId: 'case' },
    { id: '4', name: 'p2594_杭易联手续费优惠审批.docx', uploadTime: '2024-01-18', status: '构建失败' as const, knowledgeLibId: 'guide' },
    { id: '5', name: '大模型技术重塑金融行业.ppt', uploadTime: '2024-01-16', status: '构建成功' as const, knowledgeLibId: 'guide' },
  ] as KnowledgeFileItem[],
})

const filteredFiles = computed(() => {
  const k = state.keyword.trim().toLowerCase()
  if (!k)
    return state.files
  return state.files.filter(f => f.name.toLowerCase().includes(k))
})

// 表格引用，用于控制表格选择状态
const tableRef = ref<InstanceType<typeof ElTable>>()

// 同步锁，防止循环触发
const isSyncing = ref(false)

// 监听左侧知识库选择变化，同步到右侧文件选择
watch(selectedLibIds, async (newVal, oldVal) => {
  // if (isSyncing.value)
  //   return

  // isSyncing.value = true
  await nextTick()

  try {
    // 找出新增选中的知识库
    const added = newVal.filter(id => !oldVal.includes(id))
    // 找出取消选中的知识库
    const removed = oldVal.filter(id => !newVal.includes(id))

    // 选中新增知识库下的所有文件
    added.forEach((libId) => {
      const filesToSelect = state.files.filter(f => f.knowledgeLibId === libId)
      filesToSelect.forEach((file) => {
        tableRef.value?.toggleRowSelection(file, true)
      })
    })

    // 取消选中移除知识库下的所有文件
    removed.forEach((libId) => {
      const filesToUnselect = state.files.filter(f => f.knowledgeLibId === libId)
      filesToUnselect.forEach((file) => {
        tableRef.value?.toggleRowSelection(file, false)
      })
    })
  }
  finally {
    await nextTick()
    // isSyncing.value = false
  }
}, { deep: true })

// 处理右侧表格选择变化，同步到左侧知识库选择
function handleTableSelectionChange(selectedFiles: KnowledgeFileItem[]) {
  console.log('selectedFiles', selectedFiles)
  // if (isSyncing.value)
  //   return

  // isSyncing.value = true

  try {
    // 按知识库ID分组统计
    const libFileCountMap = new Map<string, { total: number, selected: number }>()

    // 初始化每个知识库的计数
    libs.value.forEach((lib) => {
      libFileCountMap.set(lib.id, { total: 0, selected: 0 })
    })

    // 统计每个知识库的文件总数和选中数
    state.files.forEach((file) => {
      const count = libFileCountMap.get(file.knowledgeLibId)
      if (count) {
        count.total++
        if (selectedFiles.some(f => f.id === file.id))
          count.selected++
      }
    })

    // 更新左侧知识库选择状态
    const newSelectedLibIds: string[] = []
    libFileCountMap.forEach((count, libId) => {
      // 如果该知识库有文件且全部选中，则选中该知识库
      if (count.total > 0 && count.selected === count.total)
        newSelectedLibIds.push(libId)
    })

    selectedLibIds.value = newSelectedLibIds
  }
  finally {
    isSyncing.value = false
  }
}

// 初始化：根据已选中的知识库，选中对应的文件
async function initFileSelection() {
  await nextTick()
  if (!tableRef.value)
    return

  isSyncing.value = true
  try {
    selectedLibIds.value.forEach((libId) => {
      const filesToSelect = state.files.filter(f => f.knowledgeLibId === libId)
      filesToSelect.forEach((file) => {
        tableRef.value?.toggleRowSelection(file, true)
      })
    })
  }
  finally {
    await nextTick()
    isSyncing.value = false
  }
}

onMounted(() => {
  initFileSelection()
})

// 上传弹窗
const uploadVisible = ref(false)
function openUpload() {
  uploadVisible.value = true
}
function closeUpload() {
  uploadVisible.value = false
}

function handleUploadSuccess(result: any) {
  // 演示：上传成功后增加一条待构建记录
  // 默认关联到第一个已选中的知识库，如果没有则关联到第一个知识库
  const defaultLibId = selectedLibIds.value.length > 0
    ? selectedLibIds.value[0]
    : libs.value[0]?.id || 'case'

  const now = new Date()
  const newFile: KnowledgeFileItem = {
    id: String(Date.now()),
    name: result?.fileName || '新文件',
    uploadTime: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    status: '待构建',
    knowledgeLibId: defaultLibId,
  }
  state.files.unshift(newFile)

  // 如果上传的文件关联的知识库已选中，则自动选中该文件
  if (selectedLibIds.value.includes(defaultLibId)) {
    nextTick(() => {
      tableRef.value?.toggleRowSelection(newFile, true)
    })
  }
}

// 操作列
function handleAsk(row: KnowledgeFileItem) {
  console.log('问答: ', row.id)
}
function handleDownload(row: KnowledgeFileItem) {
  console.log('下载: ', row.id)
}
function handleRemove(row: KnowledgeFileItem) {
  state.files = state.files.filter(f => f.id !== row.id)
  // 删除文件后，重新计算选中状态以同步左侧知识库
  nextTick(() => {
    const selectedFiles = tableRef.value?.getSelectionRows() || []
    handleTableSelectionChange(selectedFiles)
  })
}
</script>

<template>
  <div class="knowledge-page">
    <div class="header">
      <div class="title">
        Hi ~ 我是薪小助
      </div>
      <div class="sub">
        你对， 有任何关于知识库的问题，请尽管问。
      </div>
    </div>

    <div class="content">
      <div class="left">
        <div class="left-title">
          知识库目录
        </div>
        <el-scrollbar class="libs">
          <el-checkbox-group v-model="selectedLibIds">
            <div v-for="lib in libs" :key="lib.id" class="lib-item">
              <el-checkbox :label="lib.id">
                {{ lib.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-scrollbar>
      </div>

      <div class="right">
        <div class="right-header">
          <div class="right-title">
            案例复盘
            <el-tag type="warning" effect="plain" class="ml8">
              7.8%
            </el-tag>
            <el-tag type="danger" effect="plain" class="ml8">
              无问题覆盖 2.5%
            </el-tag>
          </div>
          <div class="tools">
            <el-input v-model="state.keyword" placeholder="请输入文件名称" clearable style="width: 220px;" />
            <el-button type="primary" @click="openUpload">
              上传文件
            </el-button>
          </div>
        </div>

        <el-table
          ref="tableRef"
          :data="filteredFiles"
          stripe
          border
          height="520"
          @selection-change="handleTableSelectionChange"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="name" label="文件名称" min-width="260" show-overflow-tooltip />
          <el-table-column prop="uploadTime" label="上传时间" width="140" />
          <el-table-column prop="status" label="构建状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === '构建成功' ? 'success' : (row.status === '构建失败' ? 'danger' : 'warning')">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleAsk(row)">
                问答
              </el-button>
              <el-button type="primary" link @click="handleDownload(row)">
                下载
              </el-button>
              <el-button type="danger" link @click="handleRemove(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <UploadModal
      :visible="uploadVisible"
      :multiple="true"
      upload-url="/api/upload"
      @close="closeUpload"
      @upload-success="handleUploadSuccess"
    />
  </div>
</template>

<style scoped>
.knowledge-page {
  padding: 12px;
  text-align: left;
}

.header .title {
  font-size: 20px;
  font-weight: 600;
}
.header .sub {
  color: #666;
  margin-top: 4px;
}

.content {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 12px;
  margin-top: 12px;
}

.left {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}

.left-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.libs {
  max-height: 560px;
}

.lib-item {
  line-height: 32px;
}

.right {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}

.right-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.right-title {
  font-weight: 600;
}

.ml8 { margin-left: 8px; }
</style>
