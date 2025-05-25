<template lang="pug">
div(class="!gap-5")
  f-alert(
    v-if="missingImportantSpecs"
    :type="ALERT_TYPE.CRITICAL"
    :title="$t('RR0559')"
    :desc="$t('RR0560')"
  )
  div(class="grid gap-y-5 w-full px-8")
    div(v-for="spec in filteredCommonSpecs" class="flex w-full gap-4" :key="spec.key")
      p(class="text-base break-words font-bold w-50 text-secondary-text") {{ spec.name }}
      expandable-text(
        containerClass="text-sm break-words cursor-text"
        :class="[spec.value ? 'text-primary-inverse' : 'text-disabled', 'flex-1']"
      ) {{ spec.value || $t('RR0561') }}
  div(class="p-3 flex flex-col rounded-lg border border-primary-border gap-2")
    f-tabs(
      :tabList="tabList"
      keyField="id"
      :type="TAB_TYPE.CONTROL"
      @switch="switchSideType($event.id)"
      tabItemContainerStyle="flex-1"
      tabListContainerStyle=""
      class="bg-secondary rounded-lg"
    )
    div(class="flex flex-col bg-brand rounded-lg")
      div(
        class="flex flex-col gap-4 p-5"
        v-if="withSideSpecs"
        :class="{ 'border-b border-brand-border': !missingImportantSpecs }"
      )
        div(v-for="spec in filteredSideSpecs" class="flex w-full gap-4" :key="spec.key")
          p(class="text-base break-words font-bold w-50 text-secondary-text") {{ spec.name }}

          expandable-text(
            containerClass="text-sm break-words"
            :class="[spec.value ? 'text-primary-inverse' : 'text-disabled', 'flex-1']"
          ) {{ spec.value || $t('RR0561') }}
      div(
        class="hover:bg-secondary-hover bg-secondary cursor-pointer rounded-b-lg"
        @click="onShowMore"
        v-if="!missingImportantSpecs"
      )
        div(class="py-2 px-5 justify-end flex")
          f-button(type="text" size="md" class="underline font-semibold")
            p {{ isShowMore ? $t('EE0245') : $t('EE0244') }}
            f-svg-icon(
              size="24"
              :iconName="isShowMore ? 'arrow_drop_up' : 'arrow_drop_down'"
            )
        div(
          class="px-5 transition-height"
          ref="extraContentWrapper"
          :style="{ height: wrapperHeight }"
        )
          div(class="py-5 flex flex-col gap-4")
            div(
              v-for="spec in filteredMoreSpecs"
              class="flex w-full gap-4"
              :key="spec.key"
            )
              div(class="w-50 flex flex-row gap-2 items-center")
                p(
                  class="text-base break-words font-bold text-secondary-text cursor-text"
                ) {{ spec.name }}
                f-tooltip(
                  v-if="spec.infoText"
                  theme="new-dark"
                  :placement="TOOLTIP_PLACEMENT.TOP"
                  :offset="[0, 12]"
                  :desc="spec.infoText"
                )
                  template(#slot:tooltip-trigger)
                    f-svg-icon(
                      iconName="info"
                      size="24"
                      class="text-info-solid p-0.5 self-center"
                      data-theme="new"
                    )

              expandable-text(
                containerClass="text-sm break-words text-primary-inverse  cursor-text"
                class="flex-1"
              ) {{ spec.value || $t('RR0561') }}
          div(v-if="showColorPatternData" class="flex w-full gap-4 pb-3")
            div(class="w-50 flex flex-row gap-2 items-center")
              p(class="text-base break-words font-bold text-secondary-text cursor-text") {{ $t('RR0309') }}
            material-detail-color-and-pattern(
              :pantoneList="pantoneList ?? undefined"
              :colorInfo="colorInfo ?? undefined"
              :patternInfo="patternInfo ?? undefined"
              class="flex-1"
            )
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  type MaterialSide,
  type MaterialWovenConstruction,
  type Material,
} from '@frontier/platform-web-sdk'
import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import { TYPE as ALERT_TYPE } from '@frontier/ui-component/src/FNotify/FAlert/FAlert.vue'
import { MATERIAL_SIDE_TYPE, TOOLTIP_PLACEMENT } from '@/utils/constants'
import useMaterial from '@/composables/material/useMaterial'
import useUser from '@/composables/useUser'
import ExpandableText from './ExpandableText.vue'
import MaterialDetailColorAndPattern from './internal/MaterialDetailColorAndPattern.vue'

interface Spec {
  key: string
  name?: string
  value?: string | null
  isRequired?: boolean
  infoText?: string
}

const props = defineProps<{
  material: Material
}>()

const {
  switchSideType,
  specificationInfo,
  currentSide,
  currentSideType,
  pantoneList,
  patternInfo,
  colorInfo,
} = useMaterial(ref(props.material))
const { isInternalUser } = useUser()

const isShowMore = ref(false)
const wrapperHeight = ref('0px')
const extraContentWrapper = ref<HTMLElement | null>(null)

watch(isShowMore, (isExpand) => {
  if (extraContentWrapper.value) {
    // Ensure starting height
    const fullHeight = extraContentWrapper.value.scrollHeight
    wrapperHeight.value = `${fullHeight}px`

    /**
     * if expand, Match the timeout value with CSS transation (0.5s = 500)
     * if colapsed, set timeout to 0, so the CSS animation can run
     */
    const timeout = isExpand ? 500 : 0
    setTimeout(() => {
      wrapperHeight.value = isExpand ? 'auto' : '0px'
    }, timeout)
  }
})

