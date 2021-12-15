<template lang="pug">
div(class="px-8")
  h6(class="text-h6 text-primary font-bold text-center pb-7.5") {{$t('BB0090')}}
  input-label-color(
    v-model:labelColor="labelColor"
    v-model:textValue="groupName"
    :label="$t('BB0086')"
    :placeholder="$t('BB0089')"
    :customErrorMsg="isGroupNameExist ? $t('WW0001') : ''"
    required
    class="relative z-11 mb-7.5"
  )
  input-textarea(v-model:textValue="description" :label="$t('BB0087')" :placeholder="$t('BB0088')" class="mb-1" height="160")
  div(class="flex items-center pb-0.5")
    svg-icon(size="14" iconName="error_outline" class="text-primary")
    p(class="pl-1.5 text-caption text-primary") {{$t('BB0091')}}
  div(class="w-full h-25 flex items-center justify-center")
    btn(size="md" :disabled="!availableToNextStep" @click="openModalCreateMailGroup") {{$t('UU0021')}}
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import InputLabelColor from '@/components/InputLabelColor'
export default {
  name: 'ModalCreateGroup',
  components: {
    InputLabelColor
  },
  setup () {
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
      store.dispatch('helper/openModal', {
        component: 'modal-create-mail-group'
      })
    }
    return {
      groupName,
      labelColor,
      description,
      openModalCreateMailGroup,
      availableToNextStep,
      isGroupNameExist
    }
  }
}
</script>
