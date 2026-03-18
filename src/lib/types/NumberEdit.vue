<!--
        NumberEdit.vue
        --------------

        A numeric input for number values.
-->
<script setup>
const props = defineProps({
  value: {
    type: [Number, String],
    default: 0
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

const onChange = (e) => {
  let newValue = e.target.value
  if (newValue === '') {
    newValue = props.opts.min !== undefined ? props.opts.min : 0
  } else {
    newValue = Number(newValue)
  }
  
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
</script>

<template>
  <div class="number-edit">
    <input 
      type="number" 
      :value="value" 
      :min="opts.min"
      :max="opts.max"
      :step="opts.step || 1"
      @input="onChange"
      @blur="onBlur"
      class="number-input"
    />
  </div>
</template>

<style lang="scss" scoped>
.number-edit {
  width: 100%;
  
  .number-input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid var(--input-border-color, #ccc);
    background-color: var(--input-bg-color, #fff);
    color: var(--input-text-color, #333);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--input-focus-border-color, #4caf50);
    }
  }
}
</style>
