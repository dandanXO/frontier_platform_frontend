import FInputTextButton from './FInputTextButton.vue'
import { ref } from 'vue'
import FInputTextStories from '../FInputTextOld/FInputTextOld.stories'

delete FInputTextStories.argTypes.inputType
delete FInputTextStories.argTypes['slot:errorMsg']

export default {
  title: 'Input/FInputText Series/FInputTextButton',
  component: FInputTextButton,
  args: {
    size: 'lg',
    type: 'primary',
    buttonLabel: 'Button',
  },
  argTypes: {
    ...FInputTextStories.argTypes,
    type: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
  },
}

const Template = (args) => ({
  components: { FInputTextButton },
  setup() {
    const inputText = ref('')
    return { args, inputText }
  },
  template: `<f-input-text-button v-model:textValue="inputText" v-bind="args"></f-input-text-button>`,
})

export const Default = Template.bind({})
