<template lang="pug">
div
  div(class="flex items-center gap-x-2")
    f-svg-icon(iconName="swatch_small" size="20" class="text-grey-900")
    p(class="text-body2 font-bold text-grey-900") {{ $t('RR0130') }}
  f-input-tap(
    v-if="material.isDoubleSide"
    :optionList="sideOptionList"
    v-model:inputValue="currentSelectedSideType"
    class="pt-4 pb-3"
  )
  div(class="grid gap-y-1.5 w-full")
    div(
      v-if="specificationInfo.seasonInfo.value"
      :class="{ 'bg-grey-50 px-3 py-2 rounded !text-grey-600': !specificationInfo.seasonInfo.isPublic }"
    ) {{ specificationInfo.seasonInfo.value }}
    div(v-if="specificationInfo.featureList.value.length > 0")
      p(
        :class="{ 'line-clamp-2': !hasExtendContent }"
        class="text-body2/1.6 text-grey-900"
      ) {{ specificationInfo.featureList.value }}
      button(
        v-if="!hasExtendContent"
        class="text-caption text-cyan-400 pt-2 pb-3"
        @click="hasExtendContent = true"
      ) Show More
    template(v-for="(property, key) in specificationInfo" :key="key")
      template(v-if="['seasonInfo', 'featureList'].includes(key)")
      div(
        v-else-if="key === 'construction' && specificationInfo['construction']"
        class="w-full grid gap-y-1.5 text-grey-900"
        :class="{ 'bg-grey-50 px-3 py-2 rounded !text-grey-600': !specificationInfo['construction'].isPublic }"
      )
        div(
          v-for="(constructionProperty, constructionKey) in specificationInfo['construction'].value"
          :key="constructionKey"
          class="flex"
        )
          template(v-if="constructionProperty")
            p(class="text-body2/1.6 break-words") {{ constructionProperty.name }}：
            p(class="text-body2/1.6 break-words") {{ constructionProperty.value }}
      div(
        v-else-if="key === 'constructionCustomPropertyList' && specificationInfo['constructionCustomPropertyList']"
        class="w-full grid gap-y-1.5"
      )
        div(
          v-for="constructionProperty in specificationInfo['constructionCustomPropertyList'].value"
          :key="constructionProperty.customId"
          class="flex"
          :class="{ 'bg-grey-50 px-3 py-2 rounded !text-grey-600': !constructionProperty.isPublic }"
        )
          template(v-if="constructionProperty")
            p(class="text-body2/1.6 break-words") {{ constructionProperty.name }}：
            p(class="text-body2/1.6 break-words") {{ constructionProperty.value }}
      div(v-else-if="property" class="flex w-full")
        p(class="text-body2/1.6 text-grey-900 break-words") {{ property.name }}：
        p(class="text-body2/1.6 text-grey-900 break-words") {{ property.value }}
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Material } from '@frontier/platform-web-sdk'
import useMaterial from '@/composables/material/useMaterial'

const props = defineProps<{
  material: Material
}>()

const { currentSelectedSideType, sideOptionList, specificationInfo } =
  useMaterial(ref(props.material))

const canExtendContent = (text: string, numberOfLine: number) => {
  const p = document.createElement('p')
  p.innerText = text
  p.style.maxWidth = '380px'
  p.style.fontSize = '14px'
  p.style.lineHeight = '1.6'
  document.body.appendChild(p)
  const isEllipsis = Math.floor(Number(p.offsetHeight / 22.4)) > numberOfLine
  document.body.removeChild(p)
  return isEllipsis
}
const hasExtendContent = ref(
  !canExtendContent(specificationInfo.value.featureList.value, 2)
)
</script>
