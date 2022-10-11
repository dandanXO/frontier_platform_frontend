import FSvgIcon from './FSvgIcon.vue'

const baseArgs = {
  iconName: 'clear',
  size: '20',
}

export default {
  title: 'FSvgIcon',
  component: FSvgIcon,
  args: baseArgs
}

export const Default = (args) => ({
  components: { FSvgIcon },
  setup () {
    return { args }
  },
  template: '<f-svg-icon v-bind="args" />',
})

export const Color = (args) => ({
  components: { FSvgIcon },
  setup () {
    return { args }
  },
  template: `
    <p>Set <strong>text-*</strong> class to change Icon color</p>
    <f-svg-icon v-bind="args" class="text-primary-400" />
  `,
})

export const IconList = (args) => ({
  components: { FSvgIcon },
  setup () {
    const icons = import.meta.globEager('./icons/**/*.svg')
    const iconNameList = []
    for (const path in icons) {
      const startIndex = path.match(/\w*\.svg/).index
      const endIndex = path.length - 4
      iconNameList.push(path.slice(startIndex, endIndex))
    }
    return {
      iconNameList
    }
  },
  template: `
    <div>
      <p class="font-bold text-red-400">The controls panel is not working in the page</p>
      <div v-for="iconName in iconNameList" class="flex">
        <f-svg-icon size="20" :iconName="iconName" />
        <p class="pl-2">{{ iconName }}</p>
      </div>
    </div>
`,
})
