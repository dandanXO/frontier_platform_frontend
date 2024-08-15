import type { Meta } from '@storybook/vue3'

import FBadge, { type Props } from './FBadge.vue'

const meta: Meta<Props> = {
  component: FBadge,
  title: 'FBadge',
  args: {
    size: 'medium',
    type: 'neutral',
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['medium', 'small'] as Props['size'][],
    },
    type: {
      control: { type: 'radio' },
      options: [
        'critical',
        'information',
        'neutral',
        'success',
        'warning',
      ] as Props['type'][],
    },
  },
  parameters: {
    slots: {
      default: {
        description: 'Default slot',
        template: `<p>{{ args.default }}</p>`,
      },
    },
  },
}

const Template = (args: Meta<Props>['args']) => ({
  components: { FBadge },
  setup() {
    return { args }
  },
  template: `<f-badge v-bind="args">{{args.default}}</f-badge>`,
})

export const Badge = Template.bind({})

export default meta
