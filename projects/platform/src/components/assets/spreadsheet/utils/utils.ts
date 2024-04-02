import type { MaterialRow } from '@/types'
import { generateMaterialRow } from '@/utils/material'
import {
  CurrencyCode,
  LengthUnit,
  MaterialQuantityUnit,
  MaterialSideType,
  MaterialType,
  WeightUnit,
} from '@frontier/platform-web-sdk'
import type { GridApi } from 'ag-grid-enterprise'
import type { Ref } from 'vue'
import { read, type WorkBook } from 'xlsx'

export const convertDataToWorkbook = (dataRows: any) => {
  /* convert data to binary string */
  let data = new Uint8Array(dataRows)
  let arr = []

  for (let i = 0; i !== data.length; ++i) {
    arr[i] = String.fromCharCode(data[i])
  }

  let bstr = arr.join('')

  return read(bstr, { type: 'binary' })
}

export function populateGrid(
  workbook: WorkBook,
  gridApi: Ref<GridApi<MaterialRow> | undefined>
) {
  // our data is in the first sheet
  let firstSheetName = workbook.SheetNames[0]
  let worksheet = workbook.Sheets[firstSheetName]

  // we expect the following columns to be present
  const columnKeys = (function generateKeys() {
    const keys = []
    // ASCII value of 'A' is 65 and 'Z' is 90
    for (let i = 65; i <= 90; i++) {
      keys.push(String.fromCharCode(i))
    }
    // Generate keys from 'AA' to 'AZ'
    for (let i = 65; i <= 90; i++) {
      keys.push('A' + String.fromCharCode(i))
    }
    // Generate keys from 'BA' to 'BZ'
    for (let i = 65; i <= 90; i++) {
      keys.push('B' + String.fromCharCode(i))
    }
    // Add 'CA' and 'CB'
    keys.push('CA', 'CB')
    return keys
  })()

  let rowData: Record<string, string>[] = []

  // start at the 11th row - the first 10 rows are the headers and descriptions
  let rowIndex = 11

  // iterate over the worksheet pulling out the columns we're expecting
  while (worksheet['A' + rowIndex]) {
    let row: Record<string, string> = {}
    columnKeys.forEach((column) => {
      if (!worksheet[column + 2]?.w?.trim()) {
        return
      }

      row[worksheet[column + 2].w.trim()] = worksheet[column + rowIndex]
        ? worksheet[column + rowIndex].w.trim()
        : ''
    })

    rowData.push(row)

    rowIndex++
  }
  // finally, set the imported rowData into the grid
  let addIndex = 0
  const newMaterialRowData = parseExcelToMaterialFormat(rowData)
  gridApi.value?.applyTransaction({ add: newMaterialRowData, addIndex })
}

interface ExcelRow {
  [key: string]: string
}

