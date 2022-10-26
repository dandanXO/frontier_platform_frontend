import FCircleProgressBar from './FCircleProgressBar.vue'

const baseArgs = {
  size: 60,
  max: 100,
}

export default {
  title: 'FCircleProgressBar',
  component: FCircleProgressBar,
  args: baseArgs,
  argTypes: {
    size: {
      control: { type: 'number' },
    },
    current: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
  },
}

const Template = (args) => ({
  components: { FCircleProgressBar },
  setup() {
    return { args }
  },
  template: '<f-circle-progress-bar v-bind="args"> </f-circle-progress-bar>',
})

export const Percent0 = Template.bind({})
Percent0.args = {
  current: 0,
}
export const Percent33 = Template.bind({})
Percent33.args = {
  current: 33,
}
export const Percent66 = Template.bind({})
Percent66.args = {
  current: 66,
}
export const Percent100 = Template.bind({})
Percent100.args = {
  current: 100,
}

export const WithText = (args) => ({
  components: { FCircleProgressBar },
  setup() {
    return { args }
  },
  template: `
    <p class="pb-3">made by default slot</p>
    <f-circle-progress-bar v-bind="args">
      <p> {{ ((args.current / args.max) * 100).toFixed(0) }}% </p>
    </f-circle-progress-bar>
  `,
})
WithText.args = {
  current: 50,
}
