import FSearchBar from './FSearchBar.vue'

export default {
  title: 'FSearchBar',
  component: FSearchBar,
  args: {
    keyword: '',
    placeholder: 'Search...',
    rightIcon: 'filter',
    rightIconTooltipMessage: 'Filter',
  },
  argTypes: {
    keyword: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    rightIcon: {
      control: 'text',
      description: 'Icon name to display on the right side',
    },
    rightIconTooltipMessage: {
      control: 'text',
      description: 'Tooltip message for the right icon',
    },
  },
}

const Template = (args) => ({
  components: { FSearchBar },
  setup() {
    return { args }
  },
  template: `
    <f-search-bar
      v-bind="args"
      @typing="(e) => console.log('typing:', e.target.value)"
      @search="() => console.log('search')"
      @clear="() => console.log('clear')"
      @clickRightIcon="() => console.log('right icon clicked')"
    />
  `,
})

export const Default = Template.bind({})
