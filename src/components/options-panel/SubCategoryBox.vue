<!--
        SubCategoryBox.vue
        ------------------

        Displays a sub-category's title and its settings.
-->
<script setup>
import { inject, computed } from 'vue'
import SettingRow from './SettingRow.vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  parentSlug: {
    type: String,
    required: true
  }
})

const specification = inject('specification')
const settingsState = inject('settings')
const searchQuery = inject('searchQuery')

const fullSlug = computed(() => `${props.parentSlug}.${props.category.slug}`)

const subSettings = computed(() => {
  const allSettings = specification.value.settings || {}
  return Object.entries(allSettings).filter(([key, s]) => {
    const isVisible = typeof s.show === 'function' ? s.show(settingsState.value) : true
    return isVisible && s.cats && s.cats.includes(fullSlug.value)
  })
})

const shouldShow = computed(() => {
  if (!searchQuery.value) return true
  
  const q = searchQuery.value.toLowerCase()
  
  // Check subcategory name
  if (props.category.name.toLowerCase().includes(q)) return true
  
  // Check if any settings match
  return subSettings.value.some(([key, s]) => 
    s.name.toLowerCase().includes(q) || 
    (s.desc && s.desc.toLowerCase().includes(q)) ||
    (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
  )
})

const mode = computed(() => specification.value.search?.nonMatchSettings || 'gray')
</script>

<template>
  <div 
    v-show="shouldShow || mode === 'gray'" 
    class="subcategory-box" 
    :style="{ opacity: !shouldShow && mode === 'gray' ? 0.4 : 1 }"
    :id="`subcat-${fullSlug}`"
  >
    <div class="subcategory-header">
      <h3 class="subcategory-title">{{ category.name }}</h3>
    </div>

    <div class="settings-list">
      <SettingRow 
        v-for="[key, setting] in subSettings" 
        :key="key" 
        :settingKey="key" 
        :setting="setting" 
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.subcategory-box {
  background-color: var(--mc-subcategoryBgColor, #f9f9f9);
  border: var(--mc-subcategoryBorder, none);
  border-radius: 6px;
  padding: 16px;
  transition: opacity 0.3s;

  .subcategory-header {
    margin-bottom: 12px;
    
    .subcategory-title {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: var(--mc-subcategoryHeaderColor, #444);
    }
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
