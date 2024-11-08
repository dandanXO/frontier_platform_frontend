import {
  LengthUnit,
  MaterialQuantityUnit,
  WeightUnit,
  type MaterialPriceInfo,
  type MaterialInternalInventoryInfo,
  type MaterialInternalInventoryInfoSampleCardsRemainingListInner,
  type MaterialPriceInfoPricing,
  type Material,
  type MaterialSide,
  type MaterialSideBase,
  type MaterialMiddleSide,
  CurrencyCode,
} from '@frontier/platform-web-sdk'
import { CM_PER_INCH, toDP2 } from './cropper'
import type { MaterialRow } from '@/types'
import type { Nullable } from '@/components/assets/spreadsheet/Spreadsheet.vue'

const cmToInch = (cm: number) => cm / CM_PER_INCH

const toGSM = (
  weightValue: number,
  weightUnit: WeightUnit,
  fullWidthInInch: number
) => {
  switch (weightUnit) {
    case WeightUnit.GSM: {
      return weightValue
    }
    case WeightUnit.OZ: {
      return weightValue / 33.906
    }
    case WeightUnit.GY: {
      return (weightValue / fullWidthInInch) * 43
    }
    case WeightUnit.GM: {
      return weightValue / fullWidthInInch
    }
  }
}

export const getTotalInventoryQty = (
  fullWidthValue: number,
  widthUnit: LengthUnit,
  weightValue: number,
  weightUnit: WeightUnit,
  inventoryQty: number,
  inventoryUnit: MaterialQuantityUnit
) => {
  const fullWidthInInch =
    widthUnit === LengthUnit.CM ? cmToInch(fullWidthValue) : fullWidthValue

  switch (inventoryUnit) {
    case MaterialQuantityUnit.Y:
    case MaterialQuantityUnit.PCS: {
      return inventoryQty
    }
    case MaterialQuantityUnit.M: {
      return toDP2(inventoryQty / 0.9114)
    }
    case MaterialQuantityUnit.KG: {
      const gsm = toGSM(weightValue, weightUnit, fullWidthInInch)
      return toDP2((inventoryQty / (gsm * 0.02323 * fullWidthInInch)) * 1000)
    }
  }
}

export const getDefaultHangersRemainingList = () => {
  return [
    {
      source: null,
      shelf1: null,
      shelf2: null,
      location: null,
      qtyInPcs: null,
    },
  ]
}

export const getDefaultYardageRemainingInfo = () => {
  return {
    unit: null,
    list: [
      {
        source: null,
        shelf1: null,
        shelf2: null,
        location: null,
        productionNo: null,
        roll: null,
        lot: null,
        qty: null,
      },
    ],
  }
}

export const getDefaultContentList = () => {
  return [{ contentId: null, name: '', percentage: null }]
}

export const processYardageRemainingInfo = (
  info: MaterialInternalInventoryInfo['yardageRemainingInfo']
): MaterialInternalInventoryInfo['yardageRemainingInfo'] => {
  if (!info) {
    return null
  }

  const haveValues = info.list.some((i) => {
    if (
      i.location ||
      i.lot ||
      i.productionNo ||
      i.qty != null ||
      i.roll ||
      i.shelf1 ||
      i.shelf2 ||
      i.source
    ) {
      return true
    }
    return false
  })

  return haveValues ? info : null
}

export const convertInventoryFormToReq = (
  inventoryInfo: MaterialInternalInventoryInfo
): MaterialInternalInventoryInfo => {
  const processRemainingList = (
    list: MaterialInternalInventoryInfoSampleCardsRemainingListInner[] | null
  ): MaterialInternalInventoryInfoSampleCardsRemainingListInner[] | null => {
    if (!list) {
      return null
    }

    const haveValues = list.some((h) => {
      if (
        h.location ||
        h.qtyInPcs != null ||
        h.shelf1 ||
        h.shelf2 ||
        h.source
      ) {
        return true
      }
      return false
    })
    return haveValues ? list : null
  }

  return {
    isTotalPublic: inventoryInfo.isTotalPublic,
    hangersRemainingList: processRemainingList(
      inventoryInfo.hangersRemainingList
    ),
    sampleCardsRemainingList: processRemainingList(
      inventoryInfo.sampleCardsRemainingList
    ),
    yardageRemainingInfo: processYardageRemainingInfo(
      inventoryInfo.yardageRemainingInfo
    ),
  }
}

