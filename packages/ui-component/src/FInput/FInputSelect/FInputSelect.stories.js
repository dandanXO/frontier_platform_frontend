import FInputSelect from './FInputSelect.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputSelect',
  component: FInputSelect,
  args: {
    label: 'Label',
    size: 'lg',
    optionList: [
      { name: 'Option 1', value: 1 },
      { name: 'Option 2', value: 2 },
      { name: 'Option 3', value: 3 },
      { name: 'Option 4', value: 4 },
    ],
    keyOptionDisplay: 'name',
    keyOptionValue: 'value',
    placeholder: 'select',
  },
  argTypes: {
    selectValue: {
      control: { type: null },
    },
    size: {
      control: { type: 'radio' },
      optionList: ['lg', 'sm'],
    },
    label: {
      control: { type: 'text' },
    },
  },
}

const Template = (args) => ({
  components: { FInputSelect },
  setup() {
    const selectValue = ref()
    return { args, selectValue }
  },
  template: `
    <f-input-select v-model:selectValue="selectValue" v-bind="args">
    </f-input-select>
  `,
})

export const Default = Template.bind({})

export const SearchBox = Template.bind({})
SearchBox.args = {
  searchBox: true,
}

export const SearchBoxAddNewOption = (args) => ({
  components: { FInputSelect },
  setup() {
    const selectValue = ref()
    const addNewOption = (name) => {
      args.optionList.push({
        name,
        value: args.optionList.length + 1,
      })
    }
    return { args, selectValue, addNewOption }
  },
  template: `
    <f-input-select v-model:selectValue="selectValue" v-bind="args" @addNewOption="addNewOption">
    </f-input-select>
  `,
})
SearchBoxAddNewOption.args = {
  searchBox: true,
  canAddNewOption: true,
  optionList: [
    {
      name: 'Chip 1',
      value: 1,
    },
    {
      name: 'Chip 2',
      value: 2,
    },
    {
      name: 'Chip 3',
      value: 3,
    },
  ],
}
