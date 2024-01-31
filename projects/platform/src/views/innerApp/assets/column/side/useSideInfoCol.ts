import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  CellClassParams,
  ColGroupDef,
  EditableCallbackParams,
  ValueFormatterParams,
  ValueParserParams,
} from 'ag-grid-enterprise'
import {
  MaterialType,
  type MaterialSideAllOfContentList,
  type MaterialDescription,
  MaterialSideType,
} from '@frontier/platform-web-sdk'
import type { MaterialRow } from '@/types'
import SelectCellEditor from '../../cell/SelectCellEditor.vue'
import {
  colorInfoSchema,
  patternInfoSchema,
  contentListSchema,
  materialTypeSchema,
} from '@/composables/material/useMaterialSchema'
import getWovenConstruction from './wovenConstruction'
import getKnitConstruction from './knitConstruction'
import getLeatherConstruction from './leatherConstruction'
import getNonWovenConstruction from './nonWovenConstruction'
import getTrimConstruction from './trimConstruction'
import {
  getCellStyle,
  getCustomPropertyListCellProps,
  getEnumCellProps,
  getStringCellProps,
  requiredColumnComponentParams,
  rowEditable,
} from '../../cell/cellUtils'
import type { SpreadsheetService } from '../../AssetsMaterialAgGrid.vue'
import ContentListCellEditorVue from '../../cell/ContentListCellEditor.vue'
import DescriptionListCellEditorVue from '../../cell/DescriptionListCellEditor.vue'
import useFeatureListCol from './useFeatureListCol'
import useFinishListCol from './useFinishListCol'
import useEnumText from '@/composables/useEnumText'

const sideEditable =
  (side: 'faceSide' | 'backSide') =>
  (params: EditableCallbackParams<MaterialRow>) => {
    if (!params.data) {
      return false
    }
    if (side === 'backSide' && params.data.isAutoSyncFaceToBackSideInfo) {
      return false
    }
    if (params.data.isDoubleSide) {
      return true
    }
    if (side === 'faceSide') {
      return params.data.sideType === MaterialSideType.FACE_SIDE
    }
    if (side === 'backSide') {
      return params.data.sideType === MaterialSideType.BACK_SIDE
    }

    return false
  }

const contentListValueRenderer = (
  params: ValueFormatterParams<MaterialRow, MaterialSideAllOfContentList[]>
) => {
  if (params.value == null) {
    return ''
  }

  if (!params.value.length) {
    return ''
  }

  const getItemDisplay = (content: MaterialSideAllOfContentList) => {
    if (!content.name && content.percentage == null) {
      return ''
    }
    return `${content.name}:${content.percentage || ''}%`
  }

  let displayItems = params.value
    .map(getItemDisplay)
    .filter((displayItem) => !!displayItem)
  return displayItems.join(',<br/>')
}

