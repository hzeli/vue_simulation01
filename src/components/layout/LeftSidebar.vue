<script setup lang="ts">
import { ref } from 'vue'
import type { MenuGroup, MenuItem } from '../../types/menu'
import { menuList } from '../../config/menuList'

const emit = defineEmits<{
  (e: 'open-tab', menu: MenuItem): void
}>()

const openGroups = ref<string[]>(['core'])
const groups = menuList as MenuGroup[]

const OPEN_DUR = 420
const CLOSE_DUR = 300

const toggleGroup = (key: string): void => {
  if (openGroups.value.includes(key)) {
    openGroups.value = openGroups.value.filter((item) => item !== key)
  } else {
    openGroups.value.push(key)
  }
}

const handleOpenTab = (item: MenuItem): void => {
  emit('open-tab', item)
}

/**
 * 卷轴展开：
 * 外层只负责“腾空间”
 * 内层由 CSS 做 clip-path 展开
 */
const onBeforeEnter = (el: Element): void => {
  const shell = el as HTMLElement
  shell.style.height = '0px'
  shell.style.overflow = 'hidden'
}

const onEnter = (el: Element, done: () => void): void => {
  const shell = el as HTMLElement
  const targetHeight = shell.scrollHeight

  requestAnimationFrame(() => {
    shell.style.height = `${targetHeight}px`
  })

  window.setTimeout(() => {
    shell.style.height = ''
    shell.style.overflow = ''
    done()
  }, OPEN_DUR)
}

/**
 * 卷轴收起：
 * 外层高度收回
 * 内层由 CSS 做 clip-path 卷回
 */
const onBeforeLeave = (el: Element): void => {
  const shell = el as HTMLElement
  shell.style.height = `${shell.scrollHeight}px`
  shell.style.overflow = 'hidden'
}

const onLeave = (el: Element, done: () => void): void => {
  const shell = el as HTMLElement

  requestAnimationFrame(() => {
    shell.style.height = '0px'
  })

  window.setTimeout(() => {
    done()
  }, CLOSE_DUR)
}
</script>

<template>
  <div class="left-sidebar">
    <div class="menu-title">功能导航</div>

    <div
        v-for="group in groups"
        :key="group.key"
        class="menu-group"
    >
      <div
          class="group-title"
          :class="{ 'is-open': openGroups.includes(group.key) }"
          @click="toggleGroup(group.key)"
      >
        <span>{{ group.title }}</span>
        <span class="group-arrow">
    {{ openGroups.includes(group.key) ? '▼' : '▶' }}
  </span>
      </div>

      <Transition
          name="menu-curtain"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @before-leave="onBeforeLeave"
          @leave="onLeave"
      >
        <div
            v-if="openGroups.includes(group.key)"
            class="group-children-shell"
        >
          <div class="group-children-panel">
            <div class="group-children">
              <div
                  v-for="child in group.children"
                  :key="child.key"
                  class="child-item"
                  @click="handleOpenTab(child)"
              >
                {{ child.title }}
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped src="@/assets/styles/components/left-sidebar.css"></style>