<template lang="pug">
f-tooltip(@click.stop="openStickerDrawer")
  template(#trigger)
    div(
      class="relative cursor-pointer w-12 h-7.5 rounded border border-grey-150 hover:bg-grey-100 text-grey-600 flex items-center justify-center gap-x-2"
      :class="[isHover ? 'bg-grey-0' : 'bg-grey-0/80']"
    )
      f-svg-icon(iconName="sticker_thread" size="20")
      span(class="text-caption") {{ digitalThreadQty }}
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

const openStickerDrawer = () => {
  const routePath = route.path
  let addFromLocationType

  if (routePath.includes('public-library')) {
    addFromLocationType = 1
  } else if (routePath.includes('assets')) {
    addFromLocationType = 2
  } else if (routePath.includes('workspace')) {
    addFromLocationType = 3
  } else if (routePath.includes('moodboard')) {
    addFromLocationType = 4
  } else if (routePath.includes('share-to-me')) {
    addFromLocationType = 5
  } else if (routePath.includes('received-share')) {
    addFromLocationType = 6
  }

  store.dispatch('sticker/openStickerDrawer', {
    materialId,
    addFromLocationList: props.stickerAddFromLocationList,
    addFromLocationType,
  })
}
</script>
