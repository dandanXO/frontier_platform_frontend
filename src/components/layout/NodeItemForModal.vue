<template lang="pug">
div(@mouseenter="isHover = true" @mouseleave="isHover = false")
  div(class="w-full aspect-ratio border border-black-400 rounded-md overflow-hidden relative")
    template(v-if="nodeType === NODE_TYPE.COLLECTION")
      div(class="grid grid-rows-2 grid-cols-2 grid-flow-col h-full")
        div(class="row-span-2 bg-primary-thin")
          img(v-if="node.coverImgList[0]" :src="node.coverImgList[0]" class="w-full h-full object-cover")
        div(class="bg-black-200")
          img(v-if="node.coverImgList[1]" :src="node.coverImgList[1]" class="w-full h-full")
        div(class="bg-black-50")
          img(v-if="node.coverImgList[2]" :src="node.coverImgList[2]" class="w-full h-full")
      div(v-if="node.hasChildCollection" class="w-full h-7.5 absolute bottom-0 left-0")
        div(class="bg-linear w-full h-full rounded-t-md transform rotate-180")
        svg-icon(iconName="folder" class="text-black-0" size="14" class="absolute right-2 bottom-2")
    template(v-if="nodeType === NODE_TYPE.MATERIAL")
      img(:src="node.coverImg" class="w-full h-full")
    div(v-if="isSelectable" class="w-full h-7.5 absolute top-0 left-0")
      div(class="bg-linear w-full h-full rounded-t-md")
      template(v-if="isMultiSelect")
        input-checkbox(
          v-model:inputValue="innerSelectedValue"
          :value="nodeKey"
          size="20"
          class="absolute top-1 left-1 cursor-pointer"
          iconColor="text-black-0"
          uncheckColor="text-black-0"
          @click.stop
        )
      template(v-else)
        input-radio(
          v-model:inputValue="innerSelectedValue"
          :value="nodeKey"
          size="20"
          class="absolute top-1 left-1 cursor-pointer"
          checkColor="text-black-0"
          uncheckColor="text-black-0"
          @click.stop
        )
  div(class="text-caption font-bold mt-0.5 flex items-center justify-between" :class="[isHover ? 'text-brand' : 'text-primary']")
    p(class="line-clamp-1") {{displayName}}
    tooltip-location(v-if="isShowLocation" :location="node.location")
</template>

<script>
import { NODE_TYPE } from '@/utils/constants'
import { ref, computed } from 'vue'
import TooltipLocation from '@/components/TooltipLocation.vue'

export default {
  name: 'NodeItemForModal',
  components: {
    TooltipLocation
  },
  props: {
    nodeType: {
      type: Number,
      required: true
    },
    nodeKey: {
      type: [String, Number],
      required: true
    },
    node: {
      type: Object,
      required: true
    },
    displayName: {
      type: String,
      default: ''
    },
    isMultiSelect: {
      type: Boolean,
      default: true
    },
    selectedValue: {
      type: [Array, String]
    },
    isShowLocation: {
      type: Boolean,
      default: false
    },
    isSelectable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:selectedValue'],
  setup (props, { emit }) {
    const isHover = ref(false)

    const innerSelectedValue = computed({
      get: () => props.selectedValue,
      set: (v) => emit('update:selectedValue', v)
    })

    return {
      isHover,
      innerSelectedValue,
      NODE_TYPE
    }
  }
}
</script>
