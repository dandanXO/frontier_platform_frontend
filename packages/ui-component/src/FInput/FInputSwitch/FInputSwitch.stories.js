import FInputSwitch from './FInputSwitch.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputSwitch',
  component: FInputSwitch,
  args: {
    label: 'Label',
    iconSize: '30',
  },
  argTypes: {
    inputValue: {
      control: { type: null },
    },
    label: {
      control: { type: 'text' },
    },
  },
}

const Template = (args) => ({
  components: { FInputSwitch },
  setup() {
    const inputValue = ref(false)
    return { args, inputValue }
  },
  template: `<f-input-switch v-model:inputValue="inputValue" v-bind="args"></f-input-switch>`,
})

export const Default = Template.bind({})
