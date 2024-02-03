import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  CellClassParams,
  ColDef,
  EditableCallback,
  ValueFormatterParams,
  ValueParserParams,
} from 'ag-grid-enterprise'
import type { MaterialRow } from '@/types'
import type { SpreadsheetService } from '@/components/assets/spreadsheet/Spreadsheet.vue'
import FinishCellEditor from '@/components/assets/spreadsheet/cell/FinishListCellEditor.vue'
import { finishListSchema } from '@/composables/material/useMaterialSchema'
import type { MaterialFinish } from '@frontier/platform-web-sdk'
import {
  getCellStyle,
  handleCellValueDelete,
  rowEditable,
} from '@/utils/material/spreadsheet'

const useFinishListCol = (
  side: 'faceSide' | 'middleSide' | 'backSide',
  field:
    | 'faceSide.finishList'
    | 'middleSide.finishList'
    | 'backSide.finishList',
  sideEditable: EditableCallback<MaterialRow>,
  spreadsheetService: SpreadsheetService
): ComputedRef<ColDef<MaterialRow>> => {
  const { t } = useI18n()
  const { finishMenuTree, addFinishOption } = spreadsheetService

  return computed(() => {
    return {
      field,
      headerName: t('RR0022'),
      columnGroupShow: 'open',
      editable: (params) => rowEditable(params) && sideEditable(params),
      minWidth: 200,
      cellEditor: FinishCellEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: 'under',
      wrapText: true,
      autoHeight: true,
      cellStyle: (params: CellClassParams<MaterialRow, string>) => {
        const editable = params.column.isCellEditable(params.node)
        const isValid = () => {
          if (params.column.isCellEditable(params.node)) {
            return finishListSchema.safeParse(params.value).success
          }
          return true
        }
        return getCellStyle({
          valid: isValid(),
          editable,
        })
      },
      cellEditorParams: { placeholder: t('MI0040') },
      valueFormatter: (
        params: ValueFormatterParams<MaterialRow, MaterialFinish[]>
      ) => {
        if (params.value == null) {
          return ''
        }
        return params.value.map((f) => f.name).join(',')
      },
      valueParser: (
        params: ValueParserParams<MaterialRow, MaterialFinish[]>
      ) => {
        if (!params.newValue) {
          return params.oldValue
        }

        const finishNameList = params.newValue
          .split(',')
          .map((str) => str.trim())
          .filter(Boolean)
        if (!finishNameList.length) {
          return params.oldValue
        }

        let menuItemList = finishMenuTree.value.blockList
          .flatMap((block) => block.menuList)
          .flat()
        finishNameList.forEach((finishName) => {
          if (!menuItemList.find((item) => item.title === finishName)) {
            addFinishOption(finishName)
          }
        })

        menuItemList = finishMenuTree.value.blockList
          .flatMap((block) => block.menuList)
          .flat()

        const result = finishNameList.map((finishName) => {
          const target = menuItemList.find(
            (menuItem) => menuItem.title === finishName
          )
          return target?.selectValue
        })

        return result
      },
      onCellValueChanged: handleCellValueDelete((row) => {
        const target = row[side]
        if (target) {
          target.finishList = []
        }
      }),
    }
  })
}

export default useFinishListCol
