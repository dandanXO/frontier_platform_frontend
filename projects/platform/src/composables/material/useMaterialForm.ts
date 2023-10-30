import { computed, ref, watch } from 'vue'
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  MaterialSideType,
  type Material,
  type MaterialOptionsCode,
  MaterialType,
} from '@frontier/platform-web-sdk'
import useMaterialSchema from '@/composables/material/useMaterialSchema'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import { clone } from 'ramda'
import useMaterialInputMenu from '@/composables/material/useMaterialInputMenu'
import { getInventoryQtyInY } from '@/utils/material'

configure({ validateOnInput: true })

type PrimarySideKey = 'faceSide' | 'backSide'

const useMaterialForm = ({
  material,
  materialOptions,
}: {
  material?: Material
  materialOptions: MaterialOptionsCode
}) => {
  const materialSchema = useMaterialSchema()

  const {
    values,
    defineInputBinds,
    setFieldValue,
    setValues,
    errors,
    meta,
    validate,
    handleSubmit,
    submitCount,
  } = useForm({
    initialValues: material,
    validationSchema: toTypedSchema(materialSchema),
  })

  const currentMaterialSide = ref<MATERIAL_SIDE_TYPE>(MATERIAL_SIDE_TYPE.FACE)

  const inputMenu = useMaterialInputMenu(
    values,
    materialOptions,
    currentMaterialSide
  )

  const clearMaterialDescription = (sideKey: PrimarySideKey) => {
    setFieldValue(`${sideKey}.descriptionList`, [])
  }

  const clearWovenConstruction = (sideKey: PrimarySideKey) => {
    setFieldValue(`${sideKey}.construction.warpDensity`, null)
    setFieldValue(`${sideKey}.construction.weftDensity`, null)
    setFieldValue(`${sideKey}.construction.warpYarnSize`, null)
    setFieldValue(`${sideKey}.construction.weftYarnSize`, null)
  }

  const clearKnitConstruction = (sideKey: PrimarySideKey) => {
    setFieldValue(`${sideKey}.construction.machineType`, null)
    setFieldValue(`${sideKey}.construction.walesPerInch`, null)
    setFieldValue(`${sideKey}.construction.coursesPerInch`, null)
    setFieldValue(`${sideKey}.construction.yarnSize`, null)
    setFieldValue(`${sideKey}.construction.machineGaugeInGg`, null)
  }

  const clearLeatherConstruction = (sideKey: PrimarySideKey) => {
    setFieldValue(`${sideKey}.construction.averageSkinPerMeterSquare`, null)
    setFieldValue(`${sideKey}.construction.grade`, null)
    setFieldValue(`${sideKey}.construction.tannage`, null)
    setFieldValue(`${sideKey}.construction.thicknessPerMm`, null)
  }

  const clearNonWovenConstruction = (sideKey: PrimarySideKey) => {
    setFieldValue(`${sideKey}.construction.bondingMethod`, null)
    setFieldValue(`${sideKey}.construction.thicknessPerMm`, null)
  }

  const clearTrimConstruction = (sideKey: PrimarySideKey) => {
    setFieldValue(`${sideKey}.construction.outerDiameter`, null)
    setFieldValue(`${sideKey}.construction.length`, null)
    setFieldValue(`${sideKey}.construction.thickness`, null)
    setFieldValue(`${sideKey}.construction.width`, null)
  }

  const clearMaterialTypeConstructionFields = (sideKey: PrimarySideKey) => {
    clearMaterialDescription(sideKey)

    const materialType = values[sideKey]?.materialType
    switch (materialType) {
      case MaterialType.WOVEN: {
        clearKnitConstruction(sideKey)
        clearLeatherConstruction(sideKey)
        clearNonWovenConstruction(sideKey)
        clearTrimConstruction(sideKey)
        break
      }
      case MaterialType.KNIT: {
        clearWovenConstruction(sideKey)
        clearLeatherConstruction(sideKey)
        clearNonWovenConstruction(sideKey)
        clearTrimConstruction(sideKey)
        break
      }
      case MaterialType.LEATHER: {
        clearWovenConstruction(sideKey)
        clearKnitConstruction(sideKey)
        clearNonWovenConstruction(sideKey)
        clearTrimConstruction(sideKey)
        break
      }
      case MaterialType.NON_WOVEN: {
        clearWovenConstruction(sideKey)
        clearKnitConstruction(sideKey)
        clearLeatherConstruction(sideKey)
        clearTrimConstruction(sideKey)
        break
      }
      case MaterialType.TRIM: {
        clearWovenConstruction(sideKey)
        clearKnitConstruction(sideKey)
        clearLeatherConstruction(sideKey)
        clearNonWovenConstruction(sideKey)
        break
      }
      case undefined: {
        clearWovenConstruction(sideKey)
        clearKnitConstruction(sideKey)
        clearLeatherConstruction(sideKey)
        clearNonWovenConstruction(sideKey)
        clearTrimConstruction(sideKey)
        break
      }
    }
  }

  const copyFaceSideToBackSide = () => {
    const faceSide = values.faceSide
    if (!faceSide) {
      return
    }

    setValues({ backSide: clone(faceSide) })
  }

  watch(
    () => values.isDoubleSide,
    () => {
      if (values.isDoubleSide) {
        currentMaterialSide.value = MATERIAL_SIDE_TYPE.FACE
      }
    }
  )

  watch(
    () => values.isComposite,
    () => {
      if (currentMaterialSide.value !== MATERIAL_SIDE_TYPE.MIDDLE) {
        return
      }

      if (
        !values.isDoubleSide &&
        values.sideType === MaterialSideType.BACK_SIDE
      ) {
        currentMaterialSide.value = MATERIAL_SIDE_TYPE.BACK
      } else {
        currentMaterialSide.value = MATERIAL_SIDE_TYPE.FACE
      }
    }
  )

  watch(
    () => values.sideType,
    () => {
      if (values.isDoubleSide) {
        return
      }
      if (values.sideType === MaterialSideType.FACE_SIDE) {
        currentMaterialSide.value = MATERIAL_SIDE_TYPE.FACE
      }
      if (values.sideType === MaterialSideType.BACK_SIDE) {
        currentMaterialSide.value = MATERIAL_SIDE_TYPE.BACK
      }
    }
  )

  watch(
    () => values.isAutoSyncFaceToBackSideInfo,
    () => {
      if (values.isAutoSyncFaceToBackSideInfo) {
        copyFaceSideToBackSide()
      }
    }
  )

  watch(
    () => values.faceSide,
    () => {
      if (values.isAutoSyncFaceToBackSideInfo) {
        copyFaceSideToBackSide()
      }
    },
    { deep: true }
  )

  const displayErrors = computed(() => {
    if (submitCount.value > 0) {
      return errors.value
    }

    return {}
  })

  const totalInventoryQtyInY = computed(() => {
    const fullWidth = values.width?.full
    const widthUnit = values.width?.unit
    const weightValue = values.weight?.value
    const weightUnit = values.weight?.unit
    const inventoryList =
      values.internalInfo?.inventoryInfo?.yardageRemainingInfo?.list || []
    const inventoryUnit =
      values.internalInfo?.inventoryInfo?.yardageRemainingInfo?.unit

    if (
      !fullWidth ||
      !widthUnit ||
      !weightUnit ||
      !weightValue ||
      !inventoryUnit ||
      !inventoryList
    ) {
      return 0
    }

    const inventoryTotalQty = inventoryList
      .map((a) => a.qty || 0)
      .reduce((prev, current) => prev + current, 0)

    return getInventoryQtyInY(
      fullWidth,
      widthUnit,
      weightValue,
      weightUnit,
      inventoryTotalQty,
      inventoryUnit
    )
  })

  const selectSeason = (name: string) => {
    const targetSeason = inputMenu.allSeasonList.value.find(
      (s) => s.name === name
    )
    setFieldValue('seasonInfo.season.name', name)
    setFieldValue('seasonInfo.season.seasonId', targetSeason?.seasonId)
  }

  return {
    defineInputBinds,
    values,
    errors,
    displayErrors,
    meta,
    submitCount,
    currentMaterialSide,
    totalInventoryQtyInY,
    handleSubmit,
    setFieldValue,
    selectSeason,
    validate,
    copyFaceSideToBackSide,
    clearMaterialTypeConstructionFields,
    inputMenu,
  }
}

export default useMaterialForm
