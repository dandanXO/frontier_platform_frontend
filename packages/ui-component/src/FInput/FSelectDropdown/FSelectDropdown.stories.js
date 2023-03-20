import FSelectDropdown from './FSelectDropdown.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FSelectDropdown',
  component: FSelectDropdown,
  args: {
    label: 'Label',
    size: 'lg',
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
      options: ['lg', 'md', 'sm'],
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
  components: { FSelectDropdown },
  setup() {
    const selectValue = ref()
    return { args, selectValue }
  },
  template: `
    <f-select-dropdown v-model:selectValue="selectValue" v-bind="args">
    </f-select-dropdown>
  `,
})

export const Default = Template.bind({})
