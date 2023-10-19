<template lang="pug">
div(class="grid gap-y-1.5 w-full")
  template(v-for="(property, key) in innerSpecificationInfo" :key="key")
    template(v-if="key === 'construction'")
      div(
        v-if="specificationInfo['construction'] && specificationInfo['construction'].value"
        class="w-full grid gap-y-1.5"
        :class="[specificationInfo['construction'].textColor, { 'bg-grey-50 px-3 py-2 rounded': !specificationInfo['construction'].isPublic }]"
      )
        div(
          v-for="(constructionProperty, constructionKey) in specificationInfo['construction'].value"
          :key="constructionKey"
          class="flex"
        )
          template(v-if="constructionProperty")
            p(class="text-body2/1.6 break-words") {{ constructionProperty.name }}：
            p(class="text-body2/1.6 break-words") {{ constructionProperty.value }}
    template(v-else-if="key === 'constructionCustomPropertyList'")
      div(
        v-if="specificationInfo['constructionCustomPropertyList'] && specificationInfo['constructionCustomPropertyList'].value.length > 0"
        class="w-full grid gap-y-1.5"
      )
        div(
          v-for="constructionProperty in specificationInfo['constructionCustomPropertyList'].value"
          :key="constructionProperty.customId"
          class="flex"
          :class="[specificationInfo['constructionCustomPropertyList'].textColor, { 'bg-grey-50 px-3 py-2 rounded': !constructionProperty.isPublic }]"
        )
          template(v-if="constructionProperty")
            p(class="text-body2/1.6 break-words") {{ constructionProperty.name }}：
            p(class="text-body2/1.6 break-words") {{ constructionProperty.value }}
    div(v-else-if="property" class="flex w-full" :class="property.textColor")
      p(class="text-body2/1.6 break-words") {{ property.name }}：
      p(class="text-body2/1.6 break-words") {{ property.value }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MaterialSpecificationInfo } from '@/composables/material/useMaterial'

const props = withDefaults(
  defineProps<{
    specificationInfo: MaterialSpecificationInfo
    isListView: boolean
  }>(),
  {
    isListView: false,
  }
)

const innerSpecificationInfo = computed(() => {
  const removeList = ['seasonInfo', 'featureList']
  if (props.isListView) {
    removeList.push('constructionCustomPropertyList')
  }

  return Object.keys(props.specificationInfo)
    .filter((key) => !removeList.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: props.specificationInfo[key as keyof MaterialSpecificationInfo],
      }
    }, {}) as MaterialSpecificationInfo
})
</script>
