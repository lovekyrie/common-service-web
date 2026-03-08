<script>
import WeightFormItem from '@/components/WeightFormItem.vue'

export default {
  name: 'AboutView',
  components: {
    WeightFormItem,
  },
  data() {
    return {
      weight: '',
    }
  },
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <WeightFormItem v-model="weight" />
    <p>Weight: {{ weight }}</p>
  </div>
</template>
