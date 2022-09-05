import FInputContainer from './FInputContainer.vue'

const baseArgs = {
  label: 'Label',
  required: true
}

export default {
  title: 'Input/FInputContainer',
  component: FInputContainer,
  args: baseArgs,
  argTypes: {
    required: {
      control: { type: 'boolean' }
    }
  }
}

const Template = (args) => ({
  components: { FInputContainer },
  setup () {
    return { args }
  },
  template: '<f-input-container v-bind="args"></f-input-container>',
})

export const Default = Template.bind({})
