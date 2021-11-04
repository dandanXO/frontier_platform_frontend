import { COVER_MODE, SIDE_TYPE, WEIGHT_UNIT } from '@/utils/constants.js'
import { computed } from '@vue/runtime-core'
import { ref } from 'vue'

export default function useMaterial (material) {
  const { isDoubleSideMaterial, sideType, coverMode, faceSideImg, backSideImg, coverImg, weightUnit, weightOz, weightGsm, weightGy, warpYarnCount, weftYarnCount, warpDensity, weftDensity, width } = material

  const scanFaceSide = !!faceSideImg?.crop
  const scanBackSide = !!backSideImg?.crop

  const currentCoverImg = ref(require('@/assets/images/default_material.png'))
  const neverScanBefore = ref(true)
  const statusIconName = ref('front')

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

  const square = String.fromCodePoint(0xB2)
  const materialWeight = computed(() => {
    let html = ''
    if (weightUnit === WEIGHT_UNIT.GSM) {
      html = weightGsm ? `${weightGsm} g/m${square}(${weightOz} oz/y${square})` : ''
    } else if (weightUnit === WEIGHT_UNIT.OZ) {
      html = weightOz ? `${weightOz} oz/y${square}(${weightGsm} g/m${square})` : ''
    }

    if (weightGy) {
      html += `(${weightGy} g/y)`
    }
    return html
  })

  const materialYarnCount = computed(() => warpYarnCount > 0 && weftYarnCount > 0 ? `${warpYarnCount}X${weftYarnCount}` : '')
  const materialDensity = computed(() => warpDensity > 0 && weftDensity > 0 ? `${warpDensity}X${weftDensity}` : '')
  const materialWidth = computed(() => width > 0 ? `${width}"` : '')

  return {
    currentCoverImg,
    neverScanBefore,
    statusIconName,
    materialWeight,
    materialYarnCount,
    materialDensity,
    materialWidth
  }
}
