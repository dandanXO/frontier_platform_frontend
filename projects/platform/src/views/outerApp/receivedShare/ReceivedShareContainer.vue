<style lang="scss" scoped>
.sticker-drawer-enter-active,
.sticker-drawer-leave-active {
  transition: all 0.5s ease;
}

.sticker-drawer-enter-from,
.sticker-drawer-leave-to {
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
        p(class="text-caption xl:text-body1 font-bold text-grey-900 pr-2.5") {{ share.displayName }}
        p(class="text-caption text-grey-600") {{ $t('RR0148') }} {{ toYYYYMMDDFormat(share.shareDate) }}
    template(v-else-if="share.sharingFrom === SHARING_FROM.PUBLIC_LIBRARY")
      p(class="text-caption2 xl:text-body1 font-bold text-grey-900 pr-2.5") {{ $t('GG0032') }}
      f-avatar(:imageUrl="logo" type="org" size="lg")
      p(class="text-caption2 xl:text-body1 font-bold text-grey-900 pl-2.5") {{ share.displayName }}
  template(#right)
    dropdown-locale
    div(class="relative cursor-pointer mx-2 xl:mx-4" @click="openModalShareMessage")
      f-svg-icon(iconName="chat" size="24" class="text-grey-600")
      div(
        v-if="haveMsgAndFirstRead"
        class="absolute -top-px -right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
      )
    f-button(size="md" :disabled="share.isClosed" @click="saveReceivedShare") {{ $t('UU0018') }}
  template(#content)
    div(v-if="share.isClosed" class="w-full h-full flex items-center justify-center")
      p(class="text-body1 text-grey-900") {{ $t('GG0026') }}
    router-view(v-else-if="isReloadReceivedShare")
    outer-footer
transition(name="sticker-drawer")
  sticker-drawer-for-login(v-if="isStickerDrawerForLoginOpen")
transition(name="sticker-drawer")
  sticker-drawer(v-if="isStickerDrawerOpen")
</template>

<script setup>
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import OuterFooter from '@/components/outerApp/OuterFooter.vue'
import { useStore } from 'vuex'
import { computed, ref, onMounted } from 'vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import { SHARING_FROM } from '@/utils/constants'
import DropdownLocale from '@/components/common/DropdownLocale.vue'
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import StickerDrawerForLogin from '@/components/sticker/StickerDrawerForLogin.vue'
import { toYYYYMMDDFormat } from '@frontier/utils'

const store = useStore()
const { saveReceivedShare } = useReceivedShare()

const isReloadReceivedShare = computed(
  () => store.getters['receivedShare/isReload']
)
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

const hasLogin = computed(() => store.getters['receivedShare/hasLogin'])
const hasSelectedStickerAddFromOG = computed(
  () => store.getters['receivedShare/hasSelectedStickerAddFromOG']
)
const isStickerDrawerOpen = computed(
  () => store.getters['sticker/isStickerDrawerOpen']
)
const isStickerDrawerForLoginOpen = computed(
  () => store.getters['sticker/isStickerDrawerForLoginOpen']
)

onMounted(async () => {
  if (
    hasLogin.value &&
    isStickerDrawerForLoginOpen.value &&
    !hasSelectedStickerAddFromOG.value
  ) {
    store.commit('sticker/SET_isStickerDrawerForLoginOpen', false)
    // 檢查是否有選擇過組織
    setTimeout(() => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-choose-sticker-add-from',
        properties: {
          actionHandler: async (orgNo) => {
            store.dispatch('helper/openModalLoading')
            await store.dispatch('organization/getOrg', { orgNo })
            store.commit('receivedShare/SET_hasSelectedStickerAddFromOG', true)
            store.dispatch('receivedShare/reload')
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
            store.dispatch('helper/closeModalLoading')
          },
        },
      })
    }, 0)
  }
})
</script>
