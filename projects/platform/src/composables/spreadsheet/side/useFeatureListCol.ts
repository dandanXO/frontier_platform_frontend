import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  ColDef,
  CellClassParams,
  EditableCallback,
  ValueParserParams,
} from 'ag-grid-enterprise'
import type { MaterialRow } from '@/types'
import type { SpreadsheetService } from '@/components/assets/spreadsheet/Spreadsheet.vue'
import SelectCellEditor from '@/components/assets/spreadsheet/cell/SelectCellEditor.vue'
import { featureListSchema } from '@/composables/material/useMaterialSchema'
import {
  getCellStyle,
  handleCellValueDelete,
  rowEditable,
} from '@/utils/material/spreadsheet'

const useFeatureListCol = (
  side: 'faceSide' | 'middleSide' | 'backSide',
  field:
    | 'faceSide.featureList'
    | 'middleSide.featureList'
    | 'backSide.featureList',
  sideEditable: EditableCallback<MaterialRow>,
  spreadsheetService: SpreadsheetService
): ComputedRef<ColDef<MaterialRow>> => {
  const { t } = useI18n()
  const { featureMenuTree, addFeatureOption } = spreadsheetService

  return computed(() => {
    return {
      field,
      headerName: t('MI0014'),
      columnGroupShow: 'open',
      editable: (params) => rowEditable(params) && sideEditable(params),
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      cellStyle: (params: CellClassParams<MaterialRow, string>) => {
        const editable = params.column.isCellEditable(params.node)
        const isValid = () => {
          if (params.column.isCellEditable(params.node)) {
            return featureListSchema.safeParse(params.value).success
          }
          return true
        }
        return getCellStyle({
          valid: isValid(),
          editable,
        })
      },
      cellEditorPopup: true,
      cellEditorPopupPosition: 'under',
      cellEditor: SelectCellEditor,
      cellEditorParams: {
        placeholder: t('MI0015'),
        multiple: true,
        dropdownMenuTree: () => featureMenuTree.value,
        onAddNew: (name: string) => addFeatureOption(name),
      },
      valueFormatter: (params) => {
        if (params.value == null) {
          return ''
        }
        return (params.value as string[]).join(',')
      },
      valueParser: (params: ValueParserParams<MaterialRow>) => {
        const result = params.newValue.split(',').map((s) => s.trim())
        result.forEach((tag) => {
          if (
            !featureMenuTree.value.blockList[0].menuList.find(
              (t) => t.title === tag
            )
          ) {
            addFeatureOption(tag)
          }
        })
        return result
      },
      onCellValueChanged: handleCellValueDelete((row) => {
        const target = row[side]
        if (target) {
          target.featureList = []
        }
      }),
    }
  })
}

export default useFeatureListCol
