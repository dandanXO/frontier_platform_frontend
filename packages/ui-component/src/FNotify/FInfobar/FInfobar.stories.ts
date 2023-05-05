import type { Meta, StoryObj } from '@storybook/vue3'
import FInfobar from './FInfobar.vue'
import { NOTIFY_TYPE, DISPLAY } from '../../constants'

export default {
  title: 'Notify/FInfobar',
  component: FInfobar,
  args: {
    notifyType: NOTIFY_TYPE.INFO,
    display: DISPLAY.FLEX,
    title: 'Info Title',
    messageText:
      'Single-line infobar with action. displays a prominent message and related optional action',
    hasCloseButton: false,
    hasContainer: true,
  },
  argTypes: {
    notifyType: {
      control: { type: 'select' },
      options: ['INFO', 'TIPS', 'WARNING', 'CRITICAL'],
      mapping: {
        INFO: NOTIFY_TYPE.INFO,
        TIPS: NOTIFY_TYPE.TIPS,
        WARNING: NOTIFY_TYPE.WARNING,
        CRITICAL: NOTIFY_TYPE.CRITICAL,
      },
    },
    display: {
      control: { type: 'radio' },
      options: [DISPLAY.FLEX, DISPLAY.BLOCK],
      mapping: {
        [DISPLAY.FLEX]: DISPLAY.FLEX,
        [DISPLAY.BLOCK]: DISPLAY.BLOCK,
      },
    },
  },
} as Meta<typeof FInfobar>

type Story = StoryObj<typeof FInfobar>

const Template: Story = {
  render: (args) => ({
    components: { FInfobar },
    setup() {
      return { args }
    },
    template: ` <f-infobar v-bind="args" ></f-infobar>`,
  }),
}

export const Default: Story = {
  ...Template,
  args: {
    ...Template.args,
    title: '',
  },
}

export const Title: Story = {
  ...Template,
  args: {
    ...Template.args,
  },
}

export const Action: Story = {
  ...Template,
  args: {
    ...Template.args,
    action: {
      text: 'Action',
      handler: () => {
        console.log('here')
      },
    },
  },
}

export const withSlot: Story = {
  render: (args) => ({
    components: { FInfobar },
    setup() {
      args.messageText = ''
      return { args }
    },
    template: `
      <f-infobar v-bind="args">
        <span>Your account is currently </span>
        <span class="font-bold">inactive</span>
      </f-infobar>
    `,
  }),
}
