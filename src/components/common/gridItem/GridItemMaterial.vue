<template lang="pug">
grid-item-wrapper(
  v-model:selectedValue="innerSelectedValue"
  :selectValue="selectValue"
  :isSelectable="isSelectable"
  :optionList="optionList"
  @click:option="$emit('click:option', $event)"
)
  template(#title) {{ material.materialNo }}
  template(#content)
    div(class="w-full h-full rounded-md overflow-hidden bg-cover" :class="{ 'border': neverScanBefore }")
      img(v-defaultImg :src="material.coverImg" class="w-full h-full")
  template(#hover-content)
    div(class="text-black-0 px-7.5 py-10 h-full flex flex-col items-center justify-center text-center")
      div(class="text-body2 font-bold line-clamp-2 leading-1.6") {{ material.description }}
      div(class="text-caption line-clamp-2 leading-1.6") {{ material.content }}
      div(class="text-caption flex gap-1 leading-1.6")
        div {{ materialInfo.yarn.value }}
        div {{ materialInfo.density.value }}
        div {{ materialInfo.width.value }}
      div(class="text-caption line-clamp-2 leading-1.6") {{ material.finish }}
      div(class="text-caption line-clamp-1 leading-1.6") {{ materialInfo.weight.value }}
  template(#hover-corner-top-right)
    slot(name="hover-corner-top-right")
  template(#hover-corner-bottom-left)
    slot(name="hover-corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
</template>

<script setup>
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import { computed } from '@vue/runtime-core'
import useMaterial from '@/composables/useMaterial'

const props = defineProps({
  material: {
    type: Object
  },
  isSelectable: {
    type: Boolean,
    required: false
  },
  selectedValue: {
    type: Array,
    required: true
  },
  selectValue: {
    validator: v => true
  },
  optionList: {
    type: Array,
    default: () => [] // [[{ name: '', func: () => { }, disabled: false }]]
  }
})

const emit = defineEmits(['update:selectedValue', 'click:option'])

const { neverScanBefore, materialInfo } = useMaterial(props.material)

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v)
})

</script>
