<template lang="pug">
f-table(
  v-model:pagination="pagination"
  :headers="headers"
  :items="tableData"
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
        class="absolute inset-0 w-25 h-25 bg-cover bg-center rounded"
        :class="{ 'opacity-20': item.isMaterialDeleted }"
        :style="{ 'background-image': `url(${item.image})` }"
      )
      div(v-if="item.isMaterialDeleted" class="text-body1 text-grey-250 font-bold z-1") {{ $t('RR0063') }}
    template(v-if="prop === 'createdTime'")
      p(class="text-body2/1.6 text-grey-600") {{ toStandardFormat(item.createDate) }}
    table-status-label(v-if="prop === 'statusLabel'" :status="item.status")
    table-status-progress(v-if="prop === 'procedure'" :status="item.status")
      //- Unsuccessful
      div(
        v-if="item.status === UPLOAD_PROGRESS.UNSUCCESSFUL"
        class="text-red-400 inline-flex"
      )
        f-svg-icon(iconName="warning_amber_round" size="16" class="mr-1.5 mt-0.5")
        p(v-if="item.msgCode === ERROR_MSG.INCORRECT_FORMAT") {{ $t('WW0091') }}
        p(v-else-if="item.msgCode === ERROR_MSG.INACTIVE") {{ $t('WW0092') }}
        p(v-else-if="item.msgCode === ERROR_MSG.INCORRECT_DPI") {{ $t('WW0141') }}
        p(v-else-if="item.msgCode === ERROR_MSG.INSUFFICIENT_STORAGE") {{ $t('WW0097') }}
          span(class="text-cyan-400 ml-0.5 cursor-pointer" @click="goToBillings") {{ $t('RR0210') }}
      //- Completed
      div(
        v-else-if="item.status === UPLOAD_PROGRESS.COMPLETE && item.isMapping"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        i18n-t(keypath="PP0025" tag="p" scope="global")
          template(#fabricSide)
            span(v-if="item.sideType === SIDE_TYPE.FACE") {{ $t('PP0033') }}
            span(v-if="item.sideType === SIDE_TYPE.BACK") {{ $t('PP0032') }}
          template(#materialNo) {{ item.materialNo }}
      //- In Queue
      div(
        v-else-if="item.status === UPLOAD_PROGRESS.IN_QUEUE"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        p {{ $t('PP0012') }}
      //- Processing
      div(
        v-else-if="item.status === UPLOAD_PROGRESS.PROCESSING"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        p {{ $t('PP0013') }}
    div(v-if="prop === 'action'" class="flex justify-end")
      f-button(
        v-if="item.status === UPLOAD_PROGRESS.COMPLETE"
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
            f-list-item(
              @click="handleCancel(item.materialProgressId); collapsePopper()"
            ) {{ $t('UU0002') }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import TableStatusLabel from '@/components/assets/progress/TableStatusLabel.vue'
import TableStatusProgress from '@/components/assets/progress/TableStatusProgress.vue'
import {
  UPLOAD_PROGRESS_SORT_BY,
  UPLOAD_PROGRESS,
  SIDE_TYPE,
} from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, computed, reactive, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { toStandardFormat } from '@frontier/lib'

const props = defineProps({
  currentStatus: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
  },
})

const ERROR_MSG = {
  INCORRECT_FORMAT: 1,
  INACTIVE: 2,
  INCORRECT_DPI: 3,
  INSUFFICIENT_STORAGE: 4,
}

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { goToBillings, goToAssetMaterialDetail } = useNavigation()

const isLoading = ref(false)
const pagination = ref({
  sort: UPLOAD_PROGRESS_SORT_BY.NEWEST_FIRST,
  currentPage: 1,
  totalPage: 1,
  perPageCount: 8,
})
const queryParams = reactive({
  startDate: '',
  endDate: '',
})
const tableData = computed(
  () => store.getters['assets/progress/materialProgressList']
)

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

const clearDate = () => {
  queryParams.startDate = ''
  queryParams.endDate = ''
  getList()
}

let timerId

const getList = async (targetPage = 1, showSpinner = true) => {
  clearTimeout(timerId)
  isLoading.value = showSpinner
  const result = await store.dispatch(
    'assets/progress/getMaterialUploadProgress',
    {
      ...queryParams,
      status: props.currentStatus,
      pagination: {
        perPageCount: pagination.value.perPageCount,
        sort: pagination.value.sort,
        targetPage,
      },
    }
  )
  pagination.value = result.pagination
  isLoading.value = false

  if (props.path === route.params.tab) {
    setTimer()
  }
}

const handleViewMaterial = (material) => {
  goToAssetMaterialDetail({}, material.materialId)
}

const handleCancel = async (materialProgressId) => {
  await store.dispatch('assets/progress/cancelMaterialUploadProgress', {
    materialProgressId,
  })
  await getList(pagination.value.currentPage)
}

const isCanCancel = (material) => {
  const { status, msgCode } = material
  if (status === UPLOAD_PROGRESS.IN_QUEUE) {
    return true
  } else if (status === UPLOAD_PROGRESS.UNSUCCESSFUL) {
    return (
      msgCode === ERROR_MSG.INACTIVE ||
      msgCode === ERROR_MSG.INSUFFICIENT_STORAGE
    )
  } else {
    return false
  }
}

// Polling
const setTimer = () => {
  timerId = setTimeout(async () => {
    await getList(pagination.value.currentPage, false)
  }, 30000)
}

onBeforeRouteLeave(() => clearTimeout(timerId))
onBeforeRouteUpdate(() => clearTimeout(timerId))

watch(
  () => props.currentStatus,
  async () => {
    await getList()
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>
