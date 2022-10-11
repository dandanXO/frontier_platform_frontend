<template lang="pug">
modal-behavior(
  :header="$t('BB0090')"
  :primaryBtnText="$t('UU0021')"
  :primaryBtnDisabled="!availableToNextStep"
  @click:primary="openModalCreateMailGroup"
)
  div(class="w-94")
    input-label-color(
      v-model:labelColor="labelColor"
      v-model:textValue="groupName"
      :label="$t('BB0086')"
      :placeholder="$t('BB0089')"
      :customErrorMsg="isGroupNameExist ? $t('WW0001') : ''"
      required
      class="mb-7.5"
      data-cy="modal-create-group_name"
    )
    f-input-textarea(v-model:textValue="description" :label="$t('BB0087')" :placeholder="$t('BB0088')" class="mb-1" height="160")
  template(#note) 
    p(class="text-caption text-grey-600") {{ $t("BB0114") }}
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import InputLabelColor from '@/components/management/InputLabelColor.vue'

const store = useStore()
const groupName = computed({
  get: () => store.getters['group/createForm'].groupName,
  set: (v) => store.commit('group/SET_createForm_groupName', v)
})
const labelColor = computed({
  get: () => store.getters['group/createForm'].labelColor,
  set: (v) => store.commit('group/SET_createForm_labelColor', v)
})
const description = computed({
  get: () => store.getters['group/createForm'].description,
  set: (v) => store.commit('group/SET_createForm_description', v)
})
const isGroupNameExist = computed(() => store.getters['organization/groupList'].some(group => group.groupName === groupName.value))
const availableToNextStep = computed(() => groupName.value !== '' && !isGroupNameExist.value)

const openModalCreateMailGroup = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-mail-group'
  })
}
</script>
