<!--
        TimeEdit.vue
        ------------

        A time picker input.
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
  <div class="time-edit">
    <input 
      type="time" 
      :value="value" 
      @input="onChange"
      @blur="onBlur"
      class="time-input"
    />
  </div>
</template>

<style lang="scss" scoped>
.time-edit {
  width: 100%;
  
  .time-input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid var(--input-border-color, #ccc);
    background-color: var(--input-bg-color, #fff);
    color: var(--input-text-color, #333);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;

    &:focus {
      border-color: var(--input-focus-border-color, #4caf50);
    }
  }
}
</style>
