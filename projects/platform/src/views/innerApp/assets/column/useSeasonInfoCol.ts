import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  CellClassParams,
  ColDef,
  ColGroupDef,
  ValueFormatterParams,
  ValueParserParams,
} from 'ag-grid-enterprise'
import { seasonInfoSchema } from '@/composables/material/useMaterialSchema'
import {
  getCellStyle,
  getNumberCellProps,
  rowEditable,
} from '../cell/cellUtils'
import type { SpreadsheetService } from '../AssetsMaterialAgGrid.vue'
import type { MaterialRow } from '@/types'
import SeasonCellEditor from '../cell/SeasonCellEditor.vue'

const useSeasonInfoCol = (
  spreadsheetService: SpreadsheetService
): ComputedRef<ColDef<MaterialRow> | ColGroupDef<MaterialRow>> => {
  const { t } = useI18n()
  const { addSeasonOption, allSeasonList } = spreadsheetService

  return computed(() => {
    return {
      headerName: t('MI0011'),
      children: [
        {
          field: 'seasonInfo.isPublic',
          headerName: t('MI0025'),
          editable: rowEditable,
        },
        {
          field: 'seasonInfo.season.name',
          headerName: t('MI0011'),
          editable: rowEditable,
          cellStyle: (params: CellClassParams<MaterialRow, string>) => {
            const value = params.data?.seasonInfo?.season
            const result = seasonInfoSchema.shape.season.safeParse(value)
            return getCellStyle({
              valid: result.success,
              editable: params.column.isCellEditable(params.node),
            })
          },
          cellEditorPopup: true,
          cellEditor: SeasonCellEditor,
          valueFormatter: (params: ValueFormatterParams<MaterialRow>) =>
            params.data?.seasonInfo?.season?.name || '',
          valueParser: (params: ValueParserParams<MaterialRow>) => {
            const targetSeason = allSeasonList.value.find(
              (s) => s.name === params.newValue
            )
            if (targetSeason) {
              params.data.seasonInfo = {
                ...params.data.seasonInfo,
                season: targetSeason,
              }
            } else {
              addSeasonOption(params.newValue)
              params.data.seasonInfo = {
                ...params.data.seasonInfo,
                season: {
                  seasonId: null,
                  name: params.newValue,
                },
              }
            }
            return params.newValue
          },
        },
        {
          field: 'seasonInfo.year',
          headerName: t('RR0341'),
          editable: rowEditable,
          ...getNumberCellProps(seasonInfoSchema.shape.year, t('MI0013')),
        },
      ],
    }
  })
}
export default useSeasonInfoCol
