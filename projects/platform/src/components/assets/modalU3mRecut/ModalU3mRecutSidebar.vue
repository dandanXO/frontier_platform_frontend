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
      )
      action-button(
        :title="$t('EE0151')"
        iconName="crop_skew"
        :active="currentSideCropMode === CROP_MODE.PERSPECTIVE"
        :onClick="onChangeCropMode(CROP_MODE.PERSPECTIVE)"
      )
    div(class="flex flex-row gap-3")
      action-button(:title="$t('EE0216')" iconName="crop_original" disabled)
      action-button(:title="$t('EE0217')" iconName="quilting" disabled)
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
        @update:textValue="sideCropperArea?.refPerspectiveCanvas?.changeCropWidth"
        addOnRight="cm"
        :clearable="false"
      )
      f-input-text(
        v-model:textValue="cropSizeHeight"
        @update:textValue="sideCropperArea?.refPerspectiveCanvas?.changeCropHeight"
        size="md"
        inputType="number"
        :theme="THEME.DARK"
        addOnLeft="H"
        addOnRight="cm"
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
      @update:textValue="sideCropperArea?.chagneRotateInSlider"
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
  div(class="border border-secondary-border")
  div(class="flex flex-col gap-3 text-primary-inverse")
    p(class="text-base font-bold") {{ $t('EE0218') }}

    input-grid-color(
      :labelColor="sideCropperArea?.gridColor"
      @update:labelColor="sideCropperArea?.handleGridColorChange"
    )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ActionButton from './ActionButton.vue'
import { THEME } from '@frontier/constants'
import InputGridColor from './perspectiveCropper/InputGridColor.vue'
import U3mRecutStepper from '@/components/assets/modalU3mRecut/U3mRecutStepper.vue'
import type { U3mSide } from '@/types'
import { CROP_MODE, U3M_CUT_SIDE } from '@/utils/constants'
import type PerspectiveCropper from './perspectiveCropper/PerspectiveCropper.vue'
import { toDP1 } from '@/utils/cropper'

interface Props {
  currentSide?: U3mSide
  handleCropModeChange: (v: CROP_MODE) => Promise<void>
  refFaceSideCropArea: InstanceType<typeof PerspectiveCropper> | null
  refBackSideCropArea: InstanceType<typeof PerspectiveCropper> | null
  isDoubleSideMaterial: boolean
  faceSideUrl?: string
  backSideUrl?: string
}

const props = defineProps<Props>()

const sideCropperArea = computed(() =>
  props.currentSide?.sideName === U3M_CUT_SIDE.FACE_SIDE
    ? props.refFaceSideCropArea
    : props.refBackSideCropArea
)

const onChangeCropMode = (cropMode: CROP_MODE) => () =>
  props.handleCropModeChange(cropMode)

const currentSideCropMode = computed(
  () => props.currentSide?.cropMode ?? CROP_MODE.SQUARE
)
const dimension = computed(() => sideCropperArea.value?.destinationDimension)
const cropSizeWidth = computed(() =>
  dimension.value?.cm.width ? toDP1(dimension.value?.cm.width) : 0
)
const rotateDeg = computed(() => sideCropperArea.value?.rotateDeg)

const cropSizeHeight = computed(() =>
  dimension.value?.cm.height ? toDP1(dimension.value?.cm.height) : 0
)

const onRotate = (deg: number) => () => {
  if (!sideCropperArea.value) {
    return
  }

  sideCropperArea.value.handleRotate(deg)
}
</script>
