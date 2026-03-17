<!--
        CategoriesList.vue
        ------------------

        Displays the list of top-level categories.
-->
<script setup>
import { inject, computed } from 'vue'
import CategoryItem from './CategoryItem.vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const specification = inject('specification')
const searchQuery = inject('searchQuery')
const settings = inject('settings')

const categories = computed(() => specification.categories || [])

// Helper to determine if a category should be shown based on show() and search
const filteredCategories = computed(() => {
  return categories.value.map(cat => {
    const isVisible = typeof cat.show === 'function' ? cat.show(settings) : true
    const hasSearchMatch = checkMatch(cat, searchQuery.value)
    
    return {
      ...cat,
      isVisible,
      hasSearchMatch
    }
  })
})

const checkMatch = (cat, query) => {
  if (!query) return true
  const q = query.toLowerCase()
  
  // Check name/desc
  if (cat.name.toLowerCase().includes(q) || (cat.desc && cat.desc.toLowerCase().includes(q))) return true
  
  // Check subcategories
  if (cat.categories && cat.categories.some(sub => checkMatch(sub, q))) return true
  
  // Check settings for this category
  const allSettings = specification.settings || {}
  const settingsInCat = Object.values(allSettings).filter(s => s.cats && s.cats.some(c => c.split('.')[0] === cat.slug))
  
  return settingsInCat.some(s => 
    s.name.toLowerCase().includes(q) || 
    (s.desc && s.desc.toLowerCase().includes(q)) || 
    (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
  )
}
</script>

<template>
  <div class="categories-list">
    <CategoryItem 
      v-for="cat in filteredCategories" 
      :key="cat.slug" 
      :category="cat" 
      :collapsed="collapsed"
      v-show="cat.isVisible"
    />
  </div>
</template>

<style lang="scss" scoped>
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
