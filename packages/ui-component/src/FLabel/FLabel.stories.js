import FLabel from './FLabel.vue'

const baseArgs = {
  size: 'lg',
}

export default {
  title: 'FLabel',
  component: FLabel,
  args: baseArgs,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['lg', 'sm'],
    },
  },
}

const Template = (args) => ({
  components: { FLabel },
  setup() {
    return { args }
  },
  template: '<f-label v-bind="args"> Tag </f-label>',
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
