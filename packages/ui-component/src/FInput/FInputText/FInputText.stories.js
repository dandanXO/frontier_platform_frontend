import FInputText from './FInputText.vue'
import { ref } from 'vue'

const baseArgs = {
  size: 'lg',
  inputType: 'text',
  clearable: true,
}

export default {
  title: 'Input/FInputText Series/FInputText',
  component: FInputText,
  args: baseArgs,
  argTypes: {
    textValue: {
      control: { type: null },
    },
    inputType: {
      control: { type: 'radio' },
      options: ['text', 'number', 'date', 'password'],
    },
    size: {
      control: { type: 'radio' },
      options: ['lg', 'md'],
    },
    hintError: {
      control: { type: 'text' },
    },
  },
}

const Template = (args) => ({
  components: { FInputText },
  setup() {
    const inputText = ref('')
    return { args, inputText }
  },
  template:
    '<f-input-text v-model:textValue="inputText" v-bind="args"></f-input-text>',
})

export const Default = Template.bind({})
Default.args = {
  ...baseArgs,
}

export const Label = Template.bind({})
Label.args = {
  ...baseArgs,
  label: 'Label',
}

export const RulesRequired = Template.bind({})
RulesRequired.args = {
  ...baseArgs,
  rules: [(v) => !v && 'Required!!'],
  label:
    'Example of Required rule (Try to type something and delete it to see error message)',
  required: true,
}

export const SlotErrorMsg = (args) => ({
  components: { FInputText },
  setup() {
    const inputText = ref('')
    return { args, inputText }
  },
  template: `
    <f-input-text v-model:textValue="inputText" v-bind="args">
      <template #slot:hint-error>
        <p class="text-red-400 text-caption pt-1.5">This is <strong class="text-primary-400">slot</strong> error msg</p>
      </template>
    </f-input-text>`,
})
