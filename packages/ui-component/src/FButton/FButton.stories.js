import FButton from './FButton.vue'
import { SIZE, THEME } from '../constants'

const baseArgs = {
  size: SIZE.LG,
  type: 'primary',
  theme: THEME.LIGHT,
}

export default {
  title: 'Button/FButton',
  component: FButton,
  args: baseArgs,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: [THEME.LIGHT, THEME.DARK],
    },
    size: {
      control: { type: 'radio' },
      options: [SIZE.SM, SIZE.MD, SIZE.LG],
      mapping: {
        [SIZE.SM]: SIZE.SM,
        [SIZE.MD]: SIZE.MD,
        [SIZE.LG]: SIZE.LG,
      },
    },
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'text'],
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
