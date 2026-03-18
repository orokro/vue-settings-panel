<!--
        VueOptionsPanel.vue
        -------------------

        The main entry point for the settings panel. Manages theme, search state,
        and coordinates between the left and main columns.
-->
<script setup>
import { ref, computed, watch, provide, isReactive } from 'vue'
import LeftColumn from './LeftColumn.vue'
import MainColumn from './MainColumn.vue'
import 'material-icons/iconfont/material-icons.css'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  specification: {
    type: Object,
    required: true
  },
  themeColors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['settings-changed'])

// Search state
const searchQuery = ref('')

// Theme management
const rootRef = ref(null)

const defaultTheme = {
  leftColumn: {
    bgColor: '#f5f5f5',
    categoriesBoxBgColor: 'transparent',
    categoriesBoxBorder: 'none',
    categoryColor: '#333',
    categoryTextColor: '#333',
    selectedCategoryBgColor: '#e0e0e0',
    selectedCategoryTextColor: '#000',
    searchBgColor: '#fff',
    searchXColor: '#666',
    searchTextColor: '#000',
  },
  mainColumn: {
    bgColor: '#fff',
    textColor: '#333',
    categoryHeaderColor: '#222',
    categoryHeaderTextColor: '#fff',
    categoryBorder: '1px solid #eee',
    categoryBgColor: '#fff',
    categoryTextColor: '#333',
    settingsRowBgColor: 'transparent',
    settingsRowNameColor: '#000',
    settingsRowDescColor: '#666',
    settingsRowBorder: '1px solid #f0f0f0',
    subcategoryHeaderColor: '#444',
    subcategoryHeaderTextColor: '#fff',
    subcategoryBorder: 'none',
    subcategoryBgColor: '#f9f9f9',
    subCategoryTextColor: '#333',
    attentionColor: '#00abae',
  },
  toggle: {
    bgColor: '#ccc',
    thumbColor: '#fff',
    activeBgColor: '#4caf50'
  },
  input: {
    borderColor: '#ccc',
    bgColor: '#fff',
    textColor: '#333',
    focusBorderColor: '#4caf50'
  },
  range: {
    thumbColor: '#4caf50',
    trackColor: '#ccc'
  }
}

const deepMerge = (target, source) => {
  const result = { ...target }
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  })
  return result
}

const applyTheme = (theme) => {
  if (!rootRef.value) return
  
  const root = rootRef.value
  const t = deepMerge(defaultTheme, theme || {})

  // Left Column
  if (t.leftColumn) {
    Object.entries(t.leftColumn).forEach(([key, val]) => {
      root.style.setProperty(`--lc-${key}`, val)
    })
  }

  // Main Column
  if (t.mainColumn) {
    Object.entries(t.mainColumn).forEach(([key, val]) => {
      root.style.setProperty(`--mc-${key}`, val)
    })
  }

  // Common UI elements
  if (t.toggle) {
    root.style.setProperty('--toggle-bg-color', t.toggle.bgColor)
    root.style.setProperty('--toggle-thumb-color', t.toggle.thumbColor)
    root.style.setProperty('--toggle-active-bg-color', t.toggle.activeBgColor)
  }
  
  if (t.input) {
    root.style.setProperty('--input-border-color', t.input.borderColor)
    root.style.setProperty('--input-bg-color', t.input.bgColor)
    root.style.setProperty('--input-text-color', t.input.textColor)
    root.style.setProperty('--input-focus-border-color', t.input.focusBorderColor)
  }

  if (t.range) {
    root.style.setProperty('--range-thumb-color', t.range.thumbColor)
    root.style.setProperty('--range-track-color', t.range.trackColor)
  }
}

watch(() => props.themeColors, (newTheme) => {
  applyTheme(newTheme)
}, { deep: true, immediate: true })

watch(rootRef, () => {
  applyTheme(props.themeColors)
})

// Setting handling
const updateSetting = (key, value) => {
  if (isReactive(props.settings)) {
    props.settings[key] = value
  }
  emit('settings-changed', props.settings)
}

// Category Selection
const selectedCategorySlug = ref(props.specification.categories?.[0]?.slug || '')

// Provide state to children
provide('settings', computed(() => props.settings))
provide('specification', computed(() => props.specification))
provide('searchQuery', searchQuery)
provide('updateSetting', updateSetting)
provide('selectedCategorySlug', selectedCategorySlug)

const showLeftPanel = computed(() => {
  return props.specification.sidePanel?.enabled !== false
})

</script>

<template>
  <div class="vue-options-panel" ref="rootRef" :class="{ 'no-left-panel': !showLeftPanel }">
    <LeftColumn v-if="showLeftPanel" />
    <MainColumn />
  </div>
</template>

<style lang="scss">
.vue-options-panel {
  display: flex;
  width: 100%;
  height: 100%;
  font-family: sans-serif;
  user-select: none;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  img {
    -webkit-user-drag: none;
    user-drag: none;
  }

  &.no-left-panel {
    flex-direction: column;
  }

  /* Custom Scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(120, 120, 120, 0.3);
    border-radius: 6px;
    transition: background-color 0.2s ease-in-out;
  }

  *:hover::-webkit-scrollbar-thumb,
  *:active::-webkit-scrollbar-thumb {
    background-color: rgba(120, 120, 120, 0.6);
  }
}

/* Material Icons fix */
.material-icons {
  vertical-align: middle;
}
</style>
