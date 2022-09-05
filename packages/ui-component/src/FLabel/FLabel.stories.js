import FLabel from './FLabel.vue'

export default {
  title: 'FLabel',
  component: FLabel
}

const Template = (args) => ({
  components: { FLabel },
  setup () {
    return { args }
  },
  template: '<f-label v-bind="args"> label </f-label>',
})

export const Default = Template.bind({})
