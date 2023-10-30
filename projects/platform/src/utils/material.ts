import {
  LengthUnit,
  MaterialQuantityUnit,
  WeightUnit,
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
