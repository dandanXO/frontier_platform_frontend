import FInputPassword from './FInputPassword.vue'
import { ref } from 'vue'
import FInputTextStories from '../FInputText/FInputText.stories'

delete FInputTextStories.argTypes.inputType
delete FInputTextStories.argTypes['slot:errorMsg']

export default {
  title: 'Input/FInputText Series/FInputPassword',
  component: FInputPassword,
  argTypes: {
    ...FInputTextStories.argTypes,
  },
}

const Template = (args) => ({
  components: { FInputPassword },
  setup() {
    const inputText = ref('')
    return { args, inputText }
  },
  template: `<f-input-password v-model:textValue="inputText" v-bind="args"></f-input-password>`,
})

export const Default = Template.bind({})
