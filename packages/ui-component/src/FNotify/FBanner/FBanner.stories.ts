import type { Meta, StoryObj } from '@storybook/vue3'
import FBanner from './FBanner.vue'
import { NOTIFY_TYPE } from '../../constants'
import { shallowRef, h } from 'vue'

export default {
  title: 'Notify/FBanner',
  component: FBanner,
  args: {
    notifyType: NOTIFY_TYPE.INFO,
    title: 'Info Title',
    messageText:
      'Single-line banner with action. displays a prominent message and related optional action',
  },
  argTypes: {
    notifyType: {
      control: { type: 'select' },
      options: ['INFO', 'WARNING', 'SUCCESS', 'ALERT'],
      mapping: {
        INFO: NOTIFY_TYPE.INFO,
        WARNING: NOTIFY_TYPE.WARNING,
        SUCCESS: NOTIFY_TYPE.SUCCESS,
        ALERT: NOTIFY_TYPE.ALERT,
      },
    },
  },
} as Meta<typeof FBanner>

type Story = StoryObj<typeof FBanner>

const Template: Story = {
  render: (args) => ({
    components: { FBanner },
    setup() {
      return { args }
    },
    template: '<f-banner v-bind="args"></f-banner>',
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

export const withMessageComponent: Story = {
  render: (args) => ({
    components: { FBanner },
    setup() {
      const messageComponent = shallowRef({
        render: () => {
          return h('div', { class: 'text-body1 line-clamp-1 leading-1.6' }, [
            h('span', {}, 'Your account is currently '),
            h('span', { class: 'font-bold' }, 'inactive'),
          ])
        },
      })
      args.messageText = ''
      return { args, messageComponent }
    },
    template:
      '<f-banner v-bind="args" :messageComponent="messageComponent"></f-banner>',
  }),
}
