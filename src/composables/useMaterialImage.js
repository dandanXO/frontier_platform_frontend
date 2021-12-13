import { SIDE_TYPE } from '@/utils/constants.js'

export default async function useMaterialImage (material, type = 'general') {
  const { isDoubleSideMaterial, sideType, faceSideImg, backSideImg } = material

  const isFaceSideMaterial = !isDoubleSideMaterial && sideType === SIDE_TYPE.FACE
  const isBackSideMaterial = !isDoubleSideMaterial && sideType === SIDE_TYPE.BACK

  const isFaceSideOriginalExist = !!faceSideImg.original
  const isBackSideOriginalExist = !!backSideImg.original

  const isFaceSideU3mOriginalExist = !!faceSideImg.u3mOriginal
  const isBackSideU3mOriginalExist = !!backSideImg.u3mOriginal

  const isFaceSideU3mCropExist = !!faceSideImg.u3mCrop
  const isBackSideU3mCropExist = !!backSideImg.u3mCrop

  const getImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        const { width, height, src } = img
        resolve({ width, height, src })
      }

      img.src = url
    })
  }

  const faceSideObj = type === 'general'
    ? isFaceSideOriginalExist && await getImage(faceSideImg.original)
    : isFaceSideU3mOriginalExist && await getImage(faceSideImg.u3mOriginal)

  const backSideObj = type === 'general'
    ? isBackSideOriginalExist && await getImage(backSideImg.original)
    : isBackSideU3mOriginalExist && await getImage(backSideImg.u3mOriginal)

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
