<!--
        CategoryItem.vue
        ----------------

        Represents a single category item in the navigation sidebar.
-->
<script setup>
import { inject, computed, ref } from 'vue'
import SubCategoryItem from './SubCategoryItem.vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const selectedCategorySlug = inject('selectedCategorySlug')
const searchQuery = inject('searchQuery')
const specification = inject('specification')

const isSelected = computed(() => selectedCategorySlug.value === props.category.slug)
const hasSubcategories = computed(() => props.category.categories && props.category.categories.length > 0)
const isExpanded = computed(() => isSelected.value || (searchQuery.value && props.category.hasSearchMatch))

const nonMatchedStyle = computed(() => {
  if (!searchQuery.value || props.category.hasSearchMatch) return {}
  
  const mode = specification.search?.nonMatchedCategories || 'gray'
  if (mode === 'collapse') return { display: 'none' }
  return { opacity: 0.4, pointerEvents: 'none' }
})

const selectCategory = () => {
  selectedCategorySlug.value = props.category.slug
}
</script>

<template>
  <div class="category-item-container" :style="nonMatchedStyle">
    <div 
      class="category-item" 
      :class="{ selected: isSelected, 'is-collapsed': collapsed }"
      @click="selectCategory"
    >
      <div class="icon-container" v-if="category.icon || collapsed">
        <span v-if="typeof category.icon === 'string' && !category.icon.includes('/')" class="material-icons">
          {{ category.icon || 'folder' }}
        </span>
        <img v-else-if="category.icon" :src="category.icon" class="custom-icon" />
        <span v-else class="material-icons">folder</span>
      </div>
      
      <span class="category-name" v-if="!collapsed">{{ category.name }}</span>
      <span v-if="hasSubcategories && !collapsed" class="material-icons expand-icon">
        {{ isExpanded ? 'expand_more' : 'chevron_right' }}
      </span>
    </div>

    <transition name="expand">
      <div class="subcategories-list" v-if="hasSubcategories && !collapsed && isExpanded">
        <SubCategoryItem 
          v-for="sub in category.categories" 
          :key="sub.slug" 
          :category="sub" 
          :parentSlug="category.slug"
        />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.category-item-container {
  display: flex;
  flex-direction: column;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  color: var(--lc-categoryColor, #333);
  transition: all 0.2s;
  user-select: none;
  gap: 12px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.selected {
    background-color: var(--lc-selectedCategoryBgColor, #e0e0e0);
    color: var(--lc-selectedCategoryTextColor, #000);
    font-weight: 500;
  }

  .icon-container {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .material-icons {
      font-size: 20px;
    }

    .custom-icon {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }
  }

  .category-name {
    flex: 1;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .expand-icon {
    font-size: 18px;
    opacity: 0.5;
  }

  &.is-collapsed {
    justify-content: center;
    padding: 10px 0;
    
    .category-name, .expand-icon {
      display: none;
    }
  }
}

.subcategories-list {
  padding-left: 24px;
  overflow: hidden;
}

.expand-enter-active, .expand-leave-active {
  transition: max-height 0.3s ease-out;
  max-height: 500px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
}
</style>
