import { useI18n } from 'vue-i18n'
import type {
  CellClassParams,
  ColDef,
  ColGroupDef,
  ValueFormatterFunc,
  ValueParserFunc,
} from 'ag-grid-enterprise'
import InventoryRemainingCellEditorVue from '../cell/InventoryRemainingCellEditor.vue'
import InventoryYardageRemainingCellEditorVue from '../cell/InventoryYardageRemainingCellEditor.vue'
import useMaterialSchema from '@/composables/material/useMaterialSchema'
import {
  getCellStyle,
  getStringCellProps,
  rowEditable,
} from '../cell/cellUtils'
import type { MaterialRow } from '@/types'
import type {
  MaterialInternalInventoryInfoSampleCardsRemainingListInner,
  MaterialInternalInventoryInfoYardageRemainingInfoListInner,
} from '@frontier/platform-web-sdk'
import {
  sampleCardsRemainingListSchema,
  yardageRemainingInfoSchema,
} from '@/composables/material/useMaterialSchema'
import {
  getInventoryQtyInY,
  processYardageRemainingInfo,
} from '@/utils/material'
import { computed, type ComputedRef } from 'vue'

const cellRenderer: ValueFormatterFunc<
  MaterialRow,
  MaterialInternalInventoryInfoSampleCardsRemainingListInner[]
> = (params) => {
  if (!params.value) {
    return ''
  }

  return (
    params.value
      .map((item) => {
        let { source, shelf1, shelf2, qtyInPcs, location } = item

        source = source || ''
        shelf1 = shelf1 || ''
        shelf2 = shelf2 || ''
        qtyInPcs = qtyInPcs || ''
        location = location || ''

        if (!source && !shelf1 && !shelf2 && !qtyInPcs && !location) {
          return null
        }

        return `source: ${source}, qty: ${qtyInPcs}, shelf1: ${shelf1}, shelf2: ${shelf2}, location: ${location}`
      })
      .filter(Boolean)
      .join(', <br/> ') || ''
  )
}

const valueParser: ValueParserFunc<
  MaterialRow,
  MaterialInternalInventoryInfoSampleCardsRemainingListInner[]
> = (params) => {
  const lines = params.newValue.split('<br/>').map((v) => v.trim())
  if (lines.length === 0) {
    return params.oldValue
  }

  try {
    const list = lines.map((line) => {
      const matchArray = [
        ...line.matchAll(
          /source:(.*), qty:(.*), shelf1:(.*), shelf2:(.*), location:(.*)/g
        ),
      ]
      if (matchArray.length === 0) {
        throw new Error('Invalid list format')
      }

      const matchResult = matchArray[0]
      if (matchResult.length !== 6) {
        throw new Error('Invalid list format')
      }

      const item: MaterialInternalInventoryInfoSampleCardsRemainingListInner = {
        source: matchResult[1],
        qtyInPcs: Number(matchResult[2]),
        shelf1: matchResult[3],
        shelf2: matchResult[4],
        location: matchResult[5],
      }

      return item
    })

    return list
  } catch (e) {
    console.error(e)
    return params.oldValue
  }
}

const yardageRemainingInfoCellRenderer: ValueFormatterFunc<
  MaterialRow,
  MaterialInternalInventoryInfoSampleCardsRemainingListInner[]
> = (params) => {
  if (!params.value) {
    return ''
  }

  return (
    params.value.list
      .map((item) => {
        let { productionNo, source, roll, lot, qty, shelf1, shelf2, location } =
          item

        productionNo = productionNo || ''
        source = source || ''
        roll = roll || ''
        lot = lot || ''
        qty = qty || ''
        shelf1 = shelf1 || ''
        shelf2 = shelf2 || ''
        location = location || ''

        if (
          !productionNo &&
          !source &&
          !roll &&
          !lot &&
          !shelf1 &&
          !shelf2 &&
          !qty &&
          !location
        ) {
          return null
        }

        return `productionNo: ${productionNo}, source: ${source}, roll: ${roll}, lot: ${lot}, qty: ${qty}(${params.value?.unit}), shelf1: ${shelf1}, shelf2: ${shelf2}, location: ${location}`
      })
      .filter(Boolean)
      .join(', <br/> ') || ''
  )
}

const yardageRemainingInfoValueParser: ValueParserFunc<
  MaterialRow,
  MaterialInternalInventoryInfoSampleCardsRemainingListInner[]
> = (params) => {
  const lines = params.newValue.split('<br/>').map((v) => v.trim())
  if (lines.length === 0) {
    return params.oldValue
  }

  try {
    let unit = null
    const list = lines.map((line) => {
      const matchArray = [
        ...line.matchAll(
          /productionNo:(.*), source:(.*), roll:(.*), lot:(.*), qty:(.*)\((.*)\), shelf1:(.*), shelf2:(.*), location:(.*)/g
        ),
      ]
      if (matchArray.length === 0) {
        throw new Error('Invalid remaining list format')
      }

      const matchResult = matchArray[0]
      if (matchResult.length !== 10) {
        throw new Error('Invalid remaining list format')
      }

      unit = matchResult[6]

      const item: MaterialInternalInventoryInfoYardageRemainingInfoListInner = {
        productionNo: matchResult[1],
        source: matchResult[2],
        roll: matchResult[3],
        lot: matchResult[4],
        qty: Number(matchResult[5]),
        shelf1: matchResult[7],
        shelf2: matchResult[8],
        location: matchResult[9],
      }

      return item
    })

    return { list, unit }
  } catch (e) {
    console.error(e)
    return params.oldValue
  }
}

