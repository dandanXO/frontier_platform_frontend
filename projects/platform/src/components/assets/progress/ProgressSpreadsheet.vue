<template lang="pug">
f-table(
  v-model:pagination="pagination"
  v-model:keyword="keyword"
  :headers="headers"
  :items="progressList"
  :emptyText="$t('RR0105')"
  :isLoading="isLoading"
  rowHeight="124px"
  tableWidth="1600px"
  @sort="getList()"
  @goTo="getList($event)"
  filterable
)
  template(#filter)
    div(class="pt-4 pb-3 px-5")
      div(class="flex items-center mb-2")
        p(class="text-grey-600 text-body2 mr-1.5") {{ $t('OO0117') }}
        f-button-label(@click="clearDate") {{ $t('UU0040') }}
      div(class="mr-4 flex items-center")
        f-input-text(
          v-model:textValue="queryParams.startDate"
          inputType="date"
          size="md"
          :clearable="false"
          @change="getList()"
        )
        span(class="text-body1 text-grey-900 mx-2") ~
        f-input-text(
          v-model:textValue="queryParams.endDate"
          inputType="date"
          size="md"
          :clearable="false"
          @change="getList()"
        )
    div(class="border-t border-grey-100")
  template(v-slot="{ item, prop, isHover }")
    template(v-if="prop === 'type'")
      p {{ $t('MI0146') }}
    template(v-if="prop === 'revisionHistory'")
      f-button(
        type="primary"
        size="lg"
        @click="goToSpreadsheetProgress({}, item.progressId)"
      ) {{ $t('MI0144') }}
    template(v-if="prop === 'createdTime'")
      p(class="text-body2/1.6 text-grey-600") {{ toStandardFormat(item.createDate) }}
    table-status-label(v-if="prop === 'statusLabel'" :status="item.status")
    table-status-progress(v-if="prop === 'procedure'" :status="item.status")
      //- Unsuccessful
      div(
        v-if="item.status === ProgressStatus.UNSUCCESSFUL"
        class="text-red-400 inline-flex"
      )
        f-svg-icon(iconName="warning_amber_round" size="16" class="mr-1.5 mt-0.5")
        p(v-if="item.unsuccessfulMsgCode === ERROR_MSG.INACTIVE") {{ $t('WW0092') }}
        p(
          v-else-if="item.unsuccessfulMsgCode === ERROR_MSG.INSUFFICIENT_STORAGE"
        ) {{ $t('WW0090') }}
          span(class="text-cyan-400 ml-0.5 cursor-pointer" @click="goToBillings()") {{ $t('RR0169') }}
      //- In Queue
      div(
        v-else-if="item.status === ProgressStatus.IN_QUEUE"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        p {{ $t('PP0028') }}
      //- Processing
      div(
        v-else-if="item.status === ProgressStatus.PROCESSING"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        i18n-t(
          v-if="item.category === EXCEL_CATEGORY.UPLOAD"
          keypath="PP0027"
          tag="p"
          scope="global"
        )
          template(#fileName) {{ item.fileName }}
        p(v-else-if="item.category === EXCEL_CATEGORY.EXPORT") {{ $t('PP0026') }}
    div(v-if="prop === 'createBy'" class="flex items-center")
      img(:src="item.createAvatar" class="w-6 h-6 rounded-full")
      p(class="text-body2 text-grey-900 ml-2 line-clamp-1") {{ item.createUser }}
    div(v-if="prop === 'action'" class="flex justify-end items-center")
      template(v-if="item.status === ProgressStatus.COMPLETE")
        f-button(type="secondary" size="sm" class="mr-2.5" @click="goToAssets()") {{ $t('UU0088') }}
        f-popper(
          placement="bottom-end"
          class="w-7.5"
          :class="[isHover ? 'visible' : 'invisible']"
        )
          template(#trigger)
            div(
              class="group w-7.5 h-7.5 flex items-center justify-center cursor-pointer rounded-full hover:bg-primary-400/10"
            )
              f-svg-icon(
                iconName="more_horiz"
                size="24"
                class="text-grey-600 group-hover:text-primary-400"
                :tooltipMessage="$t('RR0260')"
              )
          template(#content="{ collapsePopper }")
            f-list(
              v-if="item.status === ProgressStatus.COMPLETE && item.category === EXCEL_CATEGORY.UPLOAD"
            )
              f-list-item(
                @click="handleAction(ASSETS_MATERIAL_FUNCTION.PRINT_A4_SWATCH, item); collapsePopper()"
              ) {{ $t('RR0062') }}
              f-list-item(
                @click="handleAction(ASSETS_MATERIAL_FUNCTION.PRINT_LABEL, item); collapsePopper()"
              ) {{ $t('RR0061') }}
              div(class="border-t border-grey-250 my-1")
              //- f-list-item(
              //-   @click="handleAction(ASSETS_MATERIAL_FUNCTION.EXPORT_EXCEL, item); collapsePopper()"
              //- ) {{ $t('RR0060') }}
      //- In queue & Unsuccessful
      f-popper(
        v-else-if="item.status === ProgressStatus.IN_QUEUE"
        placement="bottom-end"
        class="w-7.5"
        :class="[isHover ? 'visible' : 'invisible']"
      )
        template(#trigger)
          div(
            class="group w-7.5 h-7.5 flex items-center justify-center cursor-pointer rounded-full hover:bg-primary-400/10"
          )
            f-svg-icon(
              iconName="more_horiz"
              size="24"
              class="text-grey-600 group-hover:text-primary-400"
              :tooltipMessage="$t('RR0260')"
            )
        template(#content="{ collapsePopper }")
          f-list
            f-list-item(@click="handleCancel(item); collapsePopper()") {{ $t('UU0002') }}
</template>

<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { toStandardFormat } from '@frontier/lib'
import { NOTIFY_TYPE } from '@/utils/constants'
import TableStatusLabel from '@/components/assets/progress/TableStatusLabel.vue'
import TableStatusProgress from '@/components/assets/progress/TableStatusProgress.vue'
import useNavigation from '@/composables/useNavigation'
import {
  ProgressStatus,
  type ProgressOnlineSpreadSheetItem,
  GetExcelProgressListRequestCategoryEnum,
  GetOnlineSpreadSheetProgressListRequestAllOfPaginationSortEnum,
} from '@frontier/platform-web-sdk'
import { useProgressStore } from '@/stores/progress'
import usePrint from '@/composables/material/usePrint'
import { ASSETS_MATERIAL_FUNCTION } from '@/composables/useAssets'

const ERROR_MSG = {
  INACTIVE: 1,
  INSUFFICIENT_STORAGE: 2,
}

const SPREADSHEET_SORT_BY =
  GetOnlineSpreadSheetProgressListRequestAllOfPaginationSortEnum
const EXCEL_CATEGORY = GetExcelProgressListRequestCategoryEnum

const props = defineProps<{
  currentStatus: ProgressStatus
}>()

const { t } = useI18n()
const store = useStore()
const { goToAssets, goToBillings, goToSpreadsheetProgress } = useNavigation()
const { ogBaseProgressApi } = useProgressStore()
const { printA4Swatch, printLabel } = usePrint()

const headers = [
  {
    prop: 'revisionHistory',
    label: t('MI0144'),
    colSpan: 'col-span-3',
    sortBy: [
      SPREADSHEET_SORT_BY.NEWEST_FIRST,
      SPREADSHEET_SORT_BY.OLDEST_FIRST,
    ],
  },
  {
    prop: 'statusLabel',
    label: t('PP0010'),
    colSpan: 'col-span-2',
    sortBy: [
      SPREADSHEET_SORT_BY.IN_QUEUE_FIRST,
      SPREADSHEET_SORT_BY.COMPLETE_FIRST,
    ],
  },
  {
    prop: 'procedure',
    label: t('PP0011'),
    colSpan: 'col-span-3',
  },
  {
    prop: 'createdTime',
    label: t('RR0189'),
    colSpan: 'col-span-2',
    sortBy: [
      SPREADSHEET_SORT_BY.NEWEST_FIRST,
      SPREADSHEET_SORT_BY.OLDEST_FIRST,
    ],
  },
  {
    prop: 'createBy',
    label: t('RR0188'),
    colSpan: 'col-span-2',
  },
]

const isLoading = ref(false)
const keyword = ref(null)
const pagination = ref({
  sort: SPREADSHEET_SORT_BY.NEWEST_FIRST as GetOnlineSpreadSheetProgressListRequestAllOfPaginationSortEnum,
  currentPage: 1,
  totalPage: 1,
  perPageCount: 8,
})
const queryParams = reactive({
  startDate: null,
  endDate: null,
  category: EXCEL_CATEGORY.ALL as GetExcelProgressListRequestCategoryEnum,
})
const clearDate = async () => {
  queryParams.startDate = null
  queryParams.endDate = null
  await getList()
}

const progressList = ref<ProgressOnlineSpreadSheetItem[]>([])
let timerId: ReturnType<typeof setTimeout>
const getList = async (targetPage = 1, showSpinner = true) => {
  clearTimeout(timerId)
  isLoading.value = showSpinner

  const { data } = await ogBaseProgressApi('getOnlineSpreadSheetProgressList', {
    ...queryParams,
    status: props.currentStatus,
    pagination: {
      perPageCount: pagination.value.perPageCount,
      sort: pagination.value.sort,
      targetPage,
    },
  })

  pagination.value = data.result.pagination
  progressList.value = data.result.progressList.map((i) => ({
    ...i,
    type: 'Mass Upload',
  }))
  isLoading.value = false

  timerId = setTimeout(() => {
    getList(pagination.value.currentPage, false)
  }, 30000)
}
watch(
  () => props.currentStatus,
  () => getList(),
  {
    immediate: true,
  }
)
onUnmounted(() => {
  clearTimeout(timerId)
})

const handleAction = async (
  type: ASSETS_MATERIAL_FUNCTION,
  item: ProgressOnlineSpreadSheetItem
) => {
  const { data } = await ogBaseProgressApi('getExcelProgressMaterialList', {
    progressId: item.progressId,
  })
  const materialList = data.result.materialList
  const deletedMaterialList = materialList.filter(
    (material) => material.metaData.isDelete
  )

  if (deletedMaterialList.length > 0) {
    store.dispatch('helper/pushModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('PP0035'),
      contentText: t('PP0036'),
      primaryBtnText: t('UU0094'),
      secondaryBtnText: t('UU0098'),
      closeAfterSecondaryBtnHandler: false,
      textBtnText: t('UU0002'),
      primaryBtnHandler: async () => {
        if (type === ASSETS_MATERIAL_FUNCTION.PRINT_A4_SWATCH) {
          printA4Swatch(materialList)
        } else if (type === ASSETS_MATERIAL_FUNCTION.PRINT_LABEL) {
          printLabel(materialList)
        } else {
          // exportExcel.func(materialList)
        }
      },
      secondaryBtnHandler: () => {
        store.dispatch('helper/pushModalBehavior', {
          component: 'modal-item-no-list',
          properties: {
            header: t('RR0211'),
            secondaryBtnText: t('UU0026'),
            secondaryBtnHandler: () => {
              store.dispatch('helper/closeModalBehavior')
            },
            itemNoList: deletedMaterialList.map((material) => material.itemNo),
          },
        })
      },
    })
  } else {
    if (type === ASSETS_MATERIAL_FUNCTION.PRINT_A4_SWATCH) {
      printA4Swatch(materialList)
    } else if (type === ASSETS_MATERIAL_FUNCTION.PRINT_LABEL) {
      printLabel(materialList)
    } else {
      // exportExcel.func(materialList)
    }
  }
}

const handleCancel = async (item: ProgressOnlineSpreadSheetItem) => {
  await ogBaseProgressApi('cancelExcelProgress', {
    progressId: item.progressId,
  })
  await getList(pagination.value.currentPage)
}
</script>