const onShowMore = () => {
  isShowMore.value = !isShowMore.value
}

const tabList = computed(() => {
  const list = [
    {
      id: MATERIAL_SIDE_TYPE.FACE,
      name: t('EE0231'),
    },
    {
      id: MATERIAL_SIDE_TYPE.MIDDLE,
      name: t('EE0243'),
    },
    {
      id: MATERIAL_SIDE_TYPE.BACK,
      name: t('EE0232'),
    },
  ]
  return list
})

const showColorPatternData = computed(
  () =>
    currentSideType.value !== MATERIAL_SIDE_TYPE.MIDDLE &&
    !(
      currentSideType.value === MATERIAL_SIDE_TYPE.BACK &&
      props.material.isAutoSyncFaceToBackSideInfo
    ) &&
    isInternalUser
)

const { t } = useI18n()

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
    specificationInfo.value.featureList.value,
    2
  )
})

const withImportantSpec = computed(() => {
  if ((currentSide.value as MaterialSide)?.isMainSide) {
    return true
  }

  return !!(
    props.material.isDoubleSide &&
    currentSideType.value !== MATERIAL_SIDE_TYPE.MIDDLE
  )
})

const commonSpecs = computed<Spec[]>(() => [
  {
    key: 'width',
    name: specificationInfo.value.width?.name,
    value: specificationInfo.value.width?.value,
    isRequired: withImportantSpec.value,
  },
  {
    key: 'weight',
    name: specificationInfo.value.weight?.name,
    value: specificationInfo.value.weight?.value,
    isRequired: withImportantSpec.value,
  },
  {
    key: 'season',
    name: specificationInfo.value.seasonInfo?.name,
    value: specificationInfo.value.seasonInfo?.value,
  },
  {
    key: 'remark',
    name: t('RR0029'),
    value: props.material.internalInfo?.remark,
  },
  // add more specs here as needed
])

const filteredCommonSpecs = computed(() =>
  commonSpecs.value.filter((spec) => spec.value || spec.isRequired)
)

const missingImportantSpecs = computed(
  () =>
    withImportantSpec.value &&
    !!(
      filteredCommonSpecs.value.find(
        (spec) => !spec.value && spec.isRequired
      ) ||
      filteredSideSpecs.value.find((spec) => !spec.value && spec.isRequired)
    )
)

const sideSpecs = computed<Spec[]>(() => [
  {
    key: 'material_type',
    name: specificationInfo.value.materialType?.name,
    value: specificationInfo.value.materialType?.value,
    isRequired: withImportantSpec.value,
  },
  {
    key: 'construction_type',
    name: specificationInfo.value.constructionTypeOnly?.name,
    value: specificationInfo.value.constructionTypeOnly?.value,
    isRequired: withImportantSpec.value,
  },
  {
    key: 'content_list',
    name: specificationInfo.value.contentList?.name,
    value: specificationInfo.value.contentList?.value,
    isRequired: withImportantSpec.value,
  },
  // add more specs here as needed
])

const filteredSideSpecs = computed(() =>
  sideSpecs.value.filter((spec) => spec.value || spec.isRequired)
)

const withSideSpecs = computed(() => !!filteredSideSpecs.value.length)

const densityText = computed(() => {
  const warpData = (
    (currentSide.value as MaterialSide)
      ?.construction as MaterialWovenConstruction
  )?.warpDensity

  const weftData = (
    (currentSide.value as MaterialSide)
      ?.construction as MaterialWovenConstruction
  )?.weftDensity

  if (!weftData || !warpData) {
    return
  }

  return [warpData, weftData].join(' X ')
})

const yarnSizeText = computed(() => {
  const warpData = (
    (currentSide.value as MaterialSide)
      ?.construction as MaterialWovenConstruction
  )?.warpYarnSize
  const weftData = (
    (currentSide.value as MaterialSide)
      ?.construction as MaterialWovenConstruction
  )?.weftYarnSize

  if (!weftData || !warpData) {
    return
  }

  return [warpData, weftData].join(' X ')
})

const moreSpecs = computed<Spec[]>(() => [
  {
    key: 'frontierNo',
    name: t('RR0084'),
    value: currentSide.value?.frontierNo,
  },
  {
    key: 'description_list',
    name: t('MI0023'),
    value: (currentSide.value as MaterialSide)?.descriptionList
      ?.map(({ name }) => name)
      .join(', '),
    infoText: t('RR0568'),
  },
  {
    key: 'density',
    name: t('RR0024'),
    value: densityText.value,
  },
  {
    key: 'yarnSize',
    name: t('RR0023'),
    value: yarnSizeText.value,
  },
  {
    key: 'finishList',
    name: t('RR0022'),
    value: (currentSide.value as MaterialSide)?.finishList
      ?.map(({ name }) => name)
      .join(', '),
  },
  // add more specs here as needed
])

const filteredMoreSpecs = computed(() =>
  moreSpecs.value.filter((spec) => spec.value || spec.isRequired)
)
</script>

<style scoped>
.transition-height {
  transition: height 0.5s ease-in-out;
  overflow: hidden;
}
</style>
