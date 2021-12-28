<template lang="pug">
div(class="w-101 px-8")
  div(class="flex flex-col items-center")
    h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{$t('MM0001')}}
    div(class="relative pb-3")
      img(:src="avatar" class="w-30 h-30 rounded-full bg-black-500")
      div(
        class="absolute flex justify-center items-center right-0 bottom-0 w-8 h-8 rounded-full bg-black-0 border-4 border-black-200 cursor-pointer"
        @click="openModalChangeAvatar"
      )
        svg-icon(iconName="camera" size="20" class="text-black-500 hover:text-brand")
    p(class="text-body2 text-primary pb-3") {{orgUser.email}}
    //- button(class="flex items-center border rounded-full border-assist-blue text-assist-blue py-1 px-5")
    //-   p(class="text-caption") {{$t('MM.Advanced settings')}}
    //-   svg-icon(iconName="keyboard_arrow_right" size="14")
    p(class="text-caption text-black-600 self-end pt-3.5 pb-1") *{{$t('MM0003')}}
    input-text(
      class="w-full pb-4"
      v-model:textValue="displayName"
      :label="$t('MM0002')"
      required
    )
  btn-group(
    class="h-25"
    :primaryText="$t('UU0018')"
    @click:primary="updateDisplayName"
    :primaryButtonDisabled="!displayName"
    :secondaryButton="false"
  )
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

export default {
  name: 'ModalOrgUserProfile',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const orgUser = computed(() => store.getters['user/orgUser/orgUser'])
    const avatar = computed(() => store.getters['user/orgUser/avatar'])
    const displayName = ref(orgUser.value.displayName)

    const updateDisplayName = async () => {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('user/orgUser/updateDisplayName', { displayName: displayName.value })
      store.dispatch('helper/clearModalPipeline')
    }

    const openModalChangeAvatar = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-change-avatar',
        header: t('MM0019'),
        properties: {
          // pure logo no preprocessing
          image: orgUser.value.avatar,
          removeHandler: async () => {
            store.dispatch('helper/pushModalLoading')
            await store.dispatch('user/orgUser/removeAvatar')
            await fetchMemberList()
            store.dispatch('helper/closeModalLoading')
          },
          afterUploadHandler: (imageObj, cropRectSize) => {
            store.dispatch('helper/replaceModal', {
              component: 'modal-crop-image',
              header: t('BB0032'),
              properties: {
                image: imageObj,
                cropRectSize,
                afterCropHandler: async (cropImage, originalImage) => {
                  await store.dispatch('user/orgUser/updateAvatar', {
                    avatar: cropImage,
                    originalAvatar: originalImage
                  })
                  await fetchMemberList()
                }
              }
            })
          }
        }
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

    return {
      displayName,
      orgUser,
      avatar,
      updateDisplayName,
      openModalChangeAvatar
    }
  }
}
</script>
