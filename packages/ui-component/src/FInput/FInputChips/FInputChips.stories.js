import FInputChips from './FInputChips.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputChips',
  component: FInputChips,
  args: {
    label: 'Input Chips',
    required: true,
    placeholder: 'Placeholder'
  },
  argTypes: {
    chips: {
      control: { type: null }
    },
    label: {
      control: { type: 'text' }
    }
  }
}

const Template = (args) => ({
  components: { FInputChips },
  setup () {
    const chips = ref([])
    return { args, chips }
  },
  template: `
    <f-input-chips v-model:chips="chips" v-bind="args"></f-input-chips>
    <div> {{ chips }} </div>
  `,
})

export const ArrayOfObject = Template.bind({})
ArrayOfObject.args = {
  ...ArrayOfObject.args,
  optionList: [
    {
      name: 'Chip 1',
      id: 1,
    },
    {
      name: 'Chip 2',
      id: 2,
    },
    {
      name: 'Chip 3',
      id: 3,
    }
  ]
}

export const ArrayOfString = Template.bind({})
ArrayOfString.args = {
  ...ArrayOfString.args,
  optionList: ['Chip 1', 'Chip 2', 'Chip 3']
}


export const AddNewOption = (args) => ({
  components: { FInputChips },
  setup () {
    const chips = ref([])
    const optionList = ref([
      {
        name: 'Chip 1',
        id: 1,
      },
      {
        name: 'Chip 2',
        id: 2,
      },
      {
        name: 'Chip 3',
        id: 3,
      }
    ])
    const addNewOption = (name) => {
      optionList.value.push({
        name,
        id: optionList.value.length + 1
      })
    }
    return { args, chips, optionList, addNewOption }
  },
  template: `
    <f-input-chips v-model:chips="chips" v-bind="args" :optionList="optionList" canAddNewOption @addNewOption="addNewOption" ></f-input-chips>
    <div> {{ chips }} </div>
  `,
})
