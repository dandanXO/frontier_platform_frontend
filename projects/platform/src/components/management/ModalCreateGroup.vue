<template lang="pug">
modal-behavior(
  :header="$t('BB0090')"
  :primaryBtnText="$t('UU0021')"
  :primaryBtnDisabled="!availableToNextStep"
  @click:primary="openModalCreateMailGroup"
)
  div(class="w-94")
    div(class="flex gap-x-2 mb-7.5 items-end")
      f-input-text(
        v-model:textValue="groupName"
        :label="$t('BB0086')"
        :placeholder="$t('BB0089')"
        :hintError="isGroupNameExist ? $t('WW0001') : (!isGroupNameFilled ? $t('WW0002') : '')"
        required
        class="flex-grow"
        data-cy="group-about_name"
      )
      input-label-color(v-model:labelColor="labelColor")
    f-input-text(
      v-model:textValue="address"
      :label="$t('BB0139')"
      :placeholder="$t('BB0140')"
      :hintError="isAddressMoreThan160Characters ? $t('WW0142', {limitNumber: 160}) : ''"
      class="flex-grow mb-7.5"
      data-cy="group-about_address"
    )
    f-input-textarea(
      v-model:textValue="description"
      :label="$t('BB0087')"
      :placeholder="$t('BB0088')"
      class="mb-1"
      minHeight="min-h-40"
    )
  template(#note) 
    p(class="text-caption text-grey-600") {{ $t('BB0114') }}
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import InputLabelColor from '@/components/management/InputLabelColor.vue'

const store = useStore()
const groupName = computed({
  get: () => store.getters['group/createForm'].groupName,
  set: (v) => store.commit('group/SET_createForm_groupName', v),
})
const address = computed({
  get: () => store.getters['group/createForm'].address,
  set: (v) => store.commit('group/SET_createForm_address', v),
})
const labelColor = computed({
  get: () => store.getters['group/createForm'].labelColor,
  set: (v) => store.commit('group/SET_createForm_labelColor', v),
})
const description = computed({
  get: () => store.getters['group/createForm'].description,
  set: (v) => store.commit('group/SET_createForm_description', v),
})
const isGroupNameExist = computed(() =>
  store.getters['organization/groupList'].some(
    (group) => group.groupName === groupName.value
  )
)
const isGroupNameFilled = computed(() =>
  (!!groupName.value && groupName.value.length > 0) || groupName.value === ''
)
const isAddressMoreThan160Characters = computed(() =>
  !!address.value && address.value.length > 160
)
const availableToNextStep = computed(
  () => !!groupName.value && !isGroupNameExist.value && !isAddressMoreThan160Characters.value
)

const openModalCreateMailGroup = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-mail-group',
  })
}
</script>
