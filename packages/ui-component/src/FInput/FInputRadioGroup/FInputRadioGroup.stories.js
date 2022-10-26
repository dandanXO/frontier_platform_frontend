import FInputRadioGroup from './FInputRadioGroup.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputRadioGroup',
  component: FInputRadioGroup,
  args: {
    label: 'Radio Group',
    radioSize: '24',
    optionList: [
      {
        name: 'Label1',
        value: 1,
      },
      {
        name: 'Label2',
        value: 2,
      },
      {
        name: 'Label3',
        value: 3,
      },
      {
        name: 'Label4',
        value: 4,
      },
    ],
  },
  argTypes: {
    inputValue: {
      control: { type: null },
    },
  },
}

const Template = (args) => ({
  components: { FInputRadioGroup },
  setup() {
    const inputValue = ref(1)
    return { args, inputValue }
  },
  template: `<f-input-radio-group v-model:inputValue="inputValue" v-bind="args"></f-input-radio-group>`,
})

export const Default = Template.bind({})
