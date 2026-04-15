<script setup lang="ts">
import { computed, ref } from 'vue'
import { removePageCache } from '@/stores/pageCache'
import TopHeader from '@/components/layout/TopHeader.vue'
import LeftSidebar from '@/components/layout/LeftSidebar.vue'
import TabBar from '@/components/layout/TabBar.vue'
import ContentRenderer from '@/components/content/ContentRenderer.vue'
import type { MenuItem } from '@/types/menu'

type MotionDirection = 'forward' | 'backward'

const tabList = ref<MenuItem[]>([])
const activeTab = ref<string>('')
const motionDirection = ref<MotionDirection>('forward')

// 返回string所代表的tab值
const getTabIndex = (key: string): number => {
  return tabList.value.findIndex((tab) => tab.key === key)
}

//通过判断新旧tab的index位置来对motionDirection进行赋值
const setDirectionByTarget = (targetKey: string): void => {
  const currentIndex = getTabIndex(activeTab.value)
  const targetIndex = getTabIndex(targetKey)

  if (currentIndex === -1 || targetIndex === -1) {
    motionDirection.value = 'forward'
    return
  }

  motionDirection.value = targetIndex > currentIndex ? 'forward' : 'backward'
}

const handleOpenTab = (menu: MenuItem): void => {
  const exists = tabList.value.find((tab) => tab.key === menu.key)

  if (!exists) {
    tabList.value.push({ ...menu })
    motionDirection.value = 'forward'
    activeTab.value = menu.key
    return
  }

  setDirectionByTarget(menu.key)
  activeTab.value = menu.key
}

const handleChangeTab = (key: string): void => {
  if (key === activeTab.value) return
  setDirectionByTarget(key)
  activeTab.value = key
}

const handleCloseTab = (key: string): void => {
  const index = getTabIndex(key)
  if (index === -1) return

  const isClosingActive = activeTab.value === key

  // 关键：关闭时清缓存，重新打开就回第一页重新请求
  removePageCache(key)

  tabList.value.splice(index, 1)

  // 如果关掉的页面不是当前页面，直接返回，不进行切换
  if (!isClosingActive) return

  const nextTab =
      tabList.value[index] ||
      tabList.value[index - 1] ||
      null
// 如果关闭之后没有页面就赋值空字符串
  if (!nextTab) {
    activeTab.value = ''
    return
  }

  const nextIndex = getTabIndex(nextTab.key)
  motionDirection.value = nextIndex >= index ? 'forward' : 'backward'
  activeTab.value = nextTab.key
}

const currentTab = computed<MenuItem | null>(() => {
  return tabList.value.find((tab) => tab.key === activeTab.value) || null
})

const motionName = computed<string>(() => {
  return motionDirection.value === 'forward'
      ? 'pane-forward'
      : 'pane-backward'
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
        <div class="content-stage">
          <Transition :name="motionName">
            <div
                v-if="currentTab"
                :key="currentTab.key"
                class="content-page"
            >
              <ContentRenderer :tab="currentTab" />
            </div>

            <div v-else key="empty" class="empty-content">
              请从左侧菜单打开一个标签页
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>


