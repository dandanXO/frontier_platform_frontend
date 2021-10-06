<template lang="pug">
div(class="w-100")
  div(class="px-8")
    h6(class="text-h6 text-primary font-bold pb-4 text-center") {{$t('b.chooseLocation')}}
    p(class="text-body2 text-primary line-height-1.6 text-center pb-4") {{$t('b.materialsMoveToLocation')}}
    div(class="w-full px-4")
      p(class="text-body2 text-primary font-bold pb-1.5") {{$t('b.storageLocation')}}
      input-select(v-model:selectValue="currentStorage" :options="storageOrgOrGroup" keyOptionDisplay="name" keyOptionValue="index")
    div(class="h-25 flex justify-center items-center")
      btn(size="md" @click="deleteGroup") {{$t('reuse.confirm')}}
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalChooseStorage',
  setup () {
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
          name: t('b.permanentlyDelete'),
          id: null,
          storageLocation: STORAGE_LOCATION.NO_STORE
        }
      ]
    })

    const deleteGroup = async () => {
      const { id, storageLocation } = storageOrgOrGroup.value[currentStorage]
      const transferOrgId = storageLocation === STORAGE_LOCATION.ORG ? Number(id) : null
      const transferGroupId = storageLocation === STORAGE_LOCATION.GROUP ? Number(id) : null
      await store.dispatch('group/deleteGroup', {
        transferOrgId,
        transferGroupId
      })
      store.dispatch('helper/clearModalPipeline')
      router.push({ name: 'PublicLibrary', params: { orgNo } })
    }

    return {
      organization,
      storageOrgOrGroup,
      currentStorage,
      deleteGroup
    }
  }
}
</script>
