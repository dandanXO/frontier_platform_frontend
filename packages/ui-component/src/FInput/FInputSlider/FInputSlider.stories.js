import FInputSlider from './FInputSlider.vue'
import { ref } from 'vue'
import { THEME } from '../../constants'

export default {
  title: 'Input/FInputSlider',
  component: FInputSlider,
  args: {
    step: 1,
    orientation: 'horizontal',
  },
  argTypes: {
    range: {
      control: { type: null },
    },
    orientation: {
      control: { type: null },
    },
    theme: {
      control: { type: 'radio' },
      options: [THEME.LIGHT, THEME.DARK],
    },
  },
}

export const OneWay = (args) => ({
  components: { FInputSlider },
  setup() {
    const rangeHorizontal = ref(0)
    const rangeVertical = ref(0)
    return { args, rangeHorizontal, rangeVertical }
  },
  template: `
    <code>Range: {{rangeHorizontal}}</code>
    <f-input-slider v-bind="args" v-model:range="rangeHorizontal" :defaultRange="0" ></f-input-slider>
    <code>Range: {{rangeVertical}}</code>
    <f-input-slider class="h-80" v-bind="args" v-model:range="rangeVertical" :defaultRange="0" orientation="vertical" ></f-input-slider>
  `,
})

export const TwoWay = (args) => ({
  components: { FInputSlider },
  setup() {
    const rangeHorizontal = ref([0, 100])
    const rangeVertical = ref([0, 100])
    return { args, rangeHorizontal, rangeVertical }
  },
  template: `
    <code>Range: {{rangeHorizontal}}</code>
    <f-input-slider v-bind="args" v-model:range="rangeHorizontal" :defaultRange="[0, 100]"></f-input-slider>
    <code>Range: {{rangeVertical}}</code>
    <f-input-slider class="h-80" v-bind="args" v-model:range="rangeVertical" :defaultRange="[0, 100]"  orientation="vertical"></f-input-slider>
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
      to: (v) => v + 'cm',
    },
    {
      from: (v) => v,
      to: (v) => v + 'cm',
    },
  ],
}
