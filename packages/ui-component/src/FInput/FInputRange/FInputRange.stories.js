import FInputRange from './FInputRange.vue'
import { ref } from 'vue'

export default {
  title: 'Input/FInputRange',
  component: FInputRange,
  args: {
    step: 1,
    orientation: 'horizontal',
  },
  argTypes: {
    range: {
      control: { type: null },
    },
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
  },
}

export const OneWay = (args) => ({
  components: { FInputRange },
  setup() {
    const range = ref(0)
    return { args, range }
  },
  template: `
    <div class="pt-4 px-4">
      <f-input-range v-bind="args" v-model:range="range"></f-input-range>
    </div>
    <div class="pt-10">
      <code>Range: {{range}}</code>
    </div>
  `,
})

export const TwoWay = (args) => ({
  components: { FInputRange },
  setup() {
    const range = ref([0, 100])
    return { args, range }
  },
  template: `
    <div class="pt-4 px-4">
      <f-input-range v-bind="args" v-model:range="range"></f-input-range>
    </div>
    <div class="pt-10">
      <code>Range: {{range}}</code>
    </div>
  `,
})

export const Tooltips = TwoWay.bind({})
Tooltips.args = {
  tooltips: true,
}

export const OneSideTooltips = TwoWay.bind({})
OneSideTooltips.args = {
  tooltips: [false, true],
}

export const Formatter = TwoWay.bind({})
Formatter.args = {
  tooltips: [
    {
      from: (v) => v,
      to: (v) => Number.parseFloat(v).toFixed(0),
    },
    {
      from: (v) => v,
      to: (v) => Number.parseFloat(v).toFixed(0),
    },
  ],
}
