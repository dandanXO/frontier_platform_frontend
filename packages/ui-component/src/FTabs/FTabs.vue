<template>
  <div class="flex flex-col" :data-theme="theme">
    <div :class="['flex', ListContainerStyle, tabListContainerStyle]">
      <div
        v-for="(tab, index) in tabList"
        :key="tab.name"
        :class="[
          itemContainerStyle(tab, index),
          { '!text-grey-250 point-events-none': tab.disabled },
          tabItemContainerStyle,
        ]"
        @click="!tab.disabled && switchTab(tab)"
        :data-cy="tab.testId ?? `tab-item-${index}`"
      >
        <FTooltip
          v-if="tab.toolTipsContent"
          :offset="[0, 8]"
          :desc="tab.toolTipsContent"
          classContainer="shadow-[0px_0px_8px_0px_rgba(19,20,20,0.10),0px_4px_8px_0px_rgba(19,20,20,0.05)]"
          :placement="TOOLTIP_PLACEMENT.TOP"
          theme="new-dark"
        >
          <template #slot:tooltip-trigger>
            <f-svg-icon
              v-if="tab.icon"
              :iconName="tab.icon"
              :size="iconSize"
              :class="[
                centerIcon ? 'flex items-center justify-center' : 'mr-1',
              ]"
              classContent="bg-grey-950-v1"
            ></f-svg-icon>
            <p class="cursor-pointer text-body2 whitespace-nowrap">
              {{ tab.name }}
            </p>
          </template>
        </FTooltip>
        <template v-else>
          <f-svg-icon
            v-if="tab.icon"
            :iconName="tab.icon"
            :size="iconSize"
            :class="[centerIcon ? 'flex items-center justify-center' : 'mr-1']"
          ></f-svg-icon>
          <p class="cursor-pointer text-body2 whitespace-nowrap">
            {{ tab.name }}
          </p>
          <div
            v-if="
              version === VERSION.V2 &&
              tab.value !== null &&
              tab.value !== undefined
            "
            :class="counterStyle(tab)"
            class="w-6 h-6 flex items-center justify-center text-xs rounded"
          >
            {{ tab.value }}
          </div>
        </template>

        <div
          v-if="tab.hasNewUpdate"
          class="ml-0.5 w-1.5 h-1.5 rounded-full bg-red-400"
        ></div>
        <div v-if="tab.new" class="new-tab-container">
          <div class="new-badge">
            <p>{{ $t('RR0465') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow">
      <slot :currentTab="currentTab"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import FTooltip from '../FTooltip/FTooltip/FTooltip.vue'
import { TOOLTIP_PLACEMENT, VERSION } from '@frontier/constants'
export default {
  name: 'FTabs',
}

export enum TYPE {
  CONTROL = 'control',
  LINE = 'line',
  PILLS = 'pills',
  SEGMENTED = 'segmented',
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
  value?: number | null
}

export interface Props {
  tabList: TabItem[]
  keyField?: string
  theme?: 'new' | 'startrust' | 'new-dark'
  /**
   *
   * To be equal to the value of [keyField] in `tabList` item
   */
  initValue?: any
  tabListContainerStyle?: string
  tabItemContainerStyle?: string
  type?: TYPE
  iconSize?: string
  centerIcon?: boolean
  version?: VERSION
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  tabListContainerStyle: 'grid gap-x-6 grid-flow-col justify-start',
  keyField: 'path',
  type: TYPE.LINE,
  iconSize: '16',
  centerIcon: false,
  version: VERSION.V1,
})
const emit = defineEmits(['switch'])

const currentTab = ref(props.initValue || props.tabList[0][props.keyField])

const switchTab = (tab: TabItem) => {
  currentTab.value = tab[props.keyField]

  emit('switch', tab)
}

const ListContainerStyle = computed(() => {
  const styleMap: Record<TYPE, Record<VERSION, string>> = {
    [TYPE.LINE]: {
      [VERSION.V1]: 'border-b border-grey-250 h-10',
      [VERSION.V2]: 'border-b border-grey-200-v1 h-10',
    },
    [TYPE.CONTROL]: {
      [VERSION.V1]: 'bg-secondary p-1 rounded-lg',
      [VERSION.V2]: 'bg-secondary p-1 rounded-lg',
    },
    [TYPE.PILLS]: {
      [VERSION.V1]: 'p-1 rounded-lg',
      [VERSION.V2]: 'p-1 rounded-lg',
    },
    [TYPE.SEGMENTED]: {
      [VERSION.V1]: 'border border-grey-300 rounded inline-flex min-h-[32px]',
      [VERSION.V2]: 'border border-grey-300 rounded inline-flex min-h-[32px]',
    },
  }
  return styleMap[props.type][props.version]
})

// Extracted base item styles
const BASE_ITEM_STYLE: Record<TYPE, Record<VERSION, string>> = {
  [TYPE.LINE]: {
    [VERSION.V1]: 'flex cursor-pointer justify-center items-center p-3 gap-2',
    [VERSION.V2]:
      'flex cursor-pointer justify-center items-center p-3 gap-2 font-bold',
  },
  [TYPE.CONTROL]: {
    [VERSION.V1]:
      'flex cursor-pointer justify-center items-center text-primary-inverse font-bold rounded p-3 gap-2',
    [VERSION.V2]:
      'flex cursor-pointer justify-center items-center text-primary-inverse font-bold rounded p-3 gap-2',
  },
  [TYPE.PILLS]: {
    [VERSION.V1]:
      'flex cursor-pointer justify-center items-center text-primary-inverse font-bold rounded p-3 gap-2',
    [VERSION.V2]:
      'flex cursor-pointer justify-center items-center text-primary-inverse font-bold rounded p-3 gap-2',
  },
  [TYPE.SEGMENTED]: {
    [VERSION.V1]:
      'flex cursor-pointer justify-center items-center align-middle px-2 py-1 text-sm border-r border-grey-300 last:border-r-0',
    [VERSION.V2]:
      'flex cursor-pointer justify-center items-center align-middle px-2 py-1 text-sm border-r border-grey-300 last:border-r-0',
  },
}

// Extracted state-based item styles
// Extracted state-based item styles
const STATE_ITEM_STYLE: Record<
  TYPE,
  Record<VERSION, Record<STATUS_TAB, string>>
> = {
  [TYPE.LINE]: {
    [VERSION.V1]: {
      [STATUS_TAB.ACTIVE]:
        'border-b-2 border-primary-400 text-grey-900 font-bold',
      [STATUS_TAB.INACTIVE]: 'text-grey-600 hover:text-grey-900',
    },
    [VERSION.V2]: {
      [STATUS_TAB.ACTIVE]:
        'border-b-2 border-green-500-v1 text-green-500-v1 font-bold hover:bg-green-50-v1',
      [STATUS_TAB.INACTIVE]: 'text-grey-600 hover:text-grey-900',
    },
  },
  [TYPE.CONTROL]: {
    [VERSION.V1]: {
      [STATUS_TAB.ACTIVE]: 'bg-brand-solid text-white',
      [STATUS_TAB.INACTIVE]: 'bg-secondary text-primary-inverse',
    },
    [VERSION.V2]: {
      [STATUS_TAB.ACTIVE]: 'bg-brand-solid text-white',
      [STATUS_TAB.INACTIVE]: 'bg-secondary text-primary-inverse',
    },
  },
  [TYPE.PILLS]: {
    [VERSION.V1]: {
      [STATUS_TAB.ACTIVE]: 'bg-brand-solid text-white',
      [STATUS_TAB.INACTIVE]: 'bg-secondary text-primary-inverse',
    },
    [VERSION.V2]: {
      [STATUS_TAB.ACTIVE]: 'bg-brand-solid text-white',
      [STATUS_TAB.INACTIVE]: 'bg-secondary text-primary-inverse',
    },
  },
  [TYPE.SEGMENTED]: {
    [VERSION.V1]: {
      [STATUS_TAB.ACTIVE]: 'bg-green-700 text-white',
      [STATUS_TAB.INACTIVE]: 'bg-white text-grey-700 hover:bg-grey-50',
    },
    [VERSION.V2]: {
      [STATUS_TAB.ACTIVE]: 'bg-green-700 text-white',
      [STATUS_TAB.INACTIVE]: 'bg-white text-grey-700 hover:bg-grey-50',
    },
  },
}

// Simplified itemContainerStyle using extracted maps
const itemContainerStyle = (tab: TabItem, index: number): string => {
  const isActive = tab[props.keyField] === currentTab.value
  const status = isActive ? STATUS_TAB.ACTIVE : STATUS_TAB.INACTIVE
  const baseStyle = BASE_ITEM_STYLE[props.type][props.version]
  const stateStyle = STATE_ITEM_STYLE[props.type][props.version][status]
  const classes = [baseStyle, stateStyle]

  if (props.type === TYPE.SEGMENTED) {
    if (index === 0) {
      classes.push('rounded-l-[0.19rem]')
    }
    if (index === props.tabList.length - 1) {
      classes.push('rounded-r-[0.19rem]')
    }
  }

  return classes.join(' ').trim()
}

const counterStyle = (tab: TabItem) => {
  const isActive = tab[props.keyField] === currentTab.value
  const status = isActive ? STATUS_TAB.ACTIVE : STATUS_TAB.INACTIVE
  const styleMap: Record<STATUS_TAB, string> = {
    [STATUS_TAB.ACTIVE]: 'bg-green-500-v1 text-white',
    [STATUS_TAB.INACTIVE]: 'bg-grey-50-v1 text-black',
  }
  return styleMap[status]
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
