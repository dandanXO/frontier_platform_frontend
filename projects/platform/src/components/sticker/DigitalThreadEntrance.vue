<template lang="pug">
f-tooltip-standard(
  @click.stop="openStickerDrawer"
  :tooltipMessage="$t('TT0001')"
)
  template(#slot:tooltip-trigger)
    div(
      class="relative cursor-pointer w-12 h-7.5 rounded border border-grey-150 hover:bg-grey-100 text-grey-600 flex items-center justify-center gap-x-2"
      :class="[isHover ? 'bg-grey-0' : 'bg-grey-0/80', { '!bg-primary-0 !text-primary-400': currentMaterialId === materialId }]"
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
import { LOCATION_TYPE } from '@/utils/constants'
import { computed } from 'vue'

const store = useStore()
const route = useRoute()

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
    drawerOpenFromLocationType = LOCATION_TYPE.PUBLIC
  } else if (routePath.includes('showroom')) {
    drawerOpenFromLocationType = LOCATION_TYPE.SHOWROOM
  } else if (routePath.includes('assets')) {
    drawerOpenFromLocationType = LOCATION_TYPE.ASSETS
  } else if (routePath.includes('workspace')) {
    drawerOpenFromLocationType = LOCATION_TYPE.WORKSPACE
  } else if (routePath.includes('moodboard')) {
    drawerOpenFromLocationType = LOCATION_TYPE.MOODBOARD
  } else if (routePath.includes('share-to-me')) {
    drawerOpenFromLocationType = LOCATION_TYPE.SHARE_TO_ME
  } else if (routePath.includes('received-share')) {
    drawerOpenFromLocationType = LOCATION_TYPE.RECEIVED_SHARE
  } else if (routePath.includes('embed')) {
    drawerOpenFromLocationType = LOCATION_TYPE.EMBED
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
    ![LOCATION_TYPE.RECEIVED_SHARE, LOCATION_TYPE.EMBED].includes(
      drawerOpenFromLocationType
    )
  ) {
    return openStickerDrawer()
  }

  if (drawerOpenFromLocationType === LOCATION_TYPE.RECEIVED_SHARE) {
    if (!store.getters['receivedShare/hasLogin']) {
      return openStickerDrawerForLogin()
    }

    const hasSelectedStickerAddFromOG =
      store.getters['receivedShare/hasSelectedStickerAddFromOG']
    if (hasSelectedStickerAddFromOG) {
      return openStickerDrawer()
    }

    return store.dispatch('helper/openModalBehavior', {
      component: 'modal-choose-sticker-add-from',
      properties: {
        actionHandler: async (orgNo) => {
          store.dispatch('helper/openModalLoading')
          await store.dispatch('organization/getOrg', { orgNo })
          store.commit('receivedShare/SET_hasSelectedStickerAddFromOG', true)
          store.dispatch('receivedShare/reload')
          await Promise.all([
            store.dispatch('organization/orgUser/getOrgUser'),
            openStickerDrawer(),
          ])
          store.dispatch('helper/closeModalLoading')
        },
      },
    })
  }

  if (drawerOpenFromLocationType === LOCATION_TYPE.EMBED) {
    if (localStorage.getItem('accessToken') === null) {
      return openStickerDrawerForLogin()
    }

    const hasSelectedStickerAddFromOG =
      store.getters['embed/hasSelectedStickerAddFromOG']
    if (hasSelectedStickerAddFromOG) {
      return openStickerDrawer()
    }

    await store.dispatch('user/getUser')
    return store.dispatch('helper/openModalBehavior', {
      component: 'modal-choose-sticker-add-from',
      properties: {
        actionHandler: async (orgNo) => {
          store.dispatch('helper/openModalLoading')
          await store.dispatch('organization/getOrg', { orgNo })
          store.commit('embed/SET_hasSelectedStickerAddFromOG', true)
          store.dispatch('embed/reload')
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
