<template lang="pug">
div(class="flex justify-center pt-28.5")
  fullscreen-header(
    :title="$t('DD0012')"
    :primaryButton="false"
    :secondaryButton="false"
  )
  div(class="w-229 flex flex-col gap-y-7.5")
    div(class="flex gap-x-2.5 text-brand justify-center pb-2.5")
      svg-icon(iconName="check_circle_outline" size="24")
      p(class="text-body1 line-height-1.6") {{$t('DD0028')}}
    h4(class="text-h4 text-center text-primary") {{$t('DD0029')}}
    div(class="flex gap-x-12")
      div(class="w-100 flex flex-col gap-y-5")
        h6(class="text-h6 text-primary font-bold text-center") {{$t('DD0030')}}
        img(:src="require('@/assets/images/how_to_scan_left.png')")
        i18n-t(keypath="DD0032" tag="p" class="text-body2 text-primary line-height-1.6")
          template(#RR0062)
            span(class="text-assist-blue underline") {{$t('RR0062')}}
          template(#RR0061)
            span(class="text-assist-blue underline") {{$t('RR0061')}}
        div(class="flex flex-col gap-y-2")
          p(class="text-body2 text-primary line-height-1.6") {{$t('DD0004')}}
          p(class="text-body1 text-primary font-bold") {{uploadMaterialEmail}}
      p(class="text-h6 text-primary font-bold pt-34") or
      div(class="w-100 flex flex-col gap-y-5")
        h6(class="text-h6 text-primary font-bold text-center") {{$t('DD0031')}}
        img(:src="require('@/assets/images/how_to_scan_right.png')")
        div(class="flex flex-col gap-y-2")
          p(class="text-body2 text-primary line-height-1.6") {{$t('DD0004')}}
          p(class="text-body1 text-primary font-bold") {{uploadMaterialEmail}}
          span(class="text-body2 text-assist-blue underline line-height-1.6") {{$t('UU0007')}}
    btn(size="md" class="self-center" @click="close") {{$t('UU0023')}}
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  name: 'MaterialUploadSuccess',
  components: {
    FullscreenHeader
  },
  setup () {
    const store = useStore()
    const { goToAssets } = useNavigation()

    const uploadMaterialEmail = computed(() => {
      return store.getters['helper/routeLocation']
        ? store.getters['organization/uploadMaterialEmail']
        : store.getters['group/uploadMaterialEmail']
    })

    const close = () => {
      store.dispatch('helper/clearModalPipeline')
      goToAssets()
    }

    return {
      uploadMaterialEmail,
      close
    }
  }
}
</script>
