import { computed, ref } from 'vue'
import { useFieldArray } from 'vee-validate'
import { MaterialType } from '@frontier/platform-web-sdk'
import type { MaterialFormService } from '@/types'

interface ContentItem {
  contentId: number | null
  name: string | null
  percentage: string
}

interface UseMaterialSideOptions {
  side: 'faceSide' | 'backSide'
  materialFormService: MaterialFormService
  inputMenu: any
  pantoneList: any[]
}

export function useMaterialSide({
  side,
  materialFormService,
  inputMenu,
  pantoneList,
}: UseMaterialSideOptions) {
  // Content Section
  const {
    fields: contentFields,
    push: pushContentField,
    remove: removeContentField,
    update: updateContentField,
  } = useFieldArray<ContentItem>(`${side}.contentList`)

  // Material Type Bindings
  const materialTypeValue = materialFormService.defineInputBinds(
    `${side}.materialType`
  )
  const materialTypeConstructionValue = materialFormService.defineInputBinds(
    `${side}.materialTypeConstruction`
  )
  const descriptionList = materialFormService.defineInputBinds(
    `${side}.descriptionList`
  )
  const warpDensity = materialFormService.defineInputBinds(
    `${side}.construction.warpDensity`
  )
  const weftDensity = materialFormService.defineInputBinds(
    `${side}.construction.weftDensity`
  )
  const warpYarnSize = materialFormService.defineInputBinds(
    `${side}.construction.warpYarnSize`
  )
  const weftYarnSize = materialFormService.defineInputBinds(
    `${side}.construction.weftYarnSize`
  )
  const finishList = materialFormService.defineInputBinds(`${side}.finishList`)

  // Construction Publish Binding
  const constructionIsPublic = materialFormService.defineInputBinds(
    `${side}.construction.isPublic`
  )

  // Knit Construction Bindings
  const knitMachineType = materialFormService.defineInputBinds(
    `${side}.construction.machineType`
  )
  const knitWalesPerInch = materialFormService.defineInputBinds(
    `${side}.construction.walesPerInch`
  )
  const knitCoursesPerInch = materialFormService.defineInputBinds(
    `${side}.construction.coursesPerInch`
  )
  const knitYarnSize = materialFormService.defineInputBinds(
    `${side}.construction.yarnSize`
  )
  const knitMachineGauge = materialFormService.defineInputBinds(
    `${side}.construction.machineGaugeInGg`
  )

  // Leather Construction Bindings
  const leatherAverageSkinPerMeterSquare = materialFormService.defineInputBinds(
    `${side}.construction.averageSkinPerMeterSquare`
  )
  const leatherGrade = materialFormService.defineInputBinds(
    `${side}.construction.grade`
  )
  const leatherTannage = materialFormService.defineInputBinds(
    `${side}.construction.tannage`
  )
  const leatherThicknessPerMm = materialFormService.defineInputBinds(
    `${side}.construction.thicknessPerMm`
  )

  // Non-woven Construction Bindings
  const nonWovenBondingMethod = materialFormService.defineInputBinds(
    `${side}.construction.bondingMethod`
  )
  const nonWovenThicknessPerMm = materialFormService.defineInputBinds(
    `${side}.construction.thicknessPerMm`
  )

  // Trim Construction Bindings
  const trimOuterDiameter = materialFormService.defineInputBinds(
    `${side}.construction.outerDiameter`
  )
  const trimLength = materialFormService.defineInputBinds(
    `${side}.construction.length`
  )
  const trimThickness = materialFormService.defineInputBinds(
    `${side}.construction.thickness`
  )
  const trimWidth = materialFormService.defineInputBinds(
    `${side}.construction.width`
  )

  // Dropdown Sources
  const materialTypeDropdownSource = computed(() => {
    const options = inputMenu.materialTypeOptionList.value || []
    return {
      blockList: [
        {
          menuList: options.map((opt: any) => ({
            title: opt.name,
            selectValue: opt.value,
          })),
        },
      ],
    }
  })

  const constructionTypeDropdownSource = computed(() => {
    return inputMenu.specOptions.materialTypeConstructionList
  })

  const contentNameDropdownSource = computed(() => {
    return inputMenu.specOptions.contentList
  })

  // Content Functions
  const selectContentName = (
    name: string | null,
    index: number,
    currentFieldData: ContentItem
  ) => {
    if (name === null || name.length === 0) {
      updateContentField(index, {
        ...currentFieldData,
        contentId: null,
        name: null,
      })
      return
    }

    const targetContent = inputMenu.allContentList.value.find(
      (c: any) => c.name === name
    )
    if (targetContent) {
      updateContentField(index, {
        percentage: currentFieldData.percentage,
        ...targetContent,
      })
    } else {
      updateContentField(index, {
        ...currentFieldData,
        contentId: null,
        name: name,
      })
    }
  }

  const selectMaterialTypeConstruction = (value: any) => {
    let newFieldValue: any

    if (typeof value === 'string') {
      newFieldValue = {
        id: null,
        isCustom: true,
        name: value,
      }
    } else {
      newFieldValue = {
        id: value.id,
        isCustom: !!value.isCustom,
        name: value.name ?? '',
        ...(typeof value === 'object' && value !== null ? value : {}),
      }
    }
    materialTypeConstructionValue.value.onInput(newFieldValue)
  }

  const contentDisplayError = computed(() => {
    const errors = []
    const generalContentError =
      materialFormService.displayErrors.value[`${side}.contentList`]
    if (generalContentError) {
      errors.push(generalContentError)
    }

    for (let i = 0; i < contentFields.value.length; i++) {
      if (
        materialFormService.displayErrors.value[
          `${side}.contentList[${i}].name`
        ]
      ) {
        errors.push(
          materialFormService.displayErrors.value[
            `${side}.contentList[${i}].name`
          ]
        )
      }
      if (
        materialFormService.displayErrors.value[
          `${side}.contentList[${i}].percentage`
        ]
      ) {
        errors.push(
          materialFormService.displayErrors.value[
            `${side}.contentList[${i}].percentage`
          ]
        )
      }
    }
    return errors.length ? [...new Set(errors)].join(', ') : undefined
  })

  // Pantone Functions
  const pantoneColor = ref('')

  const pantoneValueDisplayList = computed(() => {
    return (
      materialFormService.values[side]?.pantoneNameList?.map(
        (pantoneName: string) => {
          const pantone = pantoneList.find(
            (pant: any) => pant.name === pantoneName
          )
          if (!pantone) {
            throw new Error(`Pantone ${pantoneName} not found`)
          }
          return pantone
        }
      ) || []
    )
  })

  const removePantone = (pantone: string) => {
    materialFormService.removePantone(pantone, side)
  }

  const handlePantoneSelection = (value: string) => {
    if (value && value.trim()) {
      materialFormService.addPantone(value.trim(), side)
      pantoneColor.value = ''
    }
  }

  // Helper function to get field errors
  const getFieldError = (fieldPath: string) => {
    return materialFormService.displayErrors.value[`${side}.${fieldPath}`]
  }

  // Check if material type needs construction type
  const needsConstructionType = computed(() => {
    return (
      materialTypeValue.value.value &&
      [MaterialType.WOVEN, MaterialType.KNIT].includes(
        materialTypeValue.value.value
      )
    )
  })

  // Check if material type is specific type
  const isMaterialType = (type: MaterialType) => {
    return materialTypeValue.value.value === type
  }

  return {
    // Content
    contentFields,
    pushContentField,
    removeContentField,
    selectContentName,
    contentDisplayError,

    // Material Type
    materialTypeValue,
    materialTypeConstructionValue,
    selectMaterialTypeConstruction,
    needsConstructionType,
    isMaterialType,

    // Dropdown Sources
    materialTypeDropdownSource,
    constructionTypeDropdownSource,
    contentNameDropdownSource,

    // Form Fields
    descriptionList,
    warpDensity,
    weftDensity,
    warpYarnSize,
    weftYarnSize,
    finishList,
    constructionIsPublic,

    // Knit Fields
    knitMachineType,
    knitWalesPerInch,
    knitCoursesPerInch,
    knitYarnSize,
    knitMachineGauge,

    // Leather Fields
    leatherAverageSkinPerMeterSquare,
    leatherGrade,
    leatherTannage,
    leatherThicknessPerMm,

    // Non-woven Fields
    nonWovenBondingMethod,
    nonWovenThicknessPerMm,

    // Trim Fields
    trimOuterDiameter,
    trimLength,
    trimThickness,
    trimWidth,

    // Pantone
    pantoneColor,
    pantoneValueDisplayList,
    removePantone,
    handlePantoneSelection,

    // Utilities
    getFieldError,
  }
}
