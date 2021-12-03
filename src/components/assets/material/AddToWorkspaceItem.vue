<template lang="pug">
div(@mouseenter="isHover = true" @mouseleave="isHover = false")
  div(class="w-full aspect-ratio border border-black-400 rounded-md overflow-hidden relative")
    template(v-if="itemType === NODE_TYPE.COLLECTION")
      div(class="grid grid-rows-2 grid-cols-2 grid-flow-col h-full")
        div(class="row-span-2 bg-primary-thin")
          img(v-if="item.coverImgList[0]" :src="item.coverImgList[0]" class="w-full h-full")
        div(class="bg-black-200")
          img(v-if="item.coverImgList[1]" :src="item.coverImgList[1]" class="w-full h-full")
        div(class="bg-black-50")
          img(v-if="item.coverImgList[2]" :src="item.coverImgList[2]" class="w-full h-full")
      div(class="w-full h-7.5 absolute top-0 left-0")
        div(class="bg-linear w-full h-full rounded-t-md")
        input-checkbox(
          v-model:inputValue="innerSelectedList"
          :value="`${item.type}-${item.workspaceNodeId}`"
          size="20"
          class="absolute top-1 left-1 cursor-pointer"
          iconColor="text-black-0"
          uncheckColor="text-black-0"
          @click.stop
        )
      div(v-if="item.hasChildCollection" class="w-full h-7.5 absolute bottom-0 left-0")
        div(class="bg-linear w-full h-full rounded-t-md transform rotate-180")
        svg-icon(iconName="folder" class="text-black-0" size="14" class="absolute right-2 bottom-2")
    template(v-if="itemType === NODE_TYPE.MATERIAL")
      img(:src="item.coverImg" class="w-full h-full")
  div(class="text-caption font-bold mt-0.5 flex items-center justify-between" :class="[isHover ? 'text-brand' : 'text-primary']")
    p(class="line-clamp-1") {{displayName}}
    tooltip-location(v-if="isShowLocation" :location="item.location")
</template>

<script>
import { NODE_TYPE } from '@/utils/constants'
import { ref, computed } from 'vue'
import TooltipLocation from '@/components/TooltipLocation.vue'

export default {
  name: 'AddToWorkspaceItem',
  components: {
    TooltipLocation
  },
  props: {
    itemType: {
      type: Number,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    selectedList: {
      type: Array
    },
    isShowLocation: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:selectedList'],
  setup (props, { emit }) {
    const isHover = ref(false)
    const displayName = computed(() => {
      return props.itemType === NODE_TYPE.COLLECTION
        ? props.item.name
        : props.item.materialNo
    })

    const innerSelectedList = computed({
      get: () => props.selectedList,
      set: (v) => emit('update:selectedList', v)
    })

    return {
      isHover,
      displayName,
      innerSelectedList,
      NODE_TYPE
    }
  }
}
</script>
