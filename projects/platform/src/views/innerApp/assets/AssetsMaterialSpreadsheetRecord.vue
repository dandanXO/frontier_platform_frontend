<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-full h-full flex flex-col px-5 pb-2")
    div(class="pt-4 pb-2 flex justify-between")
      global-breadcrumb-list(
        :breadcrumbList="breadcrumbList"
        @click:item="$event.goTo?.()"
      )
    assets-material-ag-grid(:materialRowList="materialRowList" readOnly)
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import AssetsMaterialAgGrid from './AssetsMaterialAgGrid.vue'
import type { MaterialRow } from '@/types'
import useNavigation from '@/composables/useNavigation'
import { PROGRESS_TAB } from '@/utils/constants'
import { useProgressStore } from '@/stores/progress'
import axios from 'axios'
import {
  GetExcelProgressListRequestCategoryEnum,
  GetOnlineSpreadSheetProgressListRequestAllOfPaginationSortEnum,
  ProgressStatus,
} from '@frontier/platform-web-sdk'

const props = defineProps<{
  progressId: string
}>()

const { t } = useI18n()
const { ogBaseProgressApi } = useProgressStore()
const { goToProgress } = useNavigation()

// const result = await ogBaseProgressApi('getOnlineSpreadSheetProgress', {
//   progressId: Number(props.progressId),
// })
// const progressItem = result.data.result
const SPREADSHEET_SORT_BY =
  GetOnlineSpreadSheetProgressListRequestAllOfPaginationSortEnum
const EXCEL_CATEGORY = GetExcelProgressListRequestCategoryEnum
const queryParams = reactive({
  startDate: null,
  endDate: null,
  category: EXCEL_CATEGORY.ALL as GetExcelProgressListRequestCategoryEnum,
})
const result = await ogBaseProgressApi('getOnlineSpreadSheetProgressList', {
  ...queryParams,
  status: ProgressStatus.ALL,
  pagination: {
    sort: SPREADSHEET_SORT_BY.NEWEST_FIRST as GetOnlineSpreadSheetProgressListRequestAllOfPaginationSortEnum,
    targetPage: 1,
    perPageCount: 100,
  },
})
const progressItem = result.data.result.progressList.find(
  (p) => p.progressId === Number(props.progressId)
)
const fileResult = await axios.get(progressItem.fileUrl)

const getMaterialPayloadRowList = (): MaterialRow[] => {
  const payload = fileResult.data as {
    createList: MaterialRow[]
    updateList: MaterialRow[]
    deleteList: MaterialRow[]
  }
  const createMaterialRowList = payload.createList.map<MaterialRow>((m) => {
    return {
      ...m,
      isCreate: true,
      isDirty: false,
      isDelete: false,
      editable: false,
    }
  })
  const updateMaterialRowList = payload.updateList.map<MaterialRow>((m) => {
    return {
      ...m,
      isCreate: false,
      isDirty: true,
      isDelete: false,
      editable: false,
    }
  })
  const deleteMaterialRowList = payload.deleteList.map<MaterialRow>((m) => {
    return {
      ...m,
      isCreate: false,
      isDirty: false,
      isDelete: true,
      editable: false,
    }
  })

  return [
    ...createMaterialRowList,
    ...updateMaterialRowList,
    ...deleteMaterialRowList,
  ]
}

const materialRowList: MaterialRow[] = getMaterialPayloadRowList()

const breadcrumbList = computed(() => {
  return [
    {
      name: t('PP0011'),
      goTo: () => goToProgress({}, PROGRESS_TAB.SPREADSHEET),
    },
    {
      name: 'Spreadsheet',
    },
  ]
})
</script>

<style scoped></style>
