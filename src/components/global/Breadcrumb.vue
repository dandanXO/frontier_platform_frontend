<template lang="pug">
div(class="flex items-center gap-x-1")
  template(v-if="length < 4")
    template(v-for="(item, index) in breadcrumbList")
      p(:class="[...classes, { 'font-bold': index === length - 1 }]" @click="$emit('click:item', item)") {{ item.name }}
      svg-icon(v-if="index !== length - 1" size="20" iconName="slash" class="text-black-500")
  template(v-else)
    p(:class="classes" @click="$emit('click:item', breadcrumbList[0])") {{ breadcrumbList[0].name }}
    svg-icon(size="20" iconName="slash" class="text-black-500")
    popper(placement="bottom-start")
      template(#trigger="{ isExpand }")
        svg-icon(size="20" iconName="more_horiz" class="text-primary hover:bg-black-200 rounded-sm" :class="{ 'bg-black-200': isExpand }")
      template(#content)
        list
          list-item(v-for="item in breadcrumbList.slice(1, length - 1)" @click="$emit('click:item', item)") {{ item.name }}
    svg-icon(size="20" iconName="slash" class="text-black-500")
    p(:class="classes" class="font-bold") {{ breadcrumbList[length - 1].name }}
</template>

<script>
export default {
  name: 'Breadcrumb'
}
</script>

<script setup>
import { computed } from '@vue/runtime-core'
const props = defineProps({
  breadcrumbList: {
    type: Array,
    required: true
  },
  fontSize: {
    type: String,
    default: 'text-body1'
  }
})

const length = computed(() => props.breadcrumbList.length)
const classes = computed(() => ([
  'text-primary',
  'hover:text-brand',
  'cursor-pointer',
  props.fontSize
]))
</script>
