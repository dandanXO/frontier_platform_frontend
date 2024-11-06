import { computed, type ComputedRef } from 'vue'
import type { ZodType } from 'zod'
import type {
  ColDef,
  CellClassParams,
  ValueFormatterParams,
  NewValueParams,
} from 'ag-grid-enterprise'
import colors from '@frontier/tailwindcss/colors'
import {
  MaterialQuantityUnit,
  type MaterialColorCustomPropertyBase,
  MaterialType,
} from '@frontier/platform-web-sdk'
import type { MaterialRow } from '@/types'
import StringCellEditor from '@/components/assets/spreadsheet/cell/StringCellEditor.vue'
import StringCellRenderer from '@/components/assets/spreadsheet/cell/StringCellRenderer.vue'
import NumberCellEditor from '@/components/assets/spreadsheet/cell/NumberCellEditor.vue'
import NumberCellRenderer from '@/components/assets/spreadsheet/cell/NumberCellRenderer.vue'
import CustomListCellRendererVue from '@/components/assets/spreadsheet/cell/CustomListCellRenderer.vue'
import CustomListCellEditor from '@/components/assets/spreadsheet/cell/CustomListCellEditor.vue'
import type {
  CellStyle,
  EditableCallback,
  EditableCallbackParams,
  ValueParserParams,
} from 'ag-grid-enterprise'
import { MaterialQuantityText } from '@/utils/enumText'
import useEnumText from '@/composables/useEnumText'
import {
  colorInfoSchema,
  materialQuantityUnitSchema,
} from '@/composables/material/useMaterialSchema'
import { defaultCellStyle } from '@/components/assets/spreadsheet/utils/utils'
import { useReadOnly } from '@/components/assets/spreadsheet/utils/hooks'
import BigNumber from 'bignumber.js'
import BigNumberCellEditor from '@/components/assets/spreadsheet/cell/BigNumberCellEditor.vue'
import BigNumberCellRenderer from '@/components/assets/spreadsheet/cell/BigNumberCellRenderer.vue'

const toTransparent = (hex: string) => hex + '88'

export const spreadsheetBgColors = {
  default: 'transparent',
  create: colors.primary[100],
  update: colors.primary[100],
  invalid: colors.red[300].DEFAULT,
  disabled: toTransparent(colors.grey[200].DEFAULT),
}

export const rowStyle = {
  default: { background: spreadsheetBgColors.default },
  delete: { background: spreadsheetBgColors.default, opacity: 0.3 },
  create: { background: spreadsheetBgColors.create },
  update: { background: spreadsheetBgColors.update },
  readOnly: { background: spreadsheetBgColors.disabled },
}

export const getCellStyle = ({
  valid,
  editable,
}: {
  valid: boolean
  editable: boolean
}): CellStyle => {
  const { readOnly } = useReadOnly()
  function getBgColor() {
    if (!valid) {
      return spreadsheetBgColors.invalid
    }
    if (!editable) {
      return spreadsheetBgColors.disabled
    }
    return spreadsheetBgColors.default
  }

  return {
    ...(readOnly.value ? {} : { backgroundColor: getBgColor() }),
    ...defaultCellStyle,
  }
}

export const rowEditable: EditableCallback<MaterialRow> = (params) => {
  return params.data?.editable || false
}

export const getStringCellProps = (
  schema: ZodType,
  placeholder?: string
): ColDef<MaterialRow> => {
  return {
    cellEditorPopup: true,
    cellStyle: (params: CellClassParams<MaterialRow, string>) => {
      return getCellStyle({
        valid: schema.safeParse(params.value).success,
        editable: params.column.isCellEditable(params.node),
      })
    },
    cellEditor: StringCellEditor,
    cellEditorParams: { schema, placeholder },
    cellRenderer: StringCellRenderer,
    cellRendererParams: { schema },
  }
}

