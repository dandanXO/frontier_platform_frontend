<template lang="pug">
div(class="grid gap-y-4.5")
  div(class="flex items-center gap-x-2")
    f-svg-icon(iconName="swatch_small" size="20" class="text-grey-900")
    p(class="text-body2 font-bold text-grey-900") {{ $t('RR0130') }}
  f-input-tap(
    v-if="sideOptionList.length > 1"
    :optionList="sideOptionList"
    :inputValue="currentSideType"
    @update:inputValue="$emit('switchSideType', $event)"
    class="pb-3"
  )
  f-infobar(
    v-if="isAutoSyncFaceToBackSideInfo && currentSideType === MATERIAL_SIDE_TYPE.BACK"
    :notifyType="NOTIFY_TYPE.TIPS"
    :messageText="'Same material information on the back and face.'"
  )
  div(v-else class="grid gap-y-1.5 w-full")
    div(
      v-if="specificationInfo.seasonInfo.value"
      class="text-body2/1.6"
      :class="[specificationInfo.seasonInfo.textColor, { 'bg-grey-50 px-3 py-2 rounded ': !specificationInfo.seasonInfo.isPublic }]"
    ) {{ specificationInfo.seasonInfo.value }}
    div(v-if="specificationInfo.featureList.value.length > 0")
      p(
        :class="[specificationInfo.featureList.textColor, { 'line-clamp-2': !hasExtendedContent }]"
        class="text-body2/1.6"
      ) {{ specificationInfo.featureList.value }}
      button(
        v-if="!hasExtendedContent"
        class="text-caption text-cyan-400 pt-2"
        @click="hasExtendedContent = true"
      ) Show More
    block-specification(:specificationInfo="specificationInfo")
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import { NOTIFY_TYPE } from '@/utils/constants'
import type {
  MaterialSpecificationInfo,
  SideOption,
} from '@/composables/material/useMaterial'
import BlockSpecification from '@/components/common/material/detail/internal/BlockSpecification.vue'

const props = defineProps<{
  isAutoSyncFaceToBackSideInfo: boolean
  currentSideType: MATERIAL_SIDE_TYPE
  specificationInfo: MaterialSpecificationInfo
  sideOptionList: SideOption[]
}>()

defineEmits<{
  (e: 'switchSideType', sideType: MATERIAL_SIDE_TYPE): void
}>()

const canExtendContent = (text: string, numberOfLine: number) => {
  const p = document.createElement('p')
  p.innerText = text
  p.style.maxWidth = '380px'
  p.style.fontSize = '14px'
  p.style.lineHeight = '1.6'
  document.body.appendChild(p)
  const isEllipsis =
    Number(p.getBoundingClientRect().height / 22.4) > numberOfLine

  document.body.removeChild(p)
  return isEllipsis
}
const hasExtendedContent = ref(false)

onMounted(() => {
  hasExtendedContent.value = !canExtendContent(
    props.specificationInfo.featureList.value,
    2
  )
})
</script>
