import FScrollbarContainer from './FScrollbarContainer.vue'

export default {
  title: 'FScrollbarContainer',
  component: FScrollbarContainer,
}

export const SpecificHeight = (args) => ({
  components: { FScrollbarContainer },
  setup() {
    return { args }
  },
  template: `
    <f-scrollbar-container v-bind="args" class="h-80 border border-grey-900" >
      <div>
        <div v-for="i in 10" class="h-10 bg-grey-250">
          {{i}}
        </div>
      </div>
    </f-scrollbar-container >
  `,
})

export const FlexGrow = (args) => ({
  components: { FScrollbarContainer },
  setup() {
    return { args }
  },
  template: `
    <div class="h-100 flex flex-col">
      <div class="h-20 bg-grey-100"> HEADER </div>
      <f-scrollbar-container v-bind="args" class="flex-grow">
        <div v-for="i in 10" class="h-10 bg-grey-250">
          {{i}}
        </div>
      </f-scrollbar-container >
      <div class="h-20 bg-grey-100"> FOOTER </div>
    </div>
  `,
})
