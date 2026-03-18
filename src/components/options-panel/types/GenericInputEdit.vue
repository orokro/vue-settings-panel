<!--
        GenericInputEdit.vue
        --------------------

        A generic input field that can only be updated via an external onInputRequest method.
-->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Object],
    default: ''
  },
  opts: {
    type: Object,
    default: () => ({ onInputRequest: null, placeholder: 'Click to capture...' })
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

const isWaiting = ref(false)

const requestInput = () => {
  if (!props.opts.onInputRequest) return
  
  isWaiting.value = true
  props.opts.onInputRequest((val) => {
    let newValue = val
    if (props.lint) {
      newValue = props.lint(val)
    }
    emit('change', newValue)
    isWaiting.value = false
  })
}

const clear = () => {
  emit('change', '')
}
</script>

<template>
  <div class="generic-input-edit">
    <div 
      class="display-box" 
      :class="{ active: isWaiting, 'has-value': !!value }"
      @click="requestInput"
    >
      <span class="value-text">{{ isWaiting ? 'Waiting for input...' : (value || opts.placeholder) }}</span>
    </div>

    <button class="clear-btn" v-if="value" @click="clear" title="Clear">
      <span class="material-icons">close</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.generic-input-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .display-box {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--input-border-color, #ccc);
    border-radius: 4px;
    background: var(--input-bg-color, #fff);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 150px;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      border-color: var(--mc-categoryHeaderColor, #00abae);
      box-shadow: 0 0 0 2px rgba(0, 171, 174, 0.2);
      background: #f0fdfd;
    }

    &:not(.has-value) {
      color: #999;
      font-style: italic;
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
