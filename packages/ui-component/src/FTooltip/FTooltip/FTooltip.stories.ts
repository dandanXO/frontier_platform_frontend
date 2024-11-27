import type { Meta, StoryObj } from '@storybook/vue3'
import FTooltip from './FTooltip.vue'
import { TOOLTIP_PLACEMENT } from '../../constants'

export default {
  title: 'Tooltip/FTooltip',
  component: FTooltip,
  args: {
    desc: 'tooltip',
    title: 'title tooltip',
    classContainer: 'bg-primary rounded',
    theme: 'new-dark',
    placement: TOOLTIP_PLACEMENT.RIGHT,
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: Object.values(TOOLTIP_PLACEMENT),
    },
    theme: {
      control: { type: 'radio' },
      options: ['new', 'new-dark', 'startrust'],
    },
  },
  decorators: [() => ({ template: '<div class="mt-10 ml-5"><story /></div>' })],
} as Meta<typeof FTooltip>

type Story = StoryObj<typeof FTooltip>

const Template: Story = {
  render: (args) => ({
    components: { FTooltip },
    setup() {
      return { args }
    },
    template: `
    <div>
      <span>Hover on the info icon and wait 0.5 sec.</span>
      <f-tooltip v-bind="args">
        <template #slot:tooltip-trigger>
          <f-svg-icon iconName="question" size="16" class="self-center"/>
        </template>
      </f-tooltip>
    </div>
    `,
  }),
}

export const Default: Story = Template
