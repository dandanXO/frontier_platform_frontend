<template lang="pug">
div(class="flex items-center gap-x-1")
  template(v-if="length < 4")
    template(v-for="(item, index) in breadcrumbList")
      p(:class="[...classes, { 'font-bold': index === length - 1 }]" @click="$emit('click:item', item)") {{ item.name }}
      f-svg-icon(v-if="index !== length - 1" size="20" iconName="slash" class="text-grey-200")
  template(v-else)
    p(:class="classes" @click="$emit('click:item', breadcrumbList[0])") {{ breadcrumbList[0].name }}
    f-svg-icon(size="20" iconName="slash" class="text-grey-200")
    f-popper(placement="bottom-start")
      template(#trigger="{ isExpand }")
        f-svg-icon(size="20" iconName="more_horiz" class="text-grey-900 hover:bg-grey-100 rounded-sm" :class="{ 'bg-grey-100': isExpand }")
      template(#content)
        f-list
          f-list-item(v-for="item in breadcrumbList.slice(1, length - 1)" @click="$emit('click:item', item)") {{ item.name }}
    f-svg-icon(size="20" iconName="slash" class="text-grey-200")
    p(:class="classes" class="font-bold") {{ breadcrumbList[length - 1].name }}
</template>

<script>
export default {
  name: 'FBreadcrumb'
}
</script>

<script setup>
import { computed } from '@vue/runtime-core'
const props = defineProps({
  /**
   * format:
   * 
   * ```
   * [
   *  {
   *    name: String
   *    ...
   *  }
   * ]
   * ```
   */
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
  'text-grey-900',
  'hover:text-primary-400',
  'cursor-pointer',
  props.fontSize
]))
</script>
