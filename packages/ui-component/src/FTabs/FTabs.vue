<template lang="pug">
div(class="flex flex-col")
  div(class="border-b border-grey-250 h-10 flex items-end")
    div(:class="tabListContainerStyle")
      div(
        v-for="(tab, index) in tabList"
        :key="tab.name"
        class="flex cursor-pointer"
        :class="[tab[keyField] === currentTab ? 'border-b-2 border-primary-400 text-grey-900' : 'text-grey-600 hover:text-grey-900', { '!text-grey-250 point-events-none': tab.disabled }, tabItemContainerStyle]"
        @click="!tab.disabled && switchTab(tab)"
        :data-cy="tab.testId ?? `tab-item-${index}`"
      )
        f-svg-icon(v-if="tab.icon" :iconName="tab.icon" size="14" class="mr-1")
        p(
          class="pb-3 text-body2 whitespace-nowrap cursor-pointer"
          :class="{ 'font-bold': tab[keyField] === currentTab }"
        ) {{ tab.name }}
        div(v-if="tab.hasNewUpdate" class="ml-0.5 w-1.5 h-1.5 rounded-full bg-red-400")
        div(v-if="tab.new" class="new-tab-container")
          div(class="new-badge")
            p {{ $t('RR0465') }}
  div(class="flex-grow")
    slot(:currentTab="currentTab")
</template>

<script>
export default {
  name: 'FTabs',
}
</script>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  /**
   * format:
   *
   * ```
   * [
   *  {
   *    [keyField]: '',
   *    name: '',
   *    hasNewUpdate: false,
   *    icon: '',
   *    disabled: false,
   *    new: false
   *  }
   * ]
   * ```
   */
  tabList: {
    type: Array,
    required: true,
  },
  keyField: {
    type: String,
    default: 'path',
  },
  /**
   * To be equal to the value of [keyField] in `tabList` item
   */
  initValue: {
    type: [String, Number],
  },
  tabListContainerStyle: {
    type: String,
    default: 'grid gap-x-6 grid-flow-col justify-start',
  },
  tabItemContainerStyle: {
    type: String,
  },
})
const emit = defineEmits(['switch'])

const currentTab = ref(props.initValue || props.tabList[0][props.keyField])

const switchTab = (tab) => {
  currentTab.value = tab[props.keyField]
  emit('switch', tab)
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
