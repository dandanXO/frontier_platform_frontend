import type { MaterialRow } from '@/types'
import { generateMaterialRow } from '@/utils/material'
import {
  CurrencyCode,
  LengthUnit,
  MaterialQuantityUnit,
  MaterialSideType,
  MaterialType,
  WeightUnit,
  type MaterialOptions,
  type MaterialSideCreateAllOfMaterialTypeConstruction,
} from '@frontier/platform-web-sdk'
import type { GridApi } from 'ag-grid-enterprise'
import type { Ref } from 'vue'
import { read, type WorkBook } from 'xlsx'
import BigNumber from 'bignumber.js'
import Fuse from 'fuse.js'
import type { PrimarySideKey } from '@/composables/material/useMaterialForm'
import type { MaterialTypeConstructionKey } from '../Spreadsheet.vue'

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

let materialOptions: MaterialOptions

export function populateGrid(
  workbook: WorkBook,
  gridApi: Ref<GridApi<MaterialRow> | undefined>,
  MaterialOptions: MaterialOptions
) {
  materialOptions = MaterialOptions
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
        ? (
            worksheet[column + rowIndex].w ??
            String(worksheet[column + rowIndex].v)
          ).trim()
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

export const materialTypeMap: Record<
  MaterialType,
  MaterialTypeConstructionKey
> = {
  [MaterialType.WOVEN]: 'woven',
  [MaterialType.KNIT]: 'knit',
  [MaterialType.LEATHER]: 'leather',
  [MaterialType.NON_WOVEN]: 'nonWoven',
  [MaterialType.TRIM]: 'trim',
  [MaterialType.OTHERS]: 'others',
}

function parseExcelToMaterialFormat(excelData: ExcelRow[]) {
  const materialData = excelData.map((row) => {
    const sideKey: PrimarySideKey =
      !row['ST1'] ||
      row['ST1'].trim().toLowerCase() === 'Face Side'.trim().toLowerCase()
        ? 'faceSide'
        : 'backSide'
    const isAutoSyncFaceToBackSideInfo = parseYesNoValue(row['ST4'], false)
    const sideKeys: PrimarySideKey[] = isAutoSyncFaceToBackSideInfo
      ? ['faceSide', 'backSide']
      : [sideKey]
    const newRow = generateMaterialRow()
    let materialType: MaterialType

    // priceInfo
    let priceInfo = newRow.priceInfo
    priceInfo = {
      countryOfOriginal: row.PR_Origin
        ? row.PR_Origin.trim()
        : priceInfo.countryOfOriginal,
      pricing: {
        price: row.PR_Price
          ? boundedStringValue(row.PR_Price, '0', '999999999999999999.99')
          : priceInfo.pricing.price,
        unit: row.PR_Unit
          ? getMaterialQuantityUnit(row.PR_Unit)
          : priceInfo.pricing.unit,
        currencyCode: row.PR_Currency
          ? CurrencyCode[
              row.PR_Currency.trim().toUpperCase() as keyof typeof CurrencyCode
            ] || 'USD'
          : priceInfo.pricing.currencyCode,
      },
      minimumColor: {
        qty: row.PR_MCQ
          ? boundedNumber(row.PR_MCQ, 0, 999999)
          : priceInfo.minimumColor.qty,
        unit: row.PR_Unit_MCQ
          ? getMaterialQuantityUnit(row.PR_Unit_MCQ)
          : priceInfo.minimumColor.unit,
      },
      minimumOrder: {
        qty: row.PR_MOQ
          ? boundedNumber(row.PR_MOQ, 0, 999999)
          : priceInfo.minimumOrder.qty,
        unit: row.PR_Unit_MOQ
          ? getMaterialQuantityUnit(row.PR_Unit_MOQ)
          : priceInfo.minimumOrder.unit,
      },
      productionLeadTimeInDays: row.PR_Prod_Leadtime
        ? row.PR_Prod_Leadtime.trim()
        : priceInfo.productionLeadTimeInDays,
      sampleLeadTimeInDays: row.PR_Sample_Leadtime
        ? row.PR_Sample_Leadtime.trim()
        : priceInfo.sampleLeadTimeInDays,
    }

    const isPricePublic =
      row['PR_1'].trim().toLowerCase() === 'public' ? true : false

    if (isPricePublic) {
      newRow.priceInfo = priceInfo
      newRow.internalInfo.priceInfo.pricing = null
    } else {
      newRow.internalInfo.priceInfo = priceInfo
      newRow.priceInfo.pricing = null
    }

    // Determine if inventoryInfo is publicly accessible
    if (newRow.internalInfo && newRow.internalInfo.inventoryInfo) {
      newRow.internalInfo.inventoryInfo.isTotalPublic = parseYesNoValue(
        row.IN_Create_1,
        false
      )
    }

    for (const key of Object.keys(row)) {
      if (!row[key] || row[key].trim() === '') {
        continue
      }
      sideKeys.forEach((sideKey) => {
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
                name: row.COL_Field_1.trim(),
                value: row.COL_Val_1.trim(),
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
              (percentage) => Number(percentage)
            )
            const combinedList = contentNameList.reduce(
              (acc, contentName, index) => {
                if (contentName && contentPercentageList[index]) {
                  acc.push({
                    name: contentName,
                    percentage: contentPercentageList[index],
                    contentId: null,
                  })
                }
                return acc
              },
              []
            )

            newRow[sideKey]!.contentList = getUniqueItemsByField(
              combinedList,
              'name'
            )
            break
          case 'Column ID [DO NOT DELETE]':
            newRow.itemNo = row['Column ID [DO NOT DELETE]'].trim()
            break

          // Features
          case 'FE1':
            const featureList = convertStringToList(row.FE1, (feature) =>
              feature.toString().trim()
            )
            newRow[sideKey]!.featureList = getUniqueItemsByField(featureList)
            break

          // Finish
          case 'FIN_1':
            const finishList = convertStringToList(row.FIN_1, (name) => {
              return { name: name.toString().trim(), finishId: null }
            })
            newRow[sideKey]!.finishList = getUniqueItemsByField(
              finishList,
              'name'
            )
            break

          // Material Info
          case 'MI_MatDesc':
            const materialDescriptionList = convertStringToList(
              row.MI_MatDesc,
              (description) => {
                return {
                  descriptionId: null,
                  name: description.toString().trim(),
                }
              }
            )
            newRow[sideKey]!.descriptionList = getUniqueItemsByField(
              materialDescriptionList,
              'name'
            )
            break
          case 'MI_ConsType':
            if (!materialType) {
              break
            }
            newRow[sideKey].materialTypeConstruction =
              materialOptions.materialTypeConstructionList?.[
                materialTypeMap[materialType]
              ].default.find(
                ({ name }) => name === row.MI_ConsType
              ) as MaterialSideCreateAllOfMaterialTypeConstruction
            break
          case 'MI_ConsType_Custom':
            if (!materialType) {
              break
            }
            newRow[sideKey].materialTypeConstruction ??=
              (materialOptions.materialTypeConstructionList?.[
                materialTypeMap[materialType]
              ].custom.find(({ name }) => name === row.MI_ConsType_Custom) ?? {
                id: null,
                isCustom: true,
                name: row.MI_ConsType_Custom,
              }) as MaterialSideCreateAllOfMaterialTypeConstruction
            break
          case 'MI_MatType': {
            const input = row.MI_MatType.trim()
            const materialTypeKey = fuzzySearchMaterialType(input) as
              | keyof typeof MaterialType
              | null
            const materialTypeValue =
              materialTypeKey !== null ? MaterialType[materialTypeKey] : null
            newRow[sideKey]!.materialType = materialTypeValue
            materialType = materialTypeValue
            break
          }
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
            newRow[sideKey]!.construction.warpDensity =
              row.MIW_Cons_1.trim().slice(0, 100)
            break
          case 'MIW_Cons_2':
            newRow[sideKey]!.construction.weftDensity =
              row.MIW_Cons_2.trim().slice(0, 100)
            break
          case 'MIW_Cons_3':
            newRow[sideKey]!.construction.warpYarnSize =
              row.MIW_Cons_3.trim().slice(0, 100)
            break
          case 'MIW_Cons_4':
            newRow[sideKey]!.construction.weftYarnSize =
              row.MIW_Cons_4.trim().slice(0, 100)
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
            newRow[sideKey]!.construction.outerDiameter =
              row.MIT_Diameter.trim().slice(0, 50)
            break
          case 'MIT_Length':
            newRow[sideKey]!.construction.length = row.MIT_Length.trim().slice(
              0,
              50
            )
            break
          case 'MIT_Thickness':
            newRow[sideKey]!.construction.thickness =
              row.MIT_Thickness.trim().slice(0, 50)
            break
          case 'MIT_Width':
            newRow[sideKey]!.construction.width = row.MIT_Width.trim().slice(
              0,
              50
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
                name: row.PAT_Field_1.trim(),
                value: row.PAT_Val_1.trim(),
                isPublic: parseYesNoValue(row.PAT_Pub_1, true),
              }
            }
            break
        }
      })
      switch (key) {
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
          newRow.tagInfo!.certificationTagIdList = convertStringToList(
            row.TAG_Crtf_1,
            (certificateId) => Number(certificateId)
          )
          break
        case 'TAG_Priv_1':
          const privateTagList = convertStringToList(row.TAG_Priv_1, (tag) =>
            tag.toString().trim()
          )
          newRow.internalInfo!.tagList = getUniqueItemsByField(privateTagList)
          break
        case 'TAG_PubTags_1':
          const publicTagList = convertStringToList(row.TAG_PubTags_1, (tag) =>
            tag.toString().trim()
          )
          newRow.tagInfo!.tagList = getUniqueItemsByField(publicTagList)
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
          newRow.weight!.value = boundedNumber(row.WE_1, 1, 99999, 3)
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
      }
    }
    return newRow
  })
  return materialData
}

