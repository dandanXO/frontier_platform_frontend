import type { ColDef } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import type { EditableCallback } from 'ag-grid-enterprise'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SpreadsheetService } from '../AssetsMaterialAgGrid.vue'
import SelectCellEditor from '../../cell/SelectCellEditor.vue'
import type { MaterialFinish } from '@frontier/platform-web-sdk'
import { rowEditable } from '../../cell/cellUtils'

const useFinishListCol = (
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
      cellEditor: SelectCellEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: 'under',
      wrapText: true,
      autoHeight: true,
      cellEditorParams: {
        placeholder: t('MI0040'),
        multiple: true,
        dropdownMenuTree: () => finishMenuTree.value,
        onAddNew: (name: string) => addFinishOption(name),
        onConfirm: (name: string, rowId: string) => {
          // const targetFinish = [
          //   ...featureMenuTree.value.blockList[0].menuList,
          //   ...featureMenuTree.value.blockList[1].menuList,
          // ].find((f) => f.selectValue.title === name)
          // if (!targetFinish) {
          //   throw new Error('targetFinish is null')
          // }
          // const node = gridApi.value?.getRowNode(rowId)
          // const data = node?.data
          // node?.setData({
          //   ...data,
          //   [side]: {
          //     ...data[side],
          //     featureList: {
          //       ...data[side]?.featureList,
          //     }
          //     ...data?.seasonInfo,
          //     season: {
          //       seasonId: targetSeason?.seasonId ?? null,
          //       name,
          //     },
          //   },
          // })
        },
      },
      valueFormatter: (params) => {
        if (params.value == null) {
          return ''
        }
        return (params.value as MaterialFinish[]).map((f) => f.name).join(',')
      },
      valueParser: (params) => {
        const result = params.newValue.split(',').map((s) => s.trim())
        result.forEach((tag) => {
          if (
            !finishMenuTree.value.blockList[0].menuList.find(
              (t) => t.title === tag
            )
          ) {
            addFinishOption(tag)
          }
        })
        return result
      },
    }
  })
}

export default useFinishListCol
