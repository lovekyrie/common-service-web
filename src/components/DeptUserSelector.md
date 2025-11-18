# DeptUserSelector 部门人员选择器

## 功能特性

- ✅ 左侧部门树形结构展示，支持多选
- ✅ 中间标签页切换（按部门/按员工）
- ✅ 右侧人员列表展示，支持多选
- ✅ 部门和人员搜索功能
- ✅ 已选标签展示，支持点击删除
- ✅ 选中数量统计
- ✅ 支持预设默认选中项

## 使用方法

### 1. 基础使用

```vue
<script setup>
import { ref } from 'vue'
import DeptUserSelector from '@/components/DeptUserSelector.vue'

const selectorVisible = ref(false)

function handleConfirm(result) {
  console.log('选择结果：', result)
  // result 包含：
  // {
  //   deptIds: ['dept-1', 'dept-2'],  // 选中的部门ID数组
  //   userIds: ['user-1', 'user-2'],  // 选中的用户ID数组
  //   depts: [{id, label}, ...],      // 选中的部门详细信息
  //   users: [{id, name, employeeId, deptId, deptName}, ...] // 选中的用户详细信息
  // }
}
</script>

<template>
  <div>
    <el-button @click="selectorVisible = true">
      选择部门/人员
    </el-button>

    <DeptUserSelector
      v-model:visible="selectorVisible"
      @confirm="handleConfirm"
    />
  </div>
</template>
```

### 2. 带预选项的使用

```vue
<script setup>
import { ref } from 'vue'
import DeptUserSelector from '@/components/DeptUserSelector.vue'

const selectorVisible = ref(false)

function handleConfirm(result) {
  console.log('确认选择：', result)
}

function handleCancel() {
  console.log('取消选择')
}
</script>

<template>
  <DeptUserSelector
    v-model:visible="selectorVisible"
    :default-dept-ids="['dept-1-2']"
    :default-user-ids="['1', '2', '3']"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|------|--------|
| visible | 对话框是否可见（支持 v-model） | Boolean | false |
| defaultDeptIds | 默认选中的部门ID列表 | Array | [] |
| defaultUserIds | 默认选中的用户ID列表 | Array | [] |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| confirm | 点击确定按钮时触发 | result: { deptIds, userIds, depts, users } |
| cancel | 点击取消按钮或关闭对话框时触发 | - |
| update:visible | 对话框可见性变化时触发 | visible: Boolean |

## 数据接口对接

目前组件使用的是模拟数据，实际使用时需要替换为真实的 API 接口：

### 1. 修改部门树数据源

在 `DeptUserSelector.vue` 中找到 `deptTree` 的定义，替换为从 API 获取：

```javascript
import { onMounted, ref } from 'vue'
import { getDeptTreeApi } from '@/api/dept'

const deptTree = ref([])

onMounted(async () => {
  const { data } = await getDeptTreeApi()
  deptTree.value = data
})
```

### 2. 修改用户列表数据源

在 `DeptUserSelector.vue` 中找到 `userList` 的定义，替换为从 API 获取：

```javascript
import { getUserListApi } from '@/api/user'

const userList = ref([])

onMounted(async () => {
  const { data } = await getUserListApi()
  userList.value = data
})
```

## 样式自定义

组件使用了 scoped 样式，如需自定义样式，可以通过以下方式：

### 1. 修改颜色主题

在组件中修改以下 CSS 变量：

```scss
.tab-item.active {
  background: #409EFF;  // 修改为你的主题色
}

.selection-count .count {
  color: #409EFF;  // 修改为你的主题色
}
```

### 2. 修改尺寸

```scss
.dept-user-selector {
  height: 500px;  // 修改整体高度
}

.left-panel,
.right-panel {
  flex: 0 0 300px;  // 修改左右面板宽度
}
```

## 完整示例

参考 `src/views/demo/DeptUserSelectorDemo.vue` 文件查看完整的使用示例。
