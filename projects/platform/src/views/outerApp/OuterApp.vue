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
main(class="flex flex-col h-full")
  router-view(name="header" class="rwd-app-padding-x shrink-0")
  div(class="flex-grow overflow-y-auto rwd-app-padding-x")
    router-view(v-slot="{ Component }")
      suspense
        component(:is="Component")
        template(#fallback)
          div(class="h-full flex justify-center items-center")
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
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { useFilterStore } from '@/stores/filter'
import useLogSender from '@/composables/useLogSender'
import { useOuterStore } from '@/stores/outer'

const props = defineProps<{
  sharingKey: string
}>()

const store = useStore()
const { getExternalFilterOption } = useFilterStore()
const outerStore = useOuterStore()
const logSender = useLogSender()
logSender.createReceivePageLog(props.sharingKey)

const isStickerDrawerOpen = computed<boolean>(
  () => store.getters['sticker/isStickerDrawerOpen']
)
const isStickerDrawerForLoginOpen = computed<boolean>(
  () => store.getters['sticker/isStickerDrawerForLoginOpen']
)

onMounted(async () => {
  await outerStore.checkHasLogin()
  getExternalFilterOption()

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
