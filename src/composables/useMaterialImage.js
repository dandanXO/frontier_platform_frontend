import { SIDE_TYPE } from '@/utils/constants.js'

export default function useMaterialImage (material, type = 'general') {
  const { isDoubleSideMaterial, sideType, faceSideImg, backSideImg } = material

  const isFaceSideMaterial = !isDoubleSideMaterial && sideType === SIDE_TYPE.FACE
  const isBackSideMaterial = !isDoubleSideMaterial && sideType === SIDE_TYPE.BACK

  const isFaceSideOriginalExist = !!faceSideImg.original
  const isBackSideOriginalExist = !!backSideImg.original

  const isFaceSideU3mOriginalExist = !!faceSideImg.u3mOriginal
  const isBackSideU3mOriginalExist = !!backSideImg.u3mOriginal

  const isFaceSideU3mCropExist = !!faceSideImg.u3mCrop
  const isBackSideU3mCropExist = !!backSideImg.u3mCrop

  const faceSideObj = type === 'general'
    ? isFaceSideOriginalExist && faceSideImg.original
    : isFaceSideU3mOriginalExist && faceSideImg.u3mOriginal

  const backSideObj = type === 'general'
    ? isBackSideOriginalExist && backSideImg.original
    : isBackSideU3mOriginalExist && backSideImg.u3mOriginal

  return {
    isDoubleSideMaterial,
    isFaceSideMaterial,
    isBackSideMaterial,
    faceSideObj,
    backSideObj,
    isFaceSideU3mCropExist,
    isBackSideU3mCropExist
  }
}
