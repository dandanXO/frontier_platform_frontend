import FInputChips from './FInputChips.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputChips',
  component: FInputChips,
  args: {
    label: 'Input Chips',
    dropdownMenuTree: {
      width: 'w-60',
      scrollAreaMaxHeight: 'max-h-40',
      blockList: [
        {
          menuList: [
            {
              title: 'Menu 1',
            },
            {
              title: 'Menu 2 (Disabled)',
              disabled: true,
            },
            {
              title: 'Menu 3',
            },
            {
              title: 'Menu 4',
            },
          ],
        },
      ],
    },
  },
  argTypes: {
    selectValue: {
      control: { type: null },
    },
    size: {
      control: { type: 'radio' },
      options: ['lg', 'md'],
    },
    label: {
      control: { type: 'text' },
    },
    hintError: {
      control: { type: 'text' },
    },
  },
}

const Template = (args) => ({
  components: { FInputChips },
  setup() {
    const selectValue1 = ref()
    const selectValue2 = ref([])
    const dropdownMenuTree = ref({
      width: 'w-60',
      scrollAreaMaxHeight: 'max-h-40',
      blockList: [
        {
          menuList: [
            {
              title: 'Menu 1',
              selectValue: { name: 'Menu 1', value: 1 },
            },
            {
              title: 'Menu 2 (Disabled)',
              disabled: true,
              selectValue: { name: 'Menu 2', value: 2 },
            },
            {
              title: 'Menu 3',
              selectValue: { name: 'Menu 3', value: 3 },
            },
            {
              title: 'Menu 4',
              selectValue: { name: 'Menu 4', value: 4 },
            },
          ],
        },
      ],
    })

    const addNew = (newValue) => {
      dropdownMenuTree.value.blockList[0].menuList.push({
        title: newValue,
        selectValue: {
          name: newValue,
          value: null,
        },
      })
    }

    delete args.selectValue
    delete args.dropdownMenuTree
    return { args, selectValue1, selectValue2, dropdownMenuTree, addNew }
  },
  template: `
    <f-input-chips v-model:selectValue="selectValue1" :dropdownMenuTree="dropdownMenuTree" @addNew="addNew" v-bind="args"></f-input-chips>
    <div>selectValue:  {{ selectValue1 }} </div>
    <f-input-chips v-model:selectValue="selectValue2" :dropdownMenuTree="dropdownMenuTree" @addNew="addNew" multiple v-bind="args"></f-input-chips>
    <div>selectValue:  {{ selectValue2 }} </div>
  `,
})

export const Default = Template.bind({})
