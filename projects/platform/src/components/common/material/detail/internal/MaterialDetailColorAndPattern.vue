<template lang="pug">
div
  div(class="flex items-center gap-x-2")
    f-svg-icon(iconName="palette" size="20" class="text-grey-900")
    p(class="text-body2 font-bold text-grey-900") {{ $t('RR0309') }}
  div(class="grid gap-y-2 pt-4")
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
    button(
      v-if="!hasExtendedContent && checkNeedShowMoreBtn()"
      class="text-caption text-cyan-400 justify-self-start"
      @click="hasExtendedContent = true"
    ) {{ $t('TT0054') }}
    template(v-else) 
      //- Colors
      template(v-if="colorInfo && !isEmpty(colorInfo.value)")
        div(class="flex" v-if="!isEmpty(colorInfo.value.color)")
          p(class="text-body2/1.6 text-grey-900") {{ colorInfo.name }}：
          p(class="text-body2/1.6 text-grey-900") {{ colorInfo.value.color }}
        div(
          v-for="color in colorInfo.value.customPropertyList"
          :key="color.customId"
          class="flex"
          :class="{ 'bg-grey-50 px-3 py-2 rounded !text-grey-600': !color.isPublic }"
        )
          p(class="text-body2/1.6 text-grey-900") {{ color.name }}：
          p(class="text-body2/1.6 text-grey-900") {{ color.value }}
      //- Pattern
      template(v-if="patternInfo && !isEmpty(patternInfo.value)")
        div(class="flex" v-if="!isEmpty(patternInfo.value.pattern)")
          p(class="text-body2/1.6 text-grey-900") {{ patternInfo.name }}：
          p(class="text-body2/1.6 text-grey-900") {{ patternInfo.value.pattern }}
        div(
          v-for="pattern in patternInfo.value.customPropertyList"
          :key="pattern.customId"
          class="flex"
          :class="{ 'bg-grey-50 px-3 py-2 rounded !text-grey-600': !pattern.isPublic }"
        )
          p(class="text-body2/1.6 text-grey-900") {{ pattern.name }}：
          p(class="text-body2/1.6 text-grey-900") {{ pattern.value }}
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {
  MaterialSideAllOfPantoneListInner,
  MaterialColorInfo,
  MaterialPatternInfo,
} from '@frontier/platform-web-sdk'

import isEmpty from 'lodash/isEmpty'

const props = defineProps<{
  pantoneList?: Array<MaterialSideAllOfPantoneListInner>
  colorInfo?: {
    name: string
    value: MaterialColorInfo
  }
  patternInfo?: {
    name: string
    value: MaterialPatternInfo
  }
}>()

const hasExtendedContent = ref(false)
const checkNeedShowMoreBtn = () => {
  return (
    !isEmpty(props.colorInfo?.value.color) ||
    !isEmpty(props.patternInfo?.value?.pattern)
  )
}
</script>
