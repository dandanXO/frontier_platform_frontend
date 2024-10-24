import FButton from './FButton.vue'
import { SIZE } from '../constants'
import { computed } from 'vue'

const baseArgs = {
  size: SIZE.LG,
  type: 'primary',
  theme: 'current',
  isFullWidth: false,
}

export default {
  title: 'Button/FButton',
  component: FButton,
  args: baseArgs,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['new', 'new-dark', 'current', 'startrust'],
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
      options: ['primary', 'secondary', 'text', 'critical-outline'],
    },
    isFullWidth: {
      control: { type: 'radio' },
      options: [false, true],
    },
  },
}

const Template = (args) => ({
  components: { FButton },
  setup() {
    const props = computed(() => ({
      size: args.size,
      type: args.type,
      isFullWidth: args.isFullWidth,
    }))

    const theme = computed(() => args.theme)

    return { props, theme }
  },
  template: '<f-button v-bind="props" :data-theme="theme"> Button </f-button>',
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