export const getInventoryUnit = (
  inventoryInfo: MaterialInternalInventoryInfo | undefined | null
) => {
  return inventoryInfo?.yardageRemainingInfo?.unit === 'PCS' ? 'PCS' : 'Y'
}

export const convertPriceInfoFormToReq = (
  priceInfo: MaterialPriceInfo
): MaterialPriceInfo => {
  return {
    ...priceInfo,
    pricing: priceInfo.pricing?.price
      ? { ...priceInfo.pricing, price: String(priceInfo.pricing.price) }
      : null,
    minimumColor: priceInfo.minimumColor?.qty
      ? {
          qty: priceInfo.minimumColor.qty,
          unit: priceInfo.minimumColor.unit,
        }
      : null,
    minimumOrder: priceInfo.minimumOrder?.qty
      ? {
          qty: priceInfo.minimumOrder.qty,
          unit: priceInfo.minimumOrder.unit,
        }
      : null,
  }
}

export const convertSpreadSheetPriceInfoFormToReq = (
  priceInfo: MaterialPriceInfo
): MaterialPriceInfo => {
  return {
    ...priceInfo,
    pricing:
      priceInfo.pricing &&
      Object.values(priceInfo.pricing).some((v) => v != null)
        ? { ...priceInfo.pricing, price: String(priceInfo.pricing.price) }
        : null,
    minimumColor:
      priceInfo.minimumColor &&
      Object.values(priceInfo.minimumColor).some((v) => v != null)
        ? {
            qty: priceInfo.minimumColor.qty,
            unit: priceInfo.minimumColor.unit,
          }
        : null,
    minimumOrder:
      priceInfo.minimumOrder &&
      Object.values(priceInfo.minimumOrder).some((v) => v != null)
        ? {
            qty: priceInfo.minimumOrder.qty,
            unit: priceInfo.minimumOrder.unit,
          }
        : null,
  }
}

export const mapPricing = (
  pricing: MaterialPriceInfoPricing | null | undefined
) => {
  if (!pricing) {
    return {
      currencyCode: CurrencyCode.USD,
      price: null,
      unit: MaterialQuantityUnit.Y,
    }
  }

  return {
    ...pricing,
    price: Number(pricing.price),
  }
}

export const generateMaterialRow = (): Nullable<MaterialRow> => {
  const generateMaterialSideBase = (): Nullable<MaterialSideBase> => {
    return {
      materialSideId: null,
      frontierNo: null,
      featureList: [],
      finishList: [],
    }
  }

  const generateMaterialSide = (): Nullable<MaterialSide> => {
    return {
      ...generateMaterialSideBase(),
      isMainSide: false,
      sideImage: null,
      u3mImage: null,
      materialType: null,
      descriptionList: [],
      materialTypeConstruction: null,
      construction: {
        isPublic: false,
        warpDensity: null,
        weftDensity: null,
        machineType: null,
        walesPerInch: null,
      },
      contentList: getDefaultContentList(),
      pantoneList: [],
      colorInfo: {
        color: null,
        customPropertyList: [],
      },
      patternInfo: {
        pattern: null,
        customPropertyList: [],
      },
    }
  }

  const generateMaterialMiddleSide = (): Nullable<MaterialMiddleSide> => {
    return {
      ...generateMaterialSideBase(),
      customPropertyList: [],
    }
  }

  return {
    materialId: null,
    isCreate: true,
    isDelete: false,
    isDirty: false,
    editable: true,
    itemNo: null,
    isDoubleSide: false,
    isComposite: false,
    isAutoSyncFaceToBackSideInfo: false,
    sideType: 1,
    seasonInfo: {
      isPublic: false,
      season: null,
      year: null,
    },
    width: {
      cuttable: null,
      full: null,
      unit: null,
    },
    weight: {
      value: null,
      unit: null,
    },
    weightDisplaySetting: {
      isShowWeightGm: false,
      isShowWeightGsm: false,
      isShowWeightGy: false,
      isShowWeightOz: false,
    },
    faceSide: generateMaterialSide(),
    middleSide: generateMaterialMiddleSide(),
    backSide: generateMaterialSide(),
    tagInfo: {
      tagList: [],
      certificationTagList: [],
    },
    priceInfo: {
      countryOfOriginal: null,
      pricing: {
        currencyCode: null,
        price: null,
        unit: null,
      },
      minimumOrder: {
        unit: null,
        qty: null,
      },
      minimumColor: {
        unit: null,
        qty: null,
      },
      productionLeadTimeInDays: null,
      sampleLeadTimeInDays: null,
    },
    internalInfo: {
      tagList: [],
      remark: null,
      priceInfo: {
        countryOfOriginal: null,
        pricing: {
          currencyCode: null,
          price: null,
          unit: null,
        },
        minimumOrder: {
          unit: null,
          qty: null,
        },
        minimumColor: {
          unit: null,
          qty: null,
        },
        productionLeadTimeInDays: null,
        sampleLeadTimeInDays: null,
      },
      inventoryInfo: {
        isTotalPublic: false,
        hangersRemainingList: getDefaultHangersRemainingList(),
        sampleCardsRemainingList: getDefaultHangersRemainingList(),
        yardageRemainingInfo: getDefaultYardageRemainingInfo(),
      },
    },
  }
}

