<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="mb-4 h-11 flex justify-between items-center")
    div(class="text-h6 font-bold text-grey-900 pl-1.5") {{ $t('PP0001') }}
    dropdown-og-menu(@select="goToProgress({ ogKey: $event })")
  f-tabs(
    :tabList="tabList"
    :initValue="tab"
    @switch="goToProgress({}, $event.path)"
  )
    template(#default="{ currentTab }")
      div(class="flex items-center gap-x-2 pt-4 pb-3")
        f-label(
          v-for="status in statusList"
          :key="status.id"
          size="lg"
          @click="selectedStatus = status.id"
          :active="selectedStatus === status.id"
        ) {{ status.label }}
      progress-material(
        v-if="currentTab === PROGRESS_TAB.MATERIAL"
        :currentStatus="selectedStatus"
      )
      progress-u3m(
        v-else-if="currentTab === PROGRESS_TAB.U3M"
        :currentStatus="selectedStatus"
      )
      progress-excel(
        v-else-if="currentTab === PROGRESS_TAB.EXCEL"
        :currentStatus="selectedStatus"
      )
      progress-spreadsheet(
        v-else-if="currentTab === PROGRESS_TAB.SPREADSHEET"
        :currentStatus="selectedStatus"
      )
</template>

<script setup lang="ts">
import { ref, reactive, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import DropdownOgMenu from '@/components/common/DropdownOgMenu.vue'
import { ProgressStatus } from '@frontier/platform-web-sdk'
import { PROGRESS_TAB } from '@/utils/constants'

const ProgressMaterial = defineAsyncComponent(
  () => import('@/components/assets/progress/ProgressMaterial.vue')
)
const ProgressU3m = defineAsyncComponent(
  () => import('@/components/assets/progress/ProgressU3m.vue')
)
const ProgressExcel = defineAsyncComponent(
  () => import('@/components/assets/progress/ProgressExcel.vue')
)
const ProgressSpreadsheet = defineAsyncComponent(
  () => import('@/components/assets/progress/ProgressSpreadsheet.vue')
)

defineProps<{
  tab: string
}>()

const { t } = useI18n()
const { goToProgress } = useNavigation()

const tabList = reactive([
  {
    name: t('PP0002'),
    path: PROGRESS_TAB.MATERIAL,
  },
  {
    name: t('RR0199'),
    path: PROGRESS_TAB.U3M,
  },
  {
    name: t('PP0003'),
    path: PROGRESS_TAB.EXCEL,
  },
  {
    name: t('MI0143'),
    path: PROGRESS_TAB.SPREADSHEET,
  },
])

const statusList = reactive([
  {
    label: t('RR0052'),
    id: ProgressStatus.ALL,
  },
  {
    label: t('PP0004'),
    id: ProgressStatus.IN_QUEUE,
  },
  {
    label: t('PP0005'),
    id: ProgressStatus.PROCESSING,
  },
  {
    label: t('PP0006'),
    id: ProgressStatus.COMPLETE,
  },
  {
    label: t('UU0099'),
    id: ProgressStatus.CANCELED,
  },
  {
    label: t('PP0007'),
    id: ProgressStatus.UNSUCCESSFUL,
  },
])
const selectedStatus = ref(statusList[0].id)
</script>
