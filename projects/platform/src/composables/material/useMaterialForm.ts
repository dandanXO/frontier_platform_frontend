import { computed, ref, watch } from 'vue'
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { clone } from 'ramda'
import {
  MaterialSideType,
  MaterialType,
  CurrencyCode,
  MaterialQuantityUnit,
  type Material,
  type MaterialOptions,
  type PantoneColor,
} from '@frontier/platform-web-sdk'
import { CREATE_EDIT } from '@/utils/constants'
import useMaterialSchema, {
  getDefaults,
} from '@/composables/material/useMaterialSchema'
import useMaterialInputMenu from '@/composables/material/useMaterialInputMenu'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import { getInventoryQtyInY } from '@/utils/material'
import { z } from 'zod'

configure({ validateOnInput: true })

type PrimarySideKey = 'faceSide' | 'backSide'

const mapMaterialToForm = (
  material: Material
): z.infer<ReturnType<typeof useMaterialSchema>> => {
  return {
    ...material,
    faceSide: material.faceSide
      ? {
          ...material.faceSide,
          contentList: material.faceSide?.contentList?.length
            ? material.faceSide.contentList
            : [{ contentId: null, name: '', percentage: 100 }],
          pantoneList: material.faceSide?.pantoneList.map((p) => p.name) || [],
        }
      : null,
    middleSide: { ...material.middleSide },
    backSide: material.backSide
      ? {
          ...material.backSide,
          contentList: material.backSide?.contentList?.length
            ? material.backSide.contentList
            : [{ contentId: null, name: '', percentage: 100 }],
          pantoneList: material.backSide?.pantoneList.map((p) => p.name) || [],
        }
      : null,
    tagInfo: {
      ...material.tagInfo,
      certificationTagIdList:
        material.tagInfo?.certificationTagList.map((t) => t.certificateId) ||
        [],
    },
    priceInfo: {
      ...material.priceInfo,
      pricing: material.priceInfo?.pricing || {
        currencyCode: CurrencyCode.USD,
        price: null,
        unit: MaterialQuantityUnit.Y,
      },
      minimumOrder: material.priceInfo?.minimumOrder || {
        unit: MaterialQuantityUnit.Y,
        qty: null,
      },
      minimumColor: material.priceInfo?.minimumColor || {
        unit: MaterialQuantityUnit.Y,
        qty: null,
      },
    },
    internalInfo: {
      ...material.internalInfo,
      priceInfo: {
        ...material.internalInfo?.priceInfo,
        pricing: material.internalInfo?.priceInfo?.pricing || {
          currencyCode: CurrencyCode.USD,
          price: null,
          unit: MaterialQuantityUnit.Y,
        },
        minimumOrder: material.internalInfo?.priceInfo?.minimumOrder || {
          unit: MaterialQuantityUnit.Y,
          qty: null,
        },
        minimumColor: material.internalInfo?.priceInfo?.minimumColor || {
          unit: MaterialQuantityUnit.Y,
          qty: null,
        },
      },
      inventoryInfo: {
        ...material.internalInfo?.inventoryInfo,
        hangersRemainingList: material.internalInfo?.inventoryInfo
          .hangersRemainingList?.length
          ? material.internalInfo?.inventoryInfo.hangersRemainingList
          : [
              {
                source: null,
                shelf1: null,
                shelf2: null,
                location: null,
                qtyInPcs: null,
              },
            ],
        sampleCardsRemainingList: material.internalInfo?.inventoryInfo
          .sampleCardsRemainingList?.length
          ? material.internalInfo?.inventoryInfo.sampleCardsRemainingList
          : [
              {
                source: null,
                shelf1: null,
                shelf2: null,
                location: null,
                qtyInPcs: null,
              },
            ],
        yardageRemainingInfo:
          material.internalInfo?.inventoryInfo.yardageRemainingInfo != null
            ? material.internalInfo?.inventoryInfo.yardageRemainingInfo
            : {
                unit: MaterialQuantityUnit.Y,
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
              },
      },
    },
  }
}

const useMaterialForm = ({
  material,
  materialOptions,
  pantoneList,
}: {
  material?: Material
  materialOptions: MaterialOptions
  pantoneList?: PantoneColor[]
}) => {
  const materialSchema = useMaterialSchema()

  const materialSchemaWithPreprocess = z.preprocess((val) => {
    const material = val as z.infer<typeof materialSchema>
    if (material.isDoubleSide) {
      if (material.isComposite) {
        return material
      } else {
        return {
          ...material,
          backSide: {
            ...material.backSide,
            contentList: null,
          },
        }
      }
    }
    if (material.sideType === MaterialSideType.FACE_SIDE) {
      return { ...material, backSide: null }
    }
    if (material.sideType === MaterialSideType.BACK_SIDE) {
      return { ...material, faceSide: null }
    }
  }, materialSchema)

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
    // initialValues: mapMaterialToForm(material),
    initialValues: material
      ? mapMaterialToForm(material)
      : (getDefaults(materialSchema) as z.infer<
          ReturnType<typeof useMaterialSchema>
        >),
    validationSchema: toTypedSchema(
      materialSchemaWithPreprocess
    ) as typeof materialSchema,
  })

  const mode = computed(() =>
    material != null ? CREATE_EDIT.EDIT : CREATE_EDIT.CREATE
  )

  const currentMaterialSide = ref<MATERIAL_SIDE_TYPE>(MATERIAL_SIDE_TYPE.FACE)

  const inputMenu = useMaterialInputMenu(
    values,
    materialOptions,
    currentMaterialSide
  )

  const displayErrors = computed(() => {
    if (mode.value === CREATE_EDIT.CREATE && submitCount.value > 0) {
      return errors.value
    }

    if (mode.value === CREATE_EDIT.EDIT) {
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

  const selectSeason = (name: string) => {
    const targetSeason = inputMenu.allSeasonList.value.find(
      (s) => s.name === name
    )
    setFieldValue('seasonInfo.season.name', name)
    setFieldValue('seasonInfo.season.seasonId', targetSeason?.seasonId)
  }

  const addPantone = (newPantoneCode: string, sideKey: PrimarySideKey) => {
    const oldValues = values[sideKey]?.pantoneList || []

    if (oldValues.includes(newPantoneCode)) {
      return
    }

    if (!pantoneList?.find((p) => p.name === newPantoneCode)) {
      return
    }

    setFieldValue(`${sideKey}.pantoneList`, [...oldValues, newPantoneCode])
  }

  const removePantone = (pantoneCode: string, sideKey: PrimarySideKey) => {
    const oldValues = values[sideKey]?.pantoneList || []
    setFieldValue(
      `${sideKey}.pantoneList`,
      oldValues.filter((p) => p !== pantoneCode)
    )
  }

  const updatePantoneList = ({
    faceSidePantoneList,
    backSidePantoneList,
  }: {
    faceSidePantoneList: string[] | null
    backSidePantoneList: string[] | null
  }) => {
    if (faceSidePantoneList) {
      setFieldValue(`faceSide.pantoneList`, faceSidePantoneList)
    }
    if (backSidePantoneList) {
      setFieldValue(`backSide.pantoneList`, backSidePantoneList)
    }
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

  return {
    mode,
    values,
    displayErrors,
    errors,
    meta,
    pantoneList,
    defineInputBinds,
    submitCount,
    currentMaterialSide,
    totalInventoryQtyInY,
    handleSubmit,
    setFieldValue,
    selectSeason,
    addPantone,
    removePantone,
    updatePantoneList,
    validate,
    copyFaceSideToBackSide,
    clearMaterialTypeConstructionFields,
    inputMenu,
  }
}

export default useMaterialForm
