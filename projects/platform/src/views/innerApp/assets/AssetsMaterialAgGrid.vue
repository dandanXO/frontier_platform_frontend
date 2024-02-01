<template lang="pug">
div(class="relative flex-1 w-full flex flex-col gap-y-4")
  div(v-if="!readOnly" class="flex flex-row gap-x-4")
    f-button(type="secondary" size="md" prependIcon="add" @click="handleAdd") {{ $t('UU0020') }}
    f-button(
      type="secondary"
      size="md"
      prependIcon="delete"
      @click="handleDelete"
    ) {{ $t('UU0013') }}
  ag-grid-vue(
    style="height: 100%"
    :disabled="true"
    class="ag-theme-balham"
    :rowData="rowData"
    :columnDefs="colDefs"
    :grid-options="gridOptions"
    @grid-ready="onGridReady"
    @cellValueChanged="handleValueChange"
  )
  div(class="flex flex-row justify-between items-center")
    div(class="flex flex-row gap-x-4 items-center")
      f-button(
        v-if="!readOnly"
        type="primary"
        size="md"
        :disabled="!isUpdated"
        @click="handleReset"
      ) {{ $t('UU0143') }}
      div(class="flex flex-row gap-x-3 items-center")
        div(
          class="px-4 py-3 rounded-lg h-10 text-body2 bg-primary-100 flex flex-row items-center justify-center gap-x-3"
        )
          div(class="flex flex-row items-center justify-between w-15")
            span(class="text-grey-600") {{ $t('RR0278') }}
            span(class="font-bold") {{ editStatusCount.createCount }}
          span(class="h-full w-px bg-grey-250")
          div(class="flex flex-row items-center justify-between w-15")
            span(class="text-grey-600") {{ $t('RR0327') }}
            span(class="font-bold") {{ editStatusCount.updateCount }}
        div(
          class="w-26 h-10 rounded-lg bg-grey-100 px-4 py-3 text-body-2 flex flex-row justify-between items-center"
        )
          span(class="text-grey-600") {{ $t('RR0063') }}
          span(class="font-bold text-grey-900") {{ editStatusCount.deleteCount }}
    f-button(
      v-if="!readOnly"
      type="primary"
      size="lg"
      :disabled="!canSubmit"
      @click="handleSubmit"
    ) {{ $t('UU0018') }}
</template>

<script setup lang="ts">
import { computed, ref, reactive, provide } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { AgGridVue } from 'ag-grid-vue3'
import type {
  GridOptions,
  GridApi,
  GridReadyEvent,
  ColDef,
  ColGroupDef,
  CellClassParams,
  CellValueChangedEvent,
  EditableCallbackParams,
} from 'ag-grid-community'
import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import 'ag-grid-community/styles/ag-theme-balham.css'
import 'ag-grid-community/styles/ag-theme-material.css'
import { clone, omit, uniq } from 'ramda'
import {
  type Material,
  type MaterialSeasonInfoSeason,
  type MaterialFinish,
  type MaterialOptionsContentListDefaultInner,
  type MaterialDescription,
  MaterialSideType,
} from '@frontier/platform-web-sdk'
import type { MaterialRow, SubmitPayload } from '@/types'
import useMaterialSchema from '@/composables/material/useMaterialSchema'
import { useAssetsStore } from '@/stores/assets'
import type { MenuTree } from '@frontier/ui-component'
import {
  getCellStyle,
  requiredColumnComponentParams,
  getStringCellProps,
  rowEditable,
} from './cell/cellUtils'
import useEnumText from '@/composables/useEnumText'
import useSeasonInfoCol from './column/useSeasonInfoCol'
import useInventoryInfoCol from './column/useInventoryInfoCol'
import usePriceInfoCol from './column/usePriceInfoCol'
import useTagInfoCol from './column/useTagInfoCol'
import useWidthInfoCol from './column/useWidthInfoCol'
import useWeightInfoCol from './column/useWeightInfoCol'
import useSideInfoCol from './column/side/useSideInfoCol'
import useMiddleSideInfoCol from './column/side/useMiddleSideInfoCol'
import { rowStyle } from './cell/cellUtils'
import {
  convertInventoryFormToReq,
  convertSpreadSheetPriceInfoFormToReq,
  generateMaterialRow,
} from '@/utils/material'

