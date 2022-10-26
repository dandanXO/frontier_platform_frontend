import FTooltip from './FTooltip.vue'

export default {
  title: 'FTooltip',
  component: FTooltip,
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: [
        'auto',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
      ],
    },
    content: {
      description:
        ' text-grey-50, text-caption and leading-1.3 are only automatically applied when using a single root of the P tag',
    },
  },
  decorators: [() => ({ template: '<div class="mt-6 ml-5"><story /></div>' })],
}

export const Default = (args) => ({
  components: { FTooltip },
  setup() {
    return { args }
  },
  template: `
    <f-tooltip v-bind="args">
      <template #trigger>
        <f-svg-icon iconName="info_outline" class="cursor-pointer" size="14"/>
      </template>
      <template #content>
        <p>Tooltip</p>
      </template>
    </f-tooltip>
    <p>Hover on the below info icon and wait 1.5 sec.</p>
    `,
})

export const BoundaryReference = (args) => ({
  components: { FTooltip },
  setup() {
    return { args }
  },
  template: `
    <p>You can enable outline to see easily</p>
    <div class="bg-grey-100 h-20 flex items-center justify-center" data-tooltip-boundary-reference="Reference1"> data-tooltip-boundary-reference="Reference1"</div>
    <div class="bg-grey-100 h-20 ml-5 flex items-center justify-center" data-tooltip-boundary-reference="Reference2"> data-tooltip-boundary-reference="Reference2"</div>
    <div class="bg-grey-100 h-20 ml-15 flex items-center justify-center" data-tooltip-boundary-reference="Reference3"> data-tooltip-boundary-reference="Reference3"</div>
    <f-tooltip v-bind="args" class="pl-5">
      <template #trigger>
        <f-svg-icon iconName="info_outline" class="cursor-pointer" size="14"/>
      </template>
      <template #content>
        <p>Tooltip</p>
      </template>
    </f-tooltip>
    <p class="text-red-400">
      Although boundary reference has setted, but it can't be exceed the boundary of trigger element by default, as in Reference 3
    </p>
    <p class="text-red-400">
      If you want to exceed it, you need to use offset
    </p>
  `,
})

BoundaryReference.args = {
  boundaryReference: 'Reference1',
}
