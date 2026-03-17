<!--
        StringEdit.vue
        --------------

        A simple text input for string values.
-->
<script setup>
const props = defineProps({
  value: {
    type: String,
    default: ''
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
</script>

<template>
  <div class="string-edit">
    <input 
      type="text" 
      :value="value" 
      :placeholder="opts.placeholder || ''"
      @input="onChange"
      @blur="onBlur"
      class="text-input"
    />
  </div>
</template>

<style lang="scss" scoped>
.string-edit {
  width: 100%;
  
  .text-input {
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
