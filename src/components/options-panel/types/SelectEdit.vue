<!--
        SelectEdit.vue
        --------------

        A dropdown selection input or a radio button group.
-->
<script setup>
import { onMounted, watch } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: ''
  },
  opts: {
    type: Object,
    default: () => ({ options: [], radio: false })
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

const validateValue = () => {
  const options = props.opts.options || []
  if (options.length === 0) return

  // If value is not in options, try to pick first one
  if (!options.includes(props.value)) {
    const nextValue = options[0]
    if (props.lint) props.lint(nextValue)
    emit('change', nextValue)
  }
}

onMounted(validateValue)
watch(() => props.opts.options, validateValue)

const onChange = (e) => {
  const newValue = e.target.value
  if (props.lint) {
    props.lint(newValue)
  }
  emit('change', newValue)
}

const onBlur = () => {
  if (props.validate) {
    props.validate(props.value)
  }
}

const setRadioValue = (val) => {
  if (props.lint) {
    val = props.lint(val)
  }
  emit('change', val)
}
</script>

<template>
  <div class="select-edit" :class="{ 'as-radio': opts.radio }">
    <div v-if="opts.radio" class="radio-group">
      <label v-for="option in opts.options" :key="option" class="radio-item" :class="{ active: value === option }">
        <input 
          type="radio" 
          :name="$.uid + '-radio'" 
          :value="option" 
          :checked="value === option" 
          @change="setRadioValue(option)"
          class="radio-input"
        />
        <span class="radio-label">{{ option }}</span>
      </label>
    </div>
    <select v-else :value="value" @change="onChange" @blur="onBlur" class="select-input" :disabled="opts.options.length === 0">
      <option v-if="opts.options.length === 0" value="">Setting Not Available</option>
      <option v-for="option in opts.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
.select-edit {
  width: 100%;
  
  .select-input {
    width: 100%;
    padding: 8px 32px 8px 12px; /* Extra right padding for the arrow */
    border-radius: 4px;
    border: 1px solid var(--input-border-color, #ccc);
    background-color: var(--input-bg-color, #fff);
    color: var(--input-text-color, #333);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;

    &:focus {
      border-color: var(--input-focus-border-color, #4caf50);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .radio-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 20px;
    background-color: var(--input-bg-color, #f0f0f0);
    border: 1px solid var(--input-border-color, #ccc);
    transition: all 0.2s;
    user-select: none;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.active {
      background-color: var(--mc-categoryHeaderColor, #00abae);
      border-color: var(--mc-categoryHeaderColor, #00abae);
      color: #fff;
    }

    .radio-input {
      display: none;
    }

    .radio-label {
      font-size: 13px;
      font-weight: 500;
    }
  }
}
</style>
