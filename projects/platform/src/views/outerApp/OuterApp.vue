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
  div(class="flex-grow mx-auto max-w-[1032px] w-full min-w-[737px] flex flex-col")
    router-view(name="header")
    div(class="flex-grow")
      router-view(v-slot="{ Component }")
        suspense
          component(:is="Component")
          template(#fallback)
            div(class="h-full flex justify-center items-center")
              f-svg-icon(iconName="loading" size="92" class="text-primary-500")
  footer(class="w-full h-13 bg-grey-50 shadow-4")
    div(
      class="h-full mx-auto max-w-[1032px] w-full min-w-[737px] flex items-center justify-end"
    )
      a(href="https://www.frontier.cool/" target="_blank" class="flex items-center")
        img(
          src="@/assets/images/frontier_logo.png"
          class="w-14 object-contain md:w-20.5 h-4 mr-2"
        )
        p(class="text-caption md:text-body2 text-grey-900") {{ $t('GG0004') }}
  transition(name="sticker-drawer")
    sticker-drawer-for-login(v-if="isStickerDrawerForLoginOpen")
  transition(name="sticker-drawer")
    sticker-drawer(v-if="isStickerDrawerOpen")
</template>

<script setup lang="ts">
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import StickerDrawerForLogin from '@/components/sticker/StickerDrawerForLogin.vue'
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import generalApi from '@/apis/general'

const store = useStore()

const isStickerDrawerOpen = computed<boolean>(
  () => store.getters['sticker/isStickerDrawerOpen']
)
const isStickerDrawerForLoginOpen = computed<boolean>(
  () => store.getters['sticker/isStickerDrawerForLoginOpen']
)

const hasLogin = ref(false)
const checkHasLogin = async () => {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    hasLogin.value = false
    return
  }

  const { data } = await generalApi.checkTokenStatus({
    accessToken,
  })
  hasLogin.value = data.result.status !== 1
}

onMounted(async () => {
  await checkHasLogin()

  if (hasLogin.value) {
    await store.dispatch('user/getUser')
  }
})
</script>
