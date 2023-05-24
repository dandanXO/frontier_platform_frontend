<template lang="pug">
div(class="flex flex-col")
  div(class="border-b border-grey-250 h-10 flex items-end")
    div(class="grid gap-x-6 grid-flow-col justify-start")
      div(
        v-for="tab in tabList"
        :key="tab.name"
        class="flex cursor-pointer"
        :class="[tab[keyField] === currentTab ? 'border-b-2 border-primary-400 text-grey-900' : 'text-grey-600 hover:text-grey-900', { '!text-grey-250 point-events-none': tab.disabled }]"
        @click="!tab.disabled && switchTab(tab)"
      )
        f-svg-icon(v-if="tab.icon" :iconName="tab.icon" size="14" class="mr-1")
        p(
          class="pb-3 text-body2 whitespace-nowrap cursor-pointer"
          :class="{ 'font-bold': tab[keyField] === currentTab }"
        ) {{ tab.name }}
        div(v-if="tab.hasNewUpdate" class="ml-0.5 w-1.5 h-1.5 rounded-full bg-red-400")
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
   *    disabled: false
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
})
const emit = defineEmits(['switch'])

const currentTab = ref(props.initValue || props.tabList[0][props.keyField])

const switchTab = (tab) => {
  currentTab.value = tab[props.keyField]
  emit('switch', tab)
}
</script>
