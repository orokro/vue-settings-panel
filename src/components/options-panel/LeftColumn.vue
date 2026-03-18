<!--
        LeftColumn.vue
        --------------

        The sidebar of the settings panel. Contains search and category navigation.
-->
<script setup>
import { ref, inject, computed, onMounted, onUnmounted } from 'vue'
import SearchBar from './SearchBar.vue'
import CategoriesList from './CategoriesList.vue'

const specification = inject('specification')
const isCollapsed = ref(false)
const windowWidth = ref(window.innerWidth)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
  if (specification.value.sidePanel?.autoCollapse) {
    isCollapsed.value = windowWidth.value < 768
  }
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  updateWidth()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const leftPanelStyle = computed(() => ({
  width: isCollapsed.value ? '60px' : '280px',
  backgroundColor: 'var(--lc-bgColor, #f5f5f5)',
}))
</script>

<template>
  <div class="left-column" :style="leftPanelStyle" :class="{ collapsed: isCollapsed }">
    <div class="header">
      <SearchBar v-if="!isCollapsed" />
      <button class="collapse-toggle" @click="toggleCollapse">
        <span class="material-icons">
          {{ isCollapsed ? 'menu' : 'menu_open' }}
        </span>
      </button>
    </div>
    
    <div class="categories-container">
      <CategoriesList :collapsed="isCollapsed" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.left-column {
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  .header {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .collapse-toggle {
      align-self: flex-end;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--lc-categoryColor, #333);
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
    }
  }

  &.collapsed {
    .header {
      align-items: center;
      .collapse-toggle {
        align-self: center;
      }
    }
  }

  .categories-container {
    flex: 1;
    overflow-y: auto;
    padding: 0 8px 16px;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
  }
}
</style>
