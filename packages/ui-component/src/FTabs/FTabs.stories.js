import FTabs, { TYPE } from './FTabs.vue'

const tabList = [
  {
    path: 'Tab1',
    name: 'Tab1',
  },
  {
    path: 'Tab2',
    name: 'Tab2',
  },
  {
    path: 'Tab3',
    name: 'Tab3',
  },
  {
    path: 'Tab4',
    name: 'Tab4',
  },
]

export default {
  title: 'FTabs',
  component: FTabs,
  args: {
    tabList,
    type: TYPE.LINE,
    theme: 'new',
  },
  argTypes: {
    initValue: {
      control: { type: 'text' },
    },
    type: {
      options: [TYPE.LINE, TYPE.CONTROL],
      control: { type: 'radio' },
    },
    theme: {
      control: { type: 'radio' },
      options: ['new', 'new-dark', 'startrust'],
    },
  },
}

const Template = (args) => ({
  components: { FTabs },
  setup() {
    return { args }
  },
  template: '<f-tabs v-bind="args"> </f-tabs>',
})

export const Default = Template

export const HasNewUpdate = Template.bind({})
const hasNewUpdateTabList = JSON.parse(JSON.stringify(tabList))
hasNewUpdateTabList[0].hasNewUpdate = true
HasNewUpdate.args = {
  tabList: hasNewUpdateTabList,
}

export const Disabled = Template.bind({})
const disabledTabList = JSON.parse(JSON.stringify(tabList))
disabledTabList[1].disabled = true
Disabled.args = {
  tabList: disabledTabList,
}
