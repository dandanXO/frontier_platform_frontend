import FInputCheckbox from './FInputCheckbox.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputCheckbox',
  component: FInputCheckbox,
  args: {
    label: 'Checkbox',
  },
  argTypes: {
    inputValue: {
      control: { type: null },
    },
    value: {
      control: { type: null },
    },
    label: {
      control: { type: 'text' },
    },
  },
}

const Template = (args) => ({
  components: { FInputCheckbox },
  setup() {
    const inputValue = ref([])
    return { args, inputValue }
  },
  template: `
    <f-input-checkbox v-model:inputValue="inputValue" v-bind="args"></f-input-checkbox>
  `,
})

const WithSmallSlotTemplate = (args) => ({
  components: { FInputCheckbox },
  setup() {
    const inputValue = ref([])
    return { args, inputValue }
  },
  template: `
    <f-input-checkbox v-model:inputValue="inputValue" v-bind="args">
      <div class="w-4 h-4 rounded bg-purple-600"></div>
    </f-input-checkbox>
  `,
})

const WithBigSlotTemplate = (args) => ({
  components: { FInputCheckbox },
  setup() {
    const inputValue = ref([])
    return { args, inputValue }
  },
  template: `
    <f-input-checkbox v-model:inputValue="inputValue" v-bind="args">
      <div class="w-10 h-10 rounded bg-purple-600"></div>
    </f-input-checkbox>
  `,
})

export const Default = Template.bind({})
export const WithSmallSlot = WithSmallSlotTemplate.bind({})
export const WithBigSlot = WithBigSlotTemplate.bind({})
