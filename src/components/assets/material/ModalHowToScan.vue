<template lang="pug">
div(class="w-245")
  div(class="border-t border-b border-black-400 px-8 py-5")
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
  div(class="h-25 flex justify-center items-center")
    btn(size="md" @click="close") {{$t('EE0018')}}
</template>

<script>
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'ModalHowToScan',
  setup () {
    const store = useStore()
    const { location } = useNavigation()

    const uploadMaterialEmail = computed(() => {
      return location.value === 'org'
        ? store.getters['organization/uploadMaterialEmail']
        : store.getters['group/uploadMaterialEmail']
    })

    const close = () => {
      store.dispatch('helper/closeModal')
    }

    return {
      close,
      uploadMaterialEmail
    }
  }
}
</script>
