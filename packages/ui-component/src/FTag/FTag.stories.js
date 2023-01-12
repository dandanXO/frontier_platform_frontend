import FTag from './FTag.vue'

export default {
  title: 'FTag',
  component: FTag,
}

const Template = (args) => ({
  components: { FTag },
  setup() {
    return { args }
  },
  template: '<f-tag v-bind="args"> label </f-tag>',
})

export const Default = Template.bind({})