const useInventoryInfoCol = (): ComputedRef<
  ColDef<MaterialRow> | ColGroupDef<MaterialRow>
> => {
  const { t } = useI18n()
  const materialSchema = useMaterialSchema()

  return computed(() => {
    return {
      headerName: t('RR0135'),
      children: [
        {
          field: 'internalInfo.inventoryInfo.isTotalPublic',
          headerName: t('MI0025'),
          editable: rowEditable,
        },
        {
          headerName: t('RR0034'),
          minWidth: 140,
          valueFormatter: (params) => {
            const calculateInY = () => {
              if (!params.data) {
                return 0
              }

              const { width, weight, internalInfo } = params.data
              if (!internalInfo) {
                return 0
              }

              if (!width || !weight) {
                return 0
              }

              const { yardageRemainingInfo } = internalInfo.inventoryInfo
              if (!yardageRemainingInfo) {
                return 0
              }

              if (!yardageRemainingInfo.unit) {
                return 0
              }

              const inventoryTotalQty = yardageRemainingInfo.list
                .map((a) => a.qty || 0)
                .reduce((prev, current) => prev + current, 0)

              const inventoryQtyInY = getInventoryQtyInY(
                width.full,
                width.unit,
                weight.value,
                weight.unit,
                inventoryTotalQty,
                yardageRemainingInfo.unit
              )

              return inventoryQtyInY
            }

            const toYUnitDisplay = (qtyInY: number) => `${qtyInY} Y`

            return toYUnitDisplay(calculateInY())
          },
        },
        {
          headerName: t('RR0289'),
          columnGroupShow: 'open',
          children: [
            {
              field: 'internalInfo.nativeCode',
              headerName: t('RR0030'),
              editable: rowEditable,
              ...getStringCellProps(
                materialSchema.shape.internalInfo.shape.nativeCode
              ),
            },
            {
              field: 'internalInfo.inventoryInfo.sampleCardsRemainingList',
              headerName: t('RR0031'),
              minWidth: 600,
              wrapText: true,
              autoHeight: true,
              editable: rowEditable,
              cellRenderer: cellRenderer,
              valueFormatter: cellRenderer,
              valueParser: valueParser,
              cellEditorPopup: true,
              cellEditor: InventoryRemainingCellEditorVue,
              cellEditorParams: { title: t('RR0031') },
              cellStyle: (params: CellClassParams<MaterialRow, string>) => {
                const result = sampleCardsRemainingListSchema.safeParse(
                  params.value
                )
                return getCellStyle({
                  valid: result.success,
                  editable: params.column.isCellEditable(params.node),
                })
              },
            },
            {
              field: 'internalInfo.inventoryInfo.hangersRemainingList',
              headerName: t('RR0033'),
              minWidth: 600,
              wrapText: true,
              autoHeight: true,
              editable: rowEditable,
              cellRenderer: cellRenderer,
              valueFormatter: cellRenderer,
              valueParser: valueParser,
              cellEditorPopup: true,
              cellEditor: InventoryRemainingCellEditorVue,
              cellEditorParams: { title: t('RR0033') },
              cellStyle: (params: CellClassParams<MaterialRow, string>) => {
                const result = sampleCardsRemainingListSchema.safeParse(
                  params.value
                )
                return getCellStyle({
                  valid: result.success,
                  editable: params.column.isCellEditable(params.node),
                })
              },
            },
            {
              field: 'internalInfo.inventoryInfo.yardageRemainingInfo',
              headerName: t('RR0296'),
              minWidth: 600,
              wrapText: true,
              autoHeight: true,
              editable: rowEditable,
              cellRenderer: yardageRemainingInfoCellRenderer,
              valueFormatter: yardageRemainingInfoCellRenderer,
              valueParser: yardageRemainingInfoValueParser,
              cellEditorPopup: true,
              cellEditor: InventoryYardageRemainingCellEditorVue,
              cellEditorParams: { title: t('RR0296') },
              cellStyle: (params: CellClassParams<MaterialRow, string>) => {
                const value = processYardageRemainingInfo(params.value)
                const result = yardageRemainingInfoSchema.safeParse(value)

                return getCellStyle({
                  valid: result.success,
                  editable: params.column.isCellEditable(params.node),
                })
              },
              // onCellValueChanged: (e) => {
              //   e.api.refreshCells({ rowNodes: [e.node], force: true })
              // },
            },
          ],
        },
      ],
    }
  })
}

export default useInventoryInfoCol
