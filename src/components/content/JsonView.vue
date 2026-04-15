<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getPageCache, setPageCache } from '@/stores/pageCache'
import type { JsonPageCache, MenuItem } from '@/types/menu'

const props = defineProps<{
  tab: MenuItem
}>()

const loading = ref<boolean>(false)
const errorMsg = ref<string>('')
const jsonText = ref<string>('')

const requestUrl = computed<string>(() => {
  const params = new URLSearchParams()

  if (props.tab.tbl) {
    params.set('tbl', props.tab.tbl)
  }

  if (props.tab.fields) {
    params.set('field', props.tab.fields)
  }

  params.set('pageNo', '1')
  params.set('pageSize', '10')

  return `${props.tab.api}?${params.toString()}`
})

const restoreCache = (cache: JsonPageCache): void => {
  jsonText.value = cache.jsonText
}

const saveCache = (): void => {
  setPageCache(props.tab.key, {
    view: 'json',
    loaded: true,
    jsonText: jsonText.value,
    updatedAt: Date.now()
  })
}

const loadJson = async (): Promise<void> => {
  if (!props.tab.api) return

  loading.value = true
  errorMsg.value = ''

  try {
    const response = await fetch(requestUrl.value, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`)
    }

    const result = await response.json()
    console.log('JSON调试返回:', result)

    jsonText.value = JSON.stringify(result, null, 2)
    saveCache()
  } catch (error) {
    jsonText.value = ''
    errorMsg.value =
        error instanceof Error ? error.message : 'JSON 加载失败'
  } finally {
    loading.value = false
  }
}

const handleRefresh = async (): Promise<void> => {
  await loadJson()
}

const handleCopy = async (): Promise<void> => {
  if (!jsonText.value) return

  try {
    await navigator.clipboard.writeText(jsonText.value)
    alert('JSON 已复制')
  } catch {
    alert('复制失败')
  }
}

watch(
    () => props.tab.key,
    async (newKey: string) => {
      const cache = getPageCache(newKey)

      if (cache && cache.view === 'json') {
        restoreCache(cache as JsonPageCache)
        return
      }

      jsonText.value = ''
      await loadJson()
    },
    { immediate: true }
)
</script>

<template>
  <div class="json-view">
    <div class="json-toolbar">
      <div class="left-area">
        <h3 class="json-title">{{ tab.title }}</h3>
        <span class="json-table">表名：{{ tab.tbl || '--' }}</span>
      </div>

      <div class="right-area">
        <button class="action-btn" @click="handleRefresh">刷新</button>
        <button class="action-btn" @click="handleCopy">复制 JSON</button>
      </div>
    </div>

    <div class="request-url">
      <span class="label">请求地址：</span>
      <span class="value">{{ requestUrl }}</span>
    </div>

    <div v-if="loading" class="state-box">加载中...</div>

    <div v-else-if="errorMsg" class="state-box error-box">
      {{ errorMsg }}
    </div>

    <pre v-else class="json-box">{{ jsonText }}</pre>
  </div>
</template>

<style scoped src="@/assets/styles/index.css"></style>