import {
  type Material,
  type MaterialBackSide,
  type MaterialFaceSide,
  MaterialSideType,
} from '@frontier/platform-web-sdk'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'

export const getMaterialBySide: (
  material: Material,
  sideType: MaterialSideType
) => MaterialFaceSide | MaterialBackSide = (material, sideType) => {
  const { faceSide, backSide } = material
  return sideType === MATERIAL_SIDE_TYPE.FACE
    ? (faceSide as MaterialFaceSide)
    : (backSide as MaterialBackSide)
}
