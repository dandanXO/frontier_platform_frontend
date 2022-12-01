import FInputFile from './FInputFile.vue'
import { ref } from 'vue'
import FInputTextStories from '../FInputText/FInputText.stories'

export default {
  title: 'Input/FInputText Series/FInputFile',
  component: FInputFile,
  args: {
    size: 'lg',
    type: 'primary',
    text: 'Button',
  },
  argTypes: {
    size: FInputTextStories.argTypes.size,
    fileName: {
      control: { type: null },
    },
    type: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
  },
}

const Template = (args) => ({
  components: { FInputFile },
  setup() {
    const fileName = ref('')
    return { args, fileName }
  },
  template: `<f-input-file v-model:fileName="fileName" v-bind="args"></f-input-file>`,
})

export const Default = Template.bind({})
