<template lang="pug">
div(class="!gap-5")
  f-alert(
    v-if="missingImportantSpecs"
    :type="ALERT_TYPE.CRITICAL"
    :title="$t('RR0559')"
    :desc="$t('RR0560')"
  )
  div(class="grid w-full px-8 gap-y-5")
    div(v-for="spec in filteredCommonSpecs" class="flex w-full gap-4" :key="spec.key")
      p(
        class="text-base font-bold break-words w-50"
        :class="[missingImportantSpecs && !spec.value && spec.isRequired ? 'text-red-500-v1' : 'text-secondary-text']"
      ) {{ spec.name }}
      expandable-text(
        containerClass="text-sm break-words cursor-text"
        :class="[spec.value ? 'text-primary-inverse' : 'text-disabled', 'flex-1']"
        :version="VERSION.V2"
      ) {{ spec.value || $t('RR0561') }}
  div(class="flex flex-col gap-2 p-3 border rounded-lg border-primary-border")
    f-tabs(
      :tabList="filteredTabList"
      keyField="id"
      :type="TAB_TYPE.CONTROL"
      @switch="switchSideType($event.id)"
      tabItemContainerStyle="flex-1"
      tabListContainerStyle=""
      class="rounded-lg bg-secondary"
    )
    div(class="flex flex-col rounded-lg bg-brand")
      div(
        class="flex flex-col gap-4 p-5"
        v-if="withSideSpecs"
        :class="{ 'border-b border-brand-border': showShowMoreData }"
      )
        div(v-for="spec in filteredSideSpecs" class="flex w-full gap-4" :key="spec.key")
          p(
            class="text-base font-bold break-words w-50"
            :class="[missingImportantSpecs && !spec.value && spec.isRequired ? 'text-red-500-v1' : 'text-secondary-text']"
          ) {{ spec.name }}

          expandable-text(
            containerClass="text-sm break-words"
            :class="[spec.value ? 'text-primary-inverse' : 'text-disabled', 'flex-1']"
          ) {{ spec.value || $t('RR0561') }}
      div(
        class="rounded-b-lg cursor-pointer hover:bg-secondary-hover bg-secondary"
        @click="onShowMore"
        v-if="showShowMoreData"
      )
        div(class="flex justify-end px-5 py-2")
          f-button(type="text" size="md" class="font-semibold underline" version="v2")
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
          div(class="flex flex-col gap-4 py-5")
            div(
              v-for="spec in filteredMoreSpecs"
              class="flex w-full gap-4"
              :key="spec.key"
            )
              div(class="flex flex-row items-center gap-2 w-50")
                p(
                  class="text-base font-bold break-words text-secondary-text cursor-text"
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
                containerClass="text-sm break-words text-primary-inverse cursor-text"
                class="flex-1"
              ) {{ spec.value || $t('RR0561') }}
          div(v-if="showColorPatternData" class="flex w-full gap-4 pb-3")
            div(class="flex flex-row items-center gap-2 w-50")
              p(class="text-base font-bold break-words text-secondary-text cursor-text") {{ $t('RR0556') }}
            material-detail-color-and-pattern(
              :pantoneList="pantoneList ?? undefined"
              :colorInfo="colorInfo?.value ? { ...colorInfo, value: colorInfo.value } : undefined"
              :patternInfo="patternInfo?.value ? { ...patternInfo, value: patternInfo.value } : undefined"
              class="flex-1"
            )
          div(v-if="!showColorPatternData" class="flex w-full gap-4 pb-3")
            div(class="flex flex-row items-center gap-2 w-50")
              p(class="text-base font-bold break-words text-secondary-text cursor-text") {{ $t('RR0556') }}
            div ---
  custom-fields-section(
    v-if="(props.material?.customFieldList?.specificationList?.length ?? 0) > 0"
    :customFields="customFieldList.specificationList"
    :materialCustomFields="props.material.customFieldList?.specificationList"
  )
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import type {
  MaterialSide,
  MaterialWovenConstruction,
  Material,
} from '@frontier/platform-web-sdk'
import { MaterialType } from '@frontier/platform-web-sdk'
import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import { TYPE as ALERT_TYPE } from '@frontier/ui-component/src/FNotify/FAlert/FAlert.vue'
import { useCustomFieldStore } from '@/stores/customField'
import {
  MATERIAL_SIDE_TYPE,
  TOOLTIP_PLACEMENT,
  VERSION,
} from '@/utils/constants'
import useMaterial from '@/composables/material/useMaterial'
import useUser from '@/composables/useUser'
import ExpandableText from './ExpandableText.vue'
import MaterialDetailColorAndPattern from './internal/MaterialDetailColorAndPattern.vue'
import CustomFieldsSection from './CustomFieldsSection.vue'
import isEmpty from 'lodash/isEmpty'

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

const customFieldStore = useCustomFieldStore()
const { customFieldList } = storeToRefs(customFieldStore)
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
      icon: '',
    },
    {
      id: MATERIAL_SIDE_TYPE.MIDDLE,
      name: t('EE0243'),
      icon: '',
    },
    {
      id: MATERIAL_SIDE_TYPE.BACK,
      name: t('EE0232'),
      icon: '',
    },
  ]
  return list
})

const filteredTabList = computed(() => {
  const mapping = {
    [MATERIAL_SIDE_TYPE.FACE]: 'faceSide',
    [MATERIAL_SIDE_TYPE.MIDDLE]: 'middleSide',
    [MATERIAL_SIDE_TYPE.BACK]: 'backSide',
  }

  return tabList.value.filter(
    (tab) => (props.material as any)?.[mapping[tab.id]] !== null
  )
})

const showColorPatternData = computed(
  () =>
    currentSideType.value !== MATERIAL_SIDE_TYPE.MIDDLE &&
    !(
      currentSideType.value === MATERIAL_SIDE_TYPE.BACK &&
      props.material.isAutoSyncFaceToBackSideInfo
    ) &&
    isInternalUser &&
    ((pantoneList.value?.length ?? 0) > 0 ||
      colorInfo.value?.value?.color ||
      (colorInfo.value?.value?.customPropertyList?.length ?? 0) > 0 ||
      patternInfo.value?.value?.pattern ||
      (patternInfo.value?.value?.customPropertyList?.length ?? 0) > 0)
)

const showShowMoreData = computed(() => {
  return (
    filteredMoreSpecs.value
      .map((spec) => spec.value)
      .some((value) => !!value) || showColorPatternData.value
  )
})

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
    specificationInfo.value?.featureList.value,
    2
  )
})

const withImportantSpec = computed(() => {
  if ((currentSide.value as MaterialSide)?.isMainSide) {
    if(currentSide.value?.materialType === MaterialType.WOVEN || currentSide.value?.materialType === MaterialType.KNIT){
      return true
    } else {
      return false
    }
  }

  return !!(
    props.material.isDoubleSide &&
    currentSideType.value !== MATERIAL_SIDE_TYPE.MIDDLE
  )
})

