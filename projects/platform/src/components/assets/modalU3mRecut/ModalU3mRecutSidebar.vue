<template lang="pug">
div(
  class="flex flex-col bg-grey-950-v1 w-100 h-full p-6 gap-6 border-r border-secondary-border"
)
  u3m-recut-stepper(
    v-if="isDoubleSideMaterial"
    :faceSideUrl="faceSideUrl"
    :backSideUrl="backSideUrl"
    :isDoubleSideMaterial="isDoubleSideMaterial"
    :currentSideName="currentSide?.sideName"
  )
  div(class="flex flex-col gap-3")
    div(class="flex flex-row gap-3")
      action-button(
        :title="$t('EE0150')"
        iconName="crop"
        :active="currentSideCropMode === CROP_MODE.SQUARE"
        :onClick="onChangeCropMode(CROP_MODE.SQUARE)"
        :disabled="(rotateDeg ?? 0) !== 0"
      )
      action-button(
        :title="$t('EE0151')"
        iconName="crop_skew"
        :active="currentSideCropMode === CROP_MODE.PERSPECTIVE"
        :onClick="onChangeCropMode(CROP_MODE.PERSPECTIVE)"
      )
    Transition(name="find-pattern" mode="out-in")
      div(
        class="flex flex-row gap-3"
        v-if="refSideCropperArea?.refPerspectiveCanvas?.isChanging && isFindPatternButtonVisible"
      )
        action-button(
          :title="$t('EE0216')"
          iconName="crop_original"
          :onClick="onFindPattern"
          :disabled="(rotateDeg ?? 0) !== 0"
          :tooltipTitle="$t('EE0246')"
          :tooltipDesc="$t('EE0247')"
        )
        div(class="flex-1 p-2")
  div(class="border border-secondary-border transition-all duration-200 ease-in-out")
  div(class="flex flex-col gap-4 text-primary-inverse transition-all duration-200 ease-in-out")
    p(class="text-base font-bold") {{ $t('RR0122') }}
    div(class="flex flex-row gap-2")
      f-input-toggle(
        :value="isColorBalancing"
        @update:value="handleToggleColorBalancing"
      )
      p(class="text-sm text-primary-inverse") {{ $t('EE0240') }}
      f-tooltip(
        :title="$t('EE0240')"
        :desc="$t('EE0241')"
        :placement="TOOLTIP_PLACEMENT.TOP_START"
        data-theme="new"
        classContent="w-80"
        :offset="[2, 6]"
        class="self-center"
        interactive
        isDescHTML
      )
        template(#slot:tooltip-trigger)
          f-svg-icon(iconName="question" size="16" color="white" class="self-center")
    div(class="flex flex-row gap-2")
      f-input-toggle(:value="isQuilting" @update:value="handleToggleQuilting")
      p(class="text-sm text-primary-inverse") {{ $t('EE0234') }}
      f-tooltip(
        :title="$t('EE0234')"
        :desc="$t('EE0237')"
        :placement="TOOLTIP_PLACEMENT.TOP_START"
        data-theme="new"
        classContent="w-80"
        :offset="[2, 6]"
        :theme="'new'"
        class="self-center"
        interactive
        isDescHTML
      )
        template(#slot:tooltip-trigger)
          f-svg-icon(iconName="question" size="16" color="white" class="self-center")
        template(#slot:tooltip-content)
          div
            a(
              href="https://www.frontier.cool/a/docs/asset-library/creating-3d-materials#:~:text=%E2%9C%A8NEW%0ASolid%20Quiling%20Tool%3A"
              target="_blank"
            )
              button(class="text-sm font-semibold underline text-cyan-400-v1") {{ $t('EE0238') }}
    div(class="flex flex-row gap-2")
      f-input-toggle(
        :value="isShowModalReplaceSides"
        @update:value="emit('update:replaceSides', $event)"
      )
      p(class="text-sm text-primary-inverse") {{ $t(isBackSideOnly ? 'RR0478' : 'RR0477') }}
  div(class="border border-secondary-border")
  div(class="flex flex-col gap-3 text-primary-inverse")
    p(class="text-base font-bold") {{ $t('EE0215') }}
    div(class="grid grid-cols-2 gap-3")
      f-input-text(
        v-model:textValue="cropSizeWidth"
        size="md"
        inputType="number"
        :theme="THEME.DARK"
        addOnLeft="W"
        @update:textValue="refSideCropperArea?.refPerspectiveCanvas?.changeCropWidth"
        addOnRight="cm"
        :step="SIZE_STEP"
        :max="refSideCropperArea?.refPerspectiveCanvas?.imageWidthCm"
        :clearable="false"
      )
      f-input-text(
        v-model:textValue="cropSizeHeight"
        @update:textValue="refSideCropperArea?.refPerspectiveCanvas?.changeCropHeight"
        size="md"
        inputType="number"
        :theme="THEME.DARK"
        addOnLeft="H"
        addOnRight="cm"
        :step="SIZE_STEP"
        :max="refSideCropperArea?.refPerspectiveCanvas?.imageHeightCm"
        :clearable="false"
      )
  div(class="border border-secondary-border")
  div(class="flex flex-col gap-3 text-primary-inverse")
    div(class="flex justify-between")
      p(class="text-base font-bold") {{ $t('EE0049') }}
      button(
        @click="onResetRotation"
        class="text-sm font-semibold underline text-cyan-400-v1"
      )
        span {{ $t('RR0255') }}
    f-input-text(
      v-model:textValue="rotateDeg"
      size="md"
      inputType="number"
      :theme="THEME.DARK"
      :max="360"
      @update:textValue="refSideCropperArea?.changeRotateInSlider"
      addOnRight="°"
    )
    div(class="flex flex-row gap-3")
      action-button(
        :title="$t('EE0155', { degree: '90°' })"
        :onClick="onRotate(270)"
      )
      action-button(
        :title="$t('EE0156', { degree: '90°' })"
        :onClick="onRotate(90)"
      )
      action-button(title="180°" :onClick="onRotate(180)")
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import type { MaterialSide } from '@frontier/platform-web-sdk'
import { THEME, TOOLTIP_PLACEMENT } from '@frontier/constants'
import type { U3mSide } from '@/types'
import { CROP_MODE, U3M_CUT_SIDE } from '@/utils/constants'
import { toDP1 } from '@/utils/cropper'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import assetsApi from '@/apis/assets'
import U3mRecutStepper from '@/components/assets/modalU3mRecut/U3mRecutStepper.vue'
import type PerspectiveCropper from './perspectiveCropper/PerspectiveCropper.vue'
import { STATUS as NOTIF_STATUS } from './perspectiveCropper/NotifyBar.vue'
import ActionButton from './ActionButton.vue'

export interface TogglingCustomConfigParams {
  isQuilting: U3mSide['isQuilting']
  isColorBalancing: U3mSide['isColorBalancing']
}

interface Props {
  currentSide?: U3mSide
  materialSide: MaterialSide | null
  handleCropModeChange: (v: CROP_MODE) => Promise<void>
  togglingCustomConfig: (params: TogglingCustomConfigParams) => void
  refSideCropperArea: InstanceType<typeof PerspectiveCropper> | null
  isDoubleSideMaterial: boolean
  isShowModalReplaceSides?: boolean
  faceSideUrl?: string
  backSideUrl?: string
}

const SIZE_STEP = 0.1

const { t } = useI18n()
const isBackSideOnly = computed(
  () =>
    props.currentSide?.sideName === U3M_CUT_SIDE.BACK_SIDE &&
    !props.isDoubleSideMaterial
)

const emit = defineEmits<{
  (e: 'update:replaceSides', value: boolean): void
}>()

const props = defineProps<Props>()
const store = useStore()
const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)
const isQuilting = ref(false)
const isColorBalancing = ref(false)
const foundPatternCoords = ref<any>({})
const isFindPatternButtonVisible = ref(false)

const onResetRotation = () => {
  props.refSideCropperArea?.refPerspectiveCanvas?.resetRotation()
}

const onFindPattern = async () => {

  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })
  const coordsMap =
    props.refSideCropperArea?.refPerspectiveCanvas?.getCoordsMap()

  if (!coordsMap) {
    store.dispatch('helper/closeModalLoading')
    return
  }

  const { data } = await ogBaseAssetsApi(
    'getPatternFromSelectedAreaMaterialSide',
    {
      selectedArea: {
        leftBottom: coordsMap.leftBottom,
        leftTop: coordsMap.leftTop,
        rightBottom: coordsMap.rightBottom,
        rightTop: coordsMap.rightTop,
        rotateDeg: coordsMap.rotateDeg,
      },
      frontierNo: props.materialSide?.frontierNo ?? '',
    }
  )

  const { isFound, pattern } = data.result

  if (isFound) {
    foundPatternCoords.value = pattern
    props.refSideCropperArea?.refPerspectiveCanvas?.setCoordsMap(pattern)
    props.refSideCropperArea?.showToast({
      title: t('EE0248'),
      description: t('EE0249'),
      status: NOTIF_STATUS.SUCCESS,
    })
  } else {
    foundPatternCoords.value = coordsMap
    props.refSideCropperArea?.showToast({
      title: t('EE0250'),
      description: t('EE0251'),
      status: NOTIF_STATUS.FAILED,
    })
  }
  store.dispatch('helper/closeModalLoading')
  isFindPatternButtonVisible.value = false

}
const currentCoords = computed(() => {
  return props.refSideCropperArea?.refPerspectiveCanvas?.getCoordsMap()
})

