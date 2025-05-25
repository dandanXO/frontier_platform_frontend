<template lang="pug">
div(class="grid gap-y-1.5 w-full")
  template(
    v-for="(property, key) in innerSpecificationInfoComputed"
    :key="key"
  )
    template(v-if="key === 'construction'")
      div(
        v-if="specificationInfo.construction && specificationInfo.construction.value"
        class="w-full grid gap-y-1.5"
        :class="[specificationInfo.construction.textColor, { 'bg-grey-50 px-3 py-2 rounded': !specificationInfo.construction.isPublic }]"
      )
        div(
          v-for="(constructionProperty, constructionKey) in specificationInfo.construction.value"
          :key="constructionKey"
          class="flex gap-4"
        )
          p(class="text-base break-words font-bold w-41") {{ constructionProperty.name }}：
          p(class="text-base break-words") {{ constructionProperty.value }}
    template(v-else-if="key === 'constructionCustomPropertyList'")
      div(
        v-if="specificationInfo.constructionCustomPropertyList && specificationInfo.constructionCustomPropertyList.value?.length > 0"
        class="w-full grid gap-y-1.5"
      )
        div(
          v-for="constructionProperty in specificationInfo.constructionCustomPropertyList.value"
          :key="constructionProperty.customId"
          class="flex gap-4"
          :class="[specificationInfo.constructionCustomPropertyList.textColor, { 'bg-grey-50 px-3 py-2 rounded': !constructionProperty.isPublic }]"
        )
          p(class="text-base break-words font-bold w-41") {{ constructionProperty.name }}：
          p(class="text-base break-words") {{ constructionProperty.value }}
    div(
      v-else-if="property && property.value"
      class="flex w-full gap-4"
      :class="property.textColor"
    )
      p(
        class="text-base break-words font-bold w-41"
        :class="[{ 'line-clamp-1': !property.showMore }]"
      ) {{ property.name }}
      p(
        class="text-base break-words"
        :class="[{ 'line-clamp-1': !property.showMore }]"
      ) {{ property.value }}
      div(class="grid gap-y-2 pt-4")
    template(v-if="hasExtendedContent(property, key) && !property.showMore")
      button(class="text-caption text-left text-cyan-400" @click="handleShowMore(key)") {{ $t('TT0054') }}
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
import { computed, ref, watch } from 'vue'
import isEmpty from 'lodash/isEmpty'
import type {
  MaterialSpecificationInfo,
  MaterialSpecificationInfoBasicProperty,
} from '@/composables/material/useMaterial'
import type {
  MaterialColorInfo,
  MaterialPatternInfo,
} from '@frontier/platform-web-sdk'

const props = withDefaults(
  defineProps<{
    specificationInfo: MaterialSpecificationInfo
    colorInfo?: {
      name: string
      value: MaterialColorInfo
    }
    patternInfo?: {
      name: string
      value: MaterialPatternInfo
    }
    isListView?: boolean
  }>(),
  {
    isListView: false,
  }
)
const innerSpecificationInfo = ref(props.specificationInfo)
watch(
  () => props.specificationInfo,
  (val) => {
    innerSpecificationInfo.value = val
  }
)
const hasExtendedContent = (
  property: MaterialSpecificationInfoBasicProperty,
  propertyKey: string
) => {
  const seeMorePropertyList = [
    'materialType',
    'finishList',
    'contentList',
    'weight',
  ]
  const oneLineLengthIncludeTitle = 54
  return (
    property &&
    seeMorePropertyList.includes(propertyKey) &&
    (property.value + propertyKey).length >= oneLineLengthIncludeTitle
  )
}
const handleShowMore = (key: keyof MaterialSpecificationInfo) => {
  ;(
    innerSpecificationInfo.value[key] as MaterialSpecificationInfoBasicProperty
  ).showMore = true
  innerSpecificationInfo.value = { ...innerSpecificationInfo.value }
}
const innerSpecificationInfoComputed = computed(() => {
  const removeList = ['seasonInfo', 'featureList']
  return Object.keys(innerSpecificationInfo.value)
    .filter((key) => !removeList.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]:
          innerSpecificationInfo.value[key as keyof MaterialSpecificationInfo],
        showMore: false,
      }
    }, {}) as MaterialSpecificationInfo
})
</script>
