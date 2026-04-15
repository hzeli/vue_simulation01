<script setup lang="ts">
import TableView from './TableView.vue'
import JsonView from './JsonView.vue'
import HealthView from './HealthView.vue'
import DetailView from './DetailView.vue'
import ColumnsView from './ColumnsView.vue'
import type { MenuItem } from '@/types/menu'

defineProps<{
  tab: MenuItem
}>()
</script>

<template>
  <TableView v-if="tab.view === 'table'" :tab="tab" />
  <JsonView v-else-if="tab.view === 'json'" :tab="tab" />
  <HealthView v-else-if="tab.view === 'health'" :tab="tab" />
  <DetailView v-else-if="tab.view === 'detail'" :tab="tab" />
  <ColumnsView v-else-if="tab.view === 'columns'" :tab="tab" />
  <div v-else>暂不支持的视图类型：{{ tab.view }}</div>
</template>
<style scoped src="@/assets/styles/index.css"></style>