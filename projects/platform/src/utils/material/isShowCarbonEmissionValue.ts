import type { Material } from '@frontier/platform-web-sdk'
import isTrimOrOthersType from './isTrimOrOthersType'

// F22-3581 Don't show Eco-impactor number when the material type is others or trim
export default function (material: Material): boolean {
  return (
    !material.isDoubleSide &&
    !!material.carbonEmission &&
    isTrimOrOthersType(material)
  )
}
