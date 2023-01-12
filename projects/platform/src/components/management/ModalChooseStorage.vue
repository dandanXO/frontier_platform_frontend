<template lang="pug">
modal-behavior(
  :header="$t('BB0102')"
  :primaryBtnText="$t('UU0013')"
  :textBtnText="$t('UU0002')"
  @click:primary="deleteGroup"
  @click:text="closeModal"
)
  div(class="w-94")
    p(class="text-caption text-grey-600 leading-1.6 pb-4") {{ $t('BB0103') }}
    p(class="text-body2 text-grey-900 font-bold pb-1.5") {{ $t('BB0104') }}
    f-input-select(
      v-model:selectValue="currentStorage"
      :dropdownMenuTree="storageMenuTree"
      data-cy="modal-choose-storage_select"
    )
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const store = useStore()
const STORAGE_LOCATION = {
  ORG: 0,
  GROUP: 1,
  NO_STORE: 2,
}
const deletedGroup = computed(() => store.getters['group/group'])
const organization = computed(() => store.getters['organization/organization'])
const groupList = computed(() =>
  store.getters['organization/groupList'].filter(
    (group) => group.groupId !== deletedGroup.value.groupId
  )
)
const { orgId, orgName, orgNo } = organization.value
const currentStorage = ref(null)
const storageMenuTree = computed(() => {
  return {
    width: 'w-94',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            selectValue: `${STORAGE_LOCATION.ORG}-${orgId}`,
          },
          ...groupList.value.map((group) => {
            const { groupId, groupName } = group
            return {
              title: groupName,
              selectValue: `${STORAGE_LOCATION.GROUP}-${groupId}`,
            }
          }),
          {
            title: t('BB0105'),
            selectValue: `${STORAGE_LOCATION.NO_STORE}-${null}`,
          },
        ],
      },
    ],
  }
})

const deleteGroup = async () => {
  const [storageLocation, id] = currentStorage.value.split('-')
  const transferOrgId =
    storageLocation === STORAGE_LOCATION.ORG ? Number(id) : null
  const transferGroupId =
    storageLocation === STORAGE_LOCATION.GROUP ? Number(id) : null
  store.dispatch('helper/openModalLoading')
  await store.dispatch('group/deleteGroup', {
    transferOrgId,
    transferGroupId,
  })
  store.dispatch('helper/closeModalLoading')
  router.push({ name: 'PublicLibrary', params: { orgNo } })
}

const closeModal = () => store.dispatch('helper/clearModalPipeline')
</script>
