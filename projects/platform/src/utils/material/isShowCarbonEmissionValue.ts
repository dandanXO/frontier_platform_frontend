import type { Material } from '@frontier/platform-web-sdk'
import { MaterialType } from '@frontier/platform-web-sdk'

// F22-3581 Don't show Eco-impactor number when the material type is others or trim
export default function (material: Material): boolean {
  const excludedTypes = [MaterialType.OTHERS, MaterialType.TRIM]
  return (
    !material.isDoubleSide &&
    (excludedTypes.includes(material.faceSide?.materialType) ||
      excludedTypes.includes(material.backSide?.materialType))
  )
}
