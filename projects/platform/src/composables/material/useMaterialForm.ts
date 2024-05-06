import { computed, ref, watch } from 'vue'
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { clone } from 'ramda'
import {
  MaterialSideType,
  MaterialType,
  CurrencyCode,
  MaterialQuantityUnit,
  type Material,
  type MaterialOptions,
  type PantoneColor,
  type MaterialPriceInfoPricing,
  LengthUnit,
  WeightUnit,
} from '@frontier/platform-web-sdk'
import { CREATE_EDIT } from '@/utils/constants'
import useMaterialSchema, {
  getDefaults,
} from '@/composables/material/useMaterialSchema'
import useMaterialInputMenu from '@/composables/material/useMaterialInputMenu'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import { getTotalInventoryQty } from '@/utils/material'

configure({ validateOnInput: true })

type PrimarySideKey = 'faceSide' | 'backSide'

const mapPricing = (pricing: MaterialPriceInfoPricing | null | undefined) => {
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

const mapMaterialToForm = (
  material: Material
): z.infer<ReturnType<typeof useMaterialSchema>> => {
  return {
    ...material,
    faceSide: material.faceSide
      ? {
          ...material.faceSide,
          construction: material.faceSide?.construction ?? {},
          materialType: material.faceSide?.materialType || MaterialType.WOVEN,
          contentList: material.faceSide?.contentList?.length
            ? material.faceSide.contentList
            : [{ contentId: null, name: '', percentage: null }],
          pantoneNameList:
            material.faceSide?.pantoneList.map((p) => p.name) || [],
        }
      : null,
    backSide: material.backSide
      ? {
          ...material.backSide,
          materialType: material.backSide?.materialType || MaterialType.WOVEN,
          construction: material.backSide?.construction ?? {},
          contentList: material.backSide?.contentList?.length
            ? material.backSide.contentList
            : [{ contentId: null, name: '', percentage: null }],
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
      unit: LengthUnit.INCH,
    },
    weight: material.weight || {
      value: null,
      unit: WeightUnit.GSM,
    },
    weightDisplaySetting: material.weightDisplaySetting || {
      isShowWeightGm: false,
      isShowWeightOz: false,
      isShowWeightGy: false,
      isShowWeightGsm: false,
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
        pricing: mapPricing(material.internalInfo?.priceInfo?.pricing),
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
            contentList: material.faceSide?.contentList,
            materialType: material.faceSide?.materialType || MaterialType.WOVEN,
            construction: material.faceSide?.construction,
            constructionCustomPropertyList:
              material.faceSide?.constructionCustomPropertyList,
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

  const currentMaterialSide = ref<MATERIAL_SIDE_TYPE>(
    material?.sideType === MaterialSideType.BACK_SIDE
      ? MATERIAL_SIDE_TYPE.BACK
      : MATERIAL_SIDE_TYPE.FACE
  )

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

  const inventoryUnit = computed(() => {
    return values.internalInfo?.inventoryInfo?.yardageRemainingInfo?.unit ===
      'PCS'
      ? 'PCS'
      : 'Y'
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

    return getTotalInventoryQty(
      fullWidth,
      widthUnit,
      weightValue,
      weightUnit,
      inventoryTotalQty,
      inventoryUnit
    )
  })

  const isSpecificationTabValid = computed(() => {
    return !Object.keys(displayErrors.value).some((key) => {
      if (
        key === 'itemNo' ||
        key.startsWith('season') ||
        key.startsWith('faceSide') ||
        key.startsWith('middleSide') ||
        key.startsWith('backSide') ||
        key.startsWith('weight') ||
        key.startsWith('width')
      ) {
        return true
      }

      return false
    })
  })

  const isTagTabValid = computed(() => {
    return !Object.keys(displayErrors.value).some((key) => {
      if (
        key.startsWith('tagInfo') ||
        key.startsWith('internalInfo.tagList') ||
        key === 'internalInfo.remark'
      ) {
        return true
      }

      return false
    })
  })

  const isPricingTabValid = computed(() => {
    return !Object.keys(displayErrors.value).some((key) => {
      if (
        key.startsWith('priceInfo') ||
        key.startsWith('internalInfo.priceInfo')
      ) {
        return true
      }

      return false
    })
  })

  const isInventoryTabValid = computed(() => {
    return !Object.keys(displayErrors.value).some((key) => {
      if (
        key === 'internalInfo.nativeCode' ||
        key.startsWith('internalInfo.inventoryInfo')
      ) {
        return true
      }

      return false
    })
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
    if (!name) {
      setFieldValue('seasonInfo.season', null)
      return
    }
    const targetSeason = inputMenu.allSeasonList.value.find(
      (s) => s.name === name
    )
    setFieldValue('seasonInfo.season.name', name)
    setFieldValue('seasonInfo.season.seasonId', targetSeason?.seasonId)
  }

  const addPantone = (newPantoneCode: string, sideKey: PrimarySideKey) => {
    const oldValues = values[sideKey]?.pantoneNameList || []

    if (oldValues.includes(newPantoneCode)) {
      return
    }

    if (!pantoneList?.find((p) => p.name === newPantoneCode)) {
      return
    }

    setFieldValue(`${sideKey}.pantoneNameList`, [...oldValues, newPantoneCode])
  }

  const removePantone = (pantoneCode: string, sideKey: PrimarySideKey) => {
    const oldValues = values[sideKey]?.pantoneNameList || []
    setFieldValue(
      `${sideKey}.pantoneNameList`,
      oldValues.filter((p) => p !== pantoneCode)
    )
  }

  const updatePantoneList = ({
    faceSidePantoneNameList,
    backSidePantoneNameList,
  }: {
    faceSidePantoneNameList: string[] | null
    backSidePantoneNameList: string[] | null
  }) => {
    if (faceSidePantoneNameList) {
      setFieldValue(`faceSide.pantoneNameList`, faceSidePantoneNameList)
    }
    if (backSidePantoneNameList) {
      setFieldValue(`backSide.pantoneNameList`, backSidePantoneNameList)
    }
  }

  watch(
    () => values.weight.unit,
    (newValue, oldValue) => {
      const getFieldName = (weightUnit: WeightUnit) => {
        switch (weightUnit) {
          case WeightUnit.GM:
            return `weightDisplaySetting.isShowWeightGm`
          case WeightUnit.GSM:
            return `weightDisplaySetting.isShowWeightGsm`
          case WeightUnit.GY:
            return `weightDisplaySetting.isShowWeightGy`
          case WeightUnit.OZ:
            return `weightDisplaySetting.isShowWeightOz`
          default:
            throw new Error('Invalid weight unit')
        }
      }
      setFieldValue(getFieldName(newValue), true)
      setFieldValue(getFieldName(oldValue), false)
    }
  )

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

  watch(
    () => values.seasonInfo,
    (seasonInfo) => {
      if (!seasonInfo.isPublic) {
        return
      }

      if (!seasonInfo.season || seasonInfo.year == null) {
        setFieldValue('seasonInfo.isPublic', false)
      }
    },
    { deep: true }
  )

  return {
    mode,
    values,
    displayErrors,
    errors,
    isSpecificationTabValid,
    isTagTabValid,
    isPricingTabValid,
    isInventoryTabValid,
    meta,
    pantoneList,
    defineInputBinds,
    submitCount,
    currentMaterialSide,
    inventoryUnit,
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
