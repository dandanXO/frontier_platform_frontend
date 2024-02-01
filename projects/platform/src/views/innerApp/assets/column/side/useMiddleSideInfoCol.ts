import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ColGroupDef, EditableCallback } from 'ag-grid-enterprise'
import type { MaterialRow } from '@/types'
import SelectCellEditor from '../../cell/SelectCellEditor.vue'
import {
  getCustomPropertyListCellProps,
  handleCellValueDelete,
  rowEditable,
} from '../../cell/cellUtils'
import type { SpreadsheetService } from '../../AssetsMaterialAgGrid.vue'
import useFeatureListCol from './useFeatureListCol'
import useFinishListCol from './useFinishListCol'

const sideEditable: EditableCallback<MaterialRow> = (params) => {
  if (!params.data) {
    return false
  }
  return params.data.isComposite
}

const useMiddleSideInfoCol = (
  spreadsheetService: SpreadsheetService
): ComputedRef<ColGroupDef<MaterialRow>> => {
  const { t } = useI18n()
  const featureListCol = useFeatureListCol(
    'middleSide',
    'middleSide.featureList',
    sideEditable,
    spreadsheetService
  )
  const finishListCol = useFinishListCol(
    'middleSide',
    'middleSide.finishList',
    sideEditable,
    spreadsheetService
  )

  return computed(() => {
    return {
      headerName: t('MI0008'),
      children: [
        {
          field: 'middleSide.frontierNo',
          headerName: t('RR0084'),
          minWidth: 200,
          cellEditor: SelectCellEditor,
        },
        featureListCol.value,
        finishListCol.value,
        {
          headerName: t('MI0026'),
          columnGroupShow: 'open',
          children: [
            {
              headerName: t('RR0258'),
              field: 'middleSide.customPropertyList',
              editable: (params) => rowEditable(params) && sideEditable(params),
              ...getCustomPropertyListCellProps({
                label: t('MI0026'),
                nameLabel: 'Construction Name',
                namePlaceholder: t('MI0030'),
                valueLabel: 'Construction Value',
                valuePlaceholder: t('MI0044'),
              }),
              onCellValueChanged: handleCellValueDelete((row) => {
                const target = row.middleSide
                if (target) {
                  target.customPropertyList = []
                }
              }),
            },
          ],
        },
      ],
    }
  })
}

export default useMiddleSideInfoCol
