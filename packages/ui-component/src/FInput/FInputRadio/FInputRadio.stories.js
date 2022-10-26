import FInputRadio from './FInputRadio.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputRadio',
  component: FInputRadio,
  args: {
    label: 'Label',
    iconSize: '24',
    inputValue: 0,
    value: 1,
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
  components: { FInputRadio },
  setup() {
    const inputValue = ref(false)
    return { args, inputValue }
  },
  template: `<f-input-radio v-model:inputValue="inputValue" v-bind="args"></f-input-radio>`,
})

export const Default = Template.bind({})

export const Selected = Template.bind({})
Selected.args = {
  value: 0,
}
