<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="mb-4 h-11 flex justify-between items-center")
    div(class="text-h6 font-bold text-grey-900 pl-1.5") {{ $t('PP0001') }}
    f-select-dropdown(
      :selectValue="currentMenu"
      :dropdownMenuTree="menuOrgOrGroup"
      @update:selectValue="toggleOrgOrGroup"
      class="w-75"
    )
  f-tabs(
    :tabList="tabList"
    :initValue="$route.params.tab"
    @switch="toggleTab($event.path)"
  )
    template(#default="{ currentTab }")
      div(class="flex items-center gap-x-2 pt-4 pb-3")
        f-label(
          v-for="status in statusList"
          size="lg"
          @click="selectedStatus = status.id"
          :active="selectedStatus === status.id"
        ) {{ status.label }}
      progress-material(
        v-if="currentTab === 'material'"
        :currentStatus="selectedStatus"
        :path="PROGRESS_PATH.MATERIAL"
      )
      progress-u3m(
        v-else-if="currentTab === 'u3m'"
        :currentStatus="selectedStatus"
        :path="PROGRESS_PATH.U3M"
      )
      progress-excel(
        v-else-if="currentTab === 'excel'"
        :currentStatus="selectedStatus"
        :path="PROGRESS_PATH.EXCEL"
      )
</template>

<script setup>
import { ref, computed, reactive, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { UPLOAD_PROGRESS } from '@/utils/constants'

const ProgressMaterial = defineAsyncComponent(() =>
  import('@/components/assets/progress/ProgressMaterial.vue')
)
const ProgressU3m = defineAsyncComponent(() =>
  import('@/components/assets/progress/ProgressU3m.vue')
)
const ProgressExcel = defineAsyncComponent(() =>
  import('@/components/assets/progress/ProgressExcel.vue')
)

const PROGRESS_PATH = {
  MATERIAL: 'material',
  U3M: 'u3m',
  EXCEL: 'excel',
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()

const routeLocation = computed(() =>
  route.name === 'OrgProgress' ? 'org' : 'group'
)
const organization = computed(() => store.getters['organization/organization'])

const menuOrgOrGroup = computed(() => {
  const { orgNo, orgName } = organization.value
  return {
    width: 'w-75',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            selectValue: `/${orgNo}/progress`,
          },
          ...store.getters['organization/groupList'].map((group) => {
            const { groupId, groupName } = group
            return {
              title: groupName,
              selectValue: `/${orgNo}/${groupId}/progress`,
            }
          }),
        ],
      },
    ],
  }
})
const currentMenu = computed(() => {
  const { orgNo } = organization.value
  return routeLocation.value === 'org'
    ? `/${orgNo}/progress`
    : `/${orgNo}/${route.params.groupId}/progress`
})

const tabList = reactive([
  {
    name: t('PP0002'),
    path: PROGRESS_PATH.MATERIAL,
  },
  {
    name: t('RR0199'),
    path: PROGRESS_PATH.U3M,
  },
  {
    name: t('PP0003'),
    path: PROGRESS_PATH.EXCEL,
  },
])

const statusList = reactive([
  {
    label: t('RR0052'),
    id: UPLOAD_PROGRESS.ALL,
  },
  {
    label: t('PP0004'),
    id: UPLOAD_PROGRESS.IN_QUEUE,
  },
  {
    label: t('PP0005'),
    id: UPLOAD_PROGRESS.PROCESSING,
  },
  {
    label: t('PP0006'),
    id: UPLOAD_PROGRESS.COMPLETE,
  },
  {
    label: t('UU0099'),
    id: UPLOAD_PROGRESS.CANCELED,
  },
  {
    label: t('PP0007'),
    id: UPLOAD_PROGRESS.UNSUCCESSFUL,
  },
])
const selectedStatus = ref(statusList[0].id)

const toggleOrgOrGroup = (path) => {
  router.push(path + '/material')
  selectedStatus.value = statusList[0].id
}

const toggleTab = (tab) => {
  router.push({ name: route.name, params: { tab } })
  selectedStatus.value = statusList[0].id
}
</script>
