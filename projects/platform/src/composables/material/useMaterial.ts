import {
  type Material,
  WeightUnit,
  type MaterialBackSide,
  type MaterialFaceSide,
  MaterialType,
  type MaterialMiddleSide,
  MaterialSideType,
  type MaterialPriceInfo,
  type MaterialWovenConstruction,
  type MaterialKnitConstruction,
  type MaterialLeatherConstruction,
  type MaterialNonWovenConstruction,
  type MaterialTrimConstruction,
} from '@frontier/platform-web-sdk'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import { useStore } from 'vuex'

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
    value:
      | {
          [key: string]: any
        }
      | undefined
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
  const store = useStore()

  const mainSideType = computed(() => {
    const { isDoubleSide, faceSide } = material.value
    if (isDoubleSide && faceSide) {
      return faceSide.isMainSide
        ? MATERIAL_SIDE_TYPE.FACE
        : MATERIAL_SIDE_TYPE.BACK
    } else {
      return material.value.sideType === MaterialSideType.FACE_SIDE
        ? MATERIAL_SIDE_TYPE.FACE
        : MATERIAL_SIDE_TYPE.BACK
    }
  })

  const square = String.fromCodePoint(0xb2)
  const WEIGHT_UNIT: Record<WeightUnit, string> = {
    [WeightUnit.GSM]: `g/m${square}`,
    [WeightUnit.OZ]: `oz/yd${square}`,
    [WeightUnit.GY]: `g/y`,
    [WeightUnit.GM]: `g/m`,
  }

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

    const list = [
      {
        displayUrl: coverImage?.displayUrl ?? null,
        thumbnailUrl: coverImage?.thumbnailUrl ?? null,
        imgName: t('RR0081'),
        caption: null,
      },
      {
        displayUrl: faceSide?.sideImage?.displayUrl ?? null,
        thumbnailUrl: faceSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0075'),
        caption: null,
      },
      {
        displayUrl: faceSide?.sideImage?.rulerUrl ?? null,
        thumbnailUrl: faceSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0075'),
        caption: t('RR0080'),
      },
      {
        displayUrl: backSide?.sideImage?.displayUrl ?? null,
        thumbnailUrl: backSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0078'),
        caption: null,
      },
      {
        displayUrl: backSide?.sideImage?.rulerUrl ?? null,
        thumbnailUrl: backSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0078'),
        caption: t('RR0080'),
      },
    ]

    multimediaList.length > 0 &&
      list.push(
        ...multimediaList.map((multimedia) => ({
          displayUrl: multimedia.displayUrl,
          thumbnailUrl: multimedia.thumbnailUrl,
          imgName: multimedia.fileName,
          caption: null,
        }))
      )

    return list
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
      label: string
      selectValue: MATERIAL_SIDE_TYPE
      icon: string
      selectedIcon: string
    }[] = []

    const addFace = () =>
      list.push({
        label: t('MI0007'),
        selectValue: MATERIAL_SIDE_TYPE.FACE,
        icon: 'front',
        selectedIcon: 'face_full',
      })
    const addMiddle = () =>
      list.push({
        label: t('MI0008'),
        selectValue: MATERIAL_SIDE_TYPE.MIDDLE,
        icon: 'middle',
        selectedIcon: 'middle_full',
      })
    const addBack = () =>
      list.push({
        label: t('MI0009'),
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
    currentSideType.value

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
      name: t('MI0011'),
      isPublic: seasonInfo?.isPublic ?? false,
      value: (() => {
        let string = ''
        const { season, year } = seasonInfo ?? {}
        if (season) {
          string += `${season.name} `
        }
        if (year) {
          string += `${year}`
        }
        return string
      })(),
      textColor: getTextColor(seasonInfo?.isPublic ?? false, true, false),
    })
    const getFeatureList = () => ({
      name: t('MI0016'),
      value: currentSide.value.featureList
        .map((feature) => feature.name)
        .join(', '),
      textColor: getTextColor(true, false, false),
    })
    const getFinishList = () => ({
      name: 'Finish',
      value: currentSide.value.finishList
        .map((finish) => finish.name)
        .join(', '),
      textColor: getTextColor(true, false, false),
    })

    if (currentSideType.value !== MATERIAL_SIDE_TYPE.MIDDLE) {
      const sideWithoutMiddleSide = currentSide.value as
        | MaterialFaceSide
        | MaterialBackSide
      return {
        seasonInfo: getSeasonInfo(),
        featureList: getFeatureList(),
        materialType: {
          name: t('MI0003'),
          value: (() => {
            const stringList = []
            if (isComposite) {
              stringList.push('Composite')
            }
            if (faceSide) {
              stringList.push(faceSide.materialType)
            }
            if (backSide) {
              stringList.push(backSide.materialType)
            }

            return stringList.join(', ')
          })(),
          textColor: getTextColor(true, false, true),
        },
        construction: {
          name: t('MI0026'),
          isPublic: sideWithoutMiddleSide.construction?.isPublic ?? false,
          textColor: getTextColor(
            sideWithoutMiddleSide.construction?.isPublic ?? false,
            false,
            true
          ),
          value: (() => {
            if (!sideWithoutMiddleSide.construction) {
              return {}
            }

            switch (sideWithoutMiddleSide.materialType) {
              case MaterialType.WOVEN: {
                const { warpDensity, weftDensity, warpYarnSize, weftYarnSize } =
                  sideWithoutMiddleSide.construction as MaterialWovenConstruction
                return {
                  density: {
                    name: t('MI0027'),
                    value: `${warpDensity} X ${weftDensity}`,
                  },
                  yarnSize: {
                    name: t('RR0023'),
                    value: `${warpYarnSize} X ${weftYarnSize}`,
                  },
                }
              }
              case MaterialType.KNIT: {
                const {
                  machineType,
                  walesPerInch,
                  coursesPerInch,
                  yarnSize,
                  machineGaugeInGg,
                } = sideWithoutMiddleSide.construction as MaterialKnitConstruction
                return {
                  machineType: {
                    name: 'Machine Type',
                    value: machineType,
                  },
                  walesPerInch: {
                    name: 'Wales Per Inch',
                    value: walesPerInch,
                  },
                  coursesPerInch: {
                    name: 'Courses Per Inch',
                    value: coursesPerInch,
                  },
                  yarnSize: {
                    name: 'Yarn Size',
                    value: yarnSize,
                  },
                  machineGaugeInGg: {
                    name: 'Machine Gauge In Gg',
                    value: machineGaugeInGg,
                  },
                }
              }
              case MaterialType.LEATHER: {
                const {
                  averageSkinPerMeterSquare,
                  grade,
                  tannage,
                  thicknessPerMm,
                } = sideWithoutMiddleSide.construction as MaterialLeatherConstruction
                return {
                  averageSkinPerMeterSquare: {
                    name: 'Average Skin Per Meter Square',
                    value: averageSkinPerMeterSquare,
                  },
                  grade: {
                    name: 'Grade',
                    value: grade,
                  },
                  tannage: {
                    name: 'Tannage',
                    value: tannage,
                  },
                  thicknessPerMm: {
                    name: 'Thickness Per Mm',
                    value: thicknessPerMm,
                  },
                }
              }
              case MaterialType.NON_WOVEN: {
                const { bondingMethod, thicknessPerMm } =
                  sideWithoutMiddleSide.construction as MaterialNonWovenConstruction
                return {
                  bondingMethod: {
                    name: 'Bonding Method',
                    value: bondingMethod,
                  },
                  thicknessPerMm: {
                    name: 'Thickness Per Mm',
                    value: thicknessPerMm,
                  },
                }
              }
              case MaterialType.TRIM: {
                const { outerDiameter, length, thickness, width } =
                  sideWithoutMiddleSide.construction as MaterialTrimConstruction
                return {
                  outerDiameter: {
                    name: 'Outer Diameter',
                    value: outerDiameter,
                  },
                  length: {
                    name: 'Length',
                    value: length,
                  },
                  thickness: {
                    name: 'Thickness',
                    value: thickness,
                  },
                  width: {
                    name: 'Width',
                    value: width,
                  },
                }
              }
            }
          })(),
        },
        constructionCustomPropertyList: {
          name: 'Custom Construction',
          value: sideWithoutMiddleSide.constructionCustomPropertyList,
          textColor: getTextColor(true, false, true),
        },
        contentList: {
          name: t('RR0021'),
          value: sideWithoutMiddleSide.contentList
            .map((content) => content.name)
            .join(', '),
          textColor: getTextColor(true, false, true),
        },
        width: {
          name: t('RR0088'),
          value: `${width.cuttable}/${width.full}`,
          textColor: getTextColor(true, true, false),
        },
        weight: {
          name: 'Weight',
          value: `${weight.value}${WEIGHT_UNIT[weight.unit]}`,
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

  const getPriceInfo = (priceInfo: MaterialPriceInfo | undefined) => {
    if (!priceInfo) {
      return undefined
    }

    const countryList = store.getters['code/countryList']
    const { currencyCode, price, unit: priceUnit } = priceInfo.pricing || {}
    const { qty: minimumOrderQty, unit: minimumOrderUnit } =
      priceInfo.minimumOrder || {}
    const { qty: minimumColorQty, unit: minimumColorUnit } =
      priceInfo.minimumColor || {}
    const {
      countryOfOriginal,
      productionLeadTimeInDays,
      sampleLeadTimeInDays,
    } = priceInfo

    return {
      countryOfOriginal: {
        name: t('RR0042'),
        value:
          countryList.find(
            (country) => country.countryCode === countryOfOriginal
          )?.name || '',
      },
      pricing: {
        name: t('RR0043'),
        value:
          price && currencyCode && priceUnit
            ? `${price} ${currencyCode} / ${priceUnit}`
            : '',
      },
      minimumOrderQty: {
        name: t('RR0047'),
        value:
          minimumOrderQty && minimumOrderUnit
            ? `${minimumOrderQty} / ${minimumOrderUnit}`
            : '',
      },
      minimumColor: {
        name: t('RR0048'),
        value:
          minimumColorQty && minimumColorUnit
            ? `${minimumColorQty} / ${minimumColorUnit}`
            : '',
      },
      productionLeadTimeInDays: {
        name: t('RR0049'),
        value: productionLeadTimeInDays
          ? t('RR0083', { number: productionLeadTimeInDays })
          : '',
      },
      sampleLeadTimeInDays: {
        name: t('RR0051'),
        value: sampleLeadTimeInDays
          ? t('RR0083', { number: sampleLeadTimeInDays })
          : '',
      },
    }
  }

  const hasScannedImage = computed(() => {
    const { faceSide, backSide } = material.value
    return !!faceSide?.sideImage || !!backSide?.sideImage
  })

  const carbonEmissionInfo = computed(() => {
    if (!material.value.carbonEmission) {
      return {
        hasPermission: false,
        carbonEmission: null,
        lastUpdateTime: null,
      }
    }
    const { co2, water, land, lastUpdateTime } = material.value.carbonEmission

    const makeObj = (
      value: number | null,
      icon: string,
      title: string,
      unitShort: string,
      unitLong: string,
      saveUnit: string
    ) => {
      return {
        icon,
        value,
        title,
        unitShort,
        unitLong,
        saveUnit,
      }
    }
    return {
      hasPermission: true,
      carbonEmission: {
        co2: makeObj(
          co2,
          'co2',
          t('RR0221'),
          t('RR0215'),
          t('RR0225'),
          'RR0230'
        ),
        water: makeObj(
          water,
          'water',
          t('RR0222'),
          t('RR0216'),
          t('RR0226'),
          'RR0231'
        ),
        land: makeObj(
          land,
          'land',
          t('RR0224'),
          t('RR0218'),
          t('RR0228'),
          'RR0233'
        ),
      },
      lastUpdateTime,
    }
  })

  return {
    displayImageList,
    currentSideType,
    sideOptionList,
    specificationInfo,
    pantoneList,
    colorInfo,
    patternInfo,
    getPriceInfo,
    hasScannedImage,
    carbonEmissionInfo,
    switchSideType,
  }
}