const useSideInfoCol = (
  headerName: string,
  side: 'faceSide' | 'backSide',
  spreadsheetService: SpreadsheetService
): ComputedRef<ColGroupDef<MaterialRow>> => {
  const { t } = useI18n()
  const { materialTypeText } = useEnumText()
  const featureListCol = useFeatureListCol(
    `${side}.featureList`,
    sideEditable(side),
    spreadsheetService
  )
  const finishListCol = useFinishListCol(
    `${side}.finishList`,
    sideEditable(side),
    spreadsheetService
  )

  const { allContentList, descriptionList, addDescriptionOption } =
    spreadsheetService

  return computed(() => {
    return {
      headerName,
      children: [
        {
          field: `${side}.frontierNo`,
          headerName: t('RR0084'),
          minWidth: 200,
          cellEditor: SelectCellEditor,
        },
        featureListCol.value,
        finishListCol.value,
        {
          field: `${side}.contentList`,
          headerName: t('RR0021'),
          headerComponentParams: requiredColumnComponentParams,
          minWidth: 300,
          editable: (params) =>
            rowEditable(params) && sideEditable(side)(params),
          cellEditor: ContentListCellEditorVue,
          cellEditorPopup: true,
          cellEditorPopupPosition: 'under',
          wrapText: true,
          autoHeight: true,
          valueFormatter: contentListValueRenderer,
          valueParser: (
            params: ValueParserParams<
              MaterialRow,
              MaterialSideAllOfContentList[]
            >
          ) => {
            if (!params.newValue?.trim()) {
              return
            }

            const lines = params.newValue.split('<br/>').map((v) => v.trim())
            if (lines.length === 0) {
              return params.oldValue
            }

            try {
              const contentList = lines.map((line) => {
                const matchArray = [...line.matchAll(/(.*):(\d+)%/g)]
                if (matchArray.length === 0) {
                  throw new Error('Invalid content list format')
                }

                const matchResult = matchArray[0]
                if (matchResult.length !== 3) {
                  throw new Error('Invalid content list format')
                }

                const name = matchResult[1]
                const percentage = Number(matchResult[2])

                const item: MaterialSideAllOfContentList = {
                  contentId:
                    allContentList.value.find((c) => c.name === name)
                      ?.contentId ?? null,
                  name,
                  percentage,
                }

                return item
              })

              return contentList
            } catch (e) {
              console.error(e)
              return params.oldValue
            }
          },
          cellRenderer: contentListValueRenderer,
          cellStyle: (params: CellClassParams<MaterialRow, string>) => {
            const editable = params.column.isCellEditable(params.node)
            const isValid = () => {
              if (params.column.isCellEditable(params.node)) {
                return contentListSchema.safeParse(params.value).success
              }
              return true
            }
            return getCellStyle({
              valid: isValid(),
              editable,
            })
          },
        },
        {
          field: `${side}.materialType`,
          headerName: t('MI0003'),
          headerComponentParams: requiredColumnComponentParams,
          minWidth: 150,
          editable: (params) =>
            rowEditable(params) && sideEditable(side)(params),
          ...getEnumCellProps(
            materialTypeSchema,
            MaterialType,
            materialTypeText
          ),
          cellStyle: (params: CellClassParams<MaterialRow, MaterialType>) => {
            const editable = params.column.isCellEditable(params.node)
            return getCellStyle({
              valid:
                !editable || materialTypeSchema.safeParse(params.value).success,
              editable,
            })
          },
          onCellValueChanged: (e) => {
            e.api.refreshCells({ rowNodes: [e.node], force: true })

            const newRow = e.data
            newRow[side]!.descriptionList = []
            if (e.newValue !== MaterialType.WOVEN) {
              newRow[side]!.construction!.warpDensity = null
              newRow[side]!.construction!.weftDensity = null
              newRow[side]!.construction!.warpYarnSize = null
              newRow[side]!.construction!.weftYarnSize = null
            }
            if (e.newValue !== MaterialType.KNIT) {
              newRow[side]!.construction!.machineType = null
              newRow[side]!.construction!.walesPerInch = null
              newRow[side]!.construction!.coursesPerInch = null
              newRow[side]!.construction!.yarnSize = null
              newRow[side]!.construction!.machineGaugeInGg = null
            }
            if (e.newValue !== MaterialType.LEATHER) {
              newRow[side]!.construction!.averageSkinPerMeterSquare = null
              newRow[side]!.construction!.grade = null
              newRow[side]!.construction!.tannage = null
              newRow[side]!.construction!.thicknessPerMm = null
            }
            if (e.newValue !== MaterialType.NON_WOVEN) {
              newRow[side]!.construction!.bondingMethod = null
              newRow[side]!.construction!.thicknessPerMm = null
            }
            if (e.newValue !== MaterialType.TRIM) {
              newRow[side]!.construction!.outerDiameter = null
              newRow[side]!.construction!.length = null
              newRow[side]!.construction!.thickness = null
              newRow[side]!.construction!.width = null
            }
            e.api.applyTransaction({ update: [newRow] })
          },
        },
        {
          field: `${side}.descriptionList`,
          columnGroupShow: 'open',
          headerName: t('MI0023'),
          editable: (params: EditableCallbackParams<MaterialRow>) => {
            if (params.data?.[side]?.materialType == null) {
              return false
            }
            return rowEditable(params) && sideEditable(side)(params)
          },
          cellEditor: DescriptionListCellEditorVue,
          cellEditorPopup: true,
          cellEditorPopupPosition: 'under',
          cellEditorParams: { side },
          wrapText: true,
          autoHeight: true,
          cellRenderer: (
            params: ValueFormatterParams<MaterialRow, MaterialDescription[]>
          ) => {
            return params.value?.map((d) => d.name)?.join(', ') || null
          },
          valueFormatter: (
            params: ValueFormatterParams<MaterialRow, MaterialDescription[]>
          ) => {
            if (!params.value) {
              return ''
            }

            return params.value.map((d) => d.name)?.join(', ') || ''
          },
          valueParser: (
            params: ValueParserParams<MaterialRow, MaterialDescription[]>
          ) => {
            if (!params.newValue) {
              return params.oldValue
            }

            const descriptionNameList = params.newValue
              .split(',')
              .map((str) => str.trim())
              .filter(Boolean)
            if (!descriptionNameList.length) {
              return params.oldValue
            }

            const materialType = params.data[side]?.materialType
            const getKey = () => {
              switch (materialType) {
                case MaterialType.WOVEN:
                  return 'woven'
                case MaterialType.KNIT:
                  return 'knit'
                case MaterialType.LEATHER:
                  return 'leather'
                case MaterialType.NON_WOVEN:
                  return 'nonWoven'
                case MaterialType.TRIM:
                  return 'trim'
                case MaterialType.OTHERS:
                  return 'others'
              }
            }

            let descriptionMenuTree = descriptionList.value[getKey()]

            let menuItemList = descriptionMenuTree.blockList
              .flatMap((block) => block.menuList)
              .flat()
            descriptionNameList.forEach((descriptionName) => {
              if (
                !menuItemList.find((item) => item.title === descriptionName)
              ) {
                addDescriptionOption(getKey(materialType), descriptionName)
              }
            })

            descriptionMenuTree = descriptionList.value[getKey(materialType)]

            menuItemList = descriptionMenuTree.blockList
              .flatMap((block) => block.menuList)
              .flat()

            const result = descriptionNameList.map((descriptionName) => {
              const target = menuItemList.find(
                (menuItem) => menuItem.title === descriptionName
              )
              return target?.selectValue
            })

            return result
          },
        },
        {
          headerName: t('MI0026'),
          columnGroupShow: 'open',
          children: [
            {
              field: `${side}.construction.isPublic`,
              headerName: t('MI0025'),
              editable: (params) =>
                rowEditable(params) && sideEditable(side)(params),
            },
            getWovenConstruction(side),
            getKnitConstruction(side),
            getLeatherConstruction(side),
            getNonWovenConstruction(side),
            getTrimConstruction(side),
            {
              headerName: t('RR0258'),
              columnGroupShow: 'open',
              field: `${side}.constructionCustomPropertyList`,
              editable: (params) =>
                rowEditable(params) && sideEditable(side)(params),
              ...getCustomPropertyListCellProps({
                label: t('MI0026'),
                nameLabel: 'Construction Name',
                namePlaceholder: t('MI0030'),
                valueLabel: 'Construction Value',
                valuePlaceholder: t('MI0044'),
              }),
            },
          ],
        },
        {
          headerName: t('RR0026'),
          columnGroupShow: 'open',
          children: [
            {
              headerName: t('RR0026'),
              field: `${side}.colorInfo.color`,
              editable: (params) =>
                rowEditable(params) && sideEditable(side)(params),
              ...getStringCellProps(colorInfoSchema.shape.color, t('MI0041')),
            },
            {
              headerName: t('RR0258'),
              field: `${side}.colorInfo.customPropertyList`,
              editable: (params) =>
                rowEditable(params) && sideEditable(side)(params),
              ...getCustomPropertyListCellProps({
                label: t('RR0026'),
                nameLabel: 'Color Name',
                namePlaceholder: t('MI0030'),
                valueLabel: 'Color Value',
                valuePlaceholder: t('MI0044'),
              }),
            },
          ],
        },
        {
          headerName: t('RR0025'),
          columnGroupShow: 'open',
          children: [
            {
              headerName: t('RR0025'),
              field: `${side}.patternInfo.pattern`,
              editable: (params) =>
                rowEditable(params) && sideEditable(side)(params),
              ...getStringCellProps(
                patternInfoSchema.shape.pattern,
                t('MI0042')
              ),
            },
            {
              headerName: t('RR0258'),
              field: `${side}.patternInfo.customPropertyList`,
              editable: (params) =>
                rowEditable(params) && sideEditable(side)(params),
              ...getCustomPropertyListCellProps({
                label: t('RR0025'),
                nameLabel: 'Pattern Name',
                namePlaceholder: t('MI0030'),
                valueLabel: 'Pattern Value',
                valuePlaceholder: t('MI0044'),
              }),
            },
          ],
        },
      ],
    }
  })
}

export default useSideInfoCol
