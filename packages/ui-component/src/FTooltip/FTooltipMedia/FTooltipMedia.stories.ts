import type { Meta, StoryObj } from '@storybook/vue3'
import FTooltipMedia from './FTooltipMedia.vue'
import { TOOLTIP_PLACEMENT } from '../../constants'

export default {
  title: 'Tooltip/FTooltipMedia',
  component: FTooltipMedia,
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
    () => ({ template: '<div class="mt-80 ml-50"><story /></div>' }),
  ],
} as Meta<typeof FTooltipMedia>

type Story = StoryObj<typeof FTooltipMedia>

const Template: Story = {
  render: (args) => ({
    components: { FTooltipMedia },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-media v-bind="args">
      <template #slot:tooltip-trigger>
        <f-svg-icon iconName="info_outline" class="cursor-pointer" size="14"/>
      </template>
    </f-tooltip-media>
    <p>Hover on the below info icon and wait 0.5 sec.</p>
    `,
  }),
  args: {
    imageUrl:
      'https://blog.hootsuite.com/wp-content/uploads/2020/02/Image-copyright-556x556.png',
  },
}

export const Default: Story = Template

export const WithTitle: Story = {
  ...Template,
  args: {
    ...Template.args,
    tooltipTitle: 'What is a 3D material?',
  },
}
export const PantoneColor: Story = {
  ...Template,
  args: {
    ...Template.args,
    tooltipTitle: '12-0304 TCX',
    tooltipMessage: 'Whitecap Gray',
    imageUrl: '',
    pantone: {
      r: 224,
      g: 213,
      b: 198,
    },
  },
}

export const SlotTooltipContent: Story = {
  render: (args) => ({
    components: { FTooltipMedia },
    setup() {
      return { args }
    },
    template: `
    <f-tooltip-media v-bind="args">
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
    </f-tooltip-media>
    <p>Hover on the below info icon and wait 0.5 sec.</p>
    <p>With slot:tooltip-content, you can do everything</p>
    `,
  }),
  args: {
    imageUrl:
      'https://blog.hootsuite.com/wp-content/uploads/2020/02/Image-copyright-556x556.png',
  },
}