const commonSpecs = computed<Spec[]>(() => {
  const normal = [
    {
      key: 'width',
      name: specificationInfo.value?.width?.name,
      value: specificationInfo.value?.width?.value,
      isRequired: withImportantSpec.value,
    },
    {
      key: 'weight',
      name: specificationInfo.value?.weight?.name,
      value: specificationInfo.value?.weight?.value,
      isRequired: withImportantSpec.value,
    },
    {
      key: 'season',
      name: specificationInfo.value?.seasonInfo?.name,
      value: specificationInfo.value?.seasonInfo?.value,
    },
    {
      key: 'remark',
      name: t('RR0029'),
      value: props.material.internalInfo?.remark,
    },
    // add more specs here as needed
  ]
  return normal
})

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
    name: specificationInfo.value?.materialType?.name,
    value: specificationInfo.value?.materialType?.value,
    isRequired: withImportantSpec.value,
  },
  {
    key: 'construction_type',
    name: specificationInfo.value?.constructionTypeOnly?.name,
    value: specificationInfo.value?.constructionTypeOnly?.value,
    isRequired: withImportantSpec.value,
  },
  {
    key: 'content_list',
    name: specificationInfo.value?.contentList?.name,
    value: specificationInfo.value?.contentList?.value,
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

const moreSpecs = computed<Spec[]>(() => {
  const displayOption = [
    {
      key: 'frontierNo',
      name: t('RR0084'),
      value: currentSide.value?.frontierNo,
      isRequired: true,
    },
    {
      key: 'description_list',
      name: t('MI0023'),
      value: (currentSide.value as MaterialSide)?.descriptionList
        ?.map(({ name }) => name)
        .join(', '),
      infoText: t('RR0568'),
      isRequired: false,
    },
    {
      key: 'density',
      name: t('RR0024'),
      value: densityText.value,
      isRequired: false,
    },
    {
      key: 'yarnSize',
      name: t('RR0023'),
      value: yarnSizeText.value,
      isRequired: false,
    },
    // add more specs here as needed
  ]
  if (currentSide.value?.materialType === MaterialType.KNIT) {
    displayOption.push(
      {
        key: 'machine_type',
        name: t('MI0031'),
        value: specificationInfo.value?.construction?.value?.machineType.value,
        isRequired: true,
      },
      {
        key: 'walesPerInch',
        name: t('MI0032'),
        value: specificationInfo.value?.construction?.value?.walesPerInch.value,
        isRequired: true,
      },
      {
        key: 'Yarn_Size',
        name: t('RR0023'),
        value: specificationInfo.value?.construction?.value?.yarnSize.value,
        isRequired: true,
      },
      {
        key: 'Machine_Gauge',
        name: t('MI0068'),
        value:
          specificationInfo.value?.construction?.value?.machineGaugeInGg.value,
        isRequired: true,
      }
    )
  }
  if (currentSide.value?.materialType === MaterialType.LEATHER) {
    displayOption.push(
      {
        key: 'averageSkinPerMeterSquare',
        name: t('MI0071'),
        value:
          specificationInfo.value?.construction?.value
            ?.averageSkinPerMeterSquare.value,
        isRequired: true,
      },
      {
        key: 'grade',
        name: t('MI0072'),
        value: specificationInfo.value?.construction?.value?.grade.value,
        isRequired: true,
      },
      {
        key: 'tannage',
        name: t('MI0073'),
        value: specificationInfo.value?.construction?.value?.tannage.value,
        isRequired: true,
      },
      {
        key: 'thicknessPerMm',
        name: t('MI0074'),
        value:
          specificationInfo.value?.construction?.value?.thicknessPerMm.value,
        isRequired: true,
      }
    )
  }
  if (currentSide.value?.materialType === MaterialType.NON_WOVEN) {
    displayOption.push(
      {
        key: 'bondingMethod',
        name: t('MI0078'),
        value:
          specificationInfo.value?.construction?.value?.bondingMethod.value,
        isRequired: true,
      },
      {
        key: 'Thickness',
        name: t('MI0074'),
        value:
          specificationInfo.value?.construction?.value?.thicknessPerMm.value,
        isRequired: true,
      }
    )
  }
  if (currentSide.value?.materialType === MaterialType.TRIM) {
    displayOption.push(
      {
        key: 'trim_outer_diameter',
        name: t('MI0079'),
        value:
          specificationInfo.value?.construction?.value?.outerDiameter.value,
        isRequired: true,
      },
      {
        key: 'trim_length',
        name: t('MI0080'),
        value: specificationInfo.value?.construction?.value?.length.value,
        isRequired: true,
      },
      {
        key: 'trim_thickness',
        name: t('MI0081'),
        value: specificationInfo.value?.construction?.value?.thickness.value,
        isRequired: true,
      },
      {
        key: 'trim_width',
        name: t('MI0082'),
        value: specificationInfo.value?.construction?.value?.width.value,
        isRequired: true,
      }
    )
  }
  displayOption.push({
    key: 'finishList',
    name: t('RR0022'),
    value: (currentSide.value as MaterialSide)?.finishList
      ?.map(({ name }) => name)
      .join(', '),
    isRequired: true,
  })
  return displayOption
})

const filteredMoreSpecs = computed(() => {
  return moreSpecs.value.filter((spec) => spec.value || spec.isRequired)
})
</script>

<style scoped>
.transition-height {
  transition: height 0.5s ease-in-out;
  overflow: hidden;
}
</style>
