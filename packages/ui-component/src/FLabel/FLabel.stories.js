import FLabel from './FLabel.vue'
import { SIZE, THEME } from '../constants'

const baseArgs = {
  size: SIZE.LG,
  theme: THEME.LIGHT,
}

export default {
  title: 'FLabel',
  component: FLabel,
  args: baseArgs,
  argTypes: {
    theme: {
      control: { type: 'select' },
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
