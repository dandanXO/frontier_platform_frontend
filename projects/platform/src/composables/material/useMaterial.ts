import {
  type Material,
  type MaterialBackSide,
  type MaterialFaceSide,
  type MaterialMiddleSide,
  MaterialSideType,
} from '@frontier/platform-web-sdk'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { EXTENSION, MATERIAL_SIDE_TYPE } from '@/utils/constants'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { useBreakpoints, getFileExtension } from '@frontier/lib'
import type {
  MaterialDisplayImage,
  MaterialFile,
  MaterialViewModeFile,
} from '@/types'
import { getMaterialMainSideType } from '@/utils/material/getMaterialMainSide'

export type MaterialSpecificationInfo = {
  seasonInfo: {
    name: string
    isPublic: boolean
    value: string
    textColor: string
  }
  featureList: {
    name: string
    value: string
    textColor: string
  }
  finishList: {
    name: string
    value: string
    textColor: string
  }
  materialType: {
    name: string
    value: string
    textColor: string
  } | null
  construction: {
    name: string
    isPublic: boolean
    value: Record<string, { name: string; value: string }> | null
    textColor: string
  } | null
  constructionCustomPropertyList: {
    name: string
    value: {
      isPublic: boolean
      name: string
      value: string
      customId: number
    }[]
    textColor: string
  } | null
  contentList: {
    name: string
    value: string
    textColor: string
  } | null
  width: {
    name: string
    value: string
    textColor: string
  } | null
  weight: {
    name: string
    value: string
    textColor: string
  } | null
}
export type SideOption = {
  label: string
  selectValue: MATERIAL_SIDE_TYPE
  icon: string
  selectedIcon: string
}

