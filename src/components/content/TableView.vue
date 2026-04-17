<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getPageCache, setPageCache } from '@/stores/pageCache'
import type {
  ApiListResponse,
  GenericRow,
  MenuItem,
  TablePageCache
} from '@/types/menu'

const props = defineProps<{
  tab: MenuItem
}>()

const loading = ref<boolean>(false)
const errorMsg = ref<string>('')
const rows = ref<GenericRow[]>([])
const total = ref<number>(0)
const pageNo = ref<number>(1)
const pageSize = ref<number>(10)

const tableTitle = computed<string>(() => props.tab.title || '数据表')

const maxPage = computed<number>(() => {
  const value = Math.ceil(total.value / pageSize.value)
  return value > 0 ? value : 1
})

const requestUrl = computed<string>(() => {
  const params = new URLSearchParams()

  if (props.tab.tbl) {
    params.set('tbl', props.tab.tbl)
  }

  if (props.tab.fields) {
    params.set('field', props.tab.fields)
  }

  params.set('pageNo', String(pageNo.value))
  params.set('pageSize', String(pageSize.value))

  return `${props.tab.api}?${params.toString()}`
})

const restoreCache = (cache: TablePageCache): void => {
  rows.value = [...cache.rows]
  total.value = cache.total
  pageNo.value = cache.pageNo
  pageSize.value = cache.pageSize
}

const saveCache = (): void => {
  setPageCache(props.tab.key, {
    view: 'table',
    loaded: true,
    rows: [...rows.value],
    total: total.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    updatedAt: Date.now()
  })
}

const loadData = async (): Promise<void> => {
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

    const result = (await response.json()) as ApiListResponse
    console.log('接口返回结果:', result)

    const data = result.result

    rows.value = Array.isArray(data?.records) ? data.records : []
    total.value = Number(data?.total || 0)
    pageNo.value = Number(data?.pageNo || pageNo.value)
    pageSize.value = Number(data?.pageSize || pageSize.value)

    saveCache()
  } catch (error) {
    rows.value = []
    total.value = 0
    errorMsg.value =
        error instanceof Error ? error.message : '数据加载失败'
  } finally {
    loading.value = false
  }
}

const handlePrevPage = async (): Promise<void> => {
  if (pageNo.value <= 1) return
  pageNo.value -= 1
  await loadData()
}

const handleNextPage = async (): Promise<void> => {
  if (pageNo.value >= maxPage.value) return
  pageNo.value += 1
  await loadData()
}

const handleRefresh = async (): Promise<void> => {
  await loadData()
}

watch(
    () => props.tab.key,
    async (newKey: string) => {
      const cache = getPageCache(newKey)

      if (cache && cache.view === 'table') {
        restoreCache(cache as TablePageCache)
        return
      }

      rows.value = []
      total.value = 0
      pageNo.value = 1
      pageSize.value = 10

      await loadData()
    },
    { immediate: true }
)
</script>

<template>
  <div class="table-view">
    <div class="table-toolbar">
      <div class="left-area">
        <h3 class="table-title">{{ tableTitle }}</h3>
        <span class="table-total">共 {{ total }} 条</span>
      </div>

      <div class="right-area">
        <button class="action-btn" @click="handleRefresh">刷新</button>
      </div>
    </div>

    <div v-if="loading" class="state-box">加载中...</div>

    <div v-else-if="errorMsg" class="state-box error-box">
      {{ errorMsg }}
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
        <tr>
          <th v-for="col in tab.columns || []" :key="col.prop">
            {{ col.label }}
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-if="rows.length === 0">
          <td :colspan="(tab.columns || []).length || 1" class="empty-cell">
            暂无数据
          </td>
        </tr>

        <tr v-for="(row, rowIndex) in rows" :key="String(row.id ?? rowIndex)">
          <td v-for="col in tab.columns || []" :key="col.prop">
            {{ row[col.prop] ?? '--' }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pager">
      <button
          class="page-btn"
          :disabled="pageNo <= 1 || loading"
          @click="handlePrevPage"
      >
        上一页
      </button>

      <span class="page-info">
        第 {{ pageNo }} / {{ maxPage }} 页
      </span>

      <button
          class="page-btn"
          :disabled="pageNo >= maxPage || loading"
          @click="handleNextPage"
      >
        下一页
      </button>
    </div>
  </div>
</template>
<style scoped src="@/assets/styles/components/table.css"></style>