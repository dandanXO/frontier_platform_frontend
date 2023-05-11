import type { Meta, StoryObj } from '@storybook/vue3'
import FTooltipStandard from './FTooltipStandard.vue'
import { TOOLTIP_PLACEMENT } from '../../constants'

export default {
  title: 'Tooltip/FTooltipStandard',
  component: FTooltipStandard,
  args: {
    tooltipMessage: 'tooltip',
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: TOOLTIP_PLACEMENT,
    },
  },
  decorators: [() => ({ template: '<div class="mt-10 ml-5"><story /></div>' })],
} as Meta<typeof FTooltipStandard>

type Story = StoryObj<typeof FTooltipStandard>

const Template: Story = {
  render: (args) => ({
    components: { FTooltipStandard },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-standard v-bind="args">
      <template #slot:tooltip-trigger>
        <f-svg-icon iconName="info_outline" class="cursor-pointer" size="14"/>
      </template>
    </f-tooltip-standard>
    <p>Hover on the below info icon and wait 0.5 sec.</p>
    `,
  }),
}

export const Default: Story = Template

export const WithTitle: Story = {
  ...Template,
  args: {
    ...Template.args,
    tooltipTitle: 'Title',
  },
}

export const BoundaryReference: Story = {
  render: (args) => ({
    components: { FTooltipStandard },
    setup() {
      return { args }
    },
    template: `
    <p>You can enable outline to see easily</p>
    <div class="bg-grey-100 h-20 flex items-center justify-center" data-tooltip-boundary-reference="Reference1"> data-tooltip-boundary-reference="Reference1"</div>
    <div class="bg-grey-100 h-20 ml-5 flex items-center justify-center" data-tooltip-boundary-reference="Reference2"> data-tooltip-boundary-reference="Reference2"</div>
    <div class="bg-grey-100 h-20 ml-15 flex items-center justify-center" data-tooltip-boundary-reference="Reference3"> data-tooltip-boundary-reference="Reference3"</div>
    <f-tooltip-standard v-bind="args" class="pl-5">
      <template #slot:tooltip-trigger>
        <f-svg-icon iconName="info_outline" class="cursor-pointer" size="14"/>
      </template>
    </f-tooltip-standard>
    <p class="text-red-400">
      Although boundary reference has setted, but it can't be exceed the boundary of trigger element by default, as in Reference 3
    </p>
    <p class="text-red-400">
      If you want to exceed it, you need to use offset
    </p>
  `,
  }),
  args: {
    boundaryReference: 'Reference1',
  },
}

export const SlotTooltipContent: Story = {
  render: (args) => ({
    components: { FTooltipStandard },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-standard v-bind="args">
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
    </f-tooltip-standard>
    <p>Hover on the below info icon and wait 0.5 sec.</p>
    <p>With slot:tooltip-content, you can do everything</p>
    `,
  }),
}
