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
div(class="h-full flex overflow-x-hidden w-screen")
  sidebar(class="flex-shrink-0")
  main(class="flex-grow flex flex-col min-w-0 relative")
    modal-pipeline
    router-view(
      v-if="isReloadInnerApp"
      :key="$route.name?.toString() + $route.path"
      v-slot="{ Component }"
      class="overflow-y-auto flex-grow"
    )
      suspense
        component(:is="Component")
        template(
          #fallback
          v-if="!$route.matched.some((r) => r.name === 'Assets')"
        )
          div(class="h-full flex justify-center items-center" data-cy="loading-indicator")
            f-svg-icon(iconName="loading" size="92" class="text-primary-500")
    notify-bar-buffer(
      v-if="isInInnerApp && planStatus.BUFFER"
      :key="String($route.params.orgNo)"
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
import { storeToRefs } from 'pinia'
import { debounce } from 'debounce'
import { useI18n } from 'vue-i18n'

import Sidebar from '@/components/sidebar/Sidebar.vue'
import useNavigation from '@/composables/useNavigation'
import StickerDrawer from '@/components/sticker/StickerDrawer.vue'
import { useFilterStore } from '@/stores/filter'
import { OgType } from '@frontier/platform-web-sdk'
import { useSearchStore } from '@/stores/search'
import { ROUTE_NAMES } from '@/utils/routes'
import ModalSearchByImage from '@/components/common/ModalSearchByImage.vue'

const NotifyBarBuffer = defineAsyncComponent(
  () => import('@/components/billings/NotifyBarBuffer.vue')
)
const ModalAnnouncement = defineAsyncComponent(
  () => import('@/components/common/ModalAnnouncement.vue')
)
const store = useStore()
const { t } = useI18n()
const route = useRoute()
const filterStore = useFilterStore()
const searchStore = useSearchStore()
const { keyword } = storeToRefs(searchStore)
const { isInInnerApp, ogId, ogType } = useNavigation()
const isReloadInnerApp = computed(
  () => store.getters['helper/isReloadInnerApp']
)

const planStatus = computed(() => store.getters['polling/planStatus'])
const user = computed(() => store.getters['user/user'])
const isStickerDrawerOpen = computed(
  () => store.getters['sticker/isStickerDrawerOpen']
)
const debounceSearchAITag = debounce(searchStore.getAITags, 300)

const typing = (e: Event) => {
  const target = e.target as HTMLInputElement
  const v = target.value
  searchStore.setKeyword(v)
  if (v.trim() === '') {
    searchStore.setTagList([])
    searchStore.setSelectedTagList([])
    return
  }
  debounceSearchAITag()
}

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

const showSearchByImageModal = () => {
  store.dispatch('helper/pushModalCommon', {
    body: ModalSearchByImage,
    classModal: 'w-128',
    theme: 'new',
    title: t('RR0483'),
    onClose: () => {
      store.dispatch('helper/closeModal')
    },
    properties: {
      onFinish: (file: File) => {
        filterStore.setImageFileURL(URL.createObjectURL(file))
        searchStore.onSubmit()
        store.dispatch('helper/closeModal')
      },
    },
  })
}

const isNewSearch = computed(() => route.name === ROUTE_NAMES.ASSETS)

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
