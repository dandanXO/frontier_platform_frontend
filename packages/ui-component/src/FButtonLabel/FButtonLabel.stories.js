import FButtonLabel from './FButtonLabel.vue'
import { SIZE, THEME } from '../constants'

const baseArgs = {
  size: 'lg',
  active: false,
  theme: THEME.LIGHT,
}

export default {
  title: 'Button/FButtonLabel',
  component: FButtonLabel,
  args: baseArgs,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: [THEME.LIGHT, THEME.DARK],
    },
    size: {
      control: { type: 'radio' },
      options: [SIZE.SM, SIZE.LG],
      mapping: {
        [SIZE.SM]: SIZE.SM,
        [SIZE.LG]: SIZE.LG,
      },
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
