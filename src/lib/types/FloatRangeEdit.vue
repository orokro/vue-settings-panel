<!--
        FloatRangeEdit.vue
        ------------------

        A slider input for numeric ranges, with an optional text input.
-->
<script setup>
const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  opts: {
    type: Object,
    default: () => ({ min: 0, max: 100, step: 1, showInput: false })
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

const onChange = (e) => {
  let newValue = Number(e.target.value)
  
  // Apply min/max constraints
  if (props.opts.min !== undefined) newValue = Math.max(props.opts.min, newValue)
  if (props.opts.max !== undefined) newValue = Math.min(props.opts.max, newValue)
  
  if (props.lint) {
    newValue = props.lint(newValue)
  }
  emit('change', newValue)
}

const onBlur = () => {
  if (props.validate) {
    props.validate(props.value)
  }
}
</script>

<template>
  <div class="float-range-edit" :class="{ 'has-input': opts.showInput }">
    <input 
      type="range" 
      :value="value" 
      :min="opts.min" 
      :max="opts.max" 
      :step="opts.step || 0.1" 
      @input="onChange"
      @change="onBlur"
      class="range-input"
    />
    
    <input 
      v-if="opts.showInput"
      type="number"
      :value="value"
      :min="opts.min"
      :max="opts.max"
      :step="opts.step || 0.1"
      @input="onChange"
      @blur="onBlur"
      class="range-number-input"
    />
    <span v-else class="range-value">{{ value }}</span>
  </div>
</template>

<style lang="scss" scoped>
.float-range-edit {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  
  .range-input {
    flex: 1;
    cursor: pointer;
    appearance: none;
    background: transparent;

    &:focus {
      outline: none;
    }

    /* Track */
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      background: var(--range-track-color, #ccc);
      border-radius: 2px;
    }

    &::-moz-range-track {
      width: 100%;
      height: 4px;
      background: var(--range-track-color, #ccc);
      border-radius: 2px;
    }

    /* Thumb */
    &::-webkit-slider-thumb {
      appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--range-thumb-color, #00abae);
      cursor: pointer;
      margin-top: -6px; /* Center thumb on track */
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    &::-moz-range-thumb {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--range-thumb-color, #00abae);
      cursor: pointer;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
  }

  .range-value {
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    min-width: 40px;
    text-align: right;
  }

  .range-number-input {
    width: 80px;
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid var(--input-border-color, #ccc);
    background-color: var(--input-bg-color, #fff);
    color: var(--input-text-color, #333);
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--input-focus-border-color, #4caf50);
    }

    /* Hide arrows for a cleaner look if preferred, but keeping them for now */
  }
}
</style>