function areRectanglesEqual(r1: any, r2: any) {
  const pointsEqual = (p1: any, p2: any) => {
    return p1?.x === p2?.x && p1?.y === p2?.y
  }
  return (
    pointsEqual(r1.leftTop, r2.leftTop) &&
    pointsEqual(r1.rightTop, r2.rightTop) &&
    pointsEqual(r1.leftBottom, r2.leftBottom) &&
    pointsEqual(r1.rightBottom, r2.rightBottom)
  )
}

watch(currentCoords, (newValue) => {
  if (
    foundPatternCoords.value &&
    !areRectanglesEqual(
      JSON.parse(JSON.stringify(newValue)),
      JSON.parse(JSON.stringify(foundPatternCoords.value))
    )
  ) {
    isFindPatternButtonVisible.value = true
  }
})

const generateCustomResult = (
  isQuilting: boolean,
  isColorBalancing: boolean
) => {
  const isGenerateCustomResult = isQuilting || isColorBalancing
  if (isGenerateCustomResult) {
    props.refSideCropperArea?.refPerspectiveCanvas?.generateCustomResult()
    return
  }

  const coordsMap =
    props.refSideCropperArea?.refPerspectiveCanvas?.getCoordsMap()

  if (!coordsMap) {
    return
  }
  props.refSideCropperArea?.refPerspectiveCanvas?.crop(
    false,
    !isGenerateCustomResult
  )
}

