<template lang="pug">
grid-item-wrapper(
  v-model:selectedValue="innerSelectedValue"
  :selectValue="selectValue"
  :isSelectable="isSelectable"
  :optionList="optionList"
  @click:option="$emit('click:option', $event)"
  :cornerTopRightHover="material.digitalThreadQty === 0"
)
  template(#title) {{ material.materialNo }}
  template(#content)
    div(
      class="w-full h-full rounded-md border-grey-250 overflow-hidden bg-cover"
      :class="{ border: hasNoCoverImage }"
    )
      img(v-defaultImg :src="material.coverImg" class="w-full h-full")
  template(#hover-content)
    div(
      class="text-grey-0 px-7.5 py-10 w-full h-full flex flex-col items-center justify-center text-center"
      @click="onClick($event)"
    )
      p(class="text-body2 font-bold line-clamp-2 leading-1.6") {{ material.description }}
      p(class="text-caption line-clamp-2 leading-1.6 break-all") {{ material.content }}
      p(class="text-caption line-clamp-1 leading-1.6")
        span {{ materialInfo.yarn.value }}
        span(class="px-1") {{ materialInfo.density.value }}
        span {{ materialInfo.width.value }}
      p(class="text-caption line-clamp-2 leading-1.6") {{ material.finish }}
      p(class="text-caption line-clamp-1 leading-1.6") {{ materialInfo.weight.value }}
  template(#corner-top-right="{ isHover }")
    slot(name="corner-top-right")
      digital-thread-entrance(
        v-if="canAddSticker"
        :isHover="isHover"
        :material="material"
        :stickerAddFromLocationList="stickerAddFromLocationList"
      )
  template(#corner-bottom-left)
    slot(name="corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
</template>

<script setup>
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import { computed } from 'vue'
import useMaterial from '@/composables/useMaterial'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'

const props = defineProps({
  material: {
    type: Object,
  },
  isSelectable: {
    type: Boolean,
    required: false,
  },
  selectedValue: {
    type: Array,
    required: true,
  },
  selectValue: {
    validator: (v) => true,
  },
  optionList: {
    type: Array,
    default: () => [], // [[{ name: '', func: () => { }, disabled: false }]]
  },
  canAddSticker: {
    type: Boolean,
    default: true,
  },
  stickerAddFromLocationList: {
    type: Array,
    required: true,
    default: [],
  },
})

const emit = defineEmits(['update:selectedValue', 'click:option'])

const { hasNoCoverImage, materialInfo } = useMaterial(props.material)

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v),
})

const onClick = (e) => {
  // 避免選取文字的時候出發 click 事件
  if (window.getSelection && window.getSelection().toString() !== '') {
    e.stopPropagation()
    return false
  }

  return true
}
</script>
