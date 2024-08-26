import {
  type Material,
  type MaterialSide,
  type MaterialMiddleSide,
  MaterialSideType,
  Extension,
} from '@frontier/platform-web-sdk'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { EXTENSION, MATERIAL_SIDE_TYPE } from '@/utils/constants'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { useBreakpoints } from '@frontier/lib'
import type { MaterialFile, MaterialViewModeFile } from '@/types'
import { getMaterialMainSideType } from '@/utils/material/getMaterialMainSide'
import { getMaterialSideOptionList } from '@/utils/material/getMaterialSideOptionList'
import isTrimOrOthersType from '@/utils/material/isTrimOrOthersType'
import { useStore } from 'vuex'

export type MaterialSpecificationInfoBasicProperty = {
  name: string
  value: string
  textColor: string
}

export type MaterialSpecificationInfo = {
  seasonInfo: {
    name: string
    isPublic: boolean
    value: string
    textColor: string
  }
  featureList: MaterialSpecificationInfoBasicProperty
  finishList: MaterialSpecificationInfoBasicProperty
  materialType: MaterialSpecificationInfoBasicProperty | null
  construction: {
    name: string
    isPublic: boolean
    value: Record<string, { name: string; value: string }> | null
    textColor: string
  } | null
  constructionType?: MaterialSpecificationInfoBasicProperty
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
  contentList: MaterialSpecificationInfoBasicProperty | null
  width: MaterialSpecificationInfoBasicProperty | null
  weight: MaterialSpecificationInfoBasicProperty | null
}
export type SideOption = {
  label: string | null
  selectValue: MATERIAL_SIDE_TYPE
  icon: string
  selectedIcon: string
}