function boundedNumber(
  input: string,
  min: number,
  max: number,
  decimalPlaces?: number
): number {
  let decimalNumber = parseFloat(input.trim())
  if (decimalPlaces !== undefined) {
    decimalNumber = parseFloat(decimalNumber.toFixed(decimalPlaces))
  }
  return isNaN(decimalNumber) || decimalNumber < min
    ? min
    : Math.min(max, decimalNumber)
}
function boundedStringValue(input: string, min: string, max: string): string {
  const decimalNumber = new BigNumber(input.trim())
  const minNumber = new BigNumber(min)
  const maxNumber = new BigNumber(max)

  if (decimalNumber.isNaN() || decimalNumber.isLessThan(minNumber)) {
    return min
  } else if (decimalNumber.isGreaterThan(maxNumber)) {
    return max
  } else {
    return decimalNumber.toString()
  }
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
  const result: string[] = []
  let current = ''
  let inBraces = false

  for (let i = 0; i < value.length; i++) {
    const char = value[i]

    if (char === '/' && !inBraces) {
      if (current) {
        // Remove outermost braces if present
        if (current.startsWith('{') && current.endsWith('}')) {
          current = current.slice(1, -1)
        }
        result.push(callback(current))
        current = ''
      }
    } else if (char === '{') {
      inBraces = true
      current += char
    } else if (char === '}') {
      inBraces = false
      current += char
    } else {
      current += char
    }
  }

  // handle the last item
  if (current) {
    // Remove outermost braces if present
    if (current.startsWith('{') && current.endsWith('}')) {
      current = current.slice(1, -1)
    }
    result.push(callback(current))
  }

  return result
}

