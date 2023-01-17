import FAvatar from './FAvatar.vue'

export default {
  title: 'FAvatar',
  component: FAvatar,
  args: {},
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['user', 'org'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
  },
}

const Template = (args) => ({
  components: { FAvatar },
  setup() {
    return { args }
  },
  template: '<f-avatar v-bind="args" class="w-fit"></f-avatar>',
})

export const Default = Template.bind({})
