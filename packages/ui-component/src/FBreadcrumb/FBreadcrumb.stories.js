import FBreadcrumb from './FBreadcrumb.vue'

export default {
  title: 'FBreadcrumb',
  component: FBreadcrumb
}

const Template = (args) => ({
  components: { FBreadcrumb },
  setup () {
    return { args }
  },
  template: '<f-breadcrumb v-bind="args"> Button </f-breadcrumb>',
})

export const One = Template.bind({})
One.args = {
  breadcrumbList: new Array(1).fill('').map((_, index) => ({ name: `Item${index}` }))
}
export const Two = Template.bind({})
Two.args = {
  breadcrumbList: new Array(2).fill('').map((_, index) => ({ name: `Item${index}` }))
}
export const Three = Template.bind({})
Three.args = {
  breadcrumbList: new Array(3).fill('').map((_, index) => ({ name: `Item${index}` }))
}
export const MoreThanThree = Template.bind({})
MoreThanThree.args = {
  breadcrumbList: new Array(4).fill('').map((_, index) => ({ name: `Item${index}` }))
}
