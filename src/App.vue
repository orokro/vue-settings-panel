<script setup>
import { reactive } from 'vue'
import VueOptionsPanel from './components/options-panel/VueOptionsPanel.vue'
import { TYPES } from './components/options-panel/types'

// 1. Define the specification
const settingsSpec = {
  sidePanel: {
    enabled: true,
    autoCollapse: true,
  },

  search: {
    nonMatchedCategories: 'gray', // 'gray' or 'collapse'
    nonMatchSettings: 'gray', // 'gray' or 'collapse'
  },

  categories: [
    {
      name: "Main",
      slug: "main",
      desc: "General application settings",
      icon: 'settings'
    },
    {
      name: "Audio Config",
      slug: "audio",
      desc: "Configure sound routing and volume settings",
      icon: 'volume_up',
      show: (settings) => settings.enableAudio,
      categories: [
        {
          name: "Advanced Routing",
          slug: "routing",
        },
        {
          name: "Effects",
          slug: "effects",
        }
      ]
    },
    {
      name: "Appearance",
      slug: "appearance",
      desc: "UI and theme settings",
      icon: 'palette'
    }
  ],

  settings: {
    autoSave: {
      name: 'Auto Save',
      desc: 'Enable auto save periodically?',
      cats: ['main'],
      type: TYPES.Boolean,
      default: true,
    },
    savePeriod: {
      name: "Auto Save Frequency",
      desc: "How frequently should the application save",
      cats: ['main'],
      type: TYPES.Select,
      opts: {
        options: ["5 min", "10 min", "hourly"],
      },
      default: "hourly",
      show: (settings) => settings.autoSave,
    },
    enableAudio: {
      name: 'Enable Audio',
      desc: 'Enable audio in the application',
      cats: ['main'],
      type: TYPES.Boolean,
      default: true,
    },
    masterVolume: {
      name: 'Master Volume',
      desc: 'Global application volume',
      cats: ['audio'],
      tags: ['gain', 'loudness'],
      type: TYPES.FloatRange,
      opts: {
        min: 0,
        max: 1,
        step: 0.01
      },
      default: 1,
    },
    bufferSize: {
      name: 'Buffer Size',
      desc: 'Audio buffer size in samples',
      cats: ['audio.routing'],
      type: TYPES.Number,
      opts: { min: 64, max: 4096, step: 64 },
      default: 512
    },
    themeColor: {
      name: 'Accent Color',
      desc: 'Main UI accent color',
      cats: ['appearance'],
      type: TYPES.Color,
      default: '#4caf50'
    },
    profileImage: {
      name: 'Profile Image',
      desc: 'Your application profile picture',
      cats: ['appearance'],
      type: TYPES.Image,
      opts: { format: 'base64' },
      default: '',
      mount: 'bottom'
    }
  }
}

// 2. Define the initial settings state (reactive)
const settingsState = reactive({
  autoSave: true,
  savePeriod: "hourly",
  enableAudio: true,
  masterVolume: 0.8,
  bufferSize: 1024,
  themeColor: '#4caf50',
  profileImage: ''
})

// 3. Define theme colors (optional)
const themeColors = reactive({
  mainColumn: {
    settingsRowNameColor: '#2e7d32'
  }
})

const handleSettingsChanged = (newSettings) => {
  console.log('Settings changed:', newSettings)
}
</script>

<template>
  <div class="app-container">
    <VueOptionsPanel
      :settings="settingsState"
      :specification="settingsSpec"
      :themeColors="themeColors"
      @settings-changed="handleSettingsChanged"
    />
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #eee;
}

#app {
  height: 100vh;
  width: 100vw;
  display: flex;
}

.app-container {
  width: 900px;
  height: 600px;
  margin: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: white;
}
</style>