function parseExcelToMaterialFormat(excelData: ExcelRow[]) {
  const materialData = excelData.map((row) => {
    const sideKey =
      !row['ST1'] ||
      row['ST1'].trim().toLowerCase() === 'Face Side'.trim().toLowerCase()
        ? 'faceSide'
        : 'backSide'
    const newRow = generateMaterialRow()
    for (const key of Object.keys(row)) {
      if (!row[key] || row[key].trim() === '') {
        continue
      }
      switch (key) {
        // Color
        case 'COL_Color_1':
          newRow[sideKey]!.colorInfo.color = row.COL_Color_1.trim()
          break
        case 'COL_Field_1':
        case 'COL_Pub_1':
        case 'COL_Val_1':
          if (row.COL_Field_1.trim() || row.COL_Val_1.trim()) {
            if (!newRow[sideKey]!.colorInfo.customPropertyList) {
              newRow[sideKey]!.colorInfo.customPropertyList = []
            }
            newRow[sideKey]!.colorInfo.customPropertyList[0] = {
              value: row.COL_Field_1.trim(),
              name: row.COL_Val_1.trim(),
              isPublic: parseYesNoValue(row.COL_Pub_1, true),
            }
          }
          break

        // Content
        case 'CON_1':
        case 'CON_2':
          const contentNameList = convertStringToList(
            row.CON_1,
            (contentName) => contentName.trim()
          )
          const contentPercentageList = convertStringToList(
            row.CON_2,
            (percentage) => boundedNumber(percentage, 0, 100)
          )
          const combinedList = contentNameList.map((contentName, index) => {
            return {
              name: contentName,
              percentage: contentPercentageList[index] || 0,
              contentId: null,
            }
          })
          newRow[sideKey]!.contentList = combinedList
          break
        case 'Column ID [DO NOT DELETE]':
          newRow.itemNo = row['Column ID [DO NOT DELETE]'].trim()
          break

        // Features
        case 'FE1':
          newRow[sideKey]!.featureList = convertStringToList(
            row.FE1,
            (feature) => feature.trim()
          )
          break

        // Finish
        case 'FIN_1':
          newRow[sideKey]!.finishList = convertStringToList(
            row.FIN_1,
            (name) => {
              return { name: name.trim(), finishId: null }
            }
          )
          break

        // Inventory
        case 'IN_Cards_1':
          newRow.internalInfo!.inventoryInfo.sampleCardsRemainingList![0].qtyInPcs =
            boundedNumber(row.IN_Cards_1, 1, 999)
          break
        case 'IN_Cards_2':
          newRow.internalInfo!.inventoryInfo.sampleCardsRemainingList![0].shelf1 =
            row.IN_Cards_2.trim()
          break
        case 'IN_Cards_3':
          newRow.internalInfo!.inventoryInfo.sampleCardsRemainingList![0].shelf2 =
            row.IN_Cards_3.trim()
          break
        case 'IN_Cards_4':
          newRow.internalInfo!.inventoryInfo.sampleCardsRemainingList![0].location =
            row.IN_Cards_4.trim()
          break
        case 'IN_Hanger_1':
          newRow.internalInfo!.inventoryInfo.hangersRemainingList![0].source =
            row.IN_Hanger_1.trim()
          break
        case 'IN_Hanger_2':
          newRow.internalInfo!.inventoryInfo.hangersRemainingList![0].qtyInPcs =
            boundedNumber(row.IN_Hanger_2, 1, 999)
          break
        case 'IN_Hanger_3':
          newRow.internalInfo!.inventoryInfo.hangersRemainingList![0].shelf1 =
            row.IN_Hanger_3.trim()
          break
        case 'IN_Hanger_4':
          newRow.internalInfo!.inventoryInfo.hangersRemainingList![0].shelf2 =
            row.IN_Hanger_4.trim()
          break
        case 'IN_Hanger_5':
          newRow.internalInfo!.inventoryInfo.hangersRemainingList![0].location =
            row.IN_Hanger_5.trim()
          break
        case 'IN_MAT_1':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.list[0].productionNo =
            row.IN_MAT_1.trim()
          break
        case 'IN_MAT_2':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.list[0].source =
            row.IN_MAT_2.trim()
          break
        case 'IN_MAT_3':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.list[0].roll =
            row.IN_MAT_3.trim()
          break
        case 'IN_MAT_4':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.list[0].lot =
            row.IN_MAT_4.trim()
          break
        case 'IN_MAT_5':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.list[0].qty =
            boundedNumber(row.IN_MAT_5, 1, 999999)
          break
        case 'IN_MAT_6':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.unit =
            getMaterialQuantityUnit(row.IN_MAT_6)
          break
        case 'IN_MAT_7':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.list[0].shelf1 =
            row.IN_MAT_7.trim()
          break
        case 'IN_MAT_8':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.list[0].shelf2 =
            row.IN_MAT_8.trim()
          break
        case 'IN_MAT_9':
          newRow.internalInfo!.inventoryInfo.yardageRemainingInfo!.list[0].location =
            row.IN_MAT_9.trim()
          break
        case 'IN_Native':
          newRow.internalInfo!.nativeCode = row.IN_Native.trim()
          break
        case 'IN_Source':
          newRow.internalInfo!.inventoryInfo!.sampleCardsRemainingList![0].source =
            row.IN_Source.trim()
          break

        // Material Info
        case 'MI_MatDesc':
          newRow[sideKey]!.descriptionList = convertStringToList(
            row.MI_MatDesc,
            (desc) => {
              return {
                descriptionId: null,
                name: desc.trim(),
              }
            }
          )
          break
        case 'MI_MatType':
          const materialTypeKey = row.MI_MatType.trim().toUpperCase()
          const materialTypeValue =
            MaterialType[materialTypeKey as keyof typeof MaterialType]
          newRow[sideKey]!.materialType = materialTypeValue
          break
        case 'MI_PUB_1':
          newRow[sideKey]!.construction.isPublic = parseYesNoValue(
            row.MI_PUB_1,
            true
          )
          break
        case 'MI_NewField_1':
        case 'MI_NewName_1':
        case 'MI_PUB_2':
          if (row.MI_NewField_1.trim() || row.MI_NewName_1.trim()) {
            if (!newRow[sideKey]!.constructionCustomPropertyList) {
              newRow[sideKey]!.constructionCustomPropertyList = []
            }
            newRow[sideKey]!.constructionCustomPropertyList[0] = {
              value: row.MI_NewField_1.trim(),
              name: row.MI_NewName_1.trim(),
              isPublic: parseYesNoValue(row.MI_PUB_2, true),
            }
          }
          break

        // Material Type: Woven
        case 'MIW_Cons_1':
          newRow[sideKey]!.construction.warpDensity = boundedNumber(
            row.MIW_Cons_1,
            0,
            999
          )
          break
        case 'MIW_Cons_2':
          newRow[sideKey]!.construction.weftDensity = boundedNumber(
            row.MIW_Cons_2,
            0,
            999
          )
          break
        case 'MIW_Cons_3':
          newRow[sideKey]!.construction.warpYarnSize = row.MIW_Cons_3.trim()
          break
        case 'MIW_Cons_4':
          newRow[sideKey]!.construction.weftYarnSize = boundedNumber(
            row.MIW_Cons_4,
            0,
            999
          )
          break

        // Material Type: Knit
        case 'MIK_Cons_1':
          newRow[sideKey]!.construction.machineType = row.MIK_Cons_1.trim()
          break
        case 'MIK_Cons_2':
          newRow[sideKey]!.construction.walesPerInch = boundedNumber(
            row.MIK_Cons_2,
            0,
            999
          )
          break
        case 'MIK_Cons_3':
          newRow[sideKey]!.construction.coursesPerInch = boundedNumber(
            row.MIK_Cons_3,
            0,
            999
          )
          break
        case 'MIK_Cons_4':
          newRow[sideKey]!.construction.yarnSize = row.MIK_Cons_4.trim()
          break
        case 'MIK_Cons_5':
          newRow[sideKey]!.construction.machineGaugeInGg = boundedNumber(
            row.MIK_Cons_5,
            0,
            999
          )
          break

        // Material Type: Leather
        case 'MIL_Average':
          newRow[sideKey]!.construction.averageSkinPerMeterSquare =
            row.MIL_Average.trim()
          break
        case 'MIL_Grade':
          newRow[sideKey]!.construction.grade = row.MIL_Grade.trim()
          break
        case 'MIL_Tannage':
          newRow[sideKey]!.construction.tannage = row.MIL_Tannage.trim()
          break
        case 'MIL_Thickness':
          newRow[sideKey]!.construction.thicknessPerMm = boundedNumber(
            row.MIL_Thickness,
            0,
            999
          )
          break

        // Material Type: Non-Woven
        case 'MIN_Bond':
          newRow[sideKey]!.construction.bondingMethod = row.MIN_Bond.trim()
          break
        case 'MIN_Thick':
          newRow[sideKey]!.construction.thicknessPerMm = boundedNumber(
            row.MIN_Thick,
            0,
            999
          )
          break

        // Material Type: Trim
        case 'MIT_Diameter':
          newRow[sideKey]!.construction.outerDiameter = row.MIT_Diameter.trim()
          break
        case 'MIT_Length':
          newRow[sideKey]!.construction.length = row.MIT_Length.trim()
          break
        case 'MIT_Thickness':
          newRow[sideKey]!.construction.thickness = row.MIT_Thickness.trim()
          break
        case 'MIT_Width':
          newRow[sideKey]!.construction.width = boundedNumber(
            row.MIT_Width,
            0,
            999
          )
          break

        // Pattern
        case 'PAT_Pattern_1':
          newRow[sideKey]!.patternInfo!.pattern = row.PAT_Pattern_1.trim()
          break
        case 'PAT_Field_1':
        case 'PAT_Pub_1':
        case 'PAT_Val_1':
          if (row.PAT_Field_1.trim() || row.PAT_Val_1.trim()) {
            if (!newRow[sideKey]!.patternInfo!.customPropertyList) {
              newRow[sideKey]!.patternInfo!.customPropertyList = []
            }
            newRow[sideKey]!.patternInfo!.customPropertyList[0] = {
              value: row.PAT_Field_1.trim(),
              name: row.PAT_Val_1.trim(),
              isPublic: parseYesNoValue(row.PAT_Pub_1, true),
            }
          }
          break

        // Pricing
        case 'PR_Currency':
          newRow.priceInfo!.pricing!.currencyCode =
            CurrencyCode[
              row.PR_Currency.trim().toUpperCase() as keyof typeof CurrencyCode
            ] || 'USD'
          break
        case 'PR_MCQ':
          newRow.priceInfo!.minimumColor!.qty = boundedNumber(
            row.PR_MCQ,
            0,
            999999
          )
          break
        case 'PR_MOQ':
          newRow.priceInfo!.minimumOrder!.qty = boundedNumber(
            row.PR_MOQ,
            0,
            999999
          )
          break
        case 'PR_Origin':
          newRow.priceInfo!.countryOfOriginal = row.PR_Origin.trim()
          break
        case 'PR_Price':
          newRow.priceInfo!.pricing!.price = boundedNumber(
            row.PR_Price,
            0,
            999999999999999999.99
          )
          break
        case 'PR_Prod_Leadtime':
          newRow.priceInfo!.productionLeadTimeInDays =
            row.PR_Prod_Leadtime.trim()
          break
        case 'PR_Sample_Leadtime':
          newRow.priceInfo!.sampleLeadTimeInDays = row.PR_Sample_Leadtime.trim()
          break
        case 'PR_Unit':
          newRow.priceInfo!.pricing!.unit = getMaterialQuantityUnit(row.PR_Unit)
          break
        case 'PR_Unit_MCQ':
          newRow.priceInfo!.minimumColor!.unit = getMaterialQuantityUnit(
            row.PR_Unit_MCQ
          )
          break
        case 'PR_Unit_MOQ':
          newRow.priceInfo!.minimumOrder!.unit = getMaterialQuantityUnit(
            row.PR_Unit_MOQ
          )
          break

        // Season
        case 'SE1':
          if (!newRow.seasonInfo) {
            newRow.seasonInfo = {
              season: null,
              year: null,
              isPublic: true,
            }
          }

          if (!newRow.seasonInfo.season) {
            newRow.seasonInfo.season = {
              seasonId: null,
              name: row.SE1.trim(),
            }
          }
          break
        case 'SE2':
          newRow.seasonInfo!.year = parseInt(row.SE2.trim(), 10)
          break
        case 'SE3':
          newRow.seasonInfo!.isPublic = parseYesNoValue(row.SE3, true)
          break

        // Side Type
        case 'ST1':
        case 'ST3':
          newRow.sideType =
            MaterialSideType[
              row.ST1.trim()
                .toUpperCase()
                .replace(' ', '_') as keyof typeof MaterialSideType
            ] || 1
          newRow.isDoubleSide = parseYesNoValue(row.ST3, false)
          if (newRow.isDoubleSide) {
            newRow.sideType = null
          }
          break
        case 'ST2':
          newRow.isComposite = parseYesNoValue(row.ST2, false)
          break
        case 'ST4':
          newRow.isAutoSyncFaceToBackSideInfo = parseYesNoValue(row.ST4, false)
          break

        // Tags
        case 'TAG_Crtf_1':
          newRow.tagInfo!.certificationTagList = convertStringToList(
            row.TAG_Crtf_1,
            (certificateId) => {
              return {
                certificateId: parseInt(certificateId.trim()),
              }
            }
          )
          break
        case 'TAG_Priv_1':
          newRow.internalInfo!.tagList = convertStringToList(
            row.TAG_Priv_1,
            (tag) => tag.trim()
          )
          break
        case 'TAG_PubTags_1':
          newRow.tagInfo!.tagList = convertStringToList(
            row.TAG_PubTags_1,
            (tag) => tag.trim()
          )
          break
        case 'TAG_Rem_1':
          newRow.internalInfo!.remark = row.TAG_Rem_1.trim()
          break

        // Width
        case 'WD_1':
          newRow.width!.cuttable = boundedNumber(row.WD_1, 1, 999)
          break
        case 'WD_2':
          const lengthUnitKey = row.WD_2.trim().toUpperCase()
          const lengthUnitValue =
            LengthUnit[lengthUnitKey as keyof typeof LengthUnit]
          newRow.width!.unit = lengthUnitValue
          break
        case 'WD_3':
          newRow.width!.full = boundedNumber(row.WD_3, 1, 999)
          break

        // Weight
        case 'WE_1':
          newRow.weight!.value = boundedNumber(row.WE_1, 1, 999)
          break
        case 'WE_2':
          newRow.weight!.unit =
            WeightUnit[
              unitMapping[
                row.WE_2.trim().toLowerCase()
              ] as keyof typeof WeightUnit
            ] || WeightUnit.GM
          break
        case 'WE_D_GM':
          newRow.weightDisplaySetting!.isShowWeightGm = parseYesNoValue(
            row.WE_D_GM.trim(),
            true
          )
          break
        case 'WE_D_GSM':
          newRow.weightDisplaySetting.isShowWeightGsm = parseYesNoValue(
            row.WE_D_GSM.trim(),
            true
          )
          break
        case 'WE_D_GY':
          newRow.weightDisplaySetting.isShowWeightGy = parseYesNoValue(
            row.WE_D_GY.trim(),
            true
          )
          break
        case 'WE_D_OZ':
          newRow.weightDisplaySetting.isShowWeightOz = parseYesNoValue(
            row.WE_D_OZ.trim(),
            true
          )
          break

        // case 'PLACEHOLDER':
        //   PLACEHOLDER = row.backSide
        //   break
      }
    }
    return newRow
  })
  return materialData
}

