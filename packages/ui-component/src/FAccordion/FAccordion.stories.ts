import type { Meta } from '@storybook/vue3'

import FAccordion, { type Props } from './FAccordion.vue'

const meta: Meta<Props> = {
  component: FAccordion,
  title: 'FAccordion',
  args: {
    title: 'Title',
  },
  argTypes: {
    title: {
      control: { type: 'text' },
    },
  },
  parameters: {
    slots: {
      default: {
        description: 'Default slot',
        template: `<div>{{ args.default }}</div>`,
      },
    },
  },
}

const Template = (args: Meta<Props>['args']) => ({
  components: { FAccordion },
  setup() {
    return { args }
  },
  template: `<f-accordion v-bind="args">{{args.default}}</f-accordion>`,
})

export const Default = Template.bind({})

export default meta
