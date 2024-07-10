import type { Material } from '@frontier/platform-web-sdk'
import { MaterialType } from '@frontier/platform-web-sdk'

const EXCLUDED_TYPES: readonly MaterialType[] = [
  MaterialType.OTHERS,
  MaterialType.TRIM,
]

function isExcludedMaterialType(
  materialType: MaterialType | undefined
): boolean {
  return materialType !== undefined && EXCLUDED_TYPES.includes(materialType)
}

export default function isTrimOrOthersType(material: Material): boolean {
  return (
    isExcludedMaterialType(material.faceSide?.materialType) ||
    isExcludedMaterialType(material.backSide?.materialType)
  )
}
