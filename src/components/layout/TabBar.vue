<script setup>
defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  activeTab: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change-tab', 'close-tab'])
</script>

<template>
  <div class="tab-bar">
    <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="emit('change-tab', tab.key)"
    >
      <span>{{ tab.title }}</span>
      <button class="close-btn" @click.stop="emit('close-tab', tab.key)">×</button>
    </div>

    <div v-if="tabs.length === 0" class="empty-text">
      请先从左侧菜单选择功能
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  box-sizing: border-box;
  overflow-x: auto;
  white-space: nowrap;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px 6px 0 0;
  background: #f5f7fa;
  cursor: pointer;
}

.tab-item.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.close-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: inherit;
}

.empty-text {
  color: #909399;
  font-size: 14px;
}
</style>