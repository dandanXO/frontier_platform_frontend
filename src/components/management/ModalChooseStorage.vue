<template lang="pug">
modal-behavior(
  :header="$t('BB0102')"
  :primaryBtnText="$t('UU0013')"
  :textBtnText="$t('UU0002')"
  @click:primary="deleteGroup"
  @click:text="closeModal"
)
  div(class="w-94")
    p(class="text-caption text-black-800 leading-1.6 pb-4") {{ $t("BB0103") }}
    p(class="text-body2 text-primary font-bold pb-1.5") {{ $t("BB0104") }}
    input-select(v-model:selectValue="currentStorage" :options="storageOrgOrGroup" keyOptionDisplay="name" keyOptionValue="index")
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
  NO_STORE: 2
}
const deletedGroup = computed(() => store.getters['group/group'])
const organization = computed(() => store.getters['organization/organization'])
const groupList = computed(() => store.getters['organization/groupList'].filter(group => group.groupId !== deletedGroup.value.groupId))
const { orgId, orgName, orgNo } = organization.value
const currentStorage = ref(0)
const storageOrgOrGroup = computed(() => {
  let index = 0
  return [
    {
      index,
      name: orgName,
      id: orgId,
      storageLocation: STORAGE_LOCATION.ORG
    },
    ...groupList.value.map(group => {
      const { groupId, groupName } = group
      index++
      return {
        index,
        name: groupName,
        id: groupId,
        storageLocation: STORAGE_LOCATION.GROUP
      }
    }),
    {
      index: ++index,
      name: t('BB0105'),
      id: null,
      storageLocation: STORAGE_LOCATION.NO_STORE
    }
  ]
})

const deleteGroup = async () => {
  const { id, storageLocation } = storageOrgOrGroup.value[currentStorage.value]
  const transferOrgId = storageLocation === STORAGE_LOCATION.ORG ? Number(id) : null
  const transferGroupId = storageLocation === STORAGE_LOCATION.GROUP ? Number(id) : null
  await store.dispatch('group/deleteGroup', {
    transferOrgId,
    transferGroupId
  })
  store.dispatch('helper/clearModalPipeline')
  router.push({ name: 'PublicLibrary', params: { orgNo } })
}

const closeModal = () => store.dispatch('helper/clearModalPipeline')
</script>
