import FButtonLabel from './FButtonLabel.vue'

const baseArgs = {
  size: 'lg',
  active: false,
}

export default {
  title: 'Button/FButtonLabel',
  component: FButtonLabel,
  args: baseArgs,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['lg', 'sm'],
    },
  },
}

const Template = (args) => ({
  components: { FButtonLabel },
  setup() {
    return { args }
  },
  template: '<f-button-label v-bind="args"> Button </f-button-label>',
})

export const Large = Template.bind({})
Large.args = {
  ...baseArgs,
}

export const Small = Template.bind({})
Small.args = {
  ...baseArgs,
  size: 'sm',
}

export const Active = Template.bind({})
Active.args = {
  ...baseArgs,
  active: true,
}
