<template lang="pug">
div(class="flex flex-col")
  div(class="border-b border-black-400 h-10 flex items-end")
    div(class="grid gap-x-6 grid-flow-col justify-start")
      div(
        v-for="tab in tabList"
        class="flex cursor-pointer"
        :class="[tab[keyField] === currentTab ? 'border-b-2 border-brand text-primary' : 'text-black-600 hover:text-primary', { '!text-black-500 point-events-none': tab.disabled }]"
        @click="switchTab(tab)"
      )
        svg-icon(v-if="tab.icon" :iconName="tab.icon" size="14" class="mr-1")
        p(class="pb-3 text-body2 whitespace-nowrap" :class="{ 'font-bold': tab[keyField] === currentTab }") {{ tab.name }}
        div(v-if="tab.hasNewUpdate" class="ml-0.5 w-1.5 h-1.5 rounded-full bg-warn-middle")
  div(class="flex-grow")
    slot(:currentTab="currentTab")
</template>

<script>
export default {
  name: 'Tabs'
}
</script>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  tabList: {
    type: Array,
    required: true,
    default: () => ([{ ['path']: '', name: '', hasNewUpdate: false, icon: '', disabled: false }])
  },
  keyField: {
    type: String,
    default: 'path'
  },
  initValue: {
    type: [String, Number]
  }
})
const emit = defineEmits(['switch'])

const currentTab = ref(props.initValue || props.tabList[0][props.keyField])

const switchTab = (tab) => {
  currentTab.value = tab[props.keyField]
  emit('switch', tab)
}
</script>
