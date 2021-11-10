<template lang="pug">
div
  div(class="w-85 mx-auto relative")
    p(class="text-caption text-black-500 cursor-pointer absolute top-13 left-25 z-12" @click="openModalDelete") {{$t('UU0013')}}
    p(class="text-right pt-4.5 pb-5 text-caption text-black-600") *{{$t('BB0073')}}
    input-label-color(
      v-model:labelColor="groupFormData.labelColor"
      v-model:textValue="groupFormData.groupName"
      :label="$t('BB0086')"
      :placeholder="$t('BB0089')"
      :customErrorMsg="isGroupNameExist ? $t('WW0001') : ''"
      required
      class="w-85 relative z-11 mb-7.5"
    )
    input-textarea(v-model:textValue="groupFormData.description" :label="$t('BB0087')" :placeholder="$t('BB0088')" class="w-85 mb-7.5" height="160")
    btn(size="md" class="mx-auto" :disabled="!avaliableToCreateGroup" @click="updateGroup") {{$t('UU0018')}}
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, toRaw } from 'vue'
import InputLabelColor from '@/components/InputLabelColor'
export default {
  name: 'GroupAbout',
  components: {
    InputLabelColor
  },
  setup () {
    const store = useStore()
    const group = computed(() => store.getters['group/group'])
    const { groupName, labelColor, description, groupId } = group.value
    const groupFormData = reactive({ groupName, labelColor, description })
    const isGroupNameExist = computed(() => store.getters['organization/groupList'].some(group => (group.groupId !== groupId) && (group.groupName === groupFormData.groupName)))
    const avaliableToCreateGroup = computed(() => groupFormData.groupName !== '' && !isGroupNameExist.value)

    const updateGroup = async () => {
      await store.dispatch('group/updateGroup', toRaw(groupFormData))
    }

    const openModalDelete = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-delete-org-or-group'
      })
    }

    return {
      groupFormData,
      isGroupNameExist,
      avaliableToCreateGroup,
      updateGroup,
      openModalDelete
    }
  }
}
</script>
