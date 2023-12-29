<template lang="pug">
div(
  class="mx-auto w-full rwd-outer-external-container flex justify-between items-center h-16"
)
  template(v-if="material")
    div(ref="refLeft" class="flex items-center gap-x-3")
      f-avatar(:imageUrl="material.metaData.unitLogo" type="org" size="lg")
      p(class="hidden tablet:block text-body1 font-bold text-grey-900 pl-2.5") {{ material.metaData.unitName }}
    div(ref="refRight" class="flex items-center gap-x-6")
      dropdown-locale
      f-button(size="md" type="text" @click="viewInternalDetail") View Internal Detail
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import DropdownLocale from '@/components/common/DropdownLocale.vue'
import { useOuterStore } from '@/stores/outer'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useNotifyStore } from '@/stores/notify'
import { NOTIFY_TYPE } from '@frontier/constants'

const store = useStore()
const outerStore = useOuterStore()
const { material } = storeToRefs(outerStore)
const userStore = useUserStore()
const notify = useNotifyStore()

const viewInternalDetail = () => {
  if (userStore.hasLogin) {
    notify.showNotifySnackbar({
      notifyType: NOTIFY_TYPE.WARNING,
      messageText: 'only material owner can see the internal detail info',
    })
  } else {
    store.dispatch('user/getUser')
  }
}
</script>
