import FInputToggle from './FInputToggle.vue'

export default {
  title: 'Input/FInputToggle',
  component: FInputToggle,
  args: {
    value: false,
    disabled: false,
    size: 'medium',
  },
  argTypes: {
    value: {
      options: [false, true],
      control: { type: 'radio' },
    },
    disabled: {
      options: [false, true],
      control: { type: 'radio' },
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'radio' },
    },
  },
}

const Template = (args) => ({
  components: { FInputToggle },
  setup() {
    return { args }
  },
  template: `<f-input-toggle v-bind="args"></f-input-switch>`,
})

export const Default = Template.bind({})
