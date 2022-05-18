<template lang="pug">
div(@mouseenter="isHover = true" @mouseleave="isHover = false" class="relative")
  div(class="w-full aspect-square relative")
    template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
      div(class="grid grid-rows-2 grid-cols-2 grid-flow-col h-full rounded-md overflow-hidden")
        div(class="row-span-2 bg-primary-thin")
          img(v-if="properties.coverImgList[0]" :src="properties.coverImgList[0]" class="w-full h-full object-cover")
        div(class="bg-black-200")
          img(v-if="properties.coverImgList[1]" :src="properties.coverImgList[1]" class="w-full h-full")
        div(class="bg-black-50")
          img(v-if="properties.coverImgList[2]" :src="properties.coverImgList[2]" class="w-full h-full")
    template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
      div(class="w-full h-full rounded-md overflow-hidden")
        img(:src="properties.coverImg" class="w-full h-full")
    div(v-if="isHover || haveSelectedMoreThanOne" class="absolute top-0 left-0 z-10 w-full h-11")
      div(class="bg-linear w-full h-full rounded-t-md")
      template(v-if="isSelectable")
        input-checkbox(
          v-model:inputValue="innerSelectedList"
          :value="JSON.stringify(node)"
          size="24"
          class="absolute top-3 left-3 cursor-pointer"
          iconColor="text-black-0"
          uncheckColor="text-black-0"
          @click.stop
        )
    div(v-if="isHover" class="absolute inset-0 z-9 w-full h-full bg-black-900/70 rounded-md flex justify-center items-center")
      template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
        p(class="text-body1 font-bold leading-1.6 text-black-0") {{ $t("RR0068", { number: properties.itemCounts }) }}
      template(v-else-if="node.nodeType === NODE_TYPE.MATERIAL")
        div(class="text-black-0 px-7.5 py-10 h-full flex flex-col items-center justify-center text-center")
          div(class="text-body2 font-bold line-clamp-2") {{ properties.description }}
          div(class="text-caption line-clamp-2") {{ properties.content }}
          div(class="text-caption flex gap-1")
            div {{ nodeHoverInfo.yarn }}
            div {{ nodeHoverInfo.density }}
            div {{ nodeHoverInfo.width }}
          div(class="text-caption line-clamp-2") {{ properties.finish }}
          div(class="text-caption line-clamp-1") {{ nodeHoverInfo.weight }}
      slot(name="cover-overlay")
      tooltip(
        v-if="optionList.length > 0 && innerSelectedList.length === 0"
        class="absolute bottom-3 right-3 cursor-pointer"
        placement="right-start"
        :showArrow="false"
        :manual="true"
        :offset="[0, 8]"
        @click.stop
      )
        template(#trigger)
          svg-icon(iconName="more_vert" size="20" class="text-black-0 hover:text-black-200" )
        template(#content)
          list(class="w-55")
            template(v-for="(block, index) in optionList")
              list-item(v-for="option in block" :disabled="!!option.disabled" @click.stop="$emit('click:option', option)") {{ option.name }}
              div(v-if="index !== optionList.length - 1" class="mx-2 my-1 h-px bg-black-400")
  div(class="text-caption font-bold mt-2 flex items-center justify-between text-primary")
    p(class="line-clamp-1") {{ displayName }}
    tooltip-location(v-if="isShowLocation" :location="locationList")
  slot(name="caption")
</template>

<script setup>
import { NODE_TYPE, WEIGHT_UNIT } from '@/utils/constants'
import TooltipLocation from '@/components/TooltipLocation.vue'
import { ref, computed, toRefs } from 'vue'

const props = defineProps({
  node: { // 主要用於選取時能整筆 Node 資料傳入 selectedList 以利後續 MultiMenu 使用。
    type: Object,
    required: true
  },
  properties: { // 為呈現所需資料，但因為 Node 資料結構不統一，故無法直接存取 Node。
    type: Object,
    required: true
  },
  displayName: {
    type: String,
    default: ''
  },
  isSelectable: {
    type: Boolean,
    default: true
  },
  selectedList: {
    type: Array,
    default: []
  },
  isShowLocation: {
    type: Boolean,
    default: false
  },
  locationList: {
    type: Array,
    default: []
  },
  optionList: {
    type: Array,
    default: () => [] // [[{ name: '', func: () => { } }]]
  }
})
const emit = defineEmits(['update:selectedList', 'click:option'])

const isHover = ref(false)
const nodeHoverInfo = ref(null)

if (props.node.nodeType === NODE_TYPE.MATERIAL) {
  const { properties } = toRefs(props)
  const { warpYarnCount, weftYarnCount, warpDensity, weftDensity, width, weightUnit, weightOz, weightGsm, weightGy } = properties.value

  const getWeight = () => {
    const square = String.fromCodePoint(0xB2)
    let html = ''
    if (weightUnit === WEIGHT_UNIT.GSM.value) {
      html = weightGsm ? `${weightGsm} g/m${square}(${weightOz} oz/y${square})` : ''
    } else if (weightUnit === WEIGHT_UNIT.OZ.value) {
      html = weightOz ? `${weightOz} oz/y${square}(${weightGsm} g/m${square})` : ''
    }

    if (weightGy) {
      html += `(${weightGy} g/y)`
    }
    return html
  }

  nodeHoverInfo.value = {
    yarn: warpYarnCount > 0 && weftYarnCount > 0 ? `${warpYarnCount} X ${weftYarnCount}` : '',
    density: warpDensity > 0 && weftDensity > 0 ? `${warpDensity} X ${weftDensity}` : '',
    weight: getWeight(),
    width: width > 0 ? `${width}"` : ''
  }
}

const innerSelectedList = computed({
  get: () => props.selectedList,
  set: (v) => emit('update:selectedList', v)
})

const haveSelectedMoreThanOne = computed(() => props.isSelectable && props.selectedList.length > 0)
</script>
