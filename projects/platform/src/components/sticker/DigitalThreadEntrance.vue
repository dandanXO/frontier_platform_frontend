<template lang="pug">
f-tooltip(@click.stop="openStickerDrawer")
  template(#trigger)
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
  template(#content)
    p {{ $t('TT0001') }}
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { LOCATION_TYPE } from '@/utils/constants.js'
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
  stickerAddFromLocationList: {
    type: Array,
    required: true,
  },
})

const { digitalThreadQty, digitalThreadHasUnread, materialId } = props.material

const currentMaterialId = computed(
  () => store.getters['sticker/currentMaterialId']
)

const openStickerDrawer = () => {
  const routePath = route.path
  let addFromLocationType

  if (routePath.includes('public-library')) {
    addFromLocationType = LOCATION_TYPE.PUBLIC
  } else if (routePath.includes('assets')) {
    addFromLocationType = LOCATION_TYPE.ASSETS
  } else if (routePath.includes('workspace')) {
    addFromLocationType = LOCATION_TYPE.WORKSPACE
  } else if (routePath.includes('moodboard')) {
    addFromLocationType = LOCATION_TYPE.MOODBOARD
  } else if (routePath.includes('share-to-me')) {
    addFromLocationType = LOCATION_TYPE.SHARE_TO_ME
  } else if (routePath.includes('received-share')) {
    addFromLocationType = LOCATION_TYPE.RECEIVED_SHARE
  }

  store.dispatch('sticker/openStickerDrawer', {
    materialId,
    addFromLocationList: props.stickerAddFromLocationList,
    addFromLocationType,
  })
}
</script>
