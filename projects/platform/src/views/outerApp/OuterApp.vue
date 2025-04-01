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
private-view-layer(v-if="isPrivate && !hasVerified")
main(v-else class="flex flex-col h-full")
  div(class="rwd-app-padding-x shrink-0")
    router-view(v-if="isReady" name="header")
  div(class="flex-grow overflow-y-auto rwd-app-padding-x")
    router-view(v-if="isReady" v-slot="{ Component }")
      suspense
        component(:is="Component")
        template(#fallback)
          div(class="h-full flex justify-center items-center" data-cy="loading-indicator")
            f-svg-icon(iconName="loading" size="92" class="text-primary-500")
  footer(class="w-full h-13 bg-grey-50 shadow-4 shrink-0 rwd-app-padding-x")
    div(
      class="h-full mx-auto w-full rwd-outer-external-container flex items-center justify-end"
    )
      a(href="https://www.frontier.cool/" target="_blank" class="flex items-center")
        img(
          src="@/assets/images/frontier_logo.png"
          class="w-14 object-contain md:w-20.5 h-4 mr-2"
        )
        p(class="text-caption text-grey-900") {{ $t('GG0004') }}
  transition(name="sticker-drawer")
    sticker-drawer-for-login(v-if="isStickerDrawerForLoginOpen")
  transition(name="sticker-drawer")
    sticker-drawer(v-if="isStickerDrawerOpen")
</template>

<script setup lang="ts">
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import StickerDrawerForLogin from '@/components/sticker/StickerDrawerForLogin.vue'
import PrivateViewLayer from '@/components/outerApp/PrivateViewLayer.vue'
import { useStore } from 'vuex'
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useFilterStore } from '@/stores/filter'
import { useUserStore } from '@/stores/user'
import { useOuterStore } from '@/stores/outer'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { OUTER_TYPE } from '@/utils/constants'

const route = useRoute()
const store = useStore()
const { getExternalFilterOption } = useFilterStore()
const userStore = useUserStore()
const outerStore = useOuterStore()
const { isPrivate, hasVerified, outerType } = storeToRefs(outerStore)
const isReady = ref(false)

const isStickerDrawerOpen = computed<boolean>(
  () => store.getters['sticker/isStickerDrawerOpen']
)
const isStickerDrawerForLoginOpen = computed<boolean>(
  () => store.getters['sticker/isStickerDrawerForLoginOpen']
)

outerStore.setOuterType(route.meta.outerType as OUTER_TYPE)
userStore.checkHasLogin()
getExternalFilterOption()

onBeforeMount(async () => {
  const sharingKey = route.params.sharingKey as string
  if ([OUTER_TYPE.RECEIVED_SHARE, OUTER_TYPE.EMBED].includes(outerType.value)) {
    await outerStore.checkIsPrivate(sharingKey)
  }
  isReady.value = true
})

onMounted(async () => {
  if (route.query.open3d === 'true') {
    const currentPage = document.querySelector(
      `[nodeid="${route.params.nodeId}"]`
    ) as HTMLElement
    if (currentPage) {
      currentPage.style.backgroundColor = 'black'
      // hide all child
      Array.from(currentPage.children).forEach((child) => {
        child.remove()
      })
    }
  }
  if (isStickerDrawerForLoginOpen.value) {
    /**
     * 如果 isStickerDrawerForLoginOpen 為 true，表示之前呼叫過 sticker/openStickerDrawerForLogin
     * 所以 sticker/material, sticker/drawerOpenFromLocationList, sticker/drawerOpenFromLocationType 一定有值
     */
    store.commit('sticker/SET_isStickerDrawerForLoginOpen', false)
    store.dispatch('sticker/preOpenStickerDrawer', {
      material: store.getters['sticker/material'],
      drawerOpenFromLocationList:
        store.getters['sticker/drawerOpenFromLocationList'],
    })
  }
})

// For embed page
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
</script>
