import FInputTextarea from './FInputTextarea.vue'
import { ref } from 'vue'
import FInputTextStories from '../FInputText/FInputText.stories'

delete FInputTextStories.argTypes.inputType
delete FInputTextStories.argTypes.clearable
delete FInputTextStories.argTypes.size

export default {
  title: 'Input/FInputTextarea',
  component: FInputTextarea,
  args: {
    height: '120',
  },
  argTypes: {
    ...FInputTextStories.argTypes,
  },
}

const Template = (args) => ({
  components: { FInputTextarea },
  setup() {
    const inputText = ref('')
    return { args, inputText }
  },
  template: `<f-input-textarea v-model:textValue="inputText" v-bind="args"></f-input-textarea>`,
})

export const Default = Template.bind({})
