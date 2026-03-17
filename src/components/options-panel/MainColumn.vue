<!--
        MainColumn.vue
        --------------

        The main content area where settings are displayed and edited.
-->
<script setup>
import { inject, computed } from 'vue'
import CategoryBox from './CategoryBox.vue'
import SearchBar from './SearchBar.vue'

const specification = inject('specification')
const selectedCategorySlug = inject('selectedCategorySlug')
const settings = inject('settings')

const showLeftPanel = computed(() => {
  return specification.sidePanel?.enabled !== false
})

const categories = computed(() => {
  const cats = specification.categories || []
  
  if (!showLeftPanel.value) {
    // Show all categories that pass their show() test
    return cats.filter(cat => typeof cat.show === 'function' ? cat.show(settings) : true)
  }
  
  // Show only the selected top-level category
  const topLevelSelected = selectedCategorySlug.value.split('.')[0]
  return cats.filter(cat => cat.slug === topLevelSelected)
})

const mainColumnStyle = computed(() => ({
  backgroundColor: 'var(--mc-bgColor, #fff)',
  color: 'var(--mc-textColor, #333)',
}))
</script>

<template>
  <div class="main-column" :style="mainColumnStyle">
    <div class="search-sticky" v-if="!showLeftPanel">
      <SearchBar />
    </div>

    <div class="content-area">
      <CategoryBox 
        v-for="cat in categories" 
        :key="cat.slug" 
        :category="cat" 
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .search-sticky {
    padding: 16px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background-color: inherit;
    z-index: 10;
  }

  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
  }
}
</style>
