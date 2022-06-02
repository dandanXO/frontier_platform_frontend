<template lang="pug">
modal-behavior(
  :header="$t('MM0001')"
  :primaryBtnText="$t('UU0018')"
  :primaryBtnDisabled="!displayName"
  @click:primary="updateDisplayName"
)
  div(class="w-85 flex flex-col items-center")
    div(class="relative mb-3")
      img(:src="avatar" class="w-30 h-30 rounded-full bg-black-500")
      div(class="group absolute right-0 bottom-0 w-7.5 h-7.5 rounded-full cursor-pointer bg-black-0 flex justify-center items-center" @click="openModalChangeAvatar")
        div(class="flex justify-center items-center w-6.5 h-6.5 rounded-full bg-black-0" style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);")
          svg-icon(iconName="camera" size="20" class="text-black-500 group-hover:text-brand")
    p(class="text-body2 text-primary pb-3") {{ orgUser.email }}
    p(class="text-caption text-black-600 self-end pt-3.5 pb-1") *{{ $t("RR0163") }}
    input-text(
      class="w-full pb-4"
      v-model:textValue="displayName"
      :label="$t('MM0002')"
      required
    )
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

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
    header: t('MM0019')
  })
}
</script>
