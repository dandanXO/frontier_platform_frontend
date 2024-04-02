import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { path } from 'ramda'
import type { MaterialRow } from '@/types'
import { CurrencyCode, MaterialQuantityUnit } from '@frontier/platform-web-sdk'
import type {
  ColDef,
  ColDefField,
  ColGroupDef,
  CellClassParams,
} from 'ag-grid-enterprise'
import {
  getCellStyle,
  getEnumCellProps,
  getNumberCellProps,
  getStringCellProps,
  refreshCells,
  rowEditable,
  useMaterialQuantityUnitCellProps,
} from '@/utils/material/spreadsheet'
import useMaterialSchema, {
  currencyCodeSchema,
  materialQuantityUnitSchema,
  minimumQtySchema,
  priceSchema,
} from '@/composables/material/useMaterialSchema'
import type { SpreadsheetService } from '@/components/assets/spreadsheet/Spreadsheet.vue'
import { defaultCellStyle } from '@/components/assets/spreadsheet/utils/utils'

const pricingPath = ['priceInfo', 'pricing']
const minimumOrderPath = ['priceInfo', 'minimumOrder']
const minimumColorPath = ['priceInfo', 'minimumColor']

const usePriceInfoCol = (
  spreadsheetService: SpreadsheetService
): ComputedRef<ColDef<MaterialRow> | ColGroupDef<MaterialRow>> => {
  const { t } = useI18n()
  const materialSchema = useMaterialSchema()
  const materialQuantityUnitCellProps = useMaterialQuantityUnitCellProps()

  const { countryList, currencyText } = spreadsheetService

  const getPriceCols = ({
    internal,
  }: {
    internal: boolean
  }): (ColDef<MaterialRow> | ColGroupDef<MaterialRow>)[] => {
    const getField = (field: ColDefField<MaterialRow['priceInfo']>) => {
      if (internal) {
        return `internalInfo.priceInfo.${field}`
      }
      return `priceInfo.${field}`
    }

    const isParentHasValue = (
      params: CellClassParams<MaterialRow>,
      namePath: string[]
    ) => {
      const getParentPath = () => {
        if (internal) {
          return ['internalInfo', ...namePath]
        }
        return [...namePath]
      }

      const parentPath = getParentPath()
      const parent = path(parentPath, params.data) || {}
      const parentHasValue = Object.values(parent).some(Boolean)
      return parentHasValue
    }

    return [
      {
        headerName: t('RR0042'),
        field: getField('countryOfOriginal'),
        minWidth: 200,
        editable: rowEditable,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: countryList.map((i) => i.code),
          formatValue: (value: string) =>
            countryList.find((c) => c.code === value)?.name,
          allowTyping: true,
          filterList: true,
        },
        valueFormatter: (params) =>
          countryList.find((c) => c.code === params.value)?.name || '',
        valueParser: (params) => {
          const result = countryList.find(
            (c) => c.name === params.newValue
          )?.code
          if (!result) {
            return params.oldValue
          }
          return result
        },
        cellStyle: defaultCellStyle,
      },
      {
        headerName: `${t('RR0134')} (${t('PP0037')})`,
        children: [
          {
            headerName: t('RR0319'),
            field: getField('pricing.currencyCode'),
            minWidth: 130,
            editable: rowEditable,
            ...getEnumCellProps(currencyCodeSchema, CurrencyCode, currencyText),
            cellStyle: (params: CellClassParams<MaterialRow, CurrencyCode>) => {
              const isValid = () => {
                return currencyCodeSchema.nullable().safeParse(params.value)
                  .success
              }
              return getCellStyle({
                valid: isValid(),
                editable: params.column.isCellEditable(params.node),
              })
            },
            onCellValueChanged: refreshCells,
          },
          {
            headerName: t('RR0094'),
            field: getField('pricing.price'),
            minWidth: 130,
            editable: rowEditable,
            ...getNumberCellProps(priceSchema, t('MI0055')),
            cellStyle: (params: CellClassParams<MaterialRow, number>) => {
              const isValid = () => {
                return priceSchema.nullable().safeParse(params.value).success
              }
              return getCellStyle({
                valid: isValid(),
                editable: params.column.isCellEditable(params.node),
              })
            },
            onCellValueChanged: refreshCells,
          },
          {
            headerName: t('RR0320'),
            field: getField('pricing.unit'),
            minWidth: 130,
            editable: rowEditable,
            ...materialQuantityUnitCellProps.value,
            cellStyle: (
              params: CellClassParams<MaterialRow, MaterialQuantityUnit>
            ) => {
              const isValid = () => {
                return materialQuantityUnitSchema
                  .nullable()
                  .safeParse(params.value).success
              }
              return getCellStyle({
                valid: isValid(),
                editable: params.column.isCellEditable(params.node),
              })
            },
            onCellValueChanged: refreshCells,
          },
        ],
      },
      {
        headerName: t('RR0047'),
        columnGroupShow: 'open',
        minWidth: 200,
        children: [
          {
            headerName: t('RR0037'),
            field: getField('minimumOrder.qty'),
            minWidth: 100,
            editable: rowEditable,
            ...getNumberCellProps(minimumQtySchema, t('MI0056')),
            cellStyle: (params: CellClassParams<MaterialRow, number>) => {
              const isValid = () => {
                const parentHasValue = isParentHasValue(
                  params,
                  minimumOrderPath
                )
                if (parentHasValue) {
                  return minimumQtySchema.unwrap().safeParse(params.value)
                    .success
                }
                return minimumQtySchema.safeParse(params.value).success
              }
              return getCellStyle({
                valid: isValid(),
                editable: params.column.isCellEditable(params.node),
              })
            },
            onCellValueChanged: refreshCells,
          },
          {
            headerName: t('RR0038'),
            field: getField('minimumOrder.unit'),
            minWidth: 100,
            editable: rowEditable,
            ...materialQuantityUnitCellProps.value,
            cellStyle: (params: CellClassParams<MaterialRow, number>) => {
              const isValid = () => {
                const parentHasValue = isParentHasValue(
                  params,
                  minimumOrderPath
                )
                if (parentHasValue) {
                  return materialQuantityUnitSchema.safeParse(params.value)
                    .success
                }
                return materialQuantityUnitSchema
                  .nullable()
                  .safeParse(params.value).success
              }
              return getCellStyle({
                valid: isValid(),
                editable: params.column.isCellEditable(params.node),
              })
            },
            onCellValueChanged: refreshCells,
          },
        ],
      },
      {
        headerName: t('RR0048'),
        columnGroupShow: 'open',
        children: [
          {
            headerName: t('RR0037'),
            field: getField('minimumColor.qty'),
            editable: rowEditable,
            ...getNumberCellProps(minimumQtySchema, t('MI0056')),
            cellStyle: (params: CellClassParams<MaterialRow, number>) => {
              const isValid = () => {
                const parentHasValue = isParentHasValue(
                  params,
                  minimumColorPath
                )
                if (parentHasValue) {
                  return minimumQtySchema.unwrap().safeParse(params.value)
                    .success
                }
                return minimumQtySchema.safeParse(params.value).success
              }
              return getCellStyle({
                valid: isValid(),
                editable: params.column.isCellEditable(params.node),
              })
            },
            onCellValueChanged: refreshCells,
          },
          {
            headerName: t('RR0038'),
            field: getField('minimumColor.unit'),
            editable: rowEditable,
            ...materialQuantityUnitCellProps.value,
            cellStyle: (params: CellClassParams<MaterialRow, number>) => {
              const isValid = () => {
                const parentHasValue = isParentHasValue(
                  params,
                  minimumColorPath
                )
                if (parentHasValue) {
                  return materialQuantityUnitSchema.safeParse(params.value)
                    .success
                }
                return materialQuantityUnitSchema
                  .nullable()
                  .safeParse(params.value).success
              }
              return getCellStyle({
                valid: isValid(),
                editable: params.column.isCellEditable(params.node),
              })
            },
            onCellValueChanged: refreshCells,
          },
        ],
      },
      {
        field: getField('productionLeadTimeInDays'),
        headerName: t('RR0049'),
        columnGroupShow: 'open',
        editable: rowEditable,
        ...getStringCellProps(
          materialSchema.shape.priceInfo.shape.productionLeadTimeInDays,
          t('MI0057')
        ),
      },
      {
        field: getField('sampleLeadTimeInDays'),
        headerName: t('RR0051'),
        columnGroupShow: 'open',
        editable: rowEditable,
        ...getStringCellProps(
          materialSchema.shape.priceInfo.shape.sampleLeadTimeInDays,
          t('MI0057')
        ),
      },
    ]
  }

  return computed(() => {
    return {
      headerName: t('RR0094'),
      children: [
        ...getPriceCols({ internal: false }),
        {
          headerName: t('RR0289'),
          columnGroupShow: 'open',
          children: getPriceCols({ internal: true }),
        },
      ],
    }
  })
}

export default usePriceInfoCol
