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

  // enum DISPLAY_TYPE {
  //   ONLY_INTERNAL = 0, // 只顯示在 internal
  //   ONLY_EXTERNAL = 1, // 只顯示在 external
  //   BOTH_MUST = 2, // 兩邊都要顯示，無論是否有值
  //   BOTH_OPTIONAL_VALUE = 3, // 兩邊都要顯示，但是只有在有值時才顯示
  //   INTERNAL_MUST_EXTERNAL_OPTIONAL_PUBLIC = 4, // internal 時必顯示，external 時如果有值且 isPublic 為 true 才顯示
  //   INTERNAL_MUST_EXTERNAL_OPTIONAL_VALUE = 5, // internal 時必顯示，external 時如果有值才顯示
  //   INTERNAL_OPTIONAL_VALUE_EXTERNAL_OPTIONAL_PUBLIC = 6, // internal 時如果有值才顯示，external 時如果有值且 isPublic 為 true 才顯示
  // }

  // const propertyDisplayConfig = {
  //   // Item# 產品編號
  //   itemNo: DISPLAY_TYPE.BOTH_MUST,
  //   // Features 產品特色
  //   featureList: DISPLAY_TYPE.BOTH_OPTIONAL_VALUE,
  //   // Content 成分
  //   contentList: DISPLAY_TYPE.BOTH_MUST,
  //   // Material Type 布種
  //   materialType: DISPLAY_TYPE.BOTH_MUST,
  //   // Material Description 布種描述
  //   descriptionList: DISPLAY_TYPE.BOTH_OPTIONAL_VALUE,
  //   // Construction 規格
  //   construction: DISPLAY_TYPE.INTERNAL_OPTIONAL_VALUE_EXTERNAL_OPTIONAL_PUBLIC,
  //   // Custom Construction 自訂規格
  //   constructionCustomPropertyList:
  //     DISPLAY_TYPE.INTERNAL_MUST_EXTERNAL_OPTIONAL_PUBLIC,
  //   // Weight 布重
  //   weight: DISPLAY_TYPE.BOTH_MUST,
  //   // cuttable width 幅寬 (可裁)
  //   cuttableWidth: DISPLAY_TYPE.BOTH_MUST,
  //   // full width 幅寬 (全)
  //   fullWidth: DISPLAY_TYPE.BOTH_MUST,
  //   // finish 加工
  //   finishList: DISPLAY_TYPE.BOTH_MUST,
  //   // pantone 顏色資訊
  //   pantone: DISPLAY_TYPE.BOTH_MUST,
  //   // color 顏色資訊 (系統預設)
  //   color: DISPLAY_TYPE.BOTH_OPTIONAL_VALUE,
  //   // custom color 顏色資訊 (自訂)
  //   colorCustomPropertyList:
  //     DISPLAY_TYPE.INTERNAL_MUST_EXTERNAL_OPTIONAL_PUBLIC,
  //   // pattern 顏色資訊 (系統預設)
  //   pattern: DISPLAY_TYPE.BOTH_OPTIONAL_VALUE,
  //   // custom pattern 顏色資訊 (自訂)
  //   patternCustomPropertyList:
  //     DISPLAY_TYPE.INTERNAL_MUST_EXTERNAL_OPTIONAL_PUBLIC,
  //   // inventory 庫存資訊 (公開)
  //   inventoryTotalQtyInYard:
  //     DISPLAY_TYPE.INTERNAL_MUST_EXTERNAL_OPTIONAL_PUBLIC,
  //   // pricing 價格資訊 (公開)
  //   priceInfo: DISPLAY_TYPE.INTERNAL_MUST_EXTERNAL_OPTIONAL_VALUE,
  //   // Public, AI, Certificate Tags 標籤資訊 （公開）
  //   tagInfo: DISPLAY_TYPE.INTERNAL_MUST_EXTERNAL_OPTIONAL_VALUE,
  //   // internalInfo 內部資訊 (非公開) tagInfo, priceInfo, inventoryInfo, attachmentList
  //   internalInfo: DISPLAY_TYPE.ONLY_INTERNAL,
  //   // carbonEmission 碳排資訊
  //   carbonEmission: DISPLAY_TYPE.BOTH_MUST,
  // }

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

  const currentSelectedSideType = ref<MATERIAL_SIDE_TYPE>(mainSideType.value)
  const sideOptionList = computed(() => {
    const { isComposite, faceSide, middleSide, backSide } = material.value
    const list = []

    if (faceSide) {
      list.push({
        label: t('MI0007'),
        selectValue: MATERIAL_SIDE_TYPE.FACE,
        icon: 'front',
        selectedIcon: 'face_full',
      })
    }

    if (isComposite && middleSide) {
      list.push({
        label: t('MI0008'),
        selectValue: MATERIAL_SIDE_TYPE.MIDDLE,
        icon: 'middle',
        selectedIcon: 'middle_full',
      })
    }

    if (backSide) {
      list.push({
        label: t('MI0009'),
        selectValue: MATERIAL_SIDE_TYPE.BACK,
        icon: 'back',
        selectedIcon: 'back_full',
      })
    }

    return list
  })
  const specificationInfo = computed(() => {
    const { isComposite, faceSide, middleSide, backSide, seasonInfo } =
      material.value
    const side: MaterialFaceSide | MaterialBackSide | MaterialMiddleSide =
      currentSelectedSideType.value === MATERIAL_SIDE_TYPE.FACE
        ? faceSide
        : currentSelectedSideType.value === MATERIAL_SIDE_TYPE.BACK
        ? backSide
        : middleSide

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
    })
    const getFeatureList = () => ({
      name: t('MI0016'),
      value: side.featureList.map((feature) => feature.name).join(', '),
    })
    const getFinishList = () => ({
      name: 'Finish',
      value: side.finishList.map((finish) => finish.name).join(', '),
    })

    if (currentSelectedSideType.value !== MATERIAL_SIDE_TYPE.MIDDLE) {
      const sideWithoutMiddleSide = side as MaterialFaceSide | MaterialBackSide
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
        },
        construction: {
          name: t('MI0026'),
          isPublic: sideWithoutMiddleSide.construction?.isPublic ?? false,
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
        },
        contentList: {
          name: t('RR0021'),
          value: sideWithoutMiddleSide.contentList
            .map((content) => content.name)
            .join(', '),
        },
        width: {
          name: t('RR0088'),
          value: `${sideWithoutMiddleSide.width.cuttable}/${sideWithoutMiddleSide.width.full}`,
        },
        weight: {
          name: 'Weight',
          value: `${sideWithoutMiddleSide.weight.value}${
            WEIGHT_UNIT[sideWithoutMiddleSide.weight.unit]
          }`,
        },
        finishList: getFinishList(),
      }
    } else {
      return {
        seasonInfo: getSeasonInfo(),
        featureList: getFeatureList(),
        finishList: getFinishList(),
      }
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
    currentSelectedSideType,
    sideOptionList,
    specificationInfo,
    getPriceInfo,
    hasScannedImage,
    carbonEmissionInfo,
  }
}
