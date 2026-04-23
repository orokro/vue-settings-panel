import BooleanEdit from './BooleanEdit.vue'
import StringEdit from './StringEdit.vue'
import NumberEdit from './NumberEdit.vue'
import SelectEdit from './SelectEdit.vue'
import FloatRangeEdit from './FloatRangeEdit.vue'
import ColorEdit from './ColorEdit.vue'
import ImageEdit from './ImageEdit.vue'
import DateEdit from './DateEdit.vue'
import TimeEdit from './TimeEdit.vue'
import KeyInputEdit from './KeyInputEdit.vue'
import KeysInputEdit from './KeysInputEdit.vue'
import GenericInputEdit from './GenericInputEdit.vue'

export const TYPES = {
  Boolean: {
    name: 'Boolean',
    slug: 'boolean',
    defaultValue: false,
    component: BooleanEdit,
  },
  String: {
    name: 'String',
    slug: 'string',
    defaultValue: '',
    component: StringEdit,
  },
  Number: {
    name: 'Number',
    slug: 'number',
    defaultValue: 0,
    component: NumberEdit,
  },
  Select: {
    name: 'Select',
    slug: 'select',
    defaultValue: '',
    component: SelectEdit,
  },
  FloatRange: {
    name: 'FloatRange',
    slug: 'float-range',
    defaultValue: 0,
    component: FloatRangeEdit,
  },
  Color: {
    name: 'Color',
    slug: 'color',
    defaultValue: '#000000',
    component: ColorEdit,
  },
  Image: {
    name: 'Image',
    slug: 'image',
    defaultValue: '',
    component: ImageEdit,
  },
  Date: {
    name: 'Date',
    slug: 'date',
    defaultValue: '',
    component: DateEdit,
  },
  Time: {
    name: 'Time',
    slug: 'time',
    defaultValue: '',
    component: TimeEdit,
  },
  KeyInput: {
    name: 'Keyboard Shortcut',
    slug: 'key-input',
    defaultValue: { shift: false, ctrl: false, alt: false, meta: false, key: '' },
    component: KeyInputEdit,
  },
  KeysInput: {
    name: 'Keyboard Shortcuts (Multiple)',
    slug: 'keys-input',
    defaultValue: [],
    component: KeysInputEdit,
  },
  GenericInput: {
    name: 'Generic Input',
    slug: 'generic-input',
    defaultValue: '',
    component: GenericInputEdit,
  }
}

export default TYPES
