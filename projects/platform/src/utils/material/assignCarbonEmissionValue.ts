import type { Material } from '@frontier/platform-web-sdk'
import isShowCarbonEmissionValue from './isShowCarbonEmissionValue'

const assignCarbonEmissionValue = (material: Material) => {
  const newMaterial = { ...material }

  if (isShowCarbonEmissionValue(newMaterial)) {
    newMaterial.carbonEmission = null
  }

  return newMaterial
}

export default assignCarbonEmissionValue
