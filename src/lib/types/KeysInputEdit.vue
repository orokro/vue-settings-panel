<!--
        KeysInputEdit.vue
        -----------------

        A field for managing multiple keyboard shortcuts.
-->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  opts: {
    type: Object,
    default: () => ({})
  },
  lint: {
    type: Function,
    default: null
  },
  validate: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['change'])

const isFocused = ref(false)

const formatShortcut = (s) => {
  const parts = []
  if (s.ctrl) parts.push('Ctrl')
  if (s.shift) parts.push('Shift')
  if (s.alt) parts.push('Alt')
  if (s.meta) parts.push('Win/Meta')
  parts.push(s.key.toUpperCase())
  return parts.join(' + ')
}

const onKeyDown = (e) => {
  if (!isFocused.value) return
  
  e.preventDefault()
  e.stopPropagation()

  // Ignore solo modifier keys
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return

  const newShortcut = {
    ctrl: e.ctrlKey,
    shift: e.shiftKey,
    alt: e.altKey,
    meta: e.metaKey,
    key: e.key.toLowerCase()
  }

  // Check for duplicates
  const isDuplicate = props.value.some(s => 
    s.ctrl === newShortcut.ctrl && 
    s.shift === newShortcut.shift && 
    s.alt === newShortcut.alt && 
    s.meta === newShortcut.meta && 
    s.key === newShortcut.key
  )

  if (!isDuplicate) {
    const newValue = [...props.value, newShortcut]
    update(newValue)
  }
  
  isFocused.value = false
}

const update = (newValue) => {
  if (props.lint) {
    newValue = props.lint(newValue)
  }
  emit('change', newValue)
}

const removeShortcut = (index) => {
  const newValue = [...props.value]
  newValue.splice(index, 1)
  update(newValue)
}

const clear = () => {
  update([])
}
</script>

<template>
  <div class="keys-input-edit" @keydown="onKeyDown" tabindex="0">
    <div class="shortcuts-list" v-if="value && value.length > 0">
      <div v-for="(s, index) in value" :key="index" class="shortcut-chip">
        <span class="shortcut-text">{{ formatShortcut(s) }}</span>
        <span class="remove-icon material-icons" @click.stop="removeShortcut(index)">close</span>
      </div>
    </div>

    <div 
      class="capture-box" 
      :class="{ active: isFocused, 'has-items': value && value.length > 0 }"
      @click="isFocused = true"
    >
      <span class="material-icons add-icon" v-if="!isFocused">add</span>
      <span class="placeholder-text">{{ isFocused ? 'Waiting for key...' : 'Add Shortcut' }}</span>
    </div>

    <button class="clear-btn" v-if="value && value.length > 0" @click="clear" title="Clear All">
      <span class="material-icons">backspace</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.keys-input-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  outline: none;

  .shortcuts-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .shortcut-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--mc-attentionColor, #00abae);
      color: #fff;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;

      .remove-icon {
        font-size: 14px;
        cursor: pointer;
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .capture-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px dashed var(--input-border-color, #ccc);
    border-radius: 4px;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;

    &:hover {
      border-color: var(--mc-attentionColor, #00abae);
      color: var(--mc-attentionColor, #00abae);
    }

    &.active {
      border-style: solid;
      border-color: var(--mc-attentionColor, #00abae);
      box-shadow: 0 0 0 2px rgba(0, 171, 174, 0.2);
      background: #f0fdfd;
      color: var(--mc-attentionColor, #00abae);
    }

    &.has-items {
      padding: 6px 12px;
      font-size: 12px;
    }

    .add-icon {
      font-size: 16px;
    }
  }

  .clear-btn {
    align-self: flex-end;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #999;
    display: flex;
    align-items: center;
    outline: none;

    .material-icons {
      font-size: 18px;
    }

    &:hover {
      color: #f44336;
    }
  }
}
</style>
