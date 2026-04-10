<script setup>
import { ref, computed } from 'vue'
import TopHeader from '../components/layout/TopHeader.vue'
import LeftSidebar from '../components/layout/LeftSidebar.vue'
import TabBar from '../components/layout/TabBar.vue'

import View41 from '../components/module4/View41.vue'
import View42 from '../components/module4/View42.vue'
import View43 from '../components/module4/View43.vue'

const tabList = ref([])
const activeTab = ref('')

const componentMap = {
  view41: View41,
  view42: View42,
  view43: View43
}

function handleOpenTab(menu) {
  const exists = tabList.value.find(tab => tab.key === menu.key)

  if (!exists) {
    tabList.value.push(menu)
  }

  activeTab.value = menu.key
}

function handleChangeTab(key) {
  activeTab.value = key
}

function handleCloseTab(key) {
  const index = tabList.value.findIndex(tab => tab.key === key)
  if (index === -1) return

  tabList.value.splice(index, 1)

  if (activeTab.value === key) {
    if (tabList.value.length > 0) {
      activeTab.value = tabList.value[Math.max(0, index - 1)]?.key || ''
    } else {
      activeTab.value = ''
    }
  }
}

const currentComponent = computed(() => {
  if (!activeTab.value) return null
  return componentMap[activeTab.value]
})
</script>

<template>
  <div class="architecture-page">
    <div class="layout-grid">
      <div class="block block-1">
        <TopHeader />
      </div>

      <div class="block block-2">
        <LeftSidebar @open-tab="handleOpenTab" />
      </div>

      <div class="block block-3">
        <TabBar
            :tabs="tabList"
            :active-tab="activeTab"
            @change-tab="handleChangeTab"
            @close-tab="handleCloseTab"
        />
      </div>

      <div class="block block-4">
        <component v-if="currentComponent" :is="currentComponent" />
        <div v-else class="empty-content">
          请从左侧菜单打开一个标签页
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../assets/views/architecture-view.css"></style>
<style scoped>
.empty-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 16px;
}
</style>