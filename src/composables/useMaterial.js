// import { useI18n } from 'vue-i18n'
import { COVER_MODE, SIDE_TYPE, WEIGHT_UNIT } from '@/utils/constants.js'
// import { computed } from '@vue/runtime-core'
import { ref } from 'vue'

export default function useMaterial (material) {
  // const { t } = useI18n()
  const { isDoubleSideMaterial, sideType, coverMode, faceSideImg, backSideImg, coverImg, weightUnit, weightOz, weightGsm, weightGy } = material

  const scanFaceSide = !!faceSideImg?.crop
  const scanBackSide = !!backSideImg?.crop

  const currentCoverImg = ref(require('@/assets/images/default_material.png'))
  const neverScanBefore = ref(true)
  const statusIconName = ref('front')
  const materialWeight = ref('')

  if (coverMode === COVER_MODE.FACE && scanFaceSide) {
    currentCoverImg.value = faceSideImg.crop
    neverScanBefore.value = false
  } else if (coverMode === COVER_MODE.BACK && scanFaceSide) {
    currentCoverImg.value = backSideImg.crop
    neverScanBefore.value = false
  } else if (coverMode === COVER_MODE.SUP) {
    currentCoverImg.value = coverImg
    neverScanBefore.value = false
  }

  if (isDoubleSideMaterial) {
    if (scanFaceSide && scanBackSide) statusIconName.value = 'double'
    else if (scanFaceSide && !scanBackSide) statusIconName.value = 'double-front'
    else if (!scanFaceSide && scanBackSide) statusIconName.value = 'double-back'
    else if (!scanFaceSide && !scanBackSide) statusIconName.value = 'no-image-double'
  } else {
    if (sideType === SIDE_TYPE.FACE) statusIconName.value = scanFaceSide ? 'front' : 'no-image-front'
    else if (sideType === SIDE_TYPE.BACK) statusIconName.value = scanBackSide ? 'back' : 'no-image-back'
  }

  if (weightUnit === WEIGHT_UNIT.GSM) {
    materialWeight.value = `${weightGsm} g/m^2(${weightOz} oz/y^2)`
  } else if (weightUnit === WEIGHT_UNIT.OZ) {
    materialWeight.value = `${weightOz} oz/y^2(${weightGsm} g/m^2)`
  }

  if (weightGy) {
    materialWeight.value += `(${weightGy} g/y)`
  }

  return {
    currentCoverImg,
    neverScanBefore,
    statusIconName,
    materialWeight
  }
}