export type Nullable<T> = { [K in keyof T]: T[K] | null }

const props = withDefaults(
  defineProps<{
    materialRowList: MaterialRow[]
    readOnly?: boolean
  }>(),
  {
    readOnly: false,
  }
)

const emit = defineEmits<{
  (e: 'submit', payload: SubmitPayload): void
}>()

const originMaterialRowList: MaterialRow[] = clone(props.materialRowList)

const store = useStore()
const { ogBaseAssetsApi } = useAssetsStore()
const { materialSideTypeText, currencyText } = useEnumText()

const materialOptionsRes = await ogBaseAssetsApi('getMaterialOptions')
const materialOptions = materialOptionsRes.data.result!

const { t } = useI18n()

const gridApi = ref<GridApi<MaterialRow>>()
const rowData = ref<MaterialRow[]>(clone(originMaterialRowList))

const getPublicMenuList = () =>
  uniq(props.materialRowList.flatMap((m) => m.tagInfo.tagList)).map((tag) => ({
    title: tag,
    selectValue: tag,
  }))

const getPrivateMenuList = () =>
  uniq(
    props.materialRowList
      .flatMap((m) => m.internalInfo?.tagList)
      .filter((tag) => !!(tag as string))
  ).map((tag) => ({ title: tag, selectValue: tag }))

const publicTagMenuList = ref(getPublicMenuList())
const privateTagMenuList = ref(getPrivateMenuList())

const menuTreePublicTag = computed(() => ({
  blockList: [{ menuList: publicTagMenuList.value }],
}))
const menuTreePrivateTag = computed(() => ({
  blockList: [{ menuList: privateTagMenuList.value }],
}))

const materialSchema = useMaterialSchema()

const newSeasonList = ref<Nullable<MaterialSeasonInfoSeason>[]>([])
const allSeasonList = computed(() => {
  const { default: defaultList, custom: customList } =
    materialOptions.seasonList
  return [...newSeasonList.value, ...defaultList, ...customList]
})
const seasonMenuTree = computed(() => {
  const result = {
    scrollAreaMaxHeight: 'max-h-72',
    blockList: [
      {
        blockTitle: t('RR0258'),
        menuList: [
          ...newSeasonList.value,
          ...(materialOptions.seasonList?.custom || []),
        ].map((season) => ({
          selectValue: season.name,
          title: season.name,
        })),
      },
      {
        menuList:
          materialOptions.seasonList?.default.map((season) => ({
            selectValue: season.name,
            title: season.name,
          })) || [],
      },
    ],
  }
  return result
})
const addSeasonOption = (seasonName: string) => {
  newSeasonList.value.push({
    seasonId: null,
    name: seasonName,
  })
}

const countryMenuTree = computed<MenuTree>(
  () => store.getters['code/countryMenuTree']
)

const countryList = countryMenuTree.value.blockList[0].menuList.map((i) => {
  return { code: i.selectValue, name: i.title }
})

const getFeatureListFromMaterial = (m: Material) => [
  ...(m.faceSide?.featureList || []),
  ...(m.middleSide?.featureList || []),
  ...(m.backSide?.featureList || []),
]

const getInitialFeatureList = () => {
  return uniq(
    props.materialRowList.flatMap((m) => getFeatureListFromMaterial(m))
  )
}

const featureList = reactive<string[]>(getInitialFeatureList())
const featureMenuTree = computed<MenuTree>(() => ({
  scrollAreaMaxHeight: 'max-h-72',
  blockList: [
    {
      blockTitle: t('RR0258'),
      menuList: featureList.concat([]).map((feature) => ({
        title: feature,
        selectValue: feature,
      })),
    },
  ],
}))
const addFeatureOption = (featureName: string) => {
  featureList.push(featureName)
}

const newFinishList = reactive<Nullable<MaterialFinish>[]>([])
const finishMenuTree = computed<MenuTree>(() => ({
  scrollAreaMaxHeight: 'max-h-72',
  blockList: [
    {
      blockTitle: t('RR0258'),
      menuList: newFinishList
        .concat(materialOptions.finishList.custom || [])
        .map((finish) => ({
          title: finish.name || '',
          selectValue: finish,
        })),
    },
    {
      menuList:
        materialOptions.finishList.default.map((finish) => ({
          title: finish.name,
          selectValue: finish,
        })) || [],
    },
  ],
}))

