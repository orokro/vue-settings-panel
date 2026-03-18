import { reactive } from 'vue'

/**
 * Deep merges defaults from a specification with user-provided settings.
 * Ensures the returned object is reactive and matches the spec.
 * 
 * @param {Object} spec - The settings specification object.
 * @param {Object} initialData - Optional initial settings data (e.g. from localStorage).
 * @returns {Object} A reactive settings object.
 */
export function createSettings(spec, initialData = {}) {
  const settings = {}
  
  // 1. Fill with defaults from spec
  if (spec.settings) {
    Object.entries(spec.settings).forEach(([key, config]) => {
      settings[key] = config.default !== undefined ? config.default : null
    })
  }
  
  // 2. Override with initial data
  Object.entries(initialData).forEach(([key, value]) => {
    if (settings[key] !== undefined) {
      settings[key] = value
    }
  })
  
  return reactive(settings)
}
