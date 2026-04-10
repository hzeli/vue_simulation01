<script setup>
const emit = defineEmits(['open-tab'])

const menuList = [
  { key: 'view41', title: '结构 4-1' },
  { key: 'view42', title: '结构 4-2' },
  { key: 'view43', title: '结构 4-3' }
]

function handleClick(item) {
  emit('open-tab', item)
}
</script>

<template>
  <div class="left-sidebar">
    <div class="menu-title">功能导航</div>
    <ul class="menu-list">
      <li
          v-for="item in menuList"
          :key="item.key"
          @click="handleClick(item)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.left-sidebar {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.menu-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  padding: 12px 10px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
}

.menu-list li:hover {
  background: #f5f7fa;
}
</style>