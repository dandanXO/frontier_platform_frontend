import type { ColDef } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import type { EditableCallback, ValueParserParams } from 'ag-grid-enterprise'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SpreadsheetService } from '../AssetsMaterialAgGrid.vue'
import SelectCellEditor from '../../cell/SelectCellEditor.vue'
import { rowEditable } from '../../cell/cellUtils'

const useFeatureListCol = (
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
    }
  })
}

export default useFeatureListCol
