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
div(class="h-full flex overflow-x-hidden")
  sidebar
  main(class="flex-grow relative flex flex-col")
    router-view(
      v-if="isReloadInnerApp"
      :key="$route.name + $route.path"
      v-slot="{ Component }"
      class="overflow-y-auto flex-grow"
    )
      suspense
        component(:is="Component")
        template(#fallback)
          div(class="h-full flex justify-center items-center" data-cy="loading-indicator")
            f-svg-icon(iconName="loading" size="92" class="text-primary-500")
    notify-bar-buffer(
      v-if="isInInnerApp && planStatus.BUFFER"
      :key="$route.params.orgNo"
      class="flex-shrink-0"
    )
    modal-announcement(v-if="isInInnerApp && user.isShowAnnouncement")
  transition
    sticker-drawer(v-if="isStickerDrawerOpen")
</template>

<script lang="ts">
export default {
  name: 'InnerAppLayout',
}
</script>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, defineAsyncComponent, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import useNavigation from '@/composables/useNavigation'
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import { useFilterStore } from '@/stores/filter'
import { OgType } from '@frontier/platform-web-sdk'

const NotifyBarBuffer = defineAsyncComponent(
  () => import('@/components/billings/NotifyBarBuffer.vue')
)
const ModalAnnouncement = defineAsyncComponent(
  () => import('@/components/common/ModalAnnouncement.vue')
)

const store = useStore()
const filterStore = useFilterStore()
const { isInInnerApp, ogId, ogType } = useNavigation()
const isReloadInnerApp = computed(
  () => store.getters['helper/isReloadInnerApp']
)
const planStatus = computed(() => store.getters['polling/planStatus'])
const user = computed(() => store.getters['user/user'])
const isStickerDrawerOpen = computed(
  () => store.getters['sticker/isStickerDrawerOpen']
)

onBeforeRouteUpdate(async (to, from) => {
  if (
    to.params.ogKey &&
    from.params.ogKey &&
    to.params.ogKey !== from.params.ogKey
  ) {
    const [ogType, ogId] = (to.params.ogKey as string).split('-')
    if (Number(ogType) === OgType.GROUP) {
      await store.dispatch('group/getGroup', {
        groupId: Number(ogId),
      })
      await store.dispatch('group/groupUser/getGroupUser')
    }
  }
})

watch(
  () => ogId.value + ogType.value,
  () => {
    isInInnerApp.value && filterStore.getInternalFilterOption()
  },
  {
    immediate: true,
  }
)
</script>
