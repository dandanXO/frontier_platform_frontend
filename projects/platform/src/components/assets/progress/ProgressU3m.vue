<template lang="pug">
f-table(
  v-model:pagination="pagination"
  v-model:keyword="keyword"
  :headers="headers"
  :items="tableData"
  :emptyText="$t('RR0105')"
  :searchPlaceholder="$t('RR0053')"
  :isLoading="isLoading"
  rowHeight="124px"
  tableWidth="1700px"
  @search="getList()"
  @sort="getList()"
  @goTo="getList($event)"
  filterable
  searchable
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
    template(v-if="prop === 'sourceType'")
      p {{ item.sourceType == U3M_PROVIDER.FRONTIER ? $t('EE0174') : $t('EE0175') }}
    template(v-if="prop === 'itemNumber'")
      p {{ item.materialNo }}
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
        p(v-if="item.msgCode === ERROR_MSG.SOURCE_DELETED") {{ $t('PP0034') }}
        i18n-t(v-else keypath="PP0014" tag="p" scope="global")
          template(#RR0123)
            span(
              class="text-cyan-400 ml-0.5 cursor-pointer"
              @click="openModalSendFeedback"
            ) {{ $t('RR0123') }}
      //- In Queue
      div(
        v-else-if="item.status === UPLOAD_PROGRESS.IN_QUEUE"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        p {{ $t('PP0029') }}
      //- Processing
      div(
        v-else-if="item.status === UPLOAD_PROGRESS.PROCESSING"
        class="text-grey-250 inline-flex"
      )
        f-svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        p {{ $t('PP0013') }}
    div(v-if="prop === 'createBy'" class="flex items-center")
      img(:src="item.createAvatar" class="w-6 h-6 rounded-full")
      p(class="text-body2 text-grey-900 ml-2 line-clamp-1") {{ item.createUser }}
    div(v-if="prop === 'action'" class="flex justify-end items-center")
      template(
        v-if="item.isMaterialDeleted && item.status === UPLOAD_PROGRESS.COMPLETE"
      )
        f-button(type="secondary" size="sm" class="mr-2.5" disabled) {{ $t('UU0006') }}
        div(class="group w-7.5 h-7.5 flex items-center justify-center rounded-full")
          f-svg-icon(iconName="more_horiz" size="24" class="text-grey-150")
      template(v-else)
        f-button(
          v-if="item.status === UPLOAD_PROGRESS.COMPLETE"
          type="secondary"
          size="sm"
          class="mr-2.5"
          @click="openModal3dViewer(item.materialId, item.sourceType)"
        ) {{ $t('UU0006') }}
        f-popper(
          v-if="[UPLOAD_PROGRESS.IN_QUEUE, UPLOAD_PROGRESS.COMPLETE].includes(item.status)"
          class="w-7.5"
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
              template(v-if="item.status === UPLOAD_PROGRESS.IN_QUEUE")
                f-list-item(
                  @click="handleCancel(item.u3mProgressId); collapsePopper()"
                ) {{ $t('UU0002') }}
              template(v-else-if="item.status === UPLOAD_PROGRESS.COMPLETE")
                f-list-item(
                  @click="openModalU3mDownload(item.materialId); collapsePopper()"
                ) {{ $t('RR0059') }}
                f-list-item(
                  @click="openModalCreate3DMaterial(item.materialId); collapsePopper()"
                ) {{ $t('PP0019') }}
                f-list-item(
                  @click="handleViewMaterial(item); collapsePopper()"
                ) {{ $t('PP0016') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TableStatusLabel from '@/components/assets/progress/TableStatusLabel.vue'
import TableStatusProgress from '@/components/assets/progress/TableStatusProgress.vue'
import { UPLOAD_PROGRESS } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, computed, reactive, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import type { ProgressU3mItem, Material } from '@frontier/platform-web-sdk'
import { ProgressU3mSort } from '@frontier/platform-web-sdk'
import { toStandardFormat } from '@frontier/utils'
import { U3M_PROVIDER } from '@/utils/constants'

const ERROR_MSG = {
  SOURCE_DELETED: 1,
}

const props = defineProps({
  currentStatus: {
    type: Number,
  },
  path: {
    type: String,
  },
})

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { goToAssetMaterialDetail } = useNavigation()

const isLoading = ref(false)
const keyword = ref('')
const pagination = ref({
  sort: ProgressU3mSort.NEWEST_FIRST,
  currentPage: 1,
  totalPage: 1,
  perPageCount: 8,
})
const queryParams = reactive({
  startDate: '',
  endDate: '',
})
const tableData = computed<ProgressU3mItem[]>(
  () => store.getters['assets/progress/u3mProgressList']
)
const material = computed<Material>(() => store.getters['assets/material'])

const headers = [
  {
    prop: 'imagePreview',
    label: t('PP0008'),
    colSpan: 'col-span-1',
  },
  {
    prop: 'sourceType',
    label: t('RR0087'),
    colSpan: 'col-span-1',
    itemCustomClass: ['line-clamp-1'],
    sortBy: [ProgressU3mSort.FRONTIER_FIRST, ProgressU3mSort.COMPLETE_FIRST],
  },
  {
    prop: 'itemNumber',
    label: t('RR0013'),
    colSpan: 'col-span-1',
    itemCustomClass: ['line-clamp-2'],
  },
  {
    prop: 'statusLabel',
    label: t('PP0010'),
    colSpan: 'col-span-2',
    sortBy: [ProgressU3mSort.IN_QUEUE_FIRST, ProgressU3mSort.COMPLETE_FIRST],
  },
  {
    prop: 'procedure',
    label: t('PP0011'),
    colSpan: 'col-span-3',
  },
  {
    prop: 'createdTime',
    label: t('RR0189'),
    colSpan: 'col-span-1',
    sortBy: [ProgressU3mSort.NEWEST_FIRST, ProgressU3mSort.OLDEST_FIRST],
  },
  {
    prop: 'createBy',
    label: t('RR0188'),
    colSpan: 'col-span-1',
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

type Timeout = ReturnType<typeof setTimeout>
let timerId: Timeout

const getList = async (targetPage = 1, showSpinner = true) => {
  clearTimeout(timerId)
  isLoading.value = showSpinner

  const result = await store.dispatch('assets/progress/getU3mUploadProgress', {
    ...queryParams,
    keyword: keyword.value,
    status: props.currentStatus,
    pagination: {
      perPageCount: pagination.value.perPageCount,
      sort: pagination.value.sort,
      targetPage,
    },
  })
  pagination.value = result.pagination
  isLoading.value = false

  if (props.path === route.params.tab) {
    setTimer()
  }
}

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
  })
}

const openModal3dViewer = async (
  materialId: number,
  sourceType: U3M_PROVIDER
) => {
  await store.dispatch('assets/getMaterial', { materialId })
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-3d-viewer',
    properties: {
      materialId,
      u3m:
        sourceType === U3M_PROVIDER.FRONTIER
          ? material.value.u3m
          : material.value.customU3m,
    },
  })
}

const openModalU3mDownload = async (materialId: number) => {
  await store.dispatch('assets/getMaterial', { materialId })
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-u3m-download',
    properties: { materialList: [material.value] },
  })
}

const openModalCreate3DMaterial = async (materialId: number) => {
  await store.dispatch('assets/getMaterial', { materialId })
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-u3m-preview',
  })
}

const handleViewMaterial = (material: Material) => {
  goToAssetMaterialDetail(material)
}

const handleCancel = async (
  u3mProgressId: ProgressU3mItem['u3mProgressId']
) => {
  await store.dispatch('assets/progress/cancelU3mUploadProgress', {
    u3mProgressId,
  })
  await getList(pagination.value.currentPage)
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
