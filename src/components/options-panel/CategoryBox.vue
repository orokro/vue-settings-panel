<!--
        CategoryBox.vue
        ---------------

        Displays a category's title, description, and its settings and subcategories.
-->
<script setup>
import { inject, computed } from 'vue'
import SettingRow from './SettingRow.vue'
import SubCategoryBox from './SubCategoryBox.vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const specification = inject('specification')
const settingsState = inject('settings')
const searchQuery = inject('searchQuery')

const topLevelSettings = computed(() => {
  const allSettings = specification.settings || {}
  return Object.entries(allSettings).filter(([key, s]) => {
    const isVisible = typeof s.show === 'function' ? s.show(settingsState) : true
    return isVisible && s.cats && s.cats.includes(props.category.slug)
  })
})

const subCategories = computed(() => {
  return (props.category.categories || []).filter(sub => {
    return typeof sub.show === 'function' ? sub.show(settingsState) : true
  })
})

const shouldShow = computed(() => {
  if (!searchQuery.value) return true
  
  const q = searchQuery.value.toLowerCase()
  
  // Check category name/desc
  if (props.category.name.toLowerCase().includes(q) || (props.category.desc && props.category.desc.toLowerCase().includes(q))) return true
  
  // Check if any settings match
  const allSettingsInThisCat = Object.values(specification.settings || {}).filter(s => s.cats && s.cats.some(c => c.startsWith(props.category.slug)))
  const anySettingMatches = allSettingsInThisCat.some(s => 
    s.name.toLowerCase().includes(q) || 
    (s.desc && s.desc.toLowerCase().includes(q)) || 
    (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
  )
  if (anySettingMatches) return true

  // Check subcategories
  return subCategories.value.some(sub => {
    const fullSubSlug = `${props.category.slug}.${sub.slug}`
    const settingsInSub = Object.values(specification.settings || {}).filter(s => s.cats && s.cats.includes(fullSubSlug))
    return sub.name.toLowerCase().includes(q) || settingsInSub.some(s => 
      s.name.toLowerCase().includes(q) || (s.desc && s.desc.toLowerCase().includes(q))
    )
  })
})

const mode = computed(() => specification.search?.nonMatchSettings || 'gray')
</script>

<template>
  <div 
    v-show="shouldShow || mode === 'gray'" 
    class="category-box" 
    :style="{ opacity: !shouldShow && mode === 'gray' ? 0.4 : 1 }"
    :id="`cat-${category.slug}`"
  >
    <div class="category-header">
      <div class="title-row">
        <div class="icon-container" v-if="category.icon">
          <span v-if="typeof category.icon === 'string' && !category.icon.includes('/')" class="material-icons category-icon">
            {{ category.icon }}
          </span>
          <img v-else :src="category.icon" class="custom-icon" />
        </div>
        <h2 class="category-title">{{ category.name }}</h2>
      </div>
      <p class="category-desc" v-if="category.desc">{{ category.desc }}</p>
    </div>

    <div class="settings-list">
      <SettingRow 
        v-for="[key, setting] in topLevelSettings" 
        :key="key" 
        :settingKey="key" 
        :setting="setting" 
      />
    </div>

    <div class="subcategories-container" v-if="subCategories.length > 0">
      <SubCategoryBox 
        v-for="sub in subCategories" 
        :key="sub.slug" 
        :category="sub" 
        :parentSlug="category.slug"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-box {
  margin-bottom: 40px;
  background-color: var(--mc-categoryBgColor, #fff);
  border: var(--mc-categoryBorder, 1px solid #eee);
  border-radius: 8px;
  padding: 24px;
  transition: opacity 0.3s;

  .category-header {
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 16px;

    .title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .category-icon {
        font-size: 28px;
        color: var(--mc-categoryHeaderColor, #222);
      }

      .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        flex-shrink: 0;
      }

      .custom-icon {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .category-title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: var(--mc-categoryHeaderColor, #222);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
    }

    .category-desc {
      margin: 0;
      font-size: 14px;
      color: var(--mc-categoryTextColor, #666);
      line-height: 1.5;
    }
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .subcategories-container {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>
