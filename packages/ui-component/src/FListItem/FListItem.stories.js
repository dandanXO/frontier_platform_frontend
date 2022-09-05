import FListItem from './FListItem.vue'
import FList from '../FList/FList.vue'

export default {
  title: 'FListItem',
  component: FListItem,
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}

export const Default = (args) => ({
  components: { FListItem },
  setup () {
    return { args }
  },
  template: `
    <f-list-item v-bind="args">
      List
    </f-list-item>
  `,
})

export const ListAndListItem = (args) => ({
  components: { FListItem, FList },
  setup () {
    return { args }
  },
  template: `
    <f-list>
      <f-list-item v-bind="args">
        List1
      </f-list-item>
      <f-list-item v-bind="args">
        List2
      </f-list-item>
    </f-list>
  `,
})


