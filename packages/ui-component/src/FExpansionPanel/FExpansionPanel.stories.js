import FExpansionPanel from './FExpansionPanel.vue'

export default {
  title: 'FExpansionPanel',
  component: FExpansionPanel,
  argTypes: {
    trigger: {
      description: ``,
    },
  },
}

const Template = (args) => ({
  components: { FExpansionPanel },
  setup() {
    return { args }
  },
  template: `
    <div>
      <div class="h-30 bg-grey-250"> HEADER </div>
      <f-expansion-panel v-bind="args">
        <template #trigger>
          <div class="bg-primary-400"> Expansion Panel(click to expand or collapse) </div>
          </template>
        <template #content>
          <div class="h-30 border border-grey-250"> Content </div>
        </template>
      </f-expansion-panel>
      <div class="h-30 bg-grey-250"> FOOTER </div>
    </div>
  `,
})

export const Default = Template.bind({})
