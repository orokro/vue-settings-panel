<!--
        ColorEdit.vue
        ------------

        A color picker input for hex values.
-->
<script setup>
const props = defineProps({
  value: {
    type: String,
    default: '#000000'
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
  <div class="color-edit">
    <div class="color-preview" :style="{ backgroundColor: value }">
      <input 
        type="color" 
        :value="value" 
        @input="onChange"
        @change="onBlur"
        class="color-input"
      />
    </div>
    <span class="color-hex">{{ value }}</span>
  </div>
</template>

<style lang="scss" scoped>
.color-edit {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  .color-preview {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid var(--input-border-color, #ccc);
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .color-input {
    position: absolute;
    top: -5px;
    left: -5px;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    opacity: 0;
    cursor: pointer;
  }

  .color-hex {
    font-size: 14px;
    font-family: monospace;
    text-transform: uppercase;
  }
}
</style>
