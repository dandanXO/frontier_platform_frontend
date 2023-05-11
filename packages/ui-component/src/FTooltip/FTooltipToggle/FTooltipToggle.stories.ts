import type { Meta, StoryObj } from '@storybook/vue3'
import FTooltipToggle from './FTooltipToggle.vue'
import { TOOLTIP_PLACEMENT } from '../../constants'

export default {
  title: 'Tooltip/FTooltipToggle',
  component: FTooltipToggle,
  args: {
    tooltipMessage:
      "Frontier's 3D material Creator converts 2D fabric swatch images into 3D-Ready material which can then be used with 3D design software. ",
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: TOOLTIP_PLACEMENT,
    },
  },
  decorators: [
    () => ({ template: '<div class="mt-50 ml-70"><story /></div>' }),
  ],
} as Meta<typeof FTooltipToggle>

type Story = StoryObj<typeof FTooltipToggle>

const Template: Story = {
  render: (args) => ({
    components: { FTooltipToggle },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-toggle v-bind="args">
      <template #slot:tooltip-trigger>
        <f-svg-icon iconName="info_outline" class="cursor-pointer" size="14"/>
      </template>
    </f-tooltip-toggle>
    <p>Hover on the below info icon and wait 0.5 sec.</p>
    `,
  }),
}

export const Default: Story = Template

export const WithTitle: Story = {
  ...Template,
  args: {
    ...Template.args,
    tooltipTitle: 'What is a 3D material?',
  },
}

export const SlotTooltipToggleButton: Story = {
  render: (args) => ({
    components: { FTooltipToggle },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-toggle v-bind="args">
      <template #slot:tooltip-toggle-button>
        <f-button size="sm">Primary</f-button>
      </template>
    </f-tooltip-toggle>
    `,
  }),
}

export const SlotTooltipToggleLink: Story = {
  render: (args) => ({
    components: { FTooltipToggle },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-toggle v-bind="args">
      <template #slot:tooltip-toggle-link>
        <p class="flex items-center text-caption/1.3 text-grey-50">
          <span> Text or a&nbsp</span>
          <span class="text-cyan-200">Learn more</span>
          <f-svg-icon iconName="open_in_new" size="14" class="text-cyan-200 ml-1"/>
        </p>
      </template>
    </f-tooltip-toggle>
    `,
  }),
}
export const SlotTooltipToggleLinkAndButton: Story = {
  render: (args) => ({
    components: { FTooltipToggle },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-toggle v-bind="args">
      <template #slot:tooltip-toggle-link>
        <p class="flex items-center flex-wrap text-caption/1.3 text-grey-50">
          <span> Text or a Text or a Text or a Text or a&nbsp</span>
          <span class="text-cyan-200">Learn more</span>
          <f-svg-icon iconName="open_in_new" size="14" class="text-cyan-200 ml-1"/>
        </p>
      </template>
      <template #slot:tooltip-toggle-button>
        <f-button size="sm">Primary</f-button>
      </template>
    </f-tooltip-toggle>
    `,
  }),
}

export const SlotTooltipContent: Story = {
  render: (args) => ({
    components: { FTooltipToggle },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-toggle v-bind="args">
      <template #slot:tooltip-trigger>
        <f-svg-icon iconName="info_outline" class="cursor-pointer" size="14"/>
      </template>
      <template #slot:tooltip-content>
        <p>
          <span>normal text </span>
          <span class="font-bold">bold </span>
          <span class="text-primary-300">Color</span>
        </p>
      </template>
    </f-tooltip-toggle>
    <p>Hover on the below info icon and wait 0.5 sec.</p>
    <p>With slot:tooltip-content, you can do everything</p>
    `,
  }),
}
