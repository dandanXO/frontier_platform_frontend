<template lang="pug">
input-text(:size="size")
  template(#appendItem)
    div(class="flex items-center -mr-4 pl-4")
      dropdown(v-model:value="innerLabelColor" class="w-18 h-full" :options="labelColorList" keyOptionValue="labelColor")
        template(#displayItem="{ isExpand, option }")
          div(class="flex items-center gap-x-1 pl-3 border-l border-black-400" :class="[size === 'lg' ? 'h-11' : 'h-9']")
            label(class="w-5 h-5 rounded-sm" :style="{ 'background-color': option.labelColor }")
            svg-icon(iconName="arrow-down" size="20" class="text-black-600 transform" :class="[ isExpand ? '-rotate-90' : 'rotate-90' ]")
        template(#dropdownList="{ select, options ,currentIndex }")
          div(class="w-max absolute top-full -right-px transform translate-y-1.5 p-2.5 rounded bg-black-0" style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);")
            div(class="grid grid-cols-6 grid-rows-3 gap-x-2 gap-y-1.5")
              label(v-for="(item, index) in options" class="w-5 h-5 rounded-sm relative cursor-pointer" :style="{ 'background-color': item.labelColor }" @click="select($event, item)")
                svg-icon(v-if="index === currentIndex" iconName="done" size="14" class="text-black-0 absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")
</template>

<script>
import { computed } from 'vue'
import { COLOR } from '@/utils/constants'

export default {
  name: 'InputLabelColor',
  props: {
    labelColor: {
      validator: (v) => true,
      required: true
    },
    size: {
      type: String,
      default: 'lg'
    }
  },
  emits: ['update:labelColor'],
  setup (props, { emit }) {
    const labelColorList = computed(() => Object.values(COLOR).map(color => ({ labelColor: color })))

    const innerLabelColor = computed({
      get: () => props.labelColor,
      set: (v) => emit('update:labelColor', v)
    })

    return {
      labelColorList,
      innerLabelColor
    }
  }
}
</script>
