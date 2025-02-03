<template lang="pug">
div(class="flex flex-col" :data-theme="theme")
  div(:class="['flex', ListContainerStyle, tabListContainerStyle]")
    div(
      v-for="(tab, index) in tabList"
      :key="tab.name"
      class="flex cursor-pointer"
      :class="['p-3 gap-2 flex flex-row align-middle', itemContainerStyle(tab), { '!text-grey-250 point-events-none': tab.disabled }, tabItemContainerStyle]"
      @click="!tab.disabled && switchTab(tab)"
      :data-cy="tab.testId ?? `tab-item-${index}`"
    )
      f-svg-icon(v-if="tab.icon" :iconName="tab.icon" size="14" class="mr-1")
      p(class="text-body2 whitespace-nowrap cursor-pointer") {{ tab.name }}
      div(v-if="tab.hasNewUpdate" class="ml-0.5 w-1.5 h-1.5 rounded-full bg-red-400")
      div(v-if="tab.new" class="new-tab-container")
        div(class="new-badge")
          p {{ $t('RR0465') }}
  div(class="flex-grow")
    slot(:currentTab="currentTab")
</template>

<script lang="ts">
export default {
  name: 'FTabs',
}

export enum TYPE {
  CONTROL = 'control',
  LINE = 'line',
  PILLS = 'pills',
}
export enum STATUS_TAB {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface TabItem {
  testId?: string
  name: string
  path?: string
  hasNewUpdate?: boolean
  new?: boolean
  icon: string
  disabled?: boolean
  [key: string]: any
}

export interface Props {
  tabList: TabItem[]
  keyField?: string
  theme?: 'new' | 'startrust' | 'new-dark'
  /**
   * To be equal to the value of [keyField] in `tabList` item
   */
  initValue?: any
  tabListContainerStyle?: string
  tabItemContainerStyle?: string
  type: TYPE
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  tabListContainerStyle: 'grid gap-x-6 grid-flow-col justify-start',
  keyField: 'path',
  type: TYPE.LINE,
})
const emit = defineEmits(['switch'])

const currentTab = ref(props.initValue || props.tabList[0][props.keyField])

const switchTab = (tab: TabItem) => {
  currentTab.value = tab[props.keyField]

  emit('switch', tab)
}

const ListContainerStyle = computed(() => {
  const styleMap: Record<TYPE, string> = {
    //Line still using the old design system style
    [TYPE.LINE]: 'border-b border-grey-250 h-10',

    [TYPE.CONTROL]: 'bg-secondary p-1 rounded-lg',
    [TYPE.PILLS]: 'p-1 rounded-lg',
  }
  return styleMap[props.type]
})

const itemContainerStyle = (tab: TabItem) => {
  const baseStyle =
    'justify-center items-center text-primary-inverse font-bold rounded'
  const styleMap: Record<TYPE, Record<STATUS_TAB, string>> = {
    //LINE still using the old design system style
    [TYPE.LINE]: {
      active: 'border-b-2 border-primary-400 text-grey-900 font-bold',
      inactive: 'text-grey-600 hover:text-grey-900',
    },

    [TYPE.CONTROL]: {
      active: `bg-brand-solid ${baseStyle} text-white`,
      inactive: `bg-secondary ${baseStyle} text-primary-inverse`,
    },
    [TYPE.PILLS]: {
      active: `bg-brand-solid ${baseStyle} text-white`,
      inactive: `bg-secondary ${baseStyle} text-primary-inverse`,
    },
  }
  const isCurrentTab = tab[props.keyField] === currentTab.value
  const style = styleMap[props.type]

  return isCurrentTab ? style.active : style.inactive
}

defineExpose({
  currentTab,
})
</script>

<style scoped>
.new-badge {
  @apply bg-cyan-50-v1;
  @apply text-cyan-500-v1;
  @apply border border-cyan-200-v1;
  display: flex;
  position: absolute;
  left: 0 rem;
  border-radius: 0.125rem;
  height: 1rem;
  font-size: 0.75rem;
  justify-content: center;
  align-items: center;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.new-tab-container {
  position: relative;
  padding-left: 4px;
  width: 40px;
}
</style>