export default function useMaterial(
  material: ComputedRef<Material> | Ref<Material>
) {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const mainSideType = computed(() => getMaterialMainSideType(material.value))

  const hasScannedImage = computed(() => {
    const { faceSide, backSide } = material.value
    return !!faceSide?.sideImage || !!backSide?.sideImage
  })

  const scanImageStatus = computed(() => {
    const { isDoubleSide, faceSide, backSide, sideType } = material.value
    const hasScannedFaceSide = !!faceSide?.sideImage
    const hasScannedBackSide = !!backSide?.sideImage
    let iconName = 'front'
    let tooltipMessage = t('RR0266')
    if (isDoubleSide) {
      if (hasScannedFaceSide && hasScannedBackSide) {
        iconName = 'double'
        tooltipMessage = t('RR0270')
      } else if (hasScannedFaceSide && !hasScannedBackSide) {
        iconName = 'double_front'
        tooltipMessage = t('RR0268')
      } else if (!hasScannedFaceSide && hasScannedBackSide) {
        iconName = 'double_back'
        tooltipMessage = t('RR0269')
      } else if (!hasScannedFaceSide && !hasScannedBackSide) {
        iconName = 'no_image_double'
        tooltipMessage = t('RR0271')
      }
    } else if (sideType !== null) {
      if (sideType === MATERIAL_SIDE_TYPE.FACE) {
        iconName = hasScannedFaceSide ? 'front' : 'no_image_front'
        tooltipMessage = hasScannedFaceSide ? t('RR0266') : t('RR0264')
      } else {
        iconName = hasScannedBackSide ? 'back' : 'no_image_back'
        tooltipMessage = hasScannedBackSide ? t('RR0267') : t('RR0265')
      }
    }
    return { iconName, tooltipMessage }
  })

  const primarySideImage = computed(() => {
    const { faceSide, backSide } = material.value
    return faceSide?.sideImage || backSide?.sideImage || null
  })

  /**
   * A: cover image
   * B: face side original image + ruler image
   * C: back side original image + ruler image
   * D: multimedia
   *
   * displayImageList = A + B + C + D
   */
  const displayImageList = computed(() => {
    const { coverImage, faceSide, backSide, multimediaList } = material.value

    const list: Array<MaterialDisplayImage> = [
      {
        id: 'cover',
        displayUrl: coverImage?.displayUrl ?? null,
        thumbnailUrl: coverImage?.thumbnailUrl ?? null,
        imgName: t('RR0081'),
        caption: null,
      },
      {
        id: 'faceSide',
        displayUrl: faceSide?.sideImage?.displayUrl ?? null,
        thumbnailUrl: faceSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0075'),
        caption: null,
      },
      {
        id: 'faceSideRuler',
        displayUrl: faceSide?.sideImage?.rulerUrl ?? null,
        thumbnailUrl: faceSide?.sideImage?.rulerThumbnailUrl ?? null,
        imgName: t('RR0075'),
        caption: t('RR0080'),
      },
      {
        id: 'backSide',
        displayUrl: backSide?.sideImage?.displayUrl ?? null,
        thumbnailUrl: backSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0078'),
        caption: null,
      },
      {
        id: 'backSideRuler',
        displayUrl: backSide?.sideImage?.rulerUrl ?? null,
        thumbnailUrl: backSide?.sideImage?.rulerThumbnailUrl ?? null,
        imgName: t('RR0078'),
        caption: t('RR0080'),
      },
    ]

    multimediaList.length > 0 &&
      list.push(
        ...multimediaList.map((multimedia) => ({
          id: multimedia.fileId,
          displayUrl: multimedia.displayUrl,
          thumbnailUrl: multimedia.thumbnailUrl,
          imgName: multimedia.displayFileName,
          caption: null,
        }))
      )

    return list
  })

  const publicFileList = computed(() => {
    const list: Array<MaterialFile> = []
    const { coverImage, faceSide, backSide, multimediaList } = material.value

    if (coverImage) {
      list.push({
        id: 'cover',
        fileId: null,
        originalUrl: coverImage.displayUrl || '',
        thumbnailUrl: coverImage.thumbnailUrl,
        displayName: t('RR0081'),
        extension: getFileExtension(coverImage.displayUrl || '') as EXTENSION,
      })
    }

    if (faceSide?.sideImage?.originalUrl) {
      list.push({
        id: 'faceSide',
        fileId: null,
        originalUrl: faceSide.sideImage.originalUrl,
        thumbnailUrl: faceSide.sideImage.thumbnailUrl,
        displayName: t('RR0081'),
        extension: getFileExtension(
          faceSide.sideImage.originalUrl
        ) as EXTENSION,
      })
    }

    if (faceSide?.sideImage?.rulerUrl) {
      list.push({
        id: 'faceSideRuler',
        fileId: null,
        originalUrl: faceSide.sideImage.rulerUrl,
        thumbnailUrl: faceSide.sideImage.rulerThumbnailUrl,
        displayName: t('RR0081'),
        extension: getFileExtension(faceSide.sideImage.rulerUrl) as EXTENSION,
      })
    }

    if (backSide?.sideImage?.originalUrl) {
      list.push({
        id: 'backSide',
        fileId: null,
        originalUrl: backSide.sideImage.originalUrl,
        thumbnailUrl: backSide.sideImage.thumbnailUrl,
        displayName: t('RR0081'),
        extension: getFileExtension(
          backSide.sideImage.originalUrl
        ) as EXTENSION,
      })
    }

    if (backSide?.sideImage?.rulerUrl) {
      list.push({
        id: 'backSideRuler',
        fileId: null,
        originalUrl: backSide.sideImage.rulerUrl,
        thumbnailUrl: backSide.sideImage.rulerThumbnailUrl,
        displayName: t('RR0081'),
        extension: getFileExtension(backSide.sideImage.rulerUrl) as EXTENSION,
      })
    }

    multimediaList.length > 0 &&
      list.push(
        ...multimediaList.map((multimedia) => ({
          id: multimedia.fileId,
          fileId: multimedia.fileId,
          originalUrl: multimedia.originalUrl,
          thumbnailUrl: multimedia.thumbnailUrl,
          displayName: multimedia.displayFileName,
          extension: getFileExtension(multimedia.displayFileName) as EXTENSION,
        }))
      )

    return list
  })

  const publicFileViewModeList = computed(() => {
    return publicFileList.value.filter(
      (f) => !!f.originalUrl
    ) as MaterialViewModeFile[]
  })

  const attachmentViewModeList = computed<MaterialViewModeFile[]>(() => {
    const attachmentList = material.value.internalInfo?.attachmentList
    if (!attachmentList) {
      return []
    }

    return attachmentList.map((a) => ({
      id: a.fileId,
      originalUrl: a.originalUrl,
      thumbnailUrl: a.thumbnailUrl,
      displayName: a.displayFileName,
      extension: a.extension as EXTENSION,
    }))
  })

  const currentSideType = ref<MATERIAL_SIDE_TYPE>(mainSideType.value)
  const currentSide = computed<
    MaterialFaceSide | MaterialBackSide | MaterialMiddleSide
  >(() => {
    const { faceSide, middleSide, backSide } = material.value
    return currentSideType.value === MATERIAL_SIDE_TYPE.FACE
      ? (faceSide as MaterialFaceSide)
      : currentSideType.value === MATERIAL_SIDE_TYPE.BACK
      ? (backSide as MaterialBackSide)
      : (middleSide as MaterialMiddleSide)
  })
  const switchSideType = (sideType: MATERIAL_SIDE_TYPE) =>
    (currentSideType.value = sideType)
  const sideOptionList = computed<SideOption[]>(() => {
    const { isDoubleSide, isComposite, sideType } = material.value
    const list: {
      label: string | null
      selectValue: MATERIAL_SIDE_TYPE
      icon: string
      selectedIcon: string
    }[] = []

    const addFace = () =>
      list.push({
        label: isMobile.value ? null : t('MI0007'),
        selectValue: MATERIAL_SIDE_TYPE.FACE,
        icon: 'front',
        selectedIcon: 'face_full',
      })
    const addMiddle = () =>
      list.push({
        label: isMobile.value ? null : t('MI0008'),
        selectValue: MATERIAL_SIDE_TYPE.MIDDLE,
        icon: 'middle',
        selectedIcon: 'middle_full',
      })
    const addBack = () =>
      list.push({
        label: isMobile.value ? null : t('MI0009'),
        selectValue: MATERIAL_SIDE_TYPE.BACK,
        icon: 'back',
        selectedIcon: 'back_full',
      })

    if (isDoubleSide) {
      addFace()
      if (isComposite) {
        addMiddle()
      }
      addBack()
    } else {
      if (sideType === MaterialSideType.FACE_SIDE) {
        addFace()
      } else {
        addBack()
      }
      if (isComposite) {
        addMiddle()
      }
    }

    return list
  })
  const getTextColor = (
    isPublic = true,
    isMaterialProperty: boolean,
    isCompositeSideProperty: boolean
  ) => {
    const { isComposite } = material.value

    if (currentSideType.value === MATERIAL_SIDE_TYPE.BACK) {
      if (isMaterialProperty && !isCompositeSideProperty) {
        return 'text-grey-300'
      }
      if (isCompositeSideProperty) {
        return isComposite
          ? isPublic
            ? 'text-grey-900'
            : 'text-grey-600'
          : 'text-grey-300'
      }
    }

    return isPublic ? 'text-grey-900' : 'text-grey-600'
  }

  const specificationInfo = computed<MaterialSpecificationInfo>(() => {
    const { isComposite, faceSide, backSide, seasonInfo, width, weight } =
      material.value
    const getSeasonInfo = () => ({
      ...materialInfoForDisplay.seasonInfo(seasonInfo),
      isPublic: seasonInfo?.isPublic ?? false,
      textColor: getTextColor(seasonInfo?.isPublic ?? false, true, false),
    })
    const getFeatureList = () => ({
      ...materialInfoForDisplay.featureList(currentSide.value.featureList),
      textColor: getTextColor(true, false, false),
    })
    const getFinishList = () => ({
      ...materialInfoForDisplay.finishList(currentSide.value.finishList),
      textColor: getTextColor(true, false, false),
    })

    if (currentSideType.value !== MATERIAL_SIDE_TYPE.MIDDLE) {
      const sideWithoutMiddleSide = currentSide.value as
        | MaterialFaceSide
        | MaterialBackSide
      return {
        seasonInfo: getSeasonInfo(),
        featureList: getFeatureList(),
        materialType: (() => {
          return {
            ...materialInfoForDisplay.materialType(isComposite, {
              face: faceSide?.materialType,
              back: backSide?.materialType,
            }),
            textColor: getTextColor(true, false, true),
          }
        })(),
        construction: {
          ...materialInfoForDisplay.construction(
            sideWithoutMiddleSide.materialType,
            sideWithoutMiddleSide.construction ?? {}
          ),
          isPublic: sideWithoutMiddleSide.construction?.isPublic ?? false,
          textColor: getTextColor(
            sideWithoutMiddleSide.construction?.isPublic ?? false,
            false,
            true
          ),
        },
        constructionCustomPropertyList: {
          ...materialInfoForDisplay.constructionCustomPropertyList(
            sideWithoutMiddleSide.constructionCustomPropertyList
          ),
          textColor: getTextColor(true, false, true),
        },
        contentList: {
          ...materialInfoForDisplay.contentList(
            sideWithoutMiddleSide.contentList
          ),
          textColor: getTextColor(true, false, true),
        },
        width: {
          ...materialInfoForDisplay.width(width),
          textColor: getTextColor(true, true, false),
        },
        weight: {
          ...materialInfoForDisplay.weight(weight),
          textColor: getTextColor(true, true, false),
        },
        finishList: getFinishList(),
      }
    } else {
      return {
        seasonInfo: getSeasonInfo(),
        featureList: getFeatureList(),
        finishList: getFinishList(),
        materialType: null,
        construction: null,
        constructionCustomPropertyList: null,
        contentList: null,
        width: null,
        weight: null,
      }
    }
  })

  const pantoneList = computed(() => {
    if (currentSideType.value === MATERIAL_SIDE_TYPE.MIDDLE) {
      return null
    }

    const side = currentSide.value as MaterialFaceSide | MaterialBackSide
    return side.pantoneList
  })
  const colorInfo = computed(() => {
    if (currentSideType.value === MATERIAL_SIDE_TYPE.MIDDLE) {
      return null
    }

    const side = currentSide.value as MaterialFaceSide | MaterialBackSide
    return {
      name: 'Color',
      value: side.colorInfo,
    }
  })
  const patternInfo = computed(() => {
    if (currentSideType.value === MATERIAL_SIDE_TYPE.MIDDLE) {
      return null
    }

    const side = currentSide.value as MaterialFaceSide | MaterialBackSide
    return {
      name: 'Pattern',
      value: side.patternInfo,
    }
  })

  const carbonEmissionInfo = computed(() => {
    if (!material.value.carbonEmission) {
      return {
        hasPermission: false,
        carbonEmission: materialInfoForDisplay.carbonEmission(
          material.value.carbonEmission
        ),
        lastUpdateTime: null,
      }
    }
    return {
      hasPermission: true,
      carbonEmission: materialInfoForDisplay.carbonEmission(
        material.value.carbonEmission
      ),
      lastUpdateTime: material.value.carbonEmission.lastUpdateTime,
    }
  })

  return {
    primarySideImage,
    displayImageList,
    publicFileList,
    publicFileViewModeList,
    attachmentViewModeList,
    currentSide,
    currentSideType,
    sideOptionList,
    specificationInfo,
    pantoneList,
    colorInfo,
    patternInfo,
    hasScannedImage,
    scanImageStatus,
    carbonEmissionInfo,
    switchSideType,
    mainSideType,
  }
}
