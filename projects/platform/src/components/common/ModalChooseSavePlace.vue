<template lang="pug">
modal-behavior(
  :header="title"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="isFetch"
  @click:primary="innerActionHandler"
  @click:secondary="closeModalBehavior"
)
  div(class="w-[min(376px,calc(100vw_-_80px_-_40px))]")
    f-select-dropdown(
      v-model:selectValue="selectedOrgId"
      :dropdownMenuTree="orgMenuTree"
      :label="$t('RR0212')"
      class="mb-7.5"
    )
    f-select-dropdown(
      v-model:selectValue="selectedOgKey"
      :dropdownMenuTree="savePlaceMenuTree"
      :label="$t('RR0174')"
    )
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import organizationApi from '@/apis/organization'
import { OgType, type Organization } from '@frontier/platform-web-sdk'

export interface PropsModalChooseSavePlace {
  title: string
  actionHandler: (
    targetOrgId: number,
    targetOgType: OgType,
    targetOgId: number
  ) => Promise<void>
}

const props = defineProps<PropsModalChooseSavePlace>()
const store = useStore()

const orgList = computed(
  () => store.getters['user/organizationList'] as Organization[]
)
const orgMenuTree = computed(() => ({
  width: 'w-[min(376px,calc(100vw_-_80px_-_40px))]',
  blockList: [
    {
      menuList: orgList.value.map(({ orgName, orgId }) => ({
        title: orgName,
        selectValue: orgId,
      })),
    },
  ],
}))
const selectedOrgId = ref(orgList.value[0]?.orgId || null)
const selectedOrg = ref<Organization | null>(null)
const selectedOgKey = ref<string | null>(null)
const savePlaceMenuTree = computed(() => {
  if (!selectedOrg.value) {
    return { width: 'w-[min(376px,calc(100vw_-_80px_-_40px))]', blockList: [] }
  }

  const { orgName, orgId } = selectedOrg.value
  return {
    width: 'w-[min(376px,calc(100vw_-_80px_-_40px))]',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            selectValue: `${OgType.ORG}-${orgId}`,
          },
          ...selectedOrg.value.groupList.map(({ groupId, groupName }) => ({
            title: groupName,
            selectValue: `${OgType.GROUP}-${groupId}`,
          })),
        ],
      },
    ],
  }
})

const innerActionHandler = async () => {
  const [targetOgType, targetOrgId] = selectedOgKey.value!.split('-')
  await props.actionHandler(
    selectedOrgId.value!,
    targetOgType as unknown as OgType,
    Number(targetOrgId)
  )
}

const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}

const isFetch = ref(false)
const fetchData = async () => {
  isFetch.value = true
  const { data } = await organizationApi.getOrg(selectedOrgId.value)
  selectedOrg.value = data.result.organization
  selectedOgKey.value =
    savePlaceMenuTree.value?.blockList[0].menuList[0].selectValue || null
  isFetch.value = false
}
watch(() => selectedOrgId.value, fetchData)

await fetchData()
</script>
