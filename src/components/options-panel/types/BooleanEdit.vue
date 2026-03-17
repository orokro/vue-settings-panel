<!--
        BooleanEdit.vue
        ---------------

        A simple toggle switch for boolean values.
-->
<script setup>
const props = defineProps({
  value: {
    type: Boolean,
    default: false
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

const toggle = () => {
  const newValue = !props.value
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
  <div 
    class="boolean-edit" 
    :class="{ active: value }" 
    @click="toggle"
    @blur="onBlur"
    tabindex="0"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle"
  >
    <div class="toggle-track">
      <div class="toggle-thumb"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.boolean-edit {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  outline: none;
  user-select: none;
  -webkit-user-drag: none;

  .toggle-track {
    width: 40px;
    height: 20px;
    background-color: var(--toggle-bg-color, #ccc);
    border-radius: 10px;
    position: relative;
    transition: background-color 0.2s;
  }

  .toggle-thumb {
    width: 16px;
    height: 16px;
    background-color: var(--toggle-thumb-color, #fff);
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  &.active {
    .toggle-track {
      background-color: var(--toggle-active-bg-color, #4caf50);
    }
    .toggle-thumb {
      transform: translateX(20px);
    }
  }

  &:focus {
    .toggle-track {
      box-shadow: 0 0 0 2px var(--focus-ring-color, rgba(0, 123, 255, 0.25));
    }
  }
}
</style>
