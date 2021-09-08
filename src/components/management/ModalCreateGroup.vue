<template lang="pug">
div(class="px-8")
  h6(class="text-h6 text-primary font-bold text-center pb-7.5") {{$t('b.createGroup')}}
  input-label-color(
    v-model:labelColor="groupFormData.labelColor"
    v-model:textValue="groupFormData.groupName"
    :label="$t('b.groupName')"
    :placeholder="$t('b.yourGroupName')"
    :hasSlotContent="isGroupNameExist"
    required
    class="w-85 relative z-11 mb-7.5"
  )
    template(#errorMsg v-if="isGroupNameExist")
      p(class="absolute text-warn text-caption pt-1") {{$t('err.nameAlreadyExists')}}
  input-textarea(v-model:textValue="groupFormData.description" :label="$t('b.groupDescription')" :placeholder="$t('b.groupDescribeToUnderstand')" class="w-85 mb-1" height="160")
  div(class="flex items-center pb-0.5")
    svg-icon(size="14" iconName="error_outline" class="text-primary")
    p(class="pl-1.5 text-caption text-primary") {{$t('b.afterGroupCreate')}}
  div(class="w-full h-25 flex items-center justify-center")
    btn(size="md" :disabled="!avaliableToCreateGroup" @click="createGroup") {{$t('reuse.confirm')}}
</template>

<script>
import { reactive, toRaw, computed } from 'vue'
import { useStore } from 'vuex'
import InputLabelColor from '@/components/InputLabelColor'
export default {
  name: 'ModalCreateGroup',
  components: {
    InputLabelColor
  },
  setup () {
    const store = useStore()
    const isGroupNameExist = computed(() => store.getters['organization/groupList'].some(group => group.groupName === groupFormData.groupName))
    const groupFormData = reactive({
      groupName: '',
      labelColor: '#D3242A',
      description: ''
    })
    const avaliableToCreateGroup = computed(() => groupFormData.groupName !== '' && !isGroupNameExist.value)
    const createGroup = async () => {
      await store.dispatch('group/createGroup', toRaw(groupFormData))
      store.dispatch('helper/closeModal')
      /**
       * @todo: create group upload email
       */
    }
    return {
      createGroup,
      groupFormData,
      avaliableToCreateGroup,
      isGroupNameExist
    }
  }
}
</script>
