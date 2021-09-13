<template lang="pug">
div(class="l:pl-71.5 pl-91.5 2xl:146.5")
  div(class="w-85 grid grid-flow-row")
    p(class="justify-self-end pt-4.5 pb-5 text-caption text-black-600") *{{$t('b.required')}}
    input-label-color(
      v-model:labelColor="groupFormData.labelColor"
      v-model:textValue="groupFormData.groupName"
      :label="$t('b.groupName')"
      :placeholder="$t('b.yourGroupName')"
      :customErrorMsg="isGroupNameExist ? $t('err.nameAlreadyExists') : ''"
      required
      class="w-85 relative z-11 mb-7.5"
    )
    input-textarea(v-model:textValue="groupFormData.description" :label="$t('b.groupDescription')" :placeholder="$t('b.groupDescribeToUnderstand')" class="w-85 mb-7.5" height="160")
    btn(size="md" class="justify-self-center" :disabled="!avaliableToCreateGroup" @click="updateGroup") {{$t('reuse.save')}}
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

    return {
      groupFormData,
      isGroupNameExist,
      avaliableToCreateGroup,
      updateGroup
    }
  }
}
</script>