const addFinishOption = (finishName: string) => {
  newFinishList.push({
    finishId: null,
    name: finishName,
  })
}

const newContentList = reactive<
  Nullable<MaterialOptionsContentListDefaultInner>[]
>([])

const contentCustomList = computed(() =>
  newContentList.concat(materialOptions.contentList.custom)
)

const contentDefaultList = computed(() => materialOptions.contentList.default)

const allContentList = computed(() => [
  ...contentCustomList.value,
  ...contentDefaultList.value,
])

const contentList = computed(() => ({
  scrollAreaMaxHeight: 'max-h-72',
  blockList: [
    {
      blockTitle: t('RR0258'),
      menuList: contentCustomList.value.map((content) => ({
        selectValue: content.name,
        title: content.name,
      })),
    },
    {
      menuList: contentDefaultList.value.map((content) => ({
        selectValue: content.name,
        title: content.name,
      })),
    },
  ],
}))

const addContentOption = (contentName: string) => {
  newContentList.push({
    contentId: null,
    name: contentName,
  })
}

provide('contentService', {
  newContentList,
  contentList,
  contentCustomList,
  contentDefaultList,
  allContentList,
  addContentOption,
})

const newDescriptionList = reactive<{
  woven: Nullable<MaterialDescription>[]
  knit: Nullable<MaterialDescription>[]
  leather: Nullable<MaterialDescription>[]
  nonWoven: Nullable<MaterialDescription>[]
  trim: Nullable<MaterialDescription>[]
  others: Nullable<MaterialDescription>[]
}>({
  woven: [],
  knit: [],
  leather: [],
  nonWoven: [],
  trim: [],
  others: [],
})

const descriptionMenuDefaultList = computed(() => {
  const materialOptionsDescriptionList = materialOptions.descriptionList

  return Object.keys(materialOptionsDescriptionList).reduce(
    (acc, materialType) => {
      const value = materialOptionsDescriptionList[materialType].default.map(
        (description) => ({
          title: description.name,
          selectValue: description,
        })
      )

      acc[materialType] = value
      return acc
    },
    {}
  )
})

const descriptionMenuCustomList = computed(() => {
  const materialOptionsDescriptionList = materialOptions.descriptionList
  return Object.keys(materialOptionsDescriptionList).reduce(
    (acc, materialType) => {
      const value = [
        ...newDescriptionList[materialType],
        ...materialOptionsDescriptionList[materialType].custom,
      ].map((description) => ({
        title: description.name,
        selectValue: description,
      }))

      acc[materialType] = value
      return acc
    },
    {}
  )
})

const addDescriptionOption = (
  materialType: keyof typeof newDescriptionList,
  descriptionName: string
) => {
  newDescriptionList[materialType].push({
    descriptionId: null,
    name: descriptionName,
  })
}

const descriptionList = computed(() => {
  return ['woven', 'nonWoven', 'knit', 'leather', 'trim', 'others'].reduce(
    (acc, materialType) => {
      const value = {
        scrollAreaMaxHeight: 'max-h-72',
        blockList: [
          {
            blockTitle: t('RR0258'),
            menuList: descriptionMenuCustomList.value[materialType],
          },
          { menuList: descriptionMenuDefaultList.value[materialType] },
        ],
      }

      acc[materialType] = value
      return acc
    },
    {}
  )
})

const isNewMaterial = (params: EditableCallbackParams) =>
  params.data?.isCreate || false

const spreadsheetService = {
  gridApi,
  seasonMenuTree,
  addSeasonOption,
  allSeasonList,
  countryList,
  currencyText,
  materialOptions,
  menuTreePublicTag,
  menuTreePrivateTag,
  publicTagMenuList,
  privateTagMenuList,
  featureMenuTree,
  addFeatureOption,
  finishMenuTree,
  addFinishOption,
  allContentList,
  addContentOption,
  newDescriptionList,
  descriptionList,
  descriptionMenuDefaultList,
  descriptionMenuCustomList,
  addDescriptionOption,
}

const spreadsheetServiceKey = 'spreadsheetService'
provide(spreadsheetServiceKey, spreadsheetService)
export type SpreadsheetService = typeof spreadsheetService

