<template lang="pug">
modal-behavior(
  :header="$t('MM0001')"
  :primaryBtnText="$t('UU0018')"
  :primaryBtnDisabled="!displayName"
  @click:primary="updateDisplayName"
)
  div(class="w-85 flex flex-col items-center")
    div(class="relative mb-3")
      img(:src="avatar" class="w-30 h-30 rounded-full bg-grey-200")
      div(
        class="group absolute right-0 bottom-0 w-7.5 h-7.5 rounded-full cursor-pointer bg-grey-0 flex justify-center items-center"
        @click="openModalChangeAvatar"
      )
        div(
          class="flex justify-center items-center w-6.5 h-6.5 rounded-full bg-grey-0"
          style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15)"
        )
          f-svg-icon(
            iconName="camera"
            size="20"
            class="text-grey-200 group-hover:text-primary-400"
          )
    p(class="text-body2 text-grey-900 pb-3") {{ orgUser.email }}
    p(class="text-caption text-grey-600 self-end pt-3.5 pb-1") *{{ $t('RR0163') }}
    f-input-text(
      class="w-full pb-4"
      v-model:textValue="displayName"
      :label="$t('MM0002')"
      required
      :rules="[$inputRules.required()]"
    )
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

const { t } = useI18n()
const store = useStore()
const orgUser = computed(() => store.getters['organization/orgUser/orgUser'])
const avatar = computed(() => store.getters['organization/orgUser/avatar'])
const displayName = ref(orgUser.value.displayName)

const updateDisplayName = async () => {
  store.dispatch('helper/openModalLoading')
  await store.dispatch('organization/orgUser/updateDisplayName', {
    displayName: displayName.value,
  })
  store.dispatch('helper/clearModalPipeline')
}

const openModalChangeAvatar = () => {
  const avatar = computed(
    () => store.getters['organization/orgUser/orgUser'].avatar
  )
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-upload-thumbnail',
    properties: {
      header: t('MM0019'),
      thumbnail: avatar.value,
      defaultImage: 'default_user.png', // This file name is static
      updateHandler: async (croppedImage, originalImage) => {
        await store.dispatch('organization/orgUser/updateAvatar', {
          avatar: croppedImage,
          originalAvatar: originalImage,
        })
        await fetchMemberList()
      },
      removeHandler: async () => {
        await store.dispatch('organization/orgUser/removeAvatar')
        await fetchMemberList()
      },
    },
  })
}

const fetchMemberList = async () => {
  const routeLocation = store.getters['helper/routeLocation']

  if (routeLocation === 'org') {
    const orgNo = store.getters['organization/orgNo']
    await store.dispatch('organization/getOrg', { orgNo })
  } else {
    const groupId = store.getters['group/groupId']
    await store.dispatch('group/getGroup', { groupId })
  }
}
</script>
