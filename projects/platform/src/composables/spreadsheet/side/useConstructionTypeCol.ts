import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  CellClassParams,
  ColDef,
  ColGroupDef,
  EditableCallbackParams,
  ValueFormatterParams,
} from 'ag-grid-enterprise'
import { materialTypeConstructionSchema } from '@/composables/material/useMaterialSchema'
import {
  getCellStyle,
  requiredColumnComponentParams,
  rowEditable,
} from '@/utils/material/spreadsheet'
import type { MaterialRow } from '@/types'
import type { PrimarySideKey } from '../../material/useMaterialForm'
import { sideEditable } from './useSideInfoCol'
import type { IdTextWithCustomData } from '@frontier/platform-web-sdk'
import MaterialTypeConstructionListCellEditor from '@/components/assets/spreadsheet/cell/MaterialTypeConstructionListCellEditor.vue'
import { WITH_CONSTRUCTION_TYPE_MATERIALS } from '@/utils/constants'

const useConstructionTypeCol = (
  side: PrimarySideKey
): ComputedRef<ColDef<MaterialRow> | ColGroupDef<MaterialRow>> => {
  const { t } = useI18n()

  return computed(() => {
    return {
      headerName: t('MI0150'),
      headerComponentParams: requiredColumnComponentParams,
      field: `${side}.materialTypeConstruction`,
      editable: (params: EditableCallbackParams<MaterialRow>) => {
        const materialType = params.data?.[side]?.materialType
        if (
          materialType == null ||
          !WITH_CONSTRUCTION_TYPE_MATERIALS.includes(materialType)
        ) {
          return false
        }
        return rowEditable(params) && sideEditable(side)(params)
      },
      cellEditor: MaterialTypeConstructionListCellEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: 'under',
      cellEditorParams: { side },
      minWidth: 160,
      autoHeight: true,
      cellStyle: (params: CellClassParams<MaterialRow, string>) => {
        const editable = params.column.isCellEditable(params.node)

        const isValid = () => {
          if (editable) {
            return materialTypeConstructionSchema.safeParse(params.value)
              .success
          }

          return true
        }
        return getCellStyle({
          valid: isValid(),
          editable,
        })
      },
      cellRenderer: (
        params: ValueFormatterParams<MaterialRow, IdTextWithCustomData>
      ) => params.value?.name,
    }
  })
}
export default useConstructionTypeCol
