import { SIZE } from '@frontier/constants'
import FPill from './FPill.vue'

export default {
  title: 'FPill',
  component: FPill,
  args: {
    size: SIZE.MD,
    active: false,
    disabled: false,
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: [SIZE.LG, SIZE.MD, SIZE.SM],
    },
    active: {
      control: { type: 'radio' },
      options: [true, false],
    },
    disabled: {
      control: { type: 'radio' },
      options: [true, false],
    },
    theme: {
      control: { type: 'radio' },
      options: ['new', 'new-dark', 'startrust'],
    },
  },
}

const Template = (args) => ({
  components: { FPill },
  setup() {
    return { args }
  },
  template: `<f-pill v-bind="args">
  content
  </f-pill>`,
})

export const Default = Template.bind({})
