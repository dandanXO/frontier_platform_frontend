<template lang="pug">
f-tooltip-standard(
  @click.stop="openStickerDrawer"
  :tooltipMessage="$t('TT0001')"
)
  template(#slot:tooltip-trigger)
    div(
      class="relative cursor-pointer w-12 h-7.5 rounded border border-grey-150 hover:bg-grey-100 text-grey-600 flex items-center justify-center gap-x-2"
      :class="[isHover ? 'bg-grey-0' : 'bg-grey-0/80', { '!bg-primary-50 !text-primary-400': currentMaterialId === materialId }]"
    )
      f-svg-icon(iconName="sticker_thread" size="20")
      span(class="text-caption font-bold") {{ digitalThreadQty }}
      div(
        v-if="digitalThreadHasUnread"
        class="w-2 h-2 rounded-full bg-primary-400 absolute -top-0.5 -right-0.5"
      )
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { FeatureType } from '@frontier/platform-web-sdk'
import { computed } from 'vue'
import { useOuterStore } from '@/stores/outer'

const store = useStore()
const route = useRoute()
const outerStore = useOuterStore()

const props = defineProps({
  isHover: {
    type: Boolean,
    default: false,
  },
  material: {
    type: Object,
    required: true,
  },
  drawerOpenFromLocationList: {
    type: Array,
    required: true,
  },
})

const { digitalThreadQty, digitalThreadHasUnread, materialId } = props.material

const currentMaterialId = computed(
  () => store.getters['sticker/currentMaterialId']
)

const openStickerDrawer = async () => {
  const routePath = route.path
  let drawerOpenFromLocationType

  if (routePath.includes('public-library')) {
    drawerOpenFromLocationType = FeatureType.PUBLIC_LIBRARY
  } else if (routePath.includes('showroom')) {
    drawerOpenFromLocationType = FeatureType.SHOWROOM
  } else if (routePath.includes('assets')) {
    drawerOpenFromLocationType = FeatureType.ASSET
  } else if (routePath.includes('workspace')) {
    drawerOpenFromLocationType = FeatureType.WORKSPACE
  } else if (routePath.includes('moodboard')) {
    drawerOpenFromLocationType = FeatureType.MOODBOARD
  } else if (routePath.includes('share-to-me')) {
    drawerOpenFromLocationType = FeatureType.SHARED_WITH_ME
  } else if (routePath.includes('received-share')) {
    drawerOpenFromLocationType = FeatureType.RECEIVED_SHARE
  } else if (routePath.includes('embed')) {
    drawerOpenFromLocationType = FeatureType.EMBED
  }

  const openStickerDrawer = () => {
    return store.dispatch('sticker/openStickerDrawer', {
      materialId,
      drawerOpenFromLocationList: props.drawerOpenFromLocationList,
      drawerOpenFromLocationType,
    })
  }

  const openStickerDrawerForLogin = () => {
    store.commit('sticker/SET_currentMaterialId', props.material.materialId)
    return store.dispatch('sticker/openStickerDrawerForLogin', {
      material: props.material,
      drawerOpenFromLocationList: props.drawerOpenFromLocationList,
      drawerOpenFromLocationType,
    })
  }

  if (
    ![FeatureType.RECEIVED_SHARE, FeatureType.EMBED].includes(
      drawerOpenFromLocationType
    )
  ) {
    return openStickerDrawer()
  }

  if (drawerOpenFromLocationType === FeatureType.RECEIVED_SHARE) {
    if (!outerStore.hasLogin) {
      return openStickerDrawerForLogin()
    }

    if (outerStore.hasSelectedStickerAddFromOG) {
      return openStickerDrawer()
    }

    return store.dispatch('helper/openModalBehavior', {
      component: 'modal-choose-sticker-add-from',
      properties: {
        actionHandler: async (orgNo) => {
          store.dispatch('helper/openModalLoading')
          await store.dispatch('organization/getOrg', { orgNo })
          outerStore.setHasSelectedStickerAddFromOG(true)
          await Promise.all([
            store.dispatch('organization/orgUser/getOrgUser'),
            openStickerDrawer(),
          ])
          store.dispatch('helper/closeModalLoading')
        },
      },
    })
  }

  if (drawerOpenFromLocationType === FeatureType.EMBED) {
    if (!outerStore.hasLogin) {
      return openStickerDrawerForLogin()
    }

    if (outerStore.hasSelectedStickerAddFromOG) {
      return openStickerDrawer()
    }

    await store.dispatch('user/getUser')
    return store.dispatch('helper/openModalBehavior', {
      component: 'modal-choose-sticker-add-from',
      properties: {
        actionHandler: async (orgNo) => {
          store.dispatch('helper/openModalLoading')
          await store.dispatch('organization/getOrg', { orgNo })
          outerStore.setHasSelectedStickerAddFromOG(true)
          await Promise.all([
            store.dispatch('organization/orgUser/getOrgUser'),
            openStickerDrawer(),
          ])
          store.dispatch('helper/closeModalLoading')
        },
      },
    })
  }
}
</script>
