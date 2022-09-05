import FList from './FList.vue'

export default {
  title: 'FList',
  component: FList
}

const Template = (args) => ({
  components: { FList },
  setup () {
    return { args }
  },
  template: '<f-list v-bind="args"></f-list>',
})

export const Default = Template.bind({})


