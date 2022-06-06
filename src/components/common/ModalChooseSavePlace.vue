<template lang="pug">
modal-behavior(
  :header="title"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="innerActionHandler"
  @click:secondary="closeModalBehavior"
)
  div(class="w-94")
    input-select(
      v-model:selectValue="selectedOrgId"
      :options="optionOrgList"
      keyOptionDisplay="orgName"
      keyOptionValue="orgId"
      :label="$t('RR0212')"
      class="mb-7.5 z-10"
    )
    input-select(
      v-model:selectValue="selectedSavePlace"
      :options="optionSavePlaceList"
      keyOptionDisplay="name"
      keyOptionValue="key"
      :label="$t('RR0174')"
    )
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  actionHandler: {
    type: Function,
    required: true
  }
})
const store = useStore()
const SAVE_PLACE_TYPE = {
  ORG: 1,
  GROUP: 2
}

const optionOrgList = computed(() => store.getters['user/organizationList'])
const selectedOrgId = ref(optionOrgList.value[0]?.orgId || null)
const selectedOrgNo = computed(() => optionOrgList.value.find(org => org.orgId === selectedOrgId.value)?.orgNo)
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

const innerActionHandler = async () => {
  const [savePlaceType, id] = selectedSavePlace.value.split('-')
  const orgId = selectedOrgId.value
  const groupId = Number(savePlaceType) === SAVE_PLACE_TYPE.GROUP ? Number(id) : null
  await props.actionHandler({ orgId, groupId })
}

const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}

watch(
  () => selectedOrgNo.value,
  async () => {
    !!selectedOrgNo.value && await store.dispatch('organization/getOrg', { orgNo: selectedOrgNo.value })
    selectedSavePlace.value = optionSavePlaceList.value[0]?.key || null
  },
  {
    immediate: true,
    deep: true
  }
)
</script>
