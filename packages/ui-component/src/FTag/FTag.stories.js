import FTag from './FTag.vue'

const baseArgs = {
  size: 'lg',
}

export default {
  title: 'FTag',
  component: FTag,
  args: baseArgs,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['lg', 'sm'],
    },
  },
}

const Template = (args) => ({
  components: { FTag },
  setup() {
    return { args }
  },
  template: '<f-tag v-bind="args"> Tag </f-tag>',
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