const unitMapping: { [key: string]: string } = {
  gsm: 'GSM',
  'oz/yd': 'OZ',
  'g/y': 'GY',
  'g/m': 'GM',
}

export const defaultCellStyle = {
  'align-items': 'center',
  wordBreak: 'break-word',
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
    if (
      row.internalInfo &&
      row.internalInfo.priceInfo &&
      (hasInvalidAgGridCellValue(row.internalInfo.priceInfo.pricing?.price) ||
        hasInvalidAgGridCellValue(
          row.internalInfo.priceInfo.pricing?.currencyCode
        ) ||
        hasInvalidAgGridCellValue(row.internalInfo.priceInfo.pricing?.unit))
    ) {
      row.internalInfo.priceInfo.pricing = null
    }
  })
}

function getUniqueItemsByField<T extends Record<string, any>>(
  list: T[],
  field?: keyof T
): T[] {
  if (field) {
    return Array.from(new Map(list.map((item) => [item[field], item])).values())
  } else {
    return Array.from(new Set(list))
  }
}

function fuzzySearchMaterialType(input: string): string | null {
  const keys = Object.keys(MaterialType)
  const fuse = new Fuse(keys, { includeScore: true })

  const result = fuse.search(input)

  if (result.length > 0) {
    return result[0].item // return the matched key
  }

  return null
}
