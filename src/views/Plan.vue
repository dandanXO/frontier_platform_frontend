<template lang="pug">
fullscreen-header
  template(#left)
    svg-icon(iconName="frontier-logo" size="special" class="w-34 h-6.5")
  template(#right)
    div(class="flex items-center")
      svg-icon(iconName="phone_in_talk" size="20" class="text-primary")
      p(class="text-body2 text-primary pl-1") +886-2-27528855
    div(class="flex items-center pl-5")
      svg-icon(iconName="email" size="20" class="text-primary")
      p(class="text-body2 text-primary pl-1") {{$t("RR0139")}}
  template(#content)
    div(class="w-260 mx-auto pb-25")
      div(class="text-center pt-22.5 pb-11")
        div
          h2(class="text-h2 font-bold text-brand") {{$t('LL0004')}}
          h2(class="text-h2 font-bold text-brand") {{$t('LL0005')}}
        div(class="pt-4")
          p(class="text-body2 text-primary line-height-1.6") {{$t('LL0006')}}
          p(class="text-body2 text-primary line-height-1.6") {{$t('LL0007')}}
      img(:src="require('@/assets/images/price_list.png')")
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'

export default {
  name: 'Plan',
  components: {
    FullscreenHeader
  }
}
</script>
