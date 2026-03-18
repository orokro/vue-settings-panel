<!--
        SettingRow.vue
        --------------

        Represents a single setting entry. Handles layout, search highlighting,
        and dynamically mounts the appropriate editor component.
-->
<script setup>
import { inject, computed, ref } from 'vue'

const props = defineProps({
  settingKey: {
    type: String,
    required: true
  },
  setting: {
    type: Object,
    required: true
  }
})

const settings = inject('settings')
const updateSetting = inject('updateSetting')
const searchQuery = inject('searchQuery')

const error = ref('')

const currentValue = computed(() => settings.value[props.settingKey])

const onChange = (newValue) => {
  let finalValue = newValue
  if (props.setting.lint) {
    finalValue = props.setting.lint(newValue)
  }
  updateSetting(props.settingKey, finalValue)
  
  // Clear error on change if linting/validation is reactive
  if (error.value) error.value = ''
}

const onBlur = () => {
  if (props.setting.validate) {
    const result = props.setting.validate(currentValue.value)
    error.value = typeof result === 'string' ? result : ''
  }
}

const highlight = (text) => {
  if (!searchQuery.value) return text
  const q = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>')
}

const matchedTag = computed(() => {
  if (!searchQuery.value || !props.setting.tags) return null
  const q = searchQuery.value.toLowerCase()
  return props.setting.tags.find(tag => tag.toLowerCase().includes(q))
})

const isBottomMount = computed(() => {
  if (props.setting.type?.slug === 'string' && props.setting.opts?.multiline) return true
  return props.setting.type?.mount === 'bottom' || props.setting.mount === 'bottom'
})

const rowStyle = computed(() => ({
  backgroundColor: 'var(--mc-settingsRowBgColor, transparent)',
  borderBottom: 'var(--mc-settingsRowBorder, 1px solid #f0f0f0)',
  flexDirection: isBottomMount.value ? 'column' : 'row',
  alignItems: isBottomMount.value ? 'stretch' : 'center',
}))
</script>

<template>
  <div class="setting-row" :style="rowStyle">
    <div class="setting-info" :class="{ 'bottom-mount': isBottomMount }">
      <div class="name-container">
        <h4 class="setting-name" v-html="highlight(setting.name)"></h4>
        <span v-if="matchedTag" class="tag-badge">matched: {{ matchedTag }}</span>
      </div>
      <p class="setting-desc" v-if="setting.desc" v-html="highlight(setting.desc)"></p>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>

    <div class="setting-editor" :class="{ 'bottom-mount': isBottomMount }" @focusout="onBlur">
      <component 
        :is="setting.type.component" 
        :value="currentValue" 
        :opts="setting.opts || {}"
        @change="onChange"
      />
    </div>
  </div>
</template>

<style lang="scss">
.setting-row {
  display: flex;
  padding: 16px 20px;
  gap: 24px;
  
  &:last-child {
    border-bottom: none !important;
  }

  .setting-info {
    flex: 1;
    min-width: 0;

    &.bottom-mount {
      margin-bottom: 12px;
    }

    .name-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 4px;

      .setting-name {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--mc-settingsRowNameColor, #000);
      }

      .tag-badge {
        font-size: 10px;
        background-color: var(--mc-categoryHeaderColor, #222);
        color: #fff;
        padding: 2px 6px;
        border-radius: 10px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .setting-desc {
      margin: 0;
      font-size: 13px;
      color: var(--mc-settingsRowDescColor, #666);
      line-height: 1.4;
    }

    .error-message {
      margin-top: 4px;
      font-size: 12px;
      color: #f44336;
      font-weight: 500;
    }
  }

  .setting-editor {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    max-width: 40%;

    &.bottom-mount {
      max-width: 100%;
      justify-content: flex-start;
    }
  }

  mark {
    background-color: rgba(255, 235, 59, 0.4);
    color: inherit;
    padding: 0 2px;
    border-radius: 2px;
  }
}
</style>
