<!--
        ThemeSwitcher.vue
        -----------------

        A utility to switch between different theme presets for the options panel.
-->
<script setup>
const props = defineProps({
  currentTheme: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:theme'])

const themes = {
  light: {
    leftColumn: {
      bgColor: '#f5f5f5',
      categoryColor: '#333',
      selectedCategoryBgColor: '#e0e0e0',
      searchBgColor: '#fff',
    },
    mainColumn: {
      bgColor: '#fff',
      textColor: '#333',
      categoryHeaderColor: '#222',
      categoryHeaderTextColor: '#fff',
    }
  },
  dark: {
    leftColumn: {
      bgColor: '#1e1e1e',
      categoriesBoxBgColor: '#252526',
      categoriesBoxBorder: '1px solid #333',
      categoryColor: '#cccccc',
      categoryTextColor: '#cccccc',
      selectedCategoryBgColor: '#37373d',
      selectedCategoryTextColor: '#ffffff',
      searchBgColor: '#3c3c3c',
      searchXColor: '#999',
      searchTextColor: '#fff',
    },
    mainColumn: {
      bgColor: '#121212',
      textColor: '#e0e0e0',
      categoryHeaderColor: '#333',
      categoryHeaderTextColor: '#00abae',
      categoryBorder: '1px solid #333',
      categoryBgColor: '#1e1e1e',
      categoryTextColor: '#ccc',
      settingsRowBgColor: 'transparent',
      settingsRowNameColor: '#fff',
      settingsRowDescColor: '#888',
      settingsRowBorder: '1px solid #2d2d2d',
      subcategoryHeaderColor: '#252526',
      subcategoryHeaderTextColor: '#00abae',
      subcategoryBorder: 'none',
      subcategoryBgColor: '#1a1a1a',
      subCategoryTextColor: '#aaa',
    },
    toggle: {
      bgColor: '#444',
      thumbColor: '#ccc',
      activeBgColor: '#00abae'
    },
    input: {
      borderColor: '#444',
      bgColor: '#252526',
      textColor: '#fff',
      focusBorderColor: '#00abae'
    }
  },
  fun: {
    leftColumn: {
      bgColor: '#e0f7f7',
      categoriesBoxBgColor: '#f0ffff',
      categoriesBoxBorder: '2px dashed #00abae',
      categoryColor: '#007072',
      categoryTextColor: '#007072',
      selectedCategoryBgColor: '#00abae',
      selectedCategoryTextColor: '#ffffff',
      searchBgColor: '#ffffff',
      searchXColor: '#00abae',
      searchTextColor: '#004d40',
    },
    mainColumn: {
      bgColor: '#f9ffff',
      textColor: '#004d40',
      categoryHeaderColor: '#00abae',
      categoryHeaderTextColor: '#ffffff',
      categoryBorder: '2px solid #00abae',
      categoryBgColor: '#ffffff',
      categoryTextColor: '#004d40',
      settingsRowBgColor: '#f0fdfd',
      settingsRowNameColor: '#007072',
      settingsRowDescColor: '#00abae',
      settingsRowBorder: '1px solid #b2ebf2',
      subcategoryHeaderColor: '#e0f2f1',
      subcategoryHeaderTextColor: '#007072',
      subcategoryBorder: '1px dotted #00abae',
      subcategoryBgColor: '#ffffff',
      subCategoryTextColor: '#004d40',
    },
    toggle: {
      bgColor: '#b2ebf2',
      thumbColor: '#ffffff',
      activeBgColor: '#00abae'
    },
    input: {
      borderColor: '#00abae',
      bgColor: '#ffffff',
      textColor: '#004d40',
      focusBorderColor: '#004d40'
    }
  }
}

const selectTheme = (name) => {
  emit('update:theme', themes[name])
}
</script>

<template>
  <div class="theme-switcher">
    <span class="label">Theme:</span>
    <div class="buttons">
      <button @click="selectTheme('light')">Light</button>
      <button @click="selectTheme('dark')">Dark</button>
      <button @click="selectTheme('fun')">Fun</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
  font-family: sans-serif;
  font-size: 13px;

  .label {
    font-weight: bold;
    color: #555;
  }

  .buttons {
    display: flex;
    gap: 8px;
  }

  button {
    padding: 4px 12px;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
    border-radius: 4px;
    font-size: 12px;
    transition: all 0.2s;

    &:hover {
      border-color: #00abae;
      color: #00abae;
    }

    &:active {
      background: #f0f0f0;
    }
  }
}
</style>