export default function useMaterial(
  material: ComputedRef<Material> | Ref<Material>
) {
  const { t } = useI18n()
  const store = useStore()
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
   * D: Digital Drape
   * F: multimedia
   *
   * publicFileList = A + B + C + D + F
   */
  const publicFileList = computed(() => {
    const {
      isDoubleSide,
      sideType,
      coverImage,
      faceSide,
      backSide,
      multimediaList,
      u3m: { digitalDrape },
      customU3m: { digitalDrape: customDigitalDrape },
    } = material.value

    const list: Array<MaterialFile> = [
      {
        id: 'cover',
        fileId: null,
        displayUrl: coverImage?.displayUrl ?? null,
        originalUrl: coverImage.displayUrl ?? null,
        thumbnailUrl: coverImage?.thumbnailUrl ?? null,
        displayName: t('RR0081'),
        displayNameShort: t('RR0081'),
        caption: null,
        extension: Extension.JPG,
      },
    ]

    if (isDoubleSide || sideType === MaterialSideType.FACE_SIDE) {
      list.push(
        {
          id: 'faceSide',
          fileId: null,
          displayUrl: faceSide?.sideImage?.displayUrl ?? null,
          originalUrl: faceSide?.sideImage?.originalUrl ?? null,
          thumbnailUrl: faceSide?.sideImage?.thumbnailUrl ?? null,
          displayName: t('RR0075'),
          displayNameShort: t('RR0075'),
          caption: null,
          extension: Extension.JPG,
        },
        {
          id: 'faceSideRuler',
          fileId: null,
          displayUrl: faceSide?.sideImage?.rulerUrl ?? null,
          originalUrl: faceSide?.sideImage?.rulerUrl ?? null,
          thumbnailUrl: faceSide?.sideImage?.rulerThumbnailUrl ?? null,
          displayName: `${t('RR0075')}(${t('RR0080')})`,
          displayNameShort: t('RR0075'),
          caption: t('RR0080'),
          extension: Extension.JPG,
        }
      )
    }

    if (isDoubleSide || sideType === MaterialSideType.BACK_SIDE) {
      list.push(
        {
          id: 'backSide',
          fileId: null,
          displayUrl: backSide?.sideImage?.displayUrl ?? null,
          originalUrl: backSide?.sideImage?.originalUrl ?? null,
          thumbnailUrl: backSide?.sideImage?.thumbnailUrl ?? null,
          displayName: t('RR0078'),
          displayNameShort: t('RR0078'),
          caption: null,
          extension: Extension.JPG,
        },
        {
          id: 'backSideRuler',
          fileId: null,
          displayUrl: backSide?.sideImage?.rulerUrl ?? null,
          originalUrl: backSide?.sideImage?.rulerUrl ?? null,
          thumbnailUrl: backSide?.sideImage?.rulerThumbnailUrl ?? null,
          displayName: `${t('RR0078')}(${t('RR0080')})`,
          displayNameShort: t('RR0078'),
          caption: t('RR0080'),
          extension: Extension.JPG,
        }
      )
    }

    // Digital Drape
    if (
      !isTrimOrOthersType(material.value) &&
      store.getters['permission/isDigitalDrapeTrialRule']
    ) {
      const selectedDigitalDrape = customDigitalDrape?.isSelected
        ? customDigitalDrape
        : digitalDrape
      list.push({
        id: 'digitalDrape',
        fileId: null,
        displayUrl: selectedDigitalDrape?.displayUrl ?? null,
        originalUrl: selectedDigitalDrape?.originalUrl ?? null,
        thumbnailUrl: selectedDigitalDrape?.thumbnailUrl ?? null,
        displayName: `${t('MI0136')}${
          customDigitalDrape?.isSelected ? '' : `(${t('MI0137')})`
        }`,
        displayNameShort: t('MI0136'),
        caption: null,
        extension: Extension.JPG,
      })
    }

    multimediaList.length > 0 &&
      list.push(
        ...multimediaList.map((multimedia) => ({
          id: multimedia.fileId,
          fileId: multimedia.fileId,
          displayUrl: multimedia.displayUrl,
          originalUrl: multimedia.originalUrl,
          thumbnailUrl: multimedia.thumbnailUrl,
          displayName: multimedia.displayFileName,
          displayNameShort: multimedia.displayFileName,
          caption: null,
          extension: multimedia.extension,
        }))
      )

    return list
  })

  const attachmentViewModeList = computed<MaterialViewModeFile[]>(() => {
    const attachmentList = material.value.internalInfo?.attachmentList
    if (!attachmentList) {
      return []
    }

    return attachmentList.map((a) => ({
      id: a.fileId,
      fileId: a.fileId,
      displayUrl: a.displayUrl,
      originalUrl: a.originalUrl,
      thumbnailUrl: a.thumbnailUrl,
      displayName: a.displayFileName,
      extension: a.extension as EXTENSION,
    }))
  })

  const currentSideType = ref<MATERIAL_SIDE_TYPE>(mainSideType.value)
  const currentSide = computed(() => {
    const { faceSide, middleSide, backSide } = material.value
    return currentSideType.value === MATERIAL_SIDE_TYPE.FACE
      ? faceSide
      : currentSideType.value === MATERIAL_SIDE_TYPE.BACK
      ? backSide
      : middleSide
  })

  const switchSideType = (sideType: MATERIAL_SIDE_TYPE) =>
    (currentSideType.value = sideType)

  const sideOptionList = computed<SideOption[]>(() => {
    const { isDoubleSide, isComposite, sideType } = material.value
    return getMaterialSideOptionList(isDoubleSide, isComposite, sideType)
  })
  const getTextColor = (
    isPublic = true,
    isMaterialProperty: boolean,
    isCompositeSideProperty: boolean
  ) => {
    const { isComposite, sideType } = material.value

    if (currentSideType.value === MATERIAL_SIDE_TYPE.BACK) {
      if (sideType === MaterialSideType.BACK_SIDE) {
        return 'text-grey-900'
      }
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
    const {
      isComposite,
      seasonInfo,
      width,
      weight,
      weightForDisplay,
      weightDisplaySetting,
    } = material.value
    const getSeasonInfo = () => ({
      ...materialInfoForDisplay.seasonInfo(seasonInfo),
      isPublic: seasonInfo?.isPublic ?? false,
      textColor: getTextColor(seasonInfo?.isPublic ?? false, true, false),
    })
    const getFeatureList = () => ({
      ...materialInfoForDisplay.featureList(
        currentSide.value?.featureList ?? []
      ),
      textColor: getTextColor(true, false, false),
    })
    const getFinishList = () => ({
      ...materialInfoForDisplay.finishList(currentSide.value?.finishList ?? []),
      textColor: getTextColor(true, false, false),
    })
    const getConstructionType = (materialSide: MaterialSide) => ({
      ...materialInfoForDisplay.constructionType(
        materialSide?.materialType,
        materialSide?.materialTypeConstruction,
        materialSide?.descriptionList
      ),
      textColor: getTextColor(true, false, false),
    })

    if (currentSideType.value !== MATERIAL_SIDE_TYPE.MIDDLE) {
      const sideWithoutMiddleSide = currentSide.value as MaterialSide
      return {
        seasonInfo: getSeasonInfo(),
        featureList: getFeatureList(),
        materialType: (() => {
          return {
            ...materialInfoForDisplay.materialType(
              isComposite,
              sideWithoutMiddleSide.materialType
            ),
            textColor: getTextColor(true, false, true),
          }
        })(),
        constructionType: getConstructionType(sideWithoutMiddleSide),
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
          ...materialInfoForDisplay.weight(
            weight,
            weightForDisplay,
            weightDisplaySetting
          ),
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
        constructionCustomPropertyList: {
          ...materialInfoForDisplay.constructionCustomPropertyList(
            (currentSide.value as MaterialMiddleSide).customPropertyList
          ),
          textColor: getTextColor(true, false, true),
        },
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

    const side = currentSide.value as MaterialSide
    return side.pantoneList
  })
  const colorInfo = computed(() => {
    if (currentSideType.value === MATERIAL_SIDE_TYPE.MIDDLE) {
      return null
    }

    const side = currentSide.value as MaterialSide
    return {
      name: t('RR0026'),
      value: side.colorInfo,
    }
  })
  const patternInfo = computed(() => {
    if (currentSideType.value === MATERIAL_SIDE_TYPE.MIDDLE) {
      return null
    }

    const side = currentSide.value as MaterialSide
    return {
      name: t('RR0025'),
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
    publicFileList,
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
