import type { MaterialRow } from '@/types'
import { generateMaterialRow } from '@/utils/material'
import {
  CurrencyCode,
  LengthUnit,
  MaterialQuantityUnit,
  MaterialSideType,
  MaterialType,
} from '@frontier/platform-web-sdk'
import type { GridApi } from 'ag-grid-enterprise'
import { mergeDeepRight } from 'ramda'
import type { Ref } from 'vue'
import { read, type WorkBook } from 'xlsx'
import { object } from 'zod'

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
      // console.log('worksheet[column + 2].w', worksheet[column + 2])
      // console.log('worksheet[column + rowIndex]', worksheet[column + rowIndex])
      row[worksheet[column + 2].w.trim()] = worksheet[column + rowIndex]
        ? worksheet[column + rowIndex].w.trim()
        : ''
    })

    rowData.push(row)

    rowIndex++
  }

  console.log('rowData', rowData)

  // finally, set the imported rowData into the grid
  // gridApi.setGridOption('rowData', rowData)
  // gridApi.value?.setGridOption(
  //   'rowData',
  //   currentRowData ? currentRowData.concat(dummyRowData) : dummyRowData
  // )

  let addIndex = 0
  const dummyMaterialRowData = toMaterialRow(dummyRowData)
  gridApi.value?.applyTransaction({ add: dummyMaterialRowData, addIndex })
}

const dummyRowData = [
  {
    itemNo: 'Testing Knit',
    sideType: 1,
    width: { cuttable: 59, full: 60, unit: 1 },
    weight: { value: 120, unit: 1 },
    faceSide: {
      materialType: 1,
      contentList: [{ contentId: 1, name: 'Cotton', percentage: 100 }],
    },
  },
  {
    itemNo: 'Testing Knit 2',
    sideType: 2,
    width: { cuttable: 59, full: 60, unit: 1 },
    weight: { value: 120, unit: 1 },
    backSide: {
      materialType: 1,
      contentList: [{ contentId: 1, name: 'Cotton', percentage: 100 }],
    },
  },
]

