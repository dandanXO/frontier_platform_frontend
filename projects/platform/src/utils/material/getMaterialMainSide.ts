import {
  type Material,
  type MaterialBackSide,
  type MaterialFaceSide,
  MaterialSideType,
} from '@frontier/platform-web-sdk'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'

export const getMaterialMainSideType = (material: Material) => {
  const { isDoubleSide, faceSide, sideType } = material
  if (isDoubleSide && faceSide) {
    return faceSide.isMainSide
      ? MATERIAL_SIDE_TYPE.FACE
      : MATERIAL_SIDE_TYPE.BACK
  } else {
    return sideType === MaterialSideType.FACE_SIDE
      ? MATERIAL_SIDE_TYPE.FACE
      : MATERIAL_SIDE_TYPE.BACK
  }
}
export const getMaterialMainSide: (
  material: Material
) => MaterialFaceSide | MaterialBackSide = (material) => {
  const { faceSide, backSide } = material

  const mainSideType = getMaterialMainSideType(material)

  return mainSideType === MATERIAL_SIDE_TYPE.FACE
    ? (faceSide as MaterialFaceSide)
    : (backSide as MaterialBackSide)
}
