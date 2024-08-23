<template lang="pug">
modal-behavior(
  :header="$t('RR0130')"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
  :footer="!isMobile"
)
  div(class="w-[min(640px,calc(100vw_-_80px_-_40px))] grid gap-y-8")
    div(
      class="flex flex-col gap-y-5 tablet:flex-row tablet:justify-between tablet:items-start"
    )
      div
        p(class="text-body2 text-grey-900 mb-3") {{ material.metaData.unitName }}
        h4(class="text-h4 text-grey-900 font-bold") {{ material.itemNo }}
      div(class="flex items-center gap-x-5 pt-1")
        div(
          v-if="material.faceSide?.sideImage?.thumbnailUrl"
          class="box-border border-grey-250"
        )
          img(
            :src="material.faceSide?.sideImage?.thumbnailUrl"
            class="w-20 h-20 rounded overflow-hidden"
            v-default-img
          )
          p(class="text-caption/1.3 text-grey-900 text-center mt-2") {{ $t('MI0007') }}
        div(
          v-if="material.backSide?.sideImage?.thumbnailUrl"
          class="box-border border-grey-250"
        )
          img(
            :src="material.backSide?.sideImage?.thumbnailUrl"
            class="w-20 h-20 rounded overflow-hidden"
            v-default-img
          )
          p(class="text-caption/1.3 text-grey-900 text-center mt-2") {{ $t('MI0009') }}
    div
      div(class="flex items-center gap-x-2")
        f-svg-icon(iconName="swatch_small" size="20" class="text-grey-900")
        p(class="text-body2 font-bold text-grey-900") {{ $t('RR0130') }}
      f-input-tap(
        v-if="sideOptionList.length > 1"
        :optionList="sideOptionList"
        :inputValue="currentSideType"
        @update:inputValue="switchSideType"
        class="pt-4 pb-3"
      )
      div(class="grid gap-y-2 text-body2/1.6 break-word")
        //- Season
        p(
          v-if="currentSideType !== MATERIAL_SIDE_TYPE.MIDDLE && specificationInfo.seasonInfo.value && specificationInfo.seasonInfo.isPublic"
          :class="specificationInfo.seasonInfo.textColor"
        ) {{ specificationInfo.seasonInfo.value }}
        //- Feature
        p(:class="specificationInfo.featureList.textColor" class="mb-1.5") {{ specificationInfo.featureList.value }}
        //- Construction
        div(
          v-if="specificationInfo.constructionType"
          class="grid gap-y-2"
          :class="specificationInfo.constructionType?.textColor"
        )
          div(class="grid grid-cols-5 gap-x-2")
            p(class="col-span-1") {{ specificationInfo.constructionType?.name }}
            p(class="col-span-4") {{ specificationInfo.constructionType?.value }}
        //- Construction
        div(
          v-if="specificationInfo.construction && specificationInfo.construction.value && specificationInfo.construction.isPublic"
          class="grid gap-y-2"
          :class="specificationInfo.construction.textColor"
        )
          div(
            v-for="(constructionProperty, constructionKey) in specificationInfo.construction.value"
            :key="constructionKey"
            class="grid grid-cols-5 gap-x-2"
          )
            p(class="col-span-1") {{ constructionProperty.name }}
            p(class="col-span-4") {{ constructionProperty.value }}
        //- Construction CustomProperty
        div(
          v-if="specificationInfo.constructionCustomPropertyList && specificationInfo.constructionCustomPropertyList.value.length > 0"
          class="grid gap-y-2"
          :class="specificationInfo.constructionCustomPropertyList.textColor"
        )
          div(
            v-for="constructionProperty in specificationInfo.constructionCustomPropertyList.value"
            :key="constructionProperty.customId"
            class="grid grid-cols-5 gap-x-2"
          )
            p(class="col-span-1") {{ constructionProperty.name }}
            p(class="col-span-4") {{ constructionProperty.value }}
        //- Content
        div(
          v-if="specificationInfo.contentList"
          class="grid grid-cols-5 gap-x-2"
          :class="specificationInfo.contentList.textColor"
        )
          p(class="col-span-1") {{ specificationInfo.contentList.name }}
          p(class="col-span-4") {{ specificationInfo.contentList.value }}
        //- Width
        div(
          v-if="specificationInfo.width"
          class="grid grid-cols-5 gap-x-2"
          :class="specificationInfo.width.textColor"
        )
          p(class="col-span-1") {{ specificationInfo.width.name }}
          p(class="col-span-4") {{ specificationInfo.width.value }}
        //- Weight
        div(
          v-if="specificationInfo.weight"
          class="grid grid-cols-5 gap-x-2"
          :class="specificationInfo.weight.textColor"
        )
          p(class="col-span-1") {{ specificationInfo.weight.name }}
          p(class="col-span-4") {{ specificationInfo.weight.value }}
        //- Finish
        div(
          v-if="specificationInfo.finishList && !isEmpty(specificationInfo.finishList.value)"
          class="grid grid-cols-5 gap-x-2"
          :class="specificationInfo.finishList.textColor"
        )
          p(class="col-span-1") {{ specificationInfo.finishList.name }}
          p(class="col-span-4") {{ specificationInfo.finishList.value }}
    div(v-if="currentSideType !== MATERIAL_SIDE_TYPE.MIDDLE")
      div(class="flex items-center gap-x-2")
        f-svg-icon(iconName="palette" size="20" class="text-grey-900")
        p(class="text-body2 font-bold text-grey-900") {{ $t('RR0309') }}
      div(class="grid gap-y-2 pt-4 text-body2/1.6")
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
        //- Colors
        template(v-if="colorInfo && !isEmpty(colorInfo.value.color)")
          div(v-if="colorInfo.value.color" class="grid grid-cols-5 gap-x-2 text-grey-900")
            p(class="col-span-1 font-bold") {{ colorInfo.name }}
            p(class="col-span-4") {{ colorInfo.value.color }}
          template(
            v-for="color in colorInfo.value.customPropertyList"
            :key="color.customId"
          )
            div(
              v-if="color.isPublic && color.value"
              class="grid grid-cols-5 gap-x-2 text-grey-900"
            )
              p(class="col-span-1 font-bold") {{ color.name }}
              p(class="col-span-4") {{ color.value }}
        //- Pattern
        template(v-if="patternInfo && !isEmpty(patternInfo.value.pattern)")
          div(
            v-if="patternInfo.value.pattern"
            class="grid grid-cols-5 gap-x-2 text-grey-900"
          )
            p(class="col-span-1 font-bold") {{ patternInfo.name }}
            p(class="col-span-4") {{ patternInfo.value.pattern }}
          template(
            v-for="pattern in patternInfo.value.customPropertyList"
            :key="pattern.customId"
          )
            div(
              v-if="pattern.isPublic && pattern.value"
              class="grid grid-cols-5 gap-x-2 text-grey-900"
            )
              p(class="col-span-1 font-bold") {{ pattern.name }}
              p(class="col-span-4") {{ pattern.value }}
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Material } from '@frontier/platform-web-sdk'
import useMaterial from '@/composables/material/useMaterial'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import { useBreakpoints } from '@frontier/lib'
import isEmpty from 'lodash/isEmpty'

export interface PropsModalMaterialSpecification {
  material: Material
}

const props = defineProps<PropsModalMaterialSpecification>()

const { isMobile } = useBreakpoints()
const {
  currentSideType,
  specificationInfo,
  sideOptionList,
  switchSideType,
  pantoneList,
  colorInfo,
  patternInfo,
} = useMaterial(ref(props.material))
</script>