function toMaterialRow(rowData) {
  const materialRow = rowData.map((row) => {
    const newRow = generateMaterialRow()
    return mergeDeepRight(newRow, row)
  })
  return materialRow
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
    Object.keys(row).forEach((key) => {
      switch (key) {
        case 'COL_Color_1':
          newRow[sideKey]!.colorInfo.color = row.COL_Color_1
          break
        case 'COL_Field_1':
          newRow[sideKey]!.colorInfo.customPropertyList[0].name =
            row.COL_Field_1
          break
        case 'COL_Pub_1':
          newRow[sideKey]!.colorInfo.customPropertyList[0].isPublic =
            checkForNo(row.COL_Pub_1)
          break
        case 'COL_Val_1':
          newRow[sideKey]!.colorInfo.customPropertyList[0].value = row.COL_Val_1
          break
        case 'CON_1':
          newRow[sideKey]!.contentList[0].name = row.CON_1
          break
        case 'CON_2':
          newRow[sideKey]!.contentList[0].percentage = boundedNumber(
            row.CON_2,
            0,
            100
          )
          break
        case 'Column ID [DO NOT DELETE]':
          newRow.itemNo = row['Column ID [DO NOT DELETE]'].trim()
          break
        case 'FE1':
          newRow[sideKey]!.featureList = row.FE1.split(/[/,]+/).map(
            (feature) => {
              return feature.trim()
            }
          )
          break
        case 'FIN_1':
          newRow[sideKey]!.finishList = row.FE1.split(/[/,]+/).map((name) => {
            const finishObj = { name: name.trim(), finishId: null }
            return finishObj
          })
          break
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
        // case 'MIK_Cons_1':
        //   newRow.backSide = row.MIK_Cons_1.trim()
        //   break
        // case 'MIK_Cons_2':
        //   newRow.backSide = row.MIK_Cons_2.trim()
        //   break
        // case 'MIK_Cons_3':
        //   newRow.backSide = row.MIK_Cons_3.trim()
        //   break
        // case 'MIK_Cons_4':
        //   newRow.backSide = row.MIK_Cons_4.trim()
        //   break
        // case 'MIK_Cons_5':
        //   newRow.backSide = row.MIK_Cons_5.trim()
        //   break
        case 'MI_MatDesc':
          const descriptionList = row.MI_MatDesc.split(/[/,]+/).map((desc) => {
            return {
              descriptionId: null,
              name: desc.trim(),
              descriptionId: null,
            }
          })
          newRow[sideKey]!.descriptionList = descriptionList
          break
        case 'MI_MatType':
          const materialTypeKey = row.MI_MatType.trim().toUpperCase()
          const materialTypeValue =
            MaterialType[materialTypeKey as keyof typeof MaterialType]
          newRow[sideKey]!.materialType = materialTypeValue
          break
        case 'MI_NewField_1':
          newRow[sideKey]!.constructionCustomPropertyList[0].value =
            row.MI_NewField_1.trim()
          break
        case 'MI_NewName_1':
          newRow[sideKey]!.constructionCustomPropertyList[0].name =
            row.MI_NewName_1.trim()
          break
        case 'MI_PUB_1':
          newRow[sideKey]!.construction.isPublic = checkForNo(row.MI_PUB_1)
          break
        case 'MI_PUB_2':
          newRow[sideKey]!.constructionCustomPropertyList[0].isPublic =
            checkForNo(row.MI_PUB_2)
          break
        case 'PAT_Field_1':
          newRow[sideKey]!.patternInfo!.customPropertyList[0].name =
            row.PAT_Field_1.trim()
          break
        case 'PAT_Pattern_1':
          newRow[sideKey]!.patternInfo!.pattern = row.PAT_Pattern_1.trim()
          break
        case 'PAT_Pub_1':
          newRow[sideKey]!.patternInfo!.customPropertyList[0].isPublic =
            checkForNo(row.PAT_Pub_1)
          break
        case 'PAT_Val_1':
          newRow[sideKey]!.patternInfo!.customPropertyList[0].value =
            row.PAT_Val_1.trim()
          break
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
          ).toString()
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
        case 'SE1':
          newRow.seasonInfo!.season!.name = row.SE1.trim()
          break
        case 'SE2':
          newRow.seasonInfo!.year = parseInt(row.SE2.trim(), 10)
          break
        case 'SE3':
          newRow.seasonInfo!.isPublic = checkForNo(row.SE3)
          break
        case 'ST1':
          newRow.sideType =
            MaterialSideType[
              row.ST1.trim()
                .toUpperCase()
                .replace(' ', '_') as keyof typeof MaterialSideType
            ] || 1
          break
        case 'ST2':
          newRow.isComposite = checkForYes(row.ST2)
          break
        case 'ST3':
          newRow.isDoubleSide = checkForYes(row.ST3)
          break
        case 'ST4':
          newRow.isAutoSyncFaceToBackSideInfo = checkForYes(row.ST4)
          break
        case 'TAG_Crtf_1':
          newRow.tagInfo!.certificationTagList = row.TAG_Crtf_1.split(
            /[/,]+/
          ).map((certificateId) => {
            return {
              certificateId: parseInt(certificateId.trim()),
            }
          })

          break
        case 'TAG_Priv_1':
          newRow.backSide = row.TAG_Priv_1.trim()
          break
        case 'TAG_PubTags_1':
          newRow.backSide = row.TAG_PubTags_1.trim()
          break
        case 'TAG_Rem_1':
          newRow.backSide = row.TAG_Rem_1.trim()
          break
        case 'WD_1':
          newRow.width.cuttable = boundedNumber(row.WD_1, 1, 999)
          break
        case 'WD_2':
          const lengthUnitKey = row.WD_2.trim().toUpperCase()
          const lengthUnitValue =
            LengthUnit[lengthUnitKey as keyof typeof LengthUnit]
          newRow.width!.unit = lengthUnitValue
          break
        case 'WD_3':
          newRow.width.full = boundedNumber(row.WD_3, 1, 999)
          break
        case 'WD_4':
          newRow.backSide = row.WD_4.trim()
          break
        case 'WE_1':
          newRow.weight.value = boundedNumber(row.WE_1, 1, 999)
          break
        case 'WE_2':
          newRow.weight.unit = row.WE_2.trim()
          break
        case 'WE_D_GM':
          newRow.backSide = row.WE_D_GM.trim()
          break
        case 'WE_D_GSM':
          newRow.backSide = row.WE_D_GSM.trim()
          break
        case 'WE_D_GY':
          newRow.backSide = row.WE_D_GY.trim()
          break
        case 'WE_D_OZ':
          newRow.backSide = row.WE_D_OZ.trim()
          break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
        // case 'PLACEHOLDER':
        //   newRow.backSide = row.backSide
        //   break
      }
    })
    return mergeDeepRight(newRow, row)
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

//return false as default
function checkForYes(value: string): boolean {
  return value.trim().toUpperCase() === 'Y'
}

//return true as default
function checkForNo(value: string): boolean {
  return value.trim().toUpperCase() === 'N'
}
