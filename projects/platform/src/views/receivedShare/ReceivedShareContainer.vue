<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(474px);
}
</style>

<template lang="pug">
fullscreen-header
  template(#left)
    template(v-if="share.sharingFrom === SHARING_FROM.WORKSPACE")
      f-avatar(:imageUrl="logo" type="org" size="lg")
      div(class="flex items-end pl-2")
        p(class="text-body1 font-bold text-grey-900 pr-2.5") {{ share.displayName }}
        p(class="text-caption text-grey-600") {{ $t('RR0148') }} {{ $dayjs.unix(share.shareDate).format('YYYY/MM/DD') }}
    template(v-else-if="share.sharingFrom === SHARING_FROM.PUBLIC_LIBRARY")
      p(class="text-body1 font-bold text-grey-900 pr-2.5") {{ $t('GG0032') }}
      f-avatar(:imageUrl="logo" type="org" size="lg")
      p(class="text-body1 font-bold text-grey-900 pl-2.5") {{ share.displayName }}
  template(#right)
    dropdown-locale(class="mr-4")
    div(class="relative cursor-pointer mr-4" @click="openModalShareMessage")
      f-svg-icon(iconName="chat" size="24" class="text-grey-600")
      div(
        v-if="haveMsgAndFirstRead"
        class="absolute -top-px -right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
      )
    f-button(size="md" :disabled="share.isClosed" @click="saveReceivedShare") {{ $t('UU0018') }}
  template(#content)
    div(v-if="share.isClosed" class="w-full h-full flex items-center justify-center")
      p(class="text-body1 text-grey-900") {{ $t('GG0026') }}
    router-view(v-else)
    a(
      class="fixed z-footer bottom-0 w-full h-13 bg-grey-50 px-36 flex items-center justify-end card-shadow"
      href="https://www.frontier.cool/"
      target="_blank"
    )
      img(src="@/assets/images/frontier_logo.png" class="w-20.5 h-4 mr-2")
      p(class="text-body2 text-grey-900") {{ $t('GG0004') }}
transition
  received-share-sticker-drawer-for-login(
    v-if="isReceivedShareStickerDrawerOpen"
  )
transition
  sticker-drawer(v-if="isStickerDrawerOpen")
</template>

<script setup>
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import { SHARING_FROM } from '@/utils/constants'
import DropdownLocale from '@/components/common/DropdownLocale.vue'
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import ReceivedShareStickerDrawerForLogin from '@/components/sticker/ReceivedShareStickerDrawerForLogin.vue'

const store = useStore()
const { saveReceivedShare } = useReceivedShare()

const share = computed(() => store.getters['receivedShare/share'])
const logo = computed(() => store.getters['receivedShare/logo'])
const isFirstTime = ref(true)
const haveMsgAndFirstRead = computed(
  () => !!share.value.message && isFirstTime.value
)

const openModalShareMessage = () => {
  isFirstTime.value = false
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-share-message',
    properties: {
      message: share.value.message,
    },
  })
}

const isReceivedShareStickerDrawerOpen = computed(
  () => store.getters['sticker/isReceivedShareStickerDrawerOpen']
)
const isStickerDrawerOpen = computed(
  () => store.getters['sticker/isStickerDrawerOpen']
)
const hasSelectedStickerAddFrom = ref(false)

watch(
  () => isStickerDrawerOpen.value,
  () => {
    if (isStickerDrawerOpen.value && !hasSelectedStickerAddFrom.value) {
      // 檢查是否有選擇過組織
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-choose-sticker-add-from',
        properties: {
          actionHandler: async (orgNo) => {
            store.dispatch('helper/openModalLoading')
            await store.dispatch('organization/getOrg', { orgNo })
            await Promise.all([
              store.dispatch('organization/orgUser/getOrgUser'),
              store.dispatch('sticker/openStickerDrawer', {
                materialId: store.getters['sticker/currentMaterialId'],
                drawerOpenFromLocationList:
                  store.getters['sticker/drawerOpenFromLocationList'],
                drawerOpenFromLocationType:
                  store.getters['sticker/drawerOpenFromLocationType'],
              }),
            ])
            hasSelectedStickerAddFrom.value = true
            store.dispatch('helper/closeModalLoading')
          },
        },
      })
    }
  }
)
</script>