export const mapMaterialToMaterialRow =
  (editable: boolean) =>
  (material: Material): MaterialRow => {
    return {
      ...material,
      isCreate: false,
      isDelete: false,
      isDirty: false,
      editable,
      faceSide: material.faceSide
        ? {
            ...material.faceSide,
            construction: material.faceSide?.construction ?? {},
            contentList: material.faceSide?.contentList?.length
              ? material.faceSide.contentList
              : getDefaultContentList(),
            pantoneNameList:
              material.faceSide?.pantoneList.map((p) => p.name) || [],
          }
        : null,
      backSide: material.backSide
        ? {
            ...material.backSide,
            construction: material.backSide?.construction ?? {},
            contentList: material.backSide?.contentList?.length
              ? material.backSide.contentList
              : getDefaultContentList(),
            pantoneNameList:
              material.backSide?.pantoneList.map((p) => p.name) || [],
          }
        : null,
      seasonInfo: material.seasonInfo || {
        isPublic: false,
        season: null,
        year: null,
      },
      width: material.width || {
        cuttable: null,
        full: null,
        unit: null,
      },
      weight: material.weight || {
        value: null,
        unit: null,
      },
      tagInfo: {
        ...material.tagInfo,
        certificationTagIdList:
          material.tagInfo?.certificationTagList.map((t) => t.certificateId) ||
          [],
      },
      priceInfo: {
        ...material.priceInfo,
        pricing: mapPricing(material.priceInfo?.pricing),
        minimumOrder: material.priceInfo?.minimumOrder || {
          unit: null,
          qty: null,
        },
        minimumColor: material.priceInfo?.minimumColor || {
          unit: null,
          qty: null,
        },
      },
      internalInfo: {
        ...material.internalInfo,
        priceInfo: {
          ...material.internalInfo?.priceInfo,
          pricing: mapPricing(material.internalInfo?.priceInfo?.pricing),
          minimumOrder: material.internalInfo?.priceInfo?.minimumOrder || {
            unit: null,
            qty: null,
          },
          minimumColor: material.internalInfo?.priceInfo?.minimumColor || {
            unit: null,
            qty: null,
          },
        },
        inventoryInfo: {
          ...material.internalInfo?.inventoryInfo,
          hangersRemainingList: material.internalInfo?.inventoryInfo
            .hangersRemainingList?.length
            ? material.internalInfo?.inventoryInfo.hangersRemainingList
            : getDefaultHangersRemainingList(),
          sampleCardsRemainingList: material.internalInfo?.inventoryInfo
            .sampleCardsRemainingList?.length
            ? material.internalInfo?.inventoryInfo.sampleCardsRemainingList
            : getDefaultHangersRemainingList(),
          yardageRemainingInfo:
            material.internalInfo?.inventoryInfo.yardageRemainingInfo != null
              ? material.internalInfo?.inventoryInfo.yardageRemainingInfo
              : getDefaultYardageRemainingInfo(),
        },
      },
    }
  }
