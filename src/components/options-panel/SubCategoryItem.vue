<!--
        SubCategoryItem.vue
        -------------------

        Represents a sub-category item in the navigation sidebar.
-->
<script setup>
import { inject, computed } from 'vue'

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

const selectedCategorySlug = inject('selectedCategorySlug')
const fullSlug = computed(() => `${props.parentSlug}.${props.category.slug}`)
const isSelected = computed(() => selectedCategorySlug.value === fullSlug.value)

const selectSubcategory = () => {
  // Update selection
  selectedCategorySlug.value = fullSlug.value
  
  // Smooth scroll to the subcategory box in the main column
  const element = document.getElementById(`subcat-${fullSlug.value}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div 
    class="subcategory-item" 
    :class="{ selected: isSelected }"
    @click.stop="selectSubcategory"
  >
    <span class="subcategory-name">{{ category.name }}</span>
  </div>
</template>

<style lang="scss" scoped>
.subcategory-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--lc-categoryColor, #333);
  transition: all 0.2s;
  user-select: none;
  font-size: 13px;
  margin: 2px 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.selected {
    color: var(--lc-selectedCategoryTextColor, #000);
    font-weight: 500;
    background-color: rgba(0, 0, 0, 0.03);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 3px;
      height: 16px;
      background-color: var(--lc-selectedCategoryTextColor, #000);
      border-radius: 0 2px 2px 0;
    }
  }

  .subcategory-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
