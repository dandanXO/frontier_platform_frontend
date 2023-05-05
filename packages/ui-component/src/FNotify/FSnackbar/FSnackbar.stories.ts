import type { Meta, StoryObj } from '@storybook/vue3'
import FSnackbar from './FSnackbar.vue'
import { NOTIFY_TYPE, SIZE, DISPLAY } from '../../constants'
import { shallowRef, h } from 'vue'

export default {
  title: 'Notify/FSnackbar',
  component: FSnackbar,
  args: {
    id: 0,
    isShowSnackbar: false,
    notifyType: NOTIFY_TYPE.SUCCESS,
    size: SIZE.SM,
    display: DISPLAY.FLEX,
    title: 'Info Title',
    messageText:
      'Single-line snackbar with action. displays a prominent message and related optional action',
    hasCloseButton: true,
  },
  argTypes: {
    isShowSnackbar: {
      control: { type: null },
    },
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
    size: {
      control: { type: 'radio' },
      options: [SIZE.SM, SIZE.MD],
      mapping: {
        [SIZE.SM]: SIZE.SM,
        [SIZE.MD]: SIZE.MD,
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
} as Meta<typeof FSnackbar>

type Story = StoryObj<typeof FSnackbar>

const Template: Story = {
  render: (args) => ({
    components: { FSnackbar },
    setup() {
      const showSnackbar = () => {
        args.id = Date.now()
        args.isShowSnackbar = true
      }
      return { args, showSnackbar }
    },
    template: `
      <div>
        <f-button size="md" @click="showSnackbar">show</f-button>
        <f-snackbar v-model:isShowSnackbar="args.isShowSnackbar" v-bind="args" ></f-snackbar>
      </div>
      
      `,
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
    components: { FSnackbar },
    setup() {
      const messageComponent = shallowRef({
        render: () => {
          return h('div', {}, [
            h('span', {}, 'Your account is currently '),
            h('span', { class: 'font-bold' }, 'inactive'),
          ])
        },
      })
      args.messageText = ''
      args.messageComponent = messageComponent

      const showSnackbar = () => {
        args.id = Date.now()
        args.isShowSnackbar = true
      }
      return { args, showSnackbar }
    },
    template: `
    <div>
      <f-button size="md" @click="showSnackbar">show</f-button>
      <f-snackbar v-model:isShowSnackbar="args.isShowSnackbar" v-bind="args" ></f-snackbar>
    </div>
    `,
  }),
}
