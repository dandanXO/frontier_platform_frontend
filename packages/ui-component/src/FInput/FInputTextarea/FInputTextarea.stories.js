import FInputTextarea from './FInputTextarea.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputTextarea',
  component: FInputTextarea,
  argTypes: {
    textValue: {
      control: { type: null },
    },
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
