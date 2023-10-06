import { WeightUnit } from '@frontier/platform-web-sdk'

export const weight = (unit: WeightUnit) => {
  const square = String.fromCodePoint(0xb2)
  const map = {
    [WeightUnit.GSM]: `g/m${square}`,
    [WeightUnit.OZ]: `oz/yd${square}`,
    [WeightUnit.GY]: `g/y`,
    [WeightUnit.GM]: `g/m`,
  }

  return map[unit]
}

const unitFormatter = { weight }

export { unitFormatter }