export const getNumberCellProps = (
  schema: ZodType,
  placeholder?: string
): ColDef<MaterialRow> => {
  return {
    cellEditorPopup: true,
    cellStyle: (params: CellClassParams<MaterialRow, number>) => {
      return getCellStyle({
        valid: schema.safeParse(params.value).success,
        editable: params.column.isCellEditable(params.node),
      })
    },
    cellEditor: NumberCellEditor,
    cellEditorParams: { schema, placeholder },
    cellRenderer: NumberCellRenderer,
    cellRendererParams: { schema },
    valueParser: (params) => {
      if (params.newValue.length === 0) {
        return null
      }

      const newValue = Number(params.newValue)

      if (Number.isNaN(newValue)) {
        return params.oldValue
      }

      return newValue
    },
  }
}

export const getBigNumberCellProps = (
  schema: ZodType,
  placeholder?: string
): ColDef<MaterialRow> => {
  return {
    cellEditorPopup: true,
    cellStyle: (params: CellClassParams<MaterialRow, string>) => {
      return getCellStyle({
        valid: schema.safeParse(params.value).success,
        editable: params.column.isCellEditable(params.node),
      })
    },
    cellEditor: BigNumberCellEditor,
    cellEditorParams: { schema, placeholder },
    cellRenderer: BigNumberCellRenderer,
    cellRendererParams: { schema },
    valueParser: (params) => {
      const newValue = new BigNumber(params.newValue)
      if (newValue.isNaN()) {
        return params.oldValue
      }

      return newValue
    },
  }
}

export const getEnumCellProps = <T extends string | number>(
  schema: ZodType,
  enumType: Record<string, T>,
  enumText: ComputedRef<Record<T, string>>
): ColDef<MaterialRow, T> => {
  return {
    cellStyle: (params: CellClassParams<MaterialRow, T>) => {
      return {
        ...getCellStyle({
          valid: schema.safeParse(params.value).success,
          editable: params.column.isCellEditable(params.node),
        }),
        ...defaultCellStyle,
      }
    },
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: Object.values(enumType),
      formatValue: (value: T) => enumText.value[value],
      allowTyping: true,
      filterList: true,
    },
    valueFormatter: (params: ValueFormatterParams<MaterialRow, T>) => {
      if (!params.value) {
        return ''
      }
      return enumText.value[params.value]
    },
    valueParser: (params: ValueParserParams<MaterialRow, T>) => {
      const result = Object.entries(enumText.value).find(([key, value]) => {
        return value === params.newValue
      })?.[0]
      if (!result) {
        return params.oldValue
      }

      if (!Number.isNaN(Number(result))) {
        return Number(result) as T
      }
      return result as T
    },
  }
}

export const useMaterialQuantityUnitCellProps = (): ComputedRef<
  ColDef<MaterialRow, MaterialQuantityUnit>
> => {
  const { materialQuantityText } = useEnumText()

  return computed(() => ({
    ...getEnumCellProps(
      materialQuantityUnitSchema,
      MaterialQuantityUnit,
      materialQuantityText
    ),
  }))
}
export const usePerMaterialQuantityUnitCellProps = (): ComputedRef<
  ColDef<MaterialRow, MaterialQuantityUnit>
> => {
  const { materialPerQuantityText } = useEnumText()

  return computed(() => ({
    ...getEnumCellProps(
      materialQuantityUnitSchema,
      MaterialQuantityUnit,
      materialPerQuantityText
    ),
  }))
}

export const getUnitCellProps = (): ColDef<
  MaterialRow,
  MaterialQuantityUnit
> => {
  return {
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: Object.values(MaterialQuantityUnit),
      formatValue: (value: MaterialQuantityUnit) => MaterialQuantityText[value],
      allowTyping: true,
      filterList: true,
    },
    valueFormatter: (
      params: ValueFormatterParams<MaterialRow, MaterialQuantityUnit>
    ) => {
      if (!params.value) {
        return ''
      }
      return MaterialQuantityText[params.value]
    },
    valueParser: (params) => {
      const result = Object.entries(MaterialQuantityText).find(
        ([key, value]) => {
          return value === params.newValue
        }
      )?.[0]
      if (!result) {
        return params.oldValue
      }
      return result as MaterialQuantityUnit
    },
  }
}

