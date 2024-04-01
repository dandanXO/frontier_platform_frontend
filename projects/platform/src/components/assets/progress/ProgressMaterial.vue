<template lang="pug">
f-table(
  v-model:pagination="pagination"
  :headers="headers"
  :items="progressList"
  rowHeight="124px"
  :emptyText="$t('RR0105')"
  :isLoading="isLoading"
  tableWidth="1152px"
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
  template(v-slot="{ item, prop, isHover }")
    div(
      v-if="prop === 'imagePreview'"
      class="relative w-25 h-25 py-3 flex justify-center items-center"
    )
      div(
        class="absolute inset-0 w-25 h-25 bg-contain bg-no-repeat bg-center rounded"
        :class="{ 'opacity-20': item.isMaterialDeleted }"
        :style="{ 'background-image': `url(${item.materialImageUrl})` }"
      )
      div(v-if="item.isMaterialDeleted" class="text-body1 text-grey-250 font-bold z-1") {{ $t('RR0063') }}
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
        p(
          v-if="item.unsuccessfulMsgCode === UnsuccessfulMsgCode.IMAGE_FORMAT_ERROR"
        ) {{ $t('WW0091') }}
        p(
          v-else-if="item.unsuccessfulMsgCode === UnsuccessfulMsgCode.ORG_DEACTIVATED"
        ) {{ $t('WW0092') }}
        p(
          v-else-if="item.unsuccessfulMsgCode === UnsuccessfulMsgCode.IMAGE_DPI_ERROR"
        ) {{ $t('WW0141') }}
        p(
          v-else-if="item.unsuccessfulMsgCode === UnsuccessfulMsgCode.ORG_STORAGE_NOT_ENOUGH"
        ) {{ $t('WW0097') }}
          span(class="text-cyan-400 ml-0.5 cursor-pointer" @click="goToBillings()") {{ $t('RR0210') }}
      //- Completed
      div(
        v-else-if="item.status === ProgressStatus.COMPLETE && item.mappingWith"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        i18n-t(keypath="PP0025" tag="p" scope="global")
          template(#fabricSide)
            span(
              v-if="item.mappingWith.sideType === MaterialSideType.FACE_SIDE"
            ) {{ $t('PP0033') }}
            span(
              v-if="item.mappingWith.sideType === MaterialSideType.BACK_SIDE"
            ) {{ $t('PP0032') }}
          template(#materialNo) {{ item.mappingWith.itemNo }}
      //- In Queue
      div(
        v-else-if="item.status === ProgressStatus.IN_QUEUE"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        p {{ $t('PP0012') }}
      //- Processing
      div(
        v-else-if="item.status === ProgressStatus.PROCESSING"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        p {{ $t('PP0013') }}
    div(v-if="prop === 'action'" class="flex justify-end")
      f-button(
        v-if="item.status === ProgressStatus.COMPLETE"
        type="secondary"
        size="sm"
        :disabled="item.isMaterialDeleted"
        @click="handleViewMaterial(item)"
      ) {{ $t('UU0086') }}
      f-popper(
        v-else-if="isCanCancel(item)"
        placement="bottom-end"
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
import { useI18n } from 'vue-i18n'
import TableStatusLabel from '@/components/assets/progress/TableStatusLabel.vue'
import TableStatusProgress from '@/components/assets/progress/TableStatusProgress.vue'
import useNavigation from '@/composables/useNavigation'
import { ref, reactive, watch, onUnmounted } from 'vue'
import { toStandardFormat } from '@frontier/lib'
import { useProgressStore } from '@/stores/progress'
import {
  ProgressStatus,
  type ProgressMaterialUploadItem,
  ProgressMaterialUploadUnsuccessfulMsgCode,
  MaterialSideType,
  GetMaterialUploadProgressList200ResponseAllOfResultPaginationSortEnum,
} from '@frontier/platform-web-sdk'

const props = defineProps<{
  currentStatus: ProgressStatus
}>()

const UnsuccessfulMsgCode = ProgressMaterialUploadUnsuccessfulMsgCode
const UPLOAD_PROGRESS_SORT_BY =
  GetMaterialUploadProgressList200ResponseAllOfResultPaginationSortEnum

const { t } = useI18n()
const { ogBaseProgressApi } = useProgressStore()
const { goToBillings, goToAssetMaterialDetail } = useNavigation()

const headers = [
  {
    prop: 'imagePreview',
    label: t('PP0008'),
    colSpan: 'col-span-2',
  },
  {
    prop: 'createdTime',
    label: t('RR0189'),
    colSpan: 'col-span-2',
    sortBy: [
      UPLOAD_PROGRESS_SORT_BY.NEWEST_FIRST,
      UPLOAD_PROGRESS_SORT_BY.OLDEST_FIRST,
    ],
  },
  {
    prop: 'statusLabel',
    label: t('PP0010'),
    colSpan: 'col-span-2',
    sortBy: [
      UPLOAD_PROGRESS_SORT_BY.IN_QUEUE_FIRST,
      UPLOAD_PROGRESS_SORT_BY.COMPLETE_FIRST,
    ],
  },
  {
    prop: 'procedure',
    label: t('PP0011'),
    colSpan: 'col-span-4',
  },
  {
    prop: 'action',
    label: '',
    colSpan: 'col-span-2',
  },
]

const isLoading = ref(false)
const pagination = ref({
  sort: UPLOAD_PROGRESS_SORT_BY.NEWEST_FIRST as GetMaterialUploadProgressList200ResponseAllOfResultPaginationSortEnum,
  currentPage: 1,
  totalPage: 1,
  perPageCount: 8,
})
const queryParams = reactive({
  startDate: null,
  endDate: null,
})
const progressList = ref<ProgressMaterialUploadItem[]>([])

const clearDate = () => {
  queryParams.startDate = null
  queryParams.endDate = null
  getList()
}

let timerId: ReturnType<typeof setTimeout>

const getList = async (targetPage = 1, showSpinner = true) => {
  clearTimeout(timerId)
  isLoading.value = showSpinner

  const { data } = await ogBaseProgressApi('getMaterialUploadProgressList', {
    ...queryParams,
    status: props.currentStatus,
    pagination: {
      perPageCount: pagination.value.perPageCount,
      sort: pagination.value.sort,
      targetPage,
    },
  })
  pagination.value = data.result.pagination
  progressList.value = data.result.progressList
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

const handleViewMaterial = (item: ProgressMaterialUploadItem) => {
  goToAssetMaterialDetail({}, item.materialId)
}

const handleCancel = async (item: ProgressMaterialUploadItem) => {
  await ogBaseProgressApi('cancelMaterialUploadProgress', {
    progressId: item.progressId,
  })
  await getList(pagination.value.currentPage)
}

const isCanCancel = (item: ProgressMaterialUploadItem) => {
  const { status, unsuccessfulMsgCode } = item
  if (status === ProgressStatus.IN_QUEUE) {
    return true
  } else if (status === ProgressStatus.UNSUCCESSFUL) {
    return (
      unsuccessfulMsgCode === UnsuccessfulMsgCode.ORG_DEACTIVATED ||
      unsuccessfulMsgCode === UnsuccessfulMsgCode.ORG_STORAGE_NOT_ENOUGH
    )
  } else {
    return false
  }
}
</script>
