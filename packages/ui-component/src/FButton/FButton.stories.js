import FButton from './FButton.vue'

const baseArgs = {
  size: 'lg',
  type: 'primary',
}

export default {
  title: 'Button/FButton',
  component: FButton,
  args: baseArgs,
  argTypes: {
    theme: {
      control: { type: 'select' },
      option: ['light', 'dark'],
    },
    size: {
      control: { type: 'select' },
      options: ['lg', 'md', 'sm'],
    },
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
}

const Template = (args) => ({
  components: { FButton },
  setup() {
    return { args }
  },
  template: '<f-button v-bind="args"> Button </f-button>',
})

export const Primary = Template.bind({})
Primary.args = {
  ...baseArgs,
}

export const Secondary = Template.bind({})
Secondary.args = {
  ...baseArgs,
  type: 'secondary',
}

export const Icon = Template.bind({})
Icon.args = {
  ...baseArgs,
  prependIcon: 'clear',
}

export const Medium = Template.bind({})
Medium.args = {
  ...baseArgs,
  size: 'md',
}

export const Small = Template.bind({})
Small.args = {
  ...baseArgs,
  size: 'sm',
}
