<template lang="pug">
div(class="w-101 px-8")
  h6(class="text-h6 font-bold text-primary pb-7.5 text-center") {{$t('GG0005')}}
  input-select(
    v-model:selectValue="selectedOrgId"
    :options="optionOrgList"
    keyOptionDisplay="orgName"
    keyOptionValue="orgId"
    :label="$t('GG0006')"
    class="mb-7.5 z-10"
  )
  input-select(
    v-model:selectValue="selectedSavePlace"
    :options="optionSavePlaceList"
    keyOptionDisplay="name"
    keyOptionValue="key"
    :label="$t('GG0007')"
  )
  btn-group(
    class="h-25"
    :primaryText="$t('UU0018')"
    :secondaryButton="false"
    @click:primary="saveShareReceived"
  )
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ModalSaveReceiveShare.vue',
  setup () {
    const store = useStore()
    const SAVE_PLACE_TYPE = {
      ORG: 1,
      GROUP: 2
    }

    const optionOrgList = computed(() => store.getters['user/organizationList'])
    const selectedOrgId = ref(optionOrgList.value[0].orgId)
    const selectedOrgNo = computed(() => optionOrgList.value.find(org => org.orgId === selectedOrgId.value).orgNo)
    const selectedSavePlace = ref(null)
    const optionSavePlaceList = computed(() => {
      const { orgName, orgId } = store.getters['organization/organization']
      return [
        {
          name: orgName,
          key: `${SAVE_PLACE_TYPE.ORG}-${orgId}`
        },
        ...store.getters['organization/groupList'].map(({ groupId, groupName }) => ({
          name: groupName,
          key: `${SAVE_PLACE_TYPE.GROUP}-${groupId}`
        }))
      ]
    })

    const saveShareReceived = async () => {
      const [savePlaceType, id] = selectedSavePlace.value.split('-')
      store.dispatch('share/saveShareReceived', {
        orgId: selectedOrgId.value,
        groupId: Number(savePlaceType) === SAVE_PLACE_TYPE.GROUP ? id : null
      })
      store.dispatch('helper/closeModal')
    }

    watch(
      () => selectedOrgNo.value,
      async () => {
        await store.dispatch('organization/getOrg', { orgNo: selectedOrgNo.value })
        selectedSavePlace.value = optionSavePlaceList.value[0].key
      },
      {
        immediate: true,
        deep: true
      }
    )

    return {
      selectedOrgId,
      optionOrgList,
      optionSavePlaceList,
      selectedSavePlace,
      saveShareReceived
    }
  }
}
</script>