function boundedNumber(input: string, min: number, max: number): number {
  const decimalNumber = parseFloat(input.trim())
  return isNaN(decimalNumber) || decimalNumber < min
    ? min
    : Math.min(max, decimalNumber)
}

function getMaterialQuantityUnit(
  unitString: string,
  defaultUnit = MaterialQuantityUnit.KG
): MaterialQuantityUnit {
  return (
    MaterialQuantityUnit[
      unitString.trim().toUpperCase() as keyof typeof MaterialQuantityUnit
    ] || defaultUnit
  )
}

function parseYesNoValue(value: string, defaultValue: boolean): boolean {
  if (!value) {
    return defaultValue
  }

  const trimmedValue = value.trim().toUpperCase()

  if (trimmedValue === 'Y') {
    return true
  } else if (trimmedValue === 'N') {
    return false
  } else {
    return defaultValue
  }
}

function convertStringToList(
  value: string,
  callback: (val: string) => any
): any[] {
  return value.split(/[/,]+/).map(callback)
}

const unitMapping: { [key: string]: string } = {
  gsm: 'GSM',
  'oz/yd': 'OZ',
  'g/y': 'GY',
  'g/m': 'GM',
}

export const defaultCellStyle = {
  'align-items': 'center',
  display: 'flex',
}

type AgGridCellValueType =
  | string
  | number
  | boolean
  | Date
  | object
  | any[]
  | null
  | undefined

export function hasInvalidAgGridCellValue(value: AgGridCellValueType): boolean {
  if (value === null || value === undefined || value === 'null') return true

  if (typeof value === 'string' && value.trim() === '') return true

  if (Array.isArray(value) && value.length === 0) return true

  if (
    typeof value === 'object' &&
    value.constructor === Object &&
    Object.keys(value).length === 0
  ) {
    return true
  }

  return false
}

export function removeIncompletePricing(materialRowList: MaterialRow[]) {
  materialRowList.forEach((row) => {
    if (
      row.priceInfo &&
      (hasInvalidAgGridCellValue(row.priceInfo.pricing?.price) ||
        hasInvalidAgGridCellValue(row.priceInfo.pricing?.currencyCode) ||
        hasInvalidAgGridCellValue(row.priceInfo.pricing?.unit))
    ) {
      row.priceInfo.pricing = null
    }
  })
}