const handleToggleQuilting = () => {
  const value = !isQuilting.value
  isQuilting.value = value

  props.togglingCustomConfig({
    isColorBalancing: isColorBalancing.value,
    isQuilting: value,
  })

  generateCustomResult(value, isColorBalancing.value)
}

const handleToggleColorBalancing = () => {
  const value = !isColorBalancing.value
  isColorBalancing.value = value

  props.togglingCustomConfig({
    isColorBalancing: value,
    isQuilting: isQuilting.value,
  })

  generateCustomResult(isQuilting.value, value)
}

const onChangeCropMode = (cropMode: CROP_MODE) => () =>
  props.handleCropModeChange(cropMode)

const currentSideCropMode = computed(
  () => props.currentSide?.cropMode ?? CROP_MODE.SQUARE
)
const dimension = computed(() => props.refSideCropperArea?.destinationDimension)
const cropSizeWidth = computed(() =>
  dimension.value?.cm.width ? toDP1(dimension.value?.cm.width) : 0
)
const rotateDeg = computed(() => props.refSideCropperArea?.rotateDeg)

watch(rotateDeg, (currentRotateDeg) =>
  (currentRotateDeg ?? 0) > 0
    ? props.handleCropModeChange(CROP_MODE.PERSPECTIVE)
    : undefined
)

const cropSizeHeight = computed(() =>
  dimension.value?.cm.height ? toDP1(dimension.value?.cm.height) : 0
)

const onRotate = (deg: number) => () => {
  props.refSideCropperArea?.handleRotate(deg)
}
</script>

<style scoped>
.find-pattern-enter-active,
.find-pattern-leave-active {
  transition: all 200ms ease-in-out;
  overflow: hidden;
}

.find-pattern-enter-from,
.find-pattern-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
}

.find-pattern-enter-to,
.find-pattern-leave-from {
  opacity: 1;
  max-height: 70px;
}
</style>
