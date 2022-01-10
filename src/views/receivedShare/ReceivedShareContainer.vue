<template lang="pug">
fullscreen-header
  template(#left)
    img(:src="logo" class="w-10 h-10 rounded-full")
    div(class="flex items-end pl-2")
      p(class="text-body1 font-bold text-primary pr-2.5") {{share.displayName}}
      p(class="text-caption text-black-700") {{$t('RR0148')}} {{$dayjs.unix(share.shareDate).format('YYYY/MM/DD')}}
  template(#right)
    div(class="relative pr-4")
      svg-icon(iconName="chat" size="24" class="text-black-700")
    btn(size="md") {{$t('UU0018')}}
  template(#content)
    router-view
    div(class="fixed z-index:footer bottom-0 w-full h-13 bg-black-100 px-36 flex items-center justify-end card-shadow")
      p(class="text-body2 text-primary") {{$t('GG0004')}}
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'ReceivedShareContainer',
  components: {
    FullscreenHeader
  },
  setup () {
    const store = useStore()
    const share = computed(() => store.getters['share/share'])
    const logo = computed(() => store.getters['share/logo'])

    return {
      share,
      logo
    }
  }
}
</script>
