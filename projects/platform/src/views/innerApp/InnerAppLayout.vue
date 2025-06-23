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
div(class="flex w-screen h-full overflow-x-hidden")
  sidebar(clas="flex-shrink-0")
  main(class="relative flex flex-col flex-grow min-w-0 bg-primary")
    modal-pipeline
    assets-header(v-if="$route.name === ROUTE_NAMES.ASSETS")
    router-view(
      v-if="isReloadInnerApp"
      :key="$route.name?.toString() + $route.path"
      v-slot="{ Component }"
      class="flex-grow overflow-y-auto"
    )
      suspense
        component(:is="Component")
        template(
          #fallback
          v-if="!$route.matched.some((r) => r.name === 'Assets')"
        )
          div(class="flex items-center justify-center h-full" data-cy="loading-indicator")
            f-svg-icon(iconName="loading" size="92" class="text-primary-500")
    notify-bar-buffer(
      v-if="isInInnerApp && planStatus.BUFFER"
      :key="$route.params.orgNo.toString()"
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
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

import Sidebar from '@/components/sidebar/Sidebar.vue'
import useNavigation from '@/composables/useNavigation'
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import AssetsHeader from '@/components/assets/AssetsHeader.vue'
import { useFilterStore } from '@/stores/filter'
import { OgType } from '@frontier/platform-web-sdk'
import { ROUTE_NAMES } from '@/utils/routes'

const NotifyBarBuffer = defineAsyncComponent(
  () => import('@/components/billings/NotifyBarBuffer.vue')
)
const ModalAnnouncement = defineAsyncComponent(
  () => import('@/components/common/ModalAnnouncement.vue')
)

const route = useRoute()
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
    } else {
      await store.dispatch('organization/orgUser/getOrgUser')
    }
  }
})

watch(
  () => ogId.value + ogType.value,
  () => {
    isInInnerApp.value && filterStore.getInternalFilterOption(route.path)
  },
  {
    immediate: true,
  }
)
</script>
