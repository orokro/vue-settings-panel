<script setup>
import { reactive, ref } from 'vue'
import VueOptionsPanel from './components/options-panel/VueOptionsPanel.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { TYPES } from './components/options-panel/types'

// 1. Robust Specification for a Music DAW
const settingsSpec = {
  sidePanel: {
    enabled: true,
    autoCollapse: true,
  },

  search: {
    nonMatchedCategories: 'gray',
    nonMatchSettings: 'collapse',
  },

  categories: [
    {
      name: "Audio Engine",
      slug: "audio",
      desc: "Configure core audio processing and hardware routing",
      icon: 'speaker',
      categories: [
        { name: "Device Settings", slug: "device" },
        { name: "Buffer & Latency", slug: "buffer" }
      ]
    },
    {
      name: "Control Surfaces",
      slug: "control",
      desc: "Connect external MIDI controllers and Mackie/HUI surfaces",
      icon: 'settings_input_component',
      categories: [
        { name: "MIDI Mapping", slug: "midi" },
        { name: "Hardware Integration", slug: "hw" }
      ]
    },
    {
      name: "Interface",
      slug: "ui",
      desc: "Customize the DAW visual appearance and behavior",
      icon: 'palette',
      categories: [
        { name: "General UI", slug: "general" },
        { name: "Themes", slug: "themes" }
      ]
    },
    {
      name: "Python Scripting",
      slug: "scripting",
      desc: "Automation and extension via internal Python API",
      icon: 'code',
      categories: [
        { name: "Editor Options", slug: "editor" },
        { name: "Runtime", slug: "runtime" }
      ]
    },
    {
      name: "Advanced",
      slug: "advanced",
      desc: "Experimental features and expert settings",
      icon: 'https://vuejs.org/images/logo.png', // Demo icon link
    }
  ],

  settings: {
    // --- Audio Engine ---
    driverType: {
      name: 'Driver Type',
      desc: 'Select the audio driver architecture',
      cats: ['audio.device'],
      type: TYPES.Select,
      opts: { options: ["ASIO", "CoreAudio", "WASAPI", "DirectSound"] },
      default: "ASIO"
    },
    sampleRate: {
      name: 'Sample Rate',
      desc: 'System-wide audio resolution',
      cats: ['audio.device'],
      type: TYPES.Select,
      opts: { options: ["44100 Hz", "48000 Hz", "88200 Hz", "96000 Hz"] },
      default: "48000 Hz"
    },
    bufferSize: {
      name: 'Buffer Size',
      desc: 'Lower values reduce latency but increase CPU load',
      cats: ['audio.buffer'],
      tags: ['latency', 'delay'],
      type: TYPES.Number,
      opts: { min: 32, max: 4096, step: 32 },
      default: 512
    },
    multiCore: {
      name: 'Multi-Core Processing',
      desc: 'Distribute audio processing across available CPU threads',
      cats: ['audio.buffer'],
      type: TYPES.Boolean,
      default: true
    },

    // --- Control Surfaces ---
    enableMidi: {
      name: 'Enable MIDI Input',
      desc: 'Allow external controllers to send data to the DAW',
      cats: ['control.midi'],
      type: TYPES.Boolean,
      default: true
    },
    midiClock: {
      name: 'Send MIDI Clock',
      desc: 'Synchronize external hardware with DAW tempo',
      cats: ['control.midi'],
      type: TYPES.Boolean,
      default: false,
      show: (s) => s.enableMidi
    },
    surfaceType: {
      name: 'Surface Protocol',
      desc: 'Protocol used by the main hardware surface',
      cats: ['control.hw'],
      type: TYPES.Select,
      opts: { options: ["Native", "Mackie Control", "HUI", "OSC"] },
      default: "Native"
    },

    // --- Interface ---
    autoSave: {
      name: 'Auto Save',
      desc: 'Save project periodically in the background',
      cats: ['ui.general'],
      type: TYPES.Boolean,
      default: true
    },
    saveInterval: {
      name: 'Save Interval',
      desc: 'Minutes between automatic saves',
      cats: ['ui.general'],
      type: TYPES.FloatRange,
      opts: { min: 1, max: 60, step: 1 },
      default: 10,
      show: (s) => s.autoSave
    },
    accentColor: {
      name: 'Accent Color',
      desc: 'Global highlight color for the UI',
      cats: ['ui.themes'],
      type: TYPES.Color,
      default: '#00abae'
    },
    uiScale: {
      name: 'UI Scaling',
      desc: 'Adjust size of interface elements',
      cats: ['ui.themes'],
      type: TYPES.FloatRange,
      opts: { min: 0.5, max: 2, step: 0.1 },
      default: 1
    },

    // --- Scripting ---
    autoComplete: {
      name: 'Auto-Completion',
      desc: 'Show suggestions while typing Python code',
      cats: ['scripting.editor'],
      type: TYPES.Boolean,
      default: true
    },
    fontSize: {
      name: 'Editor Font Size',
      desc: 'Size of text in the script editor',
      cats: ['scripting.editor'],
      type: TYPES.Number,
      opts: { min: 8, max: 32, step: 1 },
      default: 14,
      mount: 'bottom'
    },
    safeMode: {
      name: 'Scripts Safe Mode',
      desc: 'Prevent scripts from accessing the local file system',
      cats: ['scripting.runtime'],
      type: TYPES.Boolean,
      default: true
    },

    // --- Advanced ---
    enableBeta: {
      name: 'Beta Features',
      desc: 'Unlock experimental audio algorithms (may be unstable)',
      cats: ['advanced'],
      tags: ['experimental', 'test'],
      type: TYPES.Boolean,
      default: false
    },
    masterGain: {
      name: 'Master Output Gain',
      desc: 'Calibration level for the main output stage',
      cats: ['advanced'],
      tags: ['gain', 'volume', 'loudness'],
      type: TYPES.FloatRange,
      opts: { min: -60, max: 12, step: 0.1 },
      default: 0
    }
  }
}

// 2. Initial State
const settingsState = reactive({
  driverType: "ASIO",
  sampleRate: "48000 Hz",
  bufferSize: 256,
  multiCore: true,
  enableMidi: true,
  midiClock: true,
  surfaceType: "Mackie Control",
  autoSave: true,
  saveInterval: 5,
  accentColor: '#00abae',
  uiScale: 1.1,
  autoComplete: true,
  fontSize: 16,
  safeMode: true,
  enableBeta: false,
  masterGain: -3.5
})

// 3. Theme Management
const activeTheme = ref({})

const handleSettingsChanged = (newSettings) => {
  // console.log('DAW Settings updated:', newSettings)
}
</script>

<template>
  <div class="app-wrapper">
    <ThemeSwitcher v-model:theme="activeTheme" />
    
    <div class="app-container">
      <VueOptionsPanel
        :settings="settingsState"
        :specification="settingsSpec"
        :themeColors="activeTheme"
        @settings-changed="handleSettingsChanged"
      />
    </div>
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #222;
  color: #eee;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
  display: flex;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.app-container {
  flex: 1;
  width: 1000px;
  max-width: 95vw;
  height: 700px;
  max-height: 80vh;
  margin: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  overflow: hidden;
  background: #111;
}
</style>