const inventoryInfoCol = useInventoryInfoCol()
const seasonInfoCol = useSeasonInfoCol(spreadsheetService)
const priceInfoCol = usePriceInfoCol(spreadsheetService)
const tagInfoCol = useTagInfoCol(spreadsheetService)
const widthInfoCol = useWidthInfoCol()
const weightInfoCol = useWeightInfoCol()
const faceSideInfoCol = useSideInfoCol(
  t('DD0048'),
  'faceSide',
  spreadsheetService
)
const backSideInfoCol = useSideInfoCol(
  t('DD0049'),
  'backSide',
  spreadsheetService
)
const middleSideInfoCol = useMiddleSideInfoCol(spreadsheetService)

const colDefs = computed<(ColDef<MaterialRow> | ColGroupDef<MaterialRow>)[]>(
  () => {
    return [
      {
        field: 'materialId',
        headerName: 'ID',
        minWidth: 50,
        hide: true,
        filter: true,
        pinned: 'left',
      },
      {
        field: 'itemNo',
        headerName: t('RR0013'),
        headerComponentParams: requiredColumnComponentParams,
        editable: rowEditable,
        minWidth: 200,
        filter: true,
        pinned: 'left',
        ...getStringCellProps(materialSchema.shape.itemNo, t('MI0010')),
      },
      {
        field: 'isDoubleSide',
        headerName: t('RR0342'),
        minWidth: 125,
        editable: (params) => rowEditable(params) && isNewMaterial(params),
        onCellValueChanged: (e) => {
          if (!e.node?.data) {
            return
          }
          e.api.refreshCells({ rowNodes: [e.node], force: true })
          if (e.node.data.isDoubleSide) {
            e.node.updateData({ ...e.node.data, sideType: null })
          } else {
            e.node.updateData({
              ...e.node.data,
              isAutoSyncFaceToBackSideInfo: false,
            })
          }
        },
      },
      {
        field: 'sideType',
        headerName: t('RR0343'),
        editable: (params) => {
          if (!rowEditable(params)) {
            return false
          }

          const rowData = params.data
          if (!rowData || !rowData.isCreate || rowData.isDoubleSide) {
            return false
          }
          return true
        },
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: Object.values(MaterialSideType),
          formatValue: (value: MaterialSideType) =>
            materialSideTypeText.value[value],
          allowTyping: true,
          filterList: true,
        },
        valueParser: (params) => {
          const result = Object.entries(materialSideTypeText.value).find(
            ([key, value]) => {
              return value === params.newValue
            }
          )?.[0]
          if (!result) {
            return params.oldValue
          }
          return Number(result)
        },
        valueFormatter: (params) => {
          if (!params.data) {
            return ''
          }

          const sideType = params.data.sideType
          if (sideType == null) {
            return ''
          }

          return materialSideTypeText.value[sideType]
        },
        cellStyle: (params) => {
          const isValid = () => {
            const rowData = params.data
            if (!rowData) {
              return false
            }
            if (rowData.isDoubleSide) {
              return rowData.sideType == null
            }

            return rowData.sideType != null
          }

          return getCellStyle({
            valid: isValid(),
            editable: params.column.isCellEditable(params.node),
          })
        },
        onCellValueChanged: (e) => {
          if (!e.node?.data) {
            return
          }
          e.api.refreshCells({ rowNodes: [e.node], force: true })
          if (e.node.data.sideType === MaterialSideType.FACE_SIDE) {
            e.node.updateData({
              ...e.node.data,
              backSide: generateMaterialRow().backSide,
            })
          }
          if (e.node.data.sideType === MaterialSideType.BACK_SIDE) {
            e.node.updateData({
              ...e.node.data,
              faceSide: generateMaterialRow().faceSide,
            })
          }
        },
      },
      {
        field: 'isComposite',
        headerName: t('MI0004'),
        minWidth: 160,
        editable: (params) => {
          if (!rowEditable(params)) {
            return false
          }
          return params.data?.isCreate || false
        },
        onCellValueChanged: (e) => {
          if (!e.node?.data) {
            return
          }
          e.api.refreshCells({ rowNodes: [e.node], force: true })
          if (!e.node.data.isComposite) {
            e.node.updateData({
              ...e.node.data,
              middleSide: generateMaterialRow().middleSide,
            })
          }
        },
      },
      {
        field: 'isAutoSyncFaceToBackSideInfo',
        headerName: t('MI0047'),
        minWidth: 160,
        editable: (params) => {
          if (!rowEditable(params)) {
            return false
          }
          return params.data?.isDoubleSide || false
        },
      },
      seasonInfoCol.value,
      widthInfoCol.value,
      weightInfoCol.value,
      faceSideInfoCol.value,
      middleSideInfoCol.value,
      backSideInfoCol.value,
      tagInfoCol.value,
      priceInfoCol.value,
      inventoryInfoCol.value,
    ]
  }
)

