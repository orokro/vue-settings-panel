<!--
        ImageEdit.vue
        ------------

        An image uploader that stores either a Base64 string or a path/URL.
-->
<script setup>
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  opts: {
    type: Object,
    default: () => ({ format: 'path' }) // 'base64' or 'path'
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

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (props.opts.format === 'base64') {
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      if (props.lint) props.lint(base64)
      emit('change', base64)
    }
    reader.readAsDataURL(file)
  } else {
    // For 'path', we just simulate getting a path or URL.
    // In a real app, this might involve an upload to a server.
    // Here we'll just use a local Object URL as a placeholder path if it's not a real path.
    const path = file.name
    if (props.lint) props.lint(path)
    emit('change', path)
  }
}

const clearImage = () => {
  emit('change', '')
}

const onBlur = () => {
  if (props.validate) {
    props.validate(props.value)
  }
}
</script>

<template>
  <div class="image-edit">
    <div class="preview-container" v-if="value" @click="$refs.fileInput.click()">
      <img :src="value" alt="Preview" class="image-preview" v-if="value.startsWith('data:') || value.startsWith('http') || value.startsWith('blob:')" />
      <div v-else class="path-preview">{{ value }}</div>
      <button class="clear-btn" @click.stop="clearImage">×</button>
    </div>
    <div v-else class="upload-placeholder" @click="$refs.fileInput.click()">
      <span class="upload-icon">📁</span>
      <span class="upload-text">Select Image</span>
    </div>
    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept="image/*" 
      @change="handleFileChange" 
    />
  </div>
</template>

<style lang="scss" scoped>
.image-edit {
  width: 100%;
  
  .preview-container {
    position: relative;
    width: 100%;
    min-height: 40px;
    border: 1px solid var(--input-border-color, #ccc);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;

    .image-preview {
      max-width: 100%;
      max-height: 100px;
      object-fit: contain;
      user-drag: none;
      -webkit-user-drag: none;
    }

    .path-preview {
      font-size: 12px;
      padding: 8px;
      word-break: break-all;
    }

    .clear-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;

      &:hover {
        background: rgba(0, 0, 0, 0.7);
      }
    }
  }

  .upload-placeholder {
    width: 100%;
    padding: 12px;
    border: 1px dashed var(--input-border-color, #ccc);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--input-text-color, #666);
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--input-hover-bg-color, #f9f9f9);
    }

    .upload-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }

    .upload-text {
      font-size: 12px;
    }
  }
}
</style>
