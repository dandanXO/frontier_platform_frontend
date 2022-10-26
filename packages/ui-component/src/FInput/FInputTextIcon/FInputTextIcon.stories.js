import FInputTextIcon from './FInputTextIcon.vue'
import { ref } from 'vue'
import FInputTextStories from '../FInputText/FInputText.stories'

delete FInputTextStories.argTypes.inputType
delete FInputTextStories.argTypes['slot:errorMsg']

export default {
  title: 'Input/FInputText Series/FInputTextIcon',
  component: FInputTextIcon,
  args: {
    size: 'lg',
    type: 'primary',
  },
  argTypes: {
    ...FInputTextStories.argTypes,
    type: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
    iconColor: {
      control: { type: 'text' },
    },
  },
}

const Template = (args) => ({
  components: { FInputTextIcon },
  setup() {
    const inputText = ref('')
    return { args, inputText }
  },
  template: `<f-input-text-icon v-model:textValue="inputText" v-bind="args"></f-input-text-icon>`,
})

export const Default = Template.bind({})