export const getCustomPropertyListCellProps = ({
  label,
  nameLabel,
  namePlaceholder,
  valueLabel,
  valuePlaceholder,
}: {
  label: string
  nameLabel: string
  namePlaceholder: string
  valueLabel: string
  valuePlaceholder: string
}): ColDef<MaterialRow> => {
  return {
    minWidth: 300,
    autoHeight: true,
    valueFormatter: (
      params: ValueFormatterParams<
        MaterialRow,
        MaterialColorCustomPropertyBase[]
      >
    ) => {
      if (!params.value) {
        return ''
      }

      return (
        params.value
          ?.map((customProperty) => {
            const isPublicDisplay = customProperty.isPublic
              ? 'public'
              : 'private'
            return `${customProperty.name}:${customProperty.value}(${isPublicDisplay})`
          })
          ?.join(',') || ''
      )
    },
    valueParser: (params) => {
      const lines = params.newValue.split(',').map((v) => v.trim())
      if (lines.length === 0) {
        return params.oldValue
      }

      try {
        const customPropertyList = lines.map((line) => {
          const matchArray = [...line.matchAll(/(.+):(.+)\((.+)\)/g)]
          if (matchArray.length === 0) {
            throw new Error('Invalid custom property format')
          }

          const matchResult = matchArray[0]
          if (matchResult.length !== 4) {
            throw new Error('Invalid custom property format')
          }

          const customProperty: MaterialColorCustomPropertyBase = {
            name: matchResult[1],
            value: matchResult[2],
            isPublic: matchResult[3] === 'public',
          }

          return customProperty
        })

        return customPropertyList
      } catch (e) {
        console.error(e)
        return params.oldValue
      }
    },
    cellEditorPopup: true,
    cellEditor: CustomListCellEditor,
    cellEditorParams: {
      label,
      nameLabel,
      namePlaceholder,
      valueLabel,
      valuePlaceholder,
    },
    cellRenderer: CustomListCellRendererVue,
    cellStyle: (params: CellClassParams<MaterialRow, string>) => {
      const result = colorInfoSchema.shape.customPropertyList.safeParse(
        params.value
      )
      return {
        ...getCellStyle({
          valid: result.success,
          editable: params.column.isCellEditable(params.node),
        }),
        ...defaultCellStyle,
      }
    },
  }
}

/**
 *  reference: https://blog.ag-grid.com/adding-hyperlinks-to-the-grid/
 */
export const requiredColumnComponentParams = () => {
  const requiredIcon = `<span style="color: ${colors.red[400].DEFAULT}; margin-left: 2px;">*</span>`

  return {
    template:
      '<div class="ag-cell-label-container" role="presentation">' +
      '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
      '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
      '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
      '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
      '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
      '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
      '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
      requiredIcon +
      '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
      '  </div>' +
      '</div>',
  }
}

export const constructionEditable =
  (side: 'faceSide' | 'backSide', materialType: MaterialType) =>
  (params: EditableCallbackParams<MaterialRow>) => {
    return params.data?.[side]?.materialType === materialType || false
  }

export const refreshCells = (params: NewValueParams<MaterialRow>) => {
  if (!params.node) {
    return
  }

  params.api.refreshCells({ rowNodes: [params.node], force: true })
}

export const handleCellValueDelete =
  (handleDelete: (row: MaterialRow) => void) =>
  (params: NewValueParams<MaterialRow>) => {
    if (params.newValue != null) {
      return
    }

    const row = params.node?.data
    if (!row) {
      return
    }

    handleDelete(row)
    params.api.applyTransaction({
      update: [row],
    })
  }
