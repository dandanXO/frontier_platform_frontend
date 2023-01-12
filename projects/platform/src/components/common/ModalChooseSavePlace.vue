<template lang="pug">
modal-behavior(
  :header="title"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="isFetch"
  @click:primary="innerActionHandler"
  @click:secondary="closeModalBehavior"
)
  div(class="w-94")
    f-input-select(
      v-model:selectValue="selectedOrgId"
      :dropdownMenuTree="orgMenuTree"
      :label="$t('RR0212')"
      class="mb-7.5"
    )
    f-input-select(
      v-model:selectValue="selectedSavePlace"
      :dropdownMenuTree="savePlaceMenuTree"
      :label="$t('RR0174')"
    )
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  actionHandler: {
    type: Function,
    required: true,
  },
})
const store = useStore()
const SAVE_PLACE_TYPE = {
  ORG: 1,
  GROUP: 2,
}

const orgList = computed(() => store.getters['user/organizationList'])
const orgMenuTree = computed(() => ({
  width: 'w-94',
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
const selectedOrgNo = computed(
  () => orgList.value.find((org) => org.orgId === selectedOrgId.value)?.orgNo
)
const selectedSavePlace = ref(null)
const savePlaceMenuTree = computed(() => {
  const { orgName, orgId } = store.getters['organization/organization']
  return {
    width: 'w-94',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            selectValue: `${SAVE_PLACE_TYPE.ORG}-${orgId}`,
          },
          ...store.getters['organization/groupList'].map(
            ({ groupId, groupName }) => ({
              title: groupName,
              selectValue: `${SAVE_PLACE_TYPE.GROUP}-${groupId}`,
            })
          ),
        ],
      },
    ],
  }
})

const innerActionHandler = async () => {
  const [savePlaceType, id] = selectedSavePlace.value.split('-')
  const orgId = selectedOrgId.value
  const groupId =
    Number(savePlaceType) === SAVE_PLACE_TYPE.GROUP ? Number(id) : null
  await props.actionHandler({ orgId, groupId })
}

const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}

const isFetch = ref(false)
watch(
  () => selectedOrgNo.value,
  async () => {
    isFetch.value = true
    !!selectedOrgNo.value &&
      (await store.dispatch('organization/getOrg', {
        orgNo: selectedOrgNo.value,
      }))

    selectedSavePlace.value =
      savePlaceMenuTree.value?.blockList[0].menuList[0].selectValue || null

    isFetch.value = false
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>
