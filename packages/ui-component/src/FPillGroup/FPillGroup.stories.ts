import FPillGroup from './FPillGroup.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { THEME } from '@frontier/constants'

export default {
  title: 'Input/FPillGroup',
  component: FPillGroup,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: [THEME.LIGHT, THEME.DARK],
    },
    inputValue: {
      control: { type: null },
    },
  },
} as Meta<typeof FPillGroup>

type Story = StoryObj<typeof FPillGroup>

const Template: Story = {
  render: (args) => ({
    components: { FPillGroup },
    setup() {
      const inputValue = ref(1)
      return { args, inputValue }
    },
    template: `
      <f-input-tap v-bind="args" v-model:inputValue="inputValue"></f-input-tap>
  `,
  }),
  args: {
    optionList: [
      {
        label: 'Face Side',
        selectValue: 1,
        icon: 'front',
        selectedIcon: 'face_full',
      },
      {
        label: 'Middle Side',
        selectValue: 2,
        icon: 'middle',
        selectedIcon: 'middle_full',
      },
      {
        label: 'Back Side',
        selectValue: 3,
        icon: 'back',
        selectedIcon: 'back_full',
      },
    ],
  },
}

export const Default: Story = Template
