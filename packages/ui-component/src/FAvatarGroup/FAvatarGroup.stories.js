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
  itemList: Array.from({ length: 1 }).map((_, index) => ({
    name: `Name ${index}`,
    imageUrl: 'https://picsum.photos/50',
  })),
}

export const Two = Template.bind({})
Two.args = {
  itemList: Array.from({ length: 2 }).map((_, index) => ({
    name: `Name ${index}`,
    imageUrl: 'https://picsum.photos/50',
  })),
}

export const Five = Template.bind({})
Five.args = {
  itemList: Array.from({ length: 5 }).map((_, index) => ({
    name: `Name ${index}`,
    imageUrl: 'https://picsum.photos/50',
    labelColor: '#F07D73',
  })),
}

export const MoreThanFive = Template.bind({})
MoreThanFive.args = {
  itemList: Array.from({ length: 7 }).map((_, index) => ({
    name: `Name ${index}`,
    imageUrl: 'https://picsum.photos/50',
  })),
}
