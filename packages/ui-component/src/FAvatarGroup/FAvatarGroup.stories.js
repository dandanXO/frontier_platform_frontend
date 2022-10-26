import FAvatarGroup from './FAvatarGroup.vue'

export default {
  title: 'FAvatarGroup',
  component: FAvatarGroup,
  args: {
    direction: 'ltr',
  },
  argTypes: {
    direction: {
      control: { type: 'radio' },
      options: ['ltr', 'rtl'],
    },
  },
}

const Template = (args) => ({
  components: { FAvatarGroup },
  setup() {
    return { args }
  },
  template: '<f-avatar-group v-bind="args" class="w-fit"></f-avatar-group>',
})

export const One = Template.bind({})
One.args = {
  avatarList: new Array(1).fill('https://picsum.photos/50'),
}

export const Two = Template.bind({})
Two.args = {
  avatarList: new Array(2).fill('https://picsum.photos/50'),
}

export const Six = Template.bind({})
Six.args = {
  avatarList: new Array(6).fill('https://picsum.photos/50'),
}

export const MoreThanSix = Template.bind({})
MoreThanSix.args = {
  avatarList: new Array(7).fill('https://picsum.photos/50'),
}
export const RightToLeft = Template.bind({})
RightToLeft.args = {
  avatarList: new Array(7).fill('https://picsum.photos/50'),
  direction: 'rtl',
}
