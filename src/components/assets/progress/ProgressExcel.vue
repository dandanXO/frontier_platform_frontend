<template lang="pug">
general-table(
  v-model:pagination="pagination"
  v-model:keyword="keyword"
  :headers="headers"
  :items="tableData"
  :emptyText="$t('RR0105')"
  :searchPlaceholder="$t('RR0053')"
  :isLoading="isLoading"
  rowHeight="124px"
  tableWidth="1600px"
  @search="getList()"
  @sort="getList()"
  @goTo="getList($event)"
  filterable
  searchable
)
  template(#filter)
    div(class="pt-4 pb-3 px-5")
      div(class="flex items-center mb-2")
        p(class="text-black-700 text-body2 mr-1.5") {{ $t("OO0117") }}
        btn-functional(@click="clearDate") {{ $t("UU0040") }}
      div(class="mr-4 flex items-center")
        input-text(
          v-model:textValue="queryParams.startDate"
          inputType="date"
          :clearable="false"
          size="sm"
          @change="getList()"
        )
        span(class="text-body1 text-primary mx-2") ~
        input-text(
          v-model:textValue="queryParams.endDate"
          inputType="date"
          :clearable="false"
          size="sm"
          @change="getList()"
        )
    div(class="border-t border-black-200")
    div(class="pt-4 pb-6 px-5")
      div(class="flex items-center mb-2")
        p(class="text-black-700 text-body2 mr-1.5") {{ $t("OO0118") }}
        btn-functional(@click="changeCategory(EXCEL_CATEGORY.ALL)") {{ $t("UU0040") }}
      div(class="flex")
        div(
          v-for="(category, index) in categoryOptions"
          class="text-primary text-body2 cursor-pointer flex"
          :class="{ 'text-brand': queryParams.category === category.value }"
          @click="changeCategory(category.value)"
        ) {{ category.label }}
          div(v-if="index !== categoryOptions.length - 1" class="border-r border-primary-middle h-full mx-4")
  template(v-slot="{ item, prop, isHover }")
    template(v-if="prop === 'type'")
      p(v-if="item.category === EXCEL_CATEGORY.UPLOAD") {{ $t("PP0022") }}
      p(v-else-if="item.category === EXCEL_CATEGORY.EXPORT") {{ $t("RR0060") }}
    template(v-if="prop === 'itemListAndFileName'")
      p(v-if="item.category === EXCEL_CATEGORY.UPLOAD") {{ item.fileName }}
      div(v-else-if="item.category === EXCEL_CATEGORY.EXPORT" class="flex items-center")
        p(class="line-clamp-1") {{ item.fileName }}
        tooltip(placement="top")
          template(#trigger)
            svg-icon(iconName="visibility" size="20" class="text-black-500 ml-3 w-5 flex-shrink-0 cursor-pointer" @click="openModalMaterialNoList(item.materialNoList)")
          template(#content)
            p(class="text-caption text-primary py-1 px-3 leading-1.6") {{ $t("RR0190") }}
    template(v-if="prop === 'createdTime'")
      div(v-for="string in $dayjs.unix(item.createDate).format('YYYY/MM/DD-hh:mm:ss A').split('-')" class="leading-1.6") {{ string }}
    table-status-label(v-if="prop === 'statusLabel'" :status="item.status")
    table-status-progress(v-if="prop === 'procedure'" :status="item.status")
      //- Unsuccessful
      div(v-if="item.status === UPLOAD_PROGRESS.UNSUCCESSFUL" class="text-warn-middle inline-flex")
        svg-icon(iconName="warning_amber_round" size="16" class="mr-1.5 mt-0.5")
        p(v-if="item.msgCode === ERROR_MSG.INACTIVE") {{ $t("WW0092") }}
        p(v-else-if="item.msgCode === ERROR_MSG.INSUFFICIENT_STORAGE") {{ $t("WW0090") }}
          span(class="text-assist-blue ml-0.5 cursor-pointer" @click="goToBillings") {{ $t("RR0169") }}
      //- In Queue
      div(v-else-if="item.status === UPLOAD_PROGRESS.IN_QUEUE" class="text-black-500 inline-flex")
        svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        p {{ $t("PP0028") }}
      //- Processing
      div(v-else-if="item.status === UPLOAD_PROGRESS.PROCESSING" class="text-black-500 inline-flex")
        svg-icon(iconName="info_outline" size="16" class="mr-1.5 mt-0.5")
        i18n-t(v-if="item.category === EXCEL_CATEGORY.UPLOAD" keypath="PP0027" tag="p")
          template(#fileName) {{ item.fileName }}
        p(v-else-if="item.category === EXCEL_CATEGORY.EXPORT") {{ $t("PP0026") }}
    div(v-if="prop === 'createBy'" class="flex items-center")
      img(:src="item.createAvatar" class="w-6 h-6 rounded-full")
      p(class="text-body2 text-primary ml-2 line-clamp-1") {{ item.createUser }}
    div(v-if="prop === 'action'" class="flex justify-end items-center")
      template(v-if="item.status === UPLOAD_PROGRESS.COMPLETE")
        //- Upload Complete
        template(v-if="item.category === EXCEL_CATEGORY.UPLOAD")
          btn(type="secondary" size="sm" class="mr-2.5" @click="goToAssets") {{ $t("UU0088") }}
          popper(placement="bottom-end" class="w-7.5" :class="[isHover ? 'visible' : 'invisible']")
            template(#trigger)
              div(class="group w-7.5 h-7.5 flex items-center justify-center cursor-pointer rounded-full hover:bg-brand/10")
                svg-icon(iconName="more_horiz" size="24" class="text-black-700 group-hover:text-brand")
            template(#content)
              list(v-if="item.status === UPLOAD_PROGRESS.COMPLETE && item.category === EXCEL_CATEGORY.UPLOAD")
                list-item(@click="handleAction(PRINT_TYPE.CARD, item.excelProgressId)") {{ $t("RR0062") }}
                list-item(@click="handleAction(PRINT_TYPE.LABEL, item.excelProgressId)") {{ $t("RR0061") }}
                div(class="border-t border-black-400 my-1")
                list-item(@click="handleAction(_, item.excelProgressId)") {{ $t("RR0060") }}
        //- Export Complete
        btn(
          v-else-if="item.category === EXCEL_CATEGORY.EXPORT"
          type="secondary"
          size="sm"
          class="mr-10"
          @click="downloadDataURLFile(item.fileUrl, item.fileName)"
        ) {{ $t("UU0089") }}
      //- In queue & Unsuccessful
      popper(
        v-else-if="item.status === UPLOAD_PROGRESS.IN_QUEUE" placement="bottom-end"
        class="w-7.5"
        :class="[isHover ? 'visible' : 'invisible']"
      )
        template(#trigger)
          div(class="group w-7.5 h-7.5 flex items-center justify-center cursor-pointer rounded-full hover:bg-brand/10")
            svg-icon(iconName="more_horiz" size="24" class="text-black-700 group-hover:text-brand")
        template(#content)
          list
            list-item(@click="handleCancel(item.excelProgressId)") {{ $t("UU0002") }}
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed, reactive, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { downloadDataURLFile } from '@/utils/fileOperator'
import { UPLOAD_PROGRESS_EXCEL_SORT_BY, UPLOAD_PROGRESS, EXCEL_CATEGORY } from '@/utils/constants'
import TableStatusLabel from '@/components/assets/progress/TableStatusLabel.vue'
import TableStatusProgress from '@/components/assets/progress/TableStatusProgress.vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { printGeneralLabel, printA4Card } from '@/utils/print'

const ERROR_MSG = {
  INACTIVE: 1,
  INSUFFICIENT_STORAGE: 2
}

const PRINT_TYPE = {
  CARD: 1,
  LABEL: 2
}

const props = defineProps({
  currentStatus: {
    type: Number
  },
  path: {
    type: String
  }
})

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { goToAssets } = useNavigation()
const { exportExcel } = useAssets()

const isLoading = ref(false)
const keyword = ref('')
const pagination = ref({
  sort: UPLOAD_PROGRESS_EXCEL_SORT_BY.NEWEST_FIRST,
  currentPage: 1,
  totalPage: 1,
  perPageCount: 8
})
const queryParams = reactive({
  startDate: '',
  endDate: '',
  category: EXCEL_CATEGORY.ALL
})

const tableData = computed(() => store.getters['assets/progress/excelProgressList'])

const headers = [
  {
    prop: 'type',
    label: t('RR0087'),
    colSpan: 'col-span-1',
    sortBy: [UPLOAD_PROGRESS_EXCEL_SORT_BY.UPLOAD_FIRST, UPLOAD_PROGRESS_EXCEL_SORT_BY.EXPORT_FIRST]
  },
  {
    prop: 'itemListAndFileName',
    label: t('PP0020'),
    colSpan: 'col-span-2',
  },
  {
    prop: 'statusLabel',
    label: t('PP0010'),
    colSpan: 'col-span-2',
    sortBy: [UPLOAD_PROGRESS_EXCEL_SORT_BY.IN_QUEUE_FIRST, UPLOAD_PROGRESS_EXCEL_SORT_BY.COMPLETE_FIRST]
  },
  {
    prop: 'procedure',
    label: t('PP0011'),
    colSpan: 'col-span-3'
  },
  {
    prop: 'createdTime',
    label: t('RR0189'),
    colSpan: 'col-span-1',
    sortBy: [UPLOAD_PROGRESS_EXCEL_SORT_BY.NEWEST_FIRST, UPLOAD_PROGRESS_EXCEL_SORT_BY.OLDEST_FIRST]
  },
  {
    prop: 'createBy',
    label: t('RR0188'),
    colSpan: 'col-span-1'
  },
  {
    prop: 'action',
    label: '',
    colSpan: 'col-span-2'
  },
]

const categoryOptions = [
  {
    label: t('RR0060'),
    value: EXCEL_CATEGORY.EXPORT
  }, {
    label: t('PP0022'),
    value: EXCEL_CATEGORY.UPLOAD
  }
]

const clearDate = async () => {
  queryParams.startDate = ''
  queryParams.endDate = ''
  await getList()
}

const changeCategory = async (category) => {
  queryParams.category = category
  await getList()
}

let timerId

const getList = async (targetPage = 1, showSpinner = true) => {
  clearTimeout(timerId)
  isLoading.value = showSpinner

  const result = await store.dispatch('assets/progress/getExcelUploadProgress', {
    ...queryParams,
    keyword: keyword.value,
    status: props.currentStatus,
    pagination: {
      perPageCount: pagination.value.perPageCount,
      sort: pagination.value.sort,
      targetPage
    }
  })
  pagination.value = result.pagination
  isLoading.value = false

  if (props.path === route.params.tab) {
    setTimer()
  }
}

const openModalMaterialNoList = (materialNoList) => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-material-no-list',
    properties: {
      header: t('PP0023'),
      secondaryBtnText: t('UU0026'),
      secondaryBtnHandler: () => {
        store.dispatch('helper/closeModalBehavior')
      },
      materialNoList
    }
  })
}

const handleAction = async (type, excelProgressId) => {
  const { materialList } = await store.dispatch('assets/progress/getExcelUploadMaterialList', { excelProgressId })
  const deletedMaterialList = materialList.filter(material => material.isDelete)
  const nonDeletedMaterialList = materialList.filter(material => !material.isDelete)

  if (deletedMaterialList.length > 0) {
    store.dispatch('helper/pushModalConfirm', {
      type: 1,
      header: t('PP0035'),
      contentText: t('PP0036'),
      primaryBtnText: t('UU0100'),
      secondaryBtnText: t('UU0098'),
      closeAfterSecondaryBtnHandler: false,
      textBtnText: t('UU0002'),
      primaryBtnHandler: async () => {
        if (type === PRINT_TYPE.CARD) {
          printA4Card(nonDeletedMaterialList)
        } else if (type === PRINT_TYPE.LABEL) {
          printGeneralLabel(nonDeletedMaterialList)
        } else {
          exportExcel.func(materialList)
        }
      },
      secondaryBtnHandler: () => {
        store.dispatch('helper/pushModalBehavior', {
          component: 'modal-material-no-list',
          properties: {
            header: t('RR0211'),
            secondaryBtnText: t('UU0026'),
            secondaryBtnHandler: () => {
              store.dispatch('helper/closeModalBehavior')
            },
            materialNoList: deletedMaterialList.map(material => material.materialNo)
          }
        })
      }
    })
  } else {
    if (type === PRINT_TYPE.CARD) {
      printA4Card(materialList)
    } else if (type === PRINT_TYPE.LABEL) {
      printGeneralLabel(materialList)
    } else {
      exportExcel.func(materialList)
    }
  }
}

const handleCancel = async (excelProgressId) => {
  await store.dispatch('assets/progress/cancelExcelUploadProgress', { excelProgressId })
  await getList(pagination.value.currentPage)
}

// Polling
const setTimer = () => {
  timerId = setTimeout(async () => {
    await getList(pagination.value.currentPage, false)
  }, 5000)
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
    deep: true
  }
)
</script>
