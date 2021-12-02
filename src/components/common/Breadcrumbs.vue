<template lang="pug">
div(class="flex items-center gap-x-1")
  template(v-if="length < 4")
    template(v-for="(item, index) in breadcrumbsList")
      p(:class="[...classes, { 'font-bold': index === length - 1 }]" @click="$emit('click:item', item)") {{item.name}}
      svg-icon(v-if="index !== length - 1" size="20" iconName="slash" class="text-black-500")
  template(v-else)
    p(:class="classes" @click="$emit('click:item', breadcrumbsList[0])") {{breadcrumbsList[0].name}}
    svg-icon(size="20" iconName="slash" class="text-black-500")
    dropdown(:options="breadcrumbsList.slice(1, length -1)" @select="$emit('click:item', $event)")
      template(#displayItem="{ isExpand }")
        svg-icon(size="20" iconName="more_horiz" class="text-primary hover:bg-black-200 rounded-sm" :class="{ 'bg-black-200': isExpand }")
    svg-icon(size="20" iconName="slash" class="text-black-500")
    p(:class="classes" class="font-bold") {{breadcrumbsList[length - 1].name}}
</template>

<script>
import { computed } from '@vue/runtime-core'
import { ref } from 'vue'

export default {
  name: 'Breadcrumbs',
  props: {
    breadcrumbsList: {
      type: Array,
      required: true
    },
    fontSize: {
      type: String,
      default: 'text-body1'
    }
  },
  setup (props) {
    const isExpend = ref(false)
    const length = computed(() => props.breadcrumbsList.length)
    const classes = computed(() => ([
      'text-primary',
      'hover:text-brand',
      'cursor-pointer',
      props.fontSize
    ]))

    return {
      isExpend,
      length,
      classes
    }
  }
}
</script>
