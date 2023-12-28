import {
  LengthUnit,
  MaterialQuantityUnit,
  WeightUnit,
  type MaterialPriceInfo,
  type MaterialInternalInventoryInfo,
  type MaterialInternalInventoryInfoSampleCardsRemainingListInner,
} from '@frontier/platform-web-sdk'
import { CM_PER_INCH, toDP2 } from './cropper'

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

export const getInventoryQtyInY = (
  fullWidthValue: number,
  widthUnit: LengthUnit,
  weightValue: number,
  weightUnit: WeightUnit,
  inventoryQty: number,
  inventoryUnit: MaterialQuantityUnit
) => {
  const fullWidthInInch =
    widthUnit === LengthUnit.CM ? cmToInch(fullWidthValue) : fullWidthValue

  const toQtyInY = () => {
    switch (inventoryUnit) {
      case MaterialQuantityUnit.Y: {
        return inventoryQty
      }
      case MaterialQuantityUnit.M: {
        return toDP2(inventoryQty / 0.9114)
      }
      case MaterialQuantityUnit.KG: {
        const gsm = toGSM(weightValue, weightUnit, fullWidthInInch)
        return toDP2(inventoryQty / (gsm * 0.02323 * fullWidthInInch) / 1000)
      }
    }
  }

  const totalInventoryInY = toQtyInY()
  return totalInventoryInY
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

  const processYardageRemainingInfo = (
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
