<template lang="pug">
div(class="flex flex-col")
  div(class="border-b border-black-400")
    div(class="flex gap-x-5")
      div(v-for="tab in tabList" class="cursor-pointer" @click="switchTab(tab)")
        p(
          class="pb-2 text-body1"
          :class="[tab[keyField] === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600']"
        ) {{ tab.name }}
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
    default: () => ([{ ['path']: '', name: '' }])
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
