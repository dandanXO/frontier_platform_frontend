<template lang="pug">
grid-item-wrapper(
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="selectValue"
  :optionList="optionList"
)
  template(#title) {{ collection.name }}
  template(#content)
    div(
      v-if="collection.coverImg.originalUrl"
      class="flex justify-center items-center h-full bg-grey-150 rounded-md"
    )
      img(:src="collection.coverImg.originalUrl" class="object-contain w-full h-full")
    div(
      v-else
      class="grid grid-rows-2 grid-cols-2 grid-flow-col h-full rounded-md overflow-hidden"
    )
      div(class="row-span-2 bg-grey-150")
        img(
          v-if="collection.coverImgList[0]"
          :src="collection.coverImgList[0]"
          class="w-full h-full object-cover"
        )
      div(class="bg-grey-100")
        img(
          v-if="collection.coverImgList[1]"
          :src="collection.coverImgList[1]"
          class="w-full h-full object-contain"
        )
      div(class="bg-grey-50")
        img(
          v-if="collection.coverImgList[2]"
          :src="collection.coverImgList[2]"
          class="w-full h-full object-contain"
        )
  template(#hover-content)
    p(class="text-caption2 md:text-body1/1.6 font-bold text-grey-0") {{ $t('RR0068', { number: collection.itemCounts }) }}
  template(#corner-top-right)
    slot(name="corner-top-right")
  template(#corner-bottom-left)
    slot(name="corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
</template>

<script setup lang="ts">
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import { computed } from 'vue'
import type { Collection } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'

const props = withDefaults(
  defineProps<{
    collection: Collection
    isSelectable?: boolean
    selectValue?: any
    selectedValue?: Array<any>
    optionList?: FunctionOption<any>[][]
  }>(),
  {
    isSelectable: true,
  }
)
const emit = defineEmits<{
  (e: 'update:selectedValue', v: Array<any>): void
}>()

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v!),
})
</script>
