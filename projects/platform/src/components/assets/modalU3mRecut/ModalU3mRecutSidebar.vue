<template lang="pug">
div(
  class="flex flex-col bg-primary w-100 h-full p-6 gap-6 border-r border-secondary-border"
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
    div(class="flex flex-row gap-3")
      action-button(
        :title="$t('EE0216')"
        iconName="crop_original"
        :onClick="onFindPattern"
        :disabled="!refSideCropperArea?.refPerspectiveCanvas?.isChanging || (rotateDeg ?? 0) !== 0"
        :tooltipTitle="$t('EE0235')"
        :tooltipDesc="$t('EE0236')"
      )
      div(class="flex-1 p-2")
  div(class="border border-secondary-border")
  div(class="flex flex-col gap-4 text-primary-inverse")
    p(class="text-base font-bold") {{ $t('RR0122') }}
    div(class="flex flex-row gap-2")
      f-input-toggle(:value="isQuilting" @update:value="handletoggleQuilting")
      p(class="text-sm text-primary-inverse") {{ $t('EE0234') }}
      f-tooltip(
        :title="$t('EE0234')"
        :desc="$t('EE0237')"
        :placement="TOOLTIP_PLACEMENT.RIGHT"
        data-theme="new"
        classContent="w-80"
        :offset="[-6, 0]"
        class="self-center"
        interactive
        isDescHTML
      )
        template(#slot:tooltip-trigger)
          f-svg-icon(iconName="question" size="16" color="white" class="self-center")
        template(#slot:tooltip-content)
          div(class="underline decoration-link hover:decoration-link-hover")
            f-button(type="text" postpendIcon="arrow_circle_right") {{ $t('EE0238') }}
    div(class="flex flex-row gap-2")
      f-input-toggle(
        :value="isShowModalReplaceSides"
        @update:value="emit('update:replaceSides', $event)"
      )
      p(class="text-sm text-primary-inverse") {{ $t(isBackSideOnly ? 'RR0478' : 'RR0477') }}
  div(class="border border-secondary-border")
  div(class="flex flex-col gap-3 text-primary-inverse")
    p(class="text-base font-bold") {{ $t('EE0215') }}
    div(class="flex flex-row gap-3")
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
    p(class="text-base font-bold") {{ $t('EE0049') }}
    f-input-text(
      v-model:textValue="rotateDeg"
      size="md"
      inputType="number"
      :theme="THEME.DARK"
      :max="360"
      @update:textValue="refSideCropperArea?.chagneRotateInSlider"
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

interface Props {
  currentSide?: U3mSide
  materialSide: MaterialSide | null
  handleCropModeChange: (v: CROP_MODE) => Promise<void>
  togglingQuilting: (v: U3mSide['isQuilting']) => void
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

  isFound &&
    props.refSideCropperArea?.refPerspectiveCanvas?.setCoordsMap(pattern)

  store.dispatch('helper/closeModalLoading')
  !isFound &&
    props.refSideCropperArea?.showToast({
      description: t('WW0186'),
      status: NOTIF_STATUS.FAILED,
    })
}

const handletoggleQuilting = () => {
  const value = !isQuilting.value
  isQuilting.value = value

  props.togglingQuilting(value)
  if (value) {
    props.refSideCropperArea?.refPerspectiveCanvas?.quilting()
    return
  }

  const coordsMap =
    props.refSideCropperArea?.refPerspectiveCanvas?.getCoordsMap()

  if (!coordsMap) {
    return
  }
  props.refSideCropperArea?.refPerspectiveCanvas?.crop()
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
