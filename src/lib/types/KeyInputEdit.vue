<!--
        KeyInputEdit.vue
        ----------------

        A field for capturing keyboard shortcuts with modifier keys.
-->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({ shift: false, ctrl: false, alt: false, meta: false, key: '' })
  },
  opts: {
    type: Object,
    default: () => ({ onInputRequest: null })
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

const displayValue = computed(() => {
  if (isFocused.value) return 'Waiting for key...'
  if (!props.value.key) return 'Not set'
  
  const parts = []
  if (props.value.ctrl) parts.push('Ctrl')
  if (props.value.shift) parts.push('Shift')
  if (props.value.alt) parts.push('Alt')
  if (props.value.meta) parts.push('Win/Meta')
  parts.push(props.value.key.toUpperCase())
  
  return parts.join(' + ')
})

const onKeyDown = (e) => {
  if (!isFocused.value) return
  
  e.preventDefault()
  e.stopPropagation()

  // Ignore solo modifier keys
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return

  const newValue = {
    ctrl: e.ctrlKey,
    shift: e.shiftKey,
    alt: e.altKey,
    meta: e.metaKey,
    key: e.key
  }

  update(newValue)
  isFocused.value = false
}

const update = (newValue) => {
  if (props.lint) {
    newValue = props.lint(newValue)
  }
  emit('change', newValue)
}

const toggleModifier = (mod) => {
  const newValue = { ...props.value, [mod]: !props.value[mod] }
  update(newValue)
}

const requestInput = () => {
  if (props.opts.onInputRequest) {
    props.opts.onInputRequest((val) => {
      update(val)
    })
  } else {
    isFocused.value = true
  }
}

const clear = () => {
  update({ shift: false, ctrl: false, alt: false, meta: false, key: '' })
}
</script>

<template>
  <div class="key-input-edit" @keydown="onKeyDown" tabindex="0">
    <div class="modifiers">
      <label class="mod-checkbox" title="Control">
        <input type="checkbox" :checked="value.ctrl" @change="toggleModifier('ctrl')" />
        <span>^</span>
      </label>
      <label class="mod-checkbox" title="Shift">
        <input type="checkbox" :checked="value.shift" @change="toggleModifier('shift')" />
        <span>⇧</span>
      </label>
      <label class="mod-checkbox" title="Alt">
        <input type="checkbox" :checked="value.alt" @change="toggleModifier('alt')" />
        <span>⌥</span>
      </label>
      <label class="mod-checkbox" title="Meta">
        <input type="checkbox" :checked="value.meta" @change="toggleModifier('meta')" />
        <span>⌘</span>
      </label>
    </div>

    <div 
      class="capture-box" 
      :class="{ active: isFocused }"
      @click="requestInput"
    >
      {{ displayValue }}
    </div>

    <button class="clear-btn" v-if="value.key" @click="clear" title="Clear">
      <span class="material-icons">backspace</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.key-input-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  outline: none;

  .modifiers {
    display: flex;
    gap: 2px;

    .mod-checkbox {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: 1px solid var(--input-border-color, #ccc);
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      background: var(--input-bg-color, #fff);
      transition: all 0.2s;

      input {
        display: none;
      }

      span {
        opacity: 0.5;
      }

      &:has(input:checked) {
        background: var(--mc-categoryHeaderColor, #00abae);
        border-color: var(--mc-categoryHeaderColor, #00abae);
        color: #fff;
        span {
          opacity: 1;
        }
      }
    }
  }

  .capture-box {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--input-border-color, #ccc);
    border-radius: 4px;
    background: var(--input-bg-color, #fff);
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 120px;
    user-select: none;

    &.active {
      border-color: var(--mc-categoryHeaderColor, #00abae);
      box-shadow: 0 0 0 2px rgba(0, 171, 174, 0.2);
      background: #f0fdfd;
    }
  }

  .clear-btn {
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
