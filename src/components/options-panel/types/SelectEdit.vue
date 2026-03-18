<!--
        SelectEdit.vue
        --------------

        A dropdown selection input.
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
    default: () => ({ options: [] })
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
</script>

<template>
  <div class="select-edit">
    <select :value="value" @change="onChange" @blur="onBlur" class="select-input" :disabled="opts.options.length === 0">
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
