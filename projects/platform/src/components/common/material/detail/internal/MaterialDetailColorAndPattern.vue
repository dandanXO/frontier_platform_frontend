<template lang="pug">
div(class="grid gap-y-2")
  //- Pantone
  div(v-if="pantoneList" class="flex items-center gap-x-2")
    div(v-for="pantone in pantoneList" :key="pantone.name")
      f-tooltip-media(
        placement="right-end"
        :pantone="{ r: pantone.r, g: pantone.g, b: pantone.b }"
        :tooltipTitle="pantone.name"
        :tooltipMessage="pantone.colorName"
      )
        template(#slot:tooltip-trigger)
          div(
            class="rounded w-7.5 h-7.5"
            :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }"
          )
  //- button(
  //-   v-if="!hasExtendedContent && checkNeedShowMoreBtn()"
  //-   class="text-caption text-cyan-400 justify-self-start"
  //-   @click="hasExtendedContent = true"
  //- ) {{ $t('TT0054') }}
  //- template(v-else) 
  //-   //- Colors
  //-   template(v-if="colorInfo && !isEmpty(colorInfo.value)")
  //-     div(class="flex" v-if="!isEmpty(colorInfo.value.color)")
  //-       p(class="text-body2/1.6 text-grey-900") {{ colorInfo.name }}：
  //-       p(class="text-body2/1.6 text-grey-900") {{ colorInfo.value.color }}
  //-     div(
  //-       v-for="color in processedColors"
  //-       :key="color.customId"
  //-       class="flex"
  //-       :class="{ 'bg-grey-50 px-3 py-2 rounded !text-grey-600': !color.isPublic }"
  //-     )
  //-       p(class="text-body2/1.6 text-grey-900") {{ color.name }}：
  //-       f-tooltip-media(
  //-         v-if="color.pantone"
  //-         class="flex items-center"
  //-         placement="top-start"
  //-         :pantone="{ r: color.pantone.r, g: color.pantone.g, b: color.pantone.b }"
  //-         :tooltipTitle="color.pantone.name"
  //-         :tooltipMessage="color.pantone.colorName"
  //-       )
  //-         template(#slot:tooltip-trigger)
  //-           div(class="w-5 h-5 mx-2 rounded" :style="color.pantoneStyle")
  //-       p(class="text-body2/1.6 text-grey-900") {{ color.value }}
  //-   //- Pattern
  //-   template(v-if="patternInfo && !isEmpty(patternInfo.value)")
  //-     div(class="flex" v-if="!isEmpty(patternInfo.value.pattern)")
  //-       p(class="text-body2/1.6 text-grey-900") {{ patternInfo.name }}：
  //-       p(class="text-body2/1.6 text-grey-900") {{ patternInfo.value.pattern }}
  //-     div(
  //-       v-for="pattern in patternInfo.value.customPropertyList"
  //-       :key="pattern.customId"
  //-       class="flex"
  //-       :class="{ 'bg-grey-50 px-3 py-2 rounded !text-grey-600': !pattern.isPublic }"
  //-     )
  //-       p(class="text-body2/1.6 text-grey-900") {{ pattern.name }}：
  //-       p(class="text-body2/1.6 text-grey-900") {{ pattern.value }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  MaterialSideAllOfPantoneList,
  MaterialColorInfo,
  MaterialPatternInfo,
  PantoneColor,
} from '@frontier/platform-web-sdk'
import { useStore } from 'vuex'
import isEmpty from 'lodash/isEmpty'

const store = useStore()

const props = defineProps<{
  pantoneList?: Array<MaterialSideAllOfPantoneList>
  colorInfo?: {
    name: string
    value: MaterialColorInfo
  }
  patternInfo?: {
    name: string
    value: MaterialPatternInfo
  }
}>()

const allPantoneList = store.getters['code/pantoneList'] as PantoneColor[]
const processedColors = computed(() =>
  props.colorInfo?.value.customPropertyList.map((color) => {
    const pantone = isPantoneValue(color.value)
    const style = pantone
      ? { backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }
      : {}

    return {
      ...color,
      pantone,
      pantoneStyle: style,
    }
  })
)
const isPantoneValue = (stringValue: string) => {
  const result = allPantoneList?.find((p) => p.name === stringValue)
  return result
}
const hasExtendedContent = ref(false)
const checkNeedShowMoreBtn = () => {
  return false
  // !isEmpty(props.colorInfo?.value.color) ||
  // !isEmpty(props.patternInfo?.value?.pattern)
}
</script>
