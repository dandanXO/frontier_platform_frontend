<style lang="scss">
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
transition(name="sticker-drawer")
  sticker-drawer-for-login(v-if="isStickerDrawerForLoginOpen")
transition(name="sticker-drawer")
  sticker-drawer(v-if="isStickerDrawerOpen")
router-view(v-if="isEmbedPageReload")
a(
  class="fixed z-footer bottom-0 w-full h-13 bg-grey-50 px-36 flex items-center justify-end shadow-4 border-t border-grey-150"
  href="https://www.frontier.cool/"
  target="_blank"
)
  img(src="@/assets/images/frontier_logo.png" class="w-20.5 h-4 mr-2")
  p(class="text-body2 text-grey-900") {{ $t('GG0004') }}
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import StickerDrawerForLogin from '@/components/sticker/StickerDrawerForLogin.vue'

window.onmessage = (e) => {
  if (e.origin + '/' !== document.referrer) {
    return false
  }

  const { method, params } = e.data

  if (method === 'setToken') {
    const { accessToken, refreshToken } = params
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  } else if (method === 'clearToken') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

const store = useStore()

const isStickerDrawerOpen = computed(
  () => store.getters['sticker/isStickerDrawerOpen']
)
const isStickerDrawerForLoginOpen = computed(
  () => store.getters['sticker/isStickerDrawerForLoginOpen']
)

const hasSelectedStickerAddFromOG = computed(
  () => store.getters['embed/hasSelectedStickerAddFromOG']
)

const isEmbedPageReload = computed(() => store.getters['embed/isReload'])

onMounted(async () => {
  const hasLogin = localStorage.getItem('accessToken') !== null
  if (
    hasLogin &&
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
            store.commit('embed/SET_hasSelectedStickerAddFromOG', true)
            store.dispatch('embed/reload')
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
