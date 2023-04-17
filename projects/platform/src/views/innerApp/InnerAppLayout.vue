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
div(class="flex h-full")
  router-view(name="sidebar")
  main(class="flex-grow relative")
    router-view(
      v-if="isReloadInnerApp"
      :key="$route.name"
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
    modal-announcement(v-if="isInInnerApp && user.isShowAnnouncement")
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
import { computed, defineAsyncComponent } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
const NotifyBarBuffer = defineAsyncComponent(() =>
  import('@/components/billings/NotifyBarBuffer.vue')
)
const ModalAnnouncement = defineAsyncComponent(() =>
  import('@/components/common/ModalAnnouncement.vue')
)

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