const gridOptions: GridOptions<MaterialRow> = {
  autoSizeStrategy: {
    type: 'fitGridWidth',
    defaultMinWidth: 100,
  },
  rowSelection: 'multiple',
  enableRangeSelection: true,
  pagination: true,
  localeText: {
    columns: t('RR0331'),
    pivotMode: t('RR0332'),
    pinColumn: t('RR0336'),
    autosizeThiscolumn: t('RR0337'),
    autosizeAllColumns: t('RR0338'),
    resetColumns: t('RR0339'),
    noPin: t('RR0333'),
    pinLeft: t('RR0334'),
    pinRight: t('RR0335'),
    pageSizeSelectorLabel: t('RR0328'),
    noRowsToShow: t('RR0105'),
    to: t('RR0330'),
    of: t('RR0340'),
  },
  sideBar: {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
        },
      },
    ],
  },
  getRowStyle: (params) => {
    if (!params.data) {
      return rowStyle.default
    }

    if (params.data.isCreate) {
      return rowStyle.create
    }

    if (params.data.isDelete) {
      return rowStyle.delete
    }

    if (params.data.isDirty) {
      return rowStyle.update
    }

    return rowStyle.default
  },
  defaultColDef: {
    cellStyle: (params: CellClassParams<MaterialRow, string>) =>
      getCellStyle({
        valid: true,
        editable: params.column.isCellEditable(params.node),
      }),
  },
}

const onGridReady = (params: GridReadyEvent<MaterialRow>) => {
  gridApi.value = params.api
  updateSubmitStatus()
}

const editStatusCount = reactive({
  createCount: 0,
  updateCount: 0,
  deleteCount: 0,
})

const isCreateUpdateRowValid = ref(false)

const isUpdated = computed(() => {
  return Object.values(editStatusCount).some((count) => count > 0)
})

const canSubmit = computed(() => {
  return isUpdated.value && isCreateUpdateRowValid.value
})

const handleValueChange = (e: CellValueChangedEvent<MaterialRow>) => {
  const node = e.node
  if (!node.data) {
    return
  }

  node.updateData({
    ...node.data,
    isDirty: true,
  })

  if (node.data.isAutoSyncFaceToBackSideInfo) {
    node.updateData({
      ...node.data,
      backSide: clone(node.data.faceSide),
    })
  }

  updateSubmitStatus()
}

const updateSubmitStatus = () => {
  const isSubmitPayloadValid = (submitPayload: SubmitPayload) => {
    const isRowItemValid = (row: Material) => {
      let reqRow = getReq(row)
      if (reqRow.priceInfo?.pricing?.price) {
        reqRow = {
          ...reqRow,
          priceInfo: {
            ...reqRow.priceInfo,
            pricing: {
              ...reqRow.priceInfo.pricing,
              price: Number(reqRow.priceInfo.pricing.price),
            },
          },
        }
      }
      if (reqRow.internalInfo?.priceInfo?.pricing?.price) {
        reqRow = {
          ...reqRow,
          internalInfo: {
            ...reqRow.internalInfo,
            priceInfo: {
              ...reqRow.internalInfo.priceInfo,
              pricing: {
                ...reqRow.internalInfo.priceInfo.pricing,
                price: Number(reqRow.internalInfo.pricing.price),
              },
            },
          },
        }
      }
      const result = materialSchema.safeParse(reqRow)
      if (!result.success) {
        console.error(result.error)
      }
      return result.success
    }
    return (
      submitPayload.createList.every(isRowItemValid) &&
      submitPayload.updateList.every(isRowItemValid)
    )
  }

  const materialRowList = getMaterialRowList()
  const submitPayload = getPayload(materialRowList)
  isCreateUpdateRowValid.value = isSubmitPayloadValid(submitPayload)
  Object.assign(editStatusCount, getStatusCount(submitPayload))
}

