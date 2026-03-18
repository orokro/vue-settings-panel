# Vue Settings Panel

A flexible, high-performance, and fully themeable settings panel for Vue 3 applications. Designed for complex configuration requirements with support for hierarchical categories, advanced search, real-time input sanitization, and multiple input types.

## Installation

```bash
npm install vue-settings-panel
```

## Basic Usage

To use the settings panel, you need to provide a **Specification** (defining the structure) and a **Settings Object** (holding the data).

```vue
<script setup>
import { VueSettingsPanel, TYPES, createSettings } from 'vue-settings-panel'
import 'vue-settings-panel/dist/style.css'

// 1. Define your structure
const mySpec = {
  categories: [
    { name: "General", slug: "gen", icon: "settings" }
  ],
  settings: {
    userName: {
      name: "Username",
      cats: ["gen"],
      type: TYPES.String,
      default: "Guest"
    },
    notifications: {
      name: "Enable Notifications",
      cats: ["gen"],
      type: TYPES.Boolean,
      default: true
    }
  }
}

// 2. Initialize reactive state
const settingsState = createSettings(mySpec)

const handleSave = (newSettings) => {
  console.log("Settings updated:", newSettings)
}
</script>

<template>
  <div style="height: 600px; width: 800px;">
    <VueSettingsPanel
      :settings="settingsState"
      :specification="mySpec"
      @settings-changed="handleSave"
    />
  </div>
</template>
```

---

## Specification Reference

### Global Spec Options

| Property | Type | Description |
| :--- | :--- | :--- |
| `sidePanel` | Object | `{ enabled: Boolean, autoCollapse: Boolean }` |
| `search` | Object | `{ nonMatchedCategories: 'gray'\|'collapse', nonMatchSettings: 'gray'\|'collapse' }` |
| `categories` | Array | Array of Category objects (see below). |
| `settings` | Object | Key-value map of Setting configurations. |

### Category Object

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Display name of the category. |
| `slug` | String | Unique identifier (used in `cats` array of settings). |
| `desc` | String | Subtitle or description. |
| `icon` | String | Material Icon slug or URL to an image. |
| `show` | Function | `(settings) => Boolean`. Conditional visibility. |
| `categories` | Array | Nested subcategories (supports one level of nesting). |

### Setting Configuration

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | String | The primary label for the setting. |
| `desc` | String | Helpful text displayed below the name. |
| `cats` | Array | Slugs where this setting appears (e.g., `['audio.buffer']`). |
| `type` | Object | Reference from the `TYPES` export. |
| `default` | Any | Initial value if no data is provided to `createSettings`. |
| `tags` | Array | List of strings used to improve search discovery. |
| `mount` | String | `'right'` (default) or `'bottom'` (moves widget below text). |
| `show` | Function | `(settings) => Boolean`. Conditional visibility. |
| `lint` | Function | `(value) => sanitizedValue`. Runs on every keystroke. |
| `validate`| Function | `(value) => true \| "Error String"`. Runs on blur. |

---

## Supported Input Types (`TYPES`)

| Type | Slug | Available Options (`opts`) | Data Format |
| :--- | :--- | :--- | :--- |
| **Boolean** | `boolean` | N/A | `Boolean` |
| **String** | `string` | `placeholder` (Str), `multiline` (Bool), `rows` (Num) | `String` |
| **Number** | `number` | `min`, `max`, `step` (Numbers) | `Number` |
| **Select** | `select` | `options` (Array), `radio` (Bool) | `Any` |
| **FloatRange**| `float-range`| `min`, `max`, `step` (Num), `showInput` (Bool) | `Number` |
| **Color** | `color` | N/A | `String` (Hex) |
| **Image** | `image` | `format` (`'base64'` or `'path'`) | `String` |
| **Date** | `date` | N/A | `String` (YYYY-MM-DD) |
| **Time** | `time` | N/A | `String` (HH:mm) |
| **KeyInput** | `key-input` | `onInputRequest` (Function) | `{ctrl, shift, alt, meta, key}` |
| **GenericInput**| `generic-input`| `onInputRequest` (Function), `placeholder` (Str) | `Any` |

---

## Theming

The panel is styled via CSS variables injected at the root level. You can override these by passing a `themeColors` object.

### Theme Object Structure
```javascript
const myTheme = {
  leftColumn: {
    bgColor: '#1e1e1e',
    categoryColor: '#cccccc',
    selectedCategoryBgColor: '#37373d'
  },
  mainColumn: {
    bgColor: '#121212',
    textColor: '#e0e0e0',
    attentionColor: '#bb86fc' // Pulse color for subcategories
  },
  toggle: {
    activeBgColor: '#00abae'
  },
  range: {
    thumbColor: '#00abae'
  }
}
```

---

## Advanced Features

### Input Sanitization (Linting)
Use the `lint` function to force formatting.
```javascript
lint: (val) => val.toLowerCase().replace(/\s+/g, '_')
```

### External Input Capture
For `KeyInput` or `GenericInput`, you can trigger external capture logic (useful for Electron or custom drivers).
```javascript
type: TYPES.GenericInput,
opts: {
  onInputRequest: (set) => {
    const val = getCustomDeviceData(); // Your logic
    set(val); // Updates the panel state
  }
}
```

### Automatic State Initialization
`createSettings(spec, initialData)` ensures that your settings object contains every key defined in the spec, filling missing values with their respective `default` values.

---

## Development

```bash
# Install dependencies
npm install

# Run the DAW demo app
npm run dev

# Build the library for NPM
npm run build

# Build the demo app for deployment
npm run build:demo
```
