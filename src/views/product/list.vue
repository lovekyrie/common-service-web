<script setup lang="ts">
import { getPostByQuery, postFormData, postJson, postUrlEncoded } from '@/api/service'

async function loadPost() {
  const res = await getPostByQuery({ name: 'lovekyrie', age: 20 })
  console.log(res)
}
loadPost()

async function loadPostFromUrlEncoded() {
  const res = await postUrlEncoded({ title: 'lovekyrie', content: '20', author: 'lovekyrie', age: 20 })
  console.log(res)
}
loadPostFromUrlEncoded()

async function loadPostFromJson() {
  const res = await postJson({ title: 'lovekyrie1', content: '20', author: 'lovekyrie1', age: 20 })
  console.log(res)
}
loadPostFromJson()

async function handleFileChange(e: Event) {
  const file1 = (e.target as HTMLInputElement).files?.[0]
  const file2 = (e.target as HTMLInputElement).files?.[1]
  if (!file1 || !file2) {
    return
  }
  const formData = new FormData()
  formData.append('title', 'lovekyrie')
  formData.append('age', '20')
  formData.append('file1', file1)
  formData.append('file2', file2)
  const res = await postFormData(formData)
  console.log(res)
}
</script>

<template>
  <div class="product-edit">
    这是列表页面
    <input type="file" multiple @change="handleFileChange">
  </div>
</template>

<style scoped>

</style>