const handleAdd = () => {
  if (!gridApi.value) {
    return
  }

  const newRow = generateMaterialRow()
  let addIndex = 0
  gridApi.value.applyTransaction({ add: [newRow], addIndex })

  updateSubmitStatus()
}

const handleDelete = () => {
  if (!gridApi.value) {
    return
  }

  const selectedRows = gridApi.value.getSelectedRows()
  if (!selectedRows || selectedRows.length === 0) {
    console.log('No rows selected!')
    return
  }

  const markDeletedRows = selectedRows.filter((row) => !row.isCreate)
  markDeletedRows.forEach((row) => {
    row.isDelete = true
    row.editable = false
  })

  const trueDeletedRows = selectedRows.filter((row) => row.isCreate)

  gridApi.value.applyTransaction({
    remove: trueDeletedRows,
    update: markDeletedRows,
  })
  gridApi.value.refreshCells({ force: true })

  updateSubmitStatus()
}

const getMaterialRowList = (): MaterialRow[] => {
  if (!gridApi.value) {
    throw new Error('gridApi is not ready')
  }

  const materialRowList: MaterialRow[] = []
  gridApi.value.forEachNode(function (node) {
    if (node.data) {
      materialRowList.push(node.data)
    }
  })

  return materialRowList
}

const processMaterialSideFormToReq = (form: Material) => {
  let result = { ...form }

  if (!form.isDoubleSide) {
    if (form.sideType === MaterialSideType.FACE_SIDE) {
      result = { ...result, backSide: null }
    } else if (form.sideType === MaterialSideType.BACK_SIDE) {
      result = { ...result, faceSide: null }
    }
  }

  if (!form.isComposite) {
    result = { ...result, middleSide: null }
  }

  return result
}

const getReq = (form: Material) => {
  let req = processMaterialSideFormToReq(form)

  req.priceInfo = convertSpreadSheetPriceInfoFormToReq(req.priceInfo)
  if (req.internalInfo) {
    req = {
      ...req,
      internalInfo: {
        ...req.internalInfo,
        priceInfo: convertSpreadSheetPriceInfoFormToReq(
          req.internalInfo.priceInfo
        ),
        inventoryInfo: convertInventoryFormToReq(
          req.internalInfo.inventoryInfo
        ),
      },
    }
  }

  req = {
    ...req,
    hasCustomU3mUploading: false,
    multimediaList: [],
    internalInfo: {
      ...req.internalInfo,
      attachmentList: [],
    },
  }

  return req
}

const getPayload = (materialRowList: MaterialRow[]): SubmitPayload => {
  const removeAdditional = (m: MaterialRow) =>
    omit(['isCreate', 'isDelete', 'isDirty', 'editable'], m)

  const createList = materialRowList
    .filter((m) => m.isCreate)
    .map(removeAdditional)
    .map(getReq)
  const updateList = materialRowList
    .filter((m) => !m.isCreate && !m.isDelete && m.isDirty)
    .map(removeAdditional)
    .map(getReq)
  const deleteIdList = materialRowList
    .filter((m) => m.isDelete)
    .map((m) => m.materialId)
  const deleteList = originMaterialRowList
    .filter((originRow) => deleteIdList.includes(originRow.materialId))
    .map(removeAdditional)
    .map(getReq)

  return { createList, updateList, deleteList }
}

const getStatusCount = (payload: SubmitPayload) => {
  return {
    createCount: payload.createList.length,
    updateCount: payload.updateList.length,
    deleteCount: payload.deleteList.length,
  }
}

const handleReset = () => {
  gridApi.value?.setGridOption('rowData', clone(originMaterialRowList))
  gridApi.value?.stopEditing()
  updateSubmitStatus()
}

const handleSubmit = () => {
  const materialRowList = getMaterialRowList()
  const submitPayload = getPayload(materialRowList)
  emit('submit', submitPayload)
}
</script>

<style scoped>
.ag-theme-balham {
  /* bright green, 10% opacity */
  --ag-selected-row-background-color: rgba(207, 246, 235, 1);
  --ag-range-selection-border-color: rgba(62, 195, 155, 1);
}
</style>
