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
div(class="flex flex-col h-full")
  f-banner(
    v-if="notify.isShowNotifyBanner"
    v-bind="notify.notifyBannerProps"
    class="flex-shrink-0"
    @close="notify.closeNotifyBanner"
  )
  div(class="flex-grow flex overflow-y-auto")
    router-view(name="sidebar")
    main(class="flex-grow relative")
      router-view(
        v-if="isReloadInnerApp"
        :key="$route.name + $route.path"
        v-slot="{ Component }"
        class="overflow-y-auto"
      )
        suspense
          component(:is="Component")
          template(#fallback)
            div(class="h-full flex justify-center items-center")
              f-svg-icon(iconName="loading" size="92" class="text-primary-500")
      notify-bar-buffer(
        v-if="isInInnerApp && planStatus.BUFFER"
        :key="$route.params.orgNo"
        class="absolute bottom-0 left-0 z-100"
      )
    transition
      sticker-drawer(v-if="isStickerDrawerOpen")
</template>

<script>
export default {
  name: 'InnerAppLayout',
}
</script>

<script setup>
import { setOptions, bootstrap } from 'vue-gtag'
import { useStore } from 'vuex'
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import { useNotifyStore } from '@/stores/notify'

const NotifyBarBuffer = defineAsyncComponent(() =>
  import('@/components/billings/NotifyBarBuffer.vue')
)

const notify = useNotifyStore()
const store = useStore()
const route = useRoute()
const isReloadInnerApp = computed(
  () => store.getters['helper/isReloadInnerApp']
)
const planStatus = computed(() => store.getters['polling/planStatus'])
const isInInnerApp = computed(() =>
  route.matched.some((r) => r.name === 'InnerAppRoot')
)
const user = computed(() => store.getters['user/user'])
const isStickerDrawerOpen = computed(
  () => store.getters['sticker/isStickerDrawerOpen']
)

onMounted(() => {
  if (isInInnerApp.value && user.value.isShowAnnouncement) {
    store.dispatch('helper/pushModal', { component: 'modal-announcement' })
  }
})

onBeforeRouteUpdate(async (to, from) => {
  const isFromGroup = 'groupId' in from.params
  const isToGroup = 'groupId' in to.params
  if (isFromGroup && isToGroup && from.params.groupId !== to.params.groupId) {
    await store.dispatch('group/getGroup', { groupId: to.params.groupId })
    await store.dispatch('group/groupUser/getGroupUser')
  }
})

/** GA */
setOptions({
  config: {
    id: import.meta.env.VITE_APP_GA_MEASUREMENT_ID,
    params: {
      user_id: user.value.email,
    },
  },
})
bootstrap()
</script>
