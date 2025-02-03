import FAlert, { TYPE } from './FAlert.vue'

export default {
  title: 'Notify/FAlert',
  component: FAlert,
  args: {},
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: [TYPE.CRITICAL, TYPE.INFO, TYPE.SUCCESS, TYPE.WARNING],
    },
    'data-theme': {
      control: { type: 'radio' },
      options: ['new', 'new-dark', 'startrust'],
    },
  },
}

const Template = (args) => ({
  components: { FAlert },
  setup() {
    return { args }
  },
  template: '<f-alert v-bind="args"/>',
})

export const Default = Template.bind({})
