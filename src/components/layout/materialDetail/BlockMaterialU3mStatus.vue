<template lang="pug">
div
  div(class="flex items-center pb-3 text-primary")
    h5(class="text-h5 font-bold") {{$t('RR0132')}}
    tooltip(placement="top" class="pl-1" :manual='true')
      template(#trigger)
        svg-icon(iconName="info_outline" class='cursor-pointer' size="14")
      template(#content)
        div(class="p-5")
          span(class="text-body2 text-assist-blue underline line-height-1.6 cursor-pointer" @click="openModalCreate3DMaterial") {{$t('UU0029')}}

  template(v-if="status === U3M_STATUS.UNQUALIFIED")
    p(class="flex items-center text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}} : {{$t('EE0020')}}
      tooltip(placement="top" class="pl-1" :manual='true')
        template(#trigger)
          svg-icon(iconName="info_outline" class='cursor-pointer' size="14")
        template(#content)
          div(class="p-5 text-body2 line-height-1.6") {{$t('EE0021')}}
    btn(v-if="isEditPage" size="md" disabled) {{$t('UU0020')}}

  template(v-if="status === U3M_STATUS.INITIAL")
    p(class="text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}} : {{$t('EE0019')}}
    btn(v-if="isEditPage" size="md" @click="openModalCreate3DMaterial") {{$t('UU0020')}}

  template(v-if="status === U3M_STATUS.PROCESSING")
    p(class="text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}} : {{$t('EE0022')}}
    btn(v-if="isEditPage" size="md" disabled) {{$t('UU0020')}}

  template(v-if="status === U3M_STATUS.COMPLETED")
    p(class="text-body2 text-primary line-height-1.6 pb-2 flex flex-wrap items-center gap-2") {{$t('EE0017')}} : {{$t('EE0018')}}
      a(:href="zipUrl" class="flex items-center text-assist-blue underline cursor-pointer" download) {{$t('EE0081')}}
        svg-icon(iconName="u3m_download" size="20")
      a(:href="u3maUrl" target="_blank" class="flex items-center text-assist-blue underline cursor-pointer" download) {{$t('EE0082')}}
        svg-icon(iconName="u3m_download" size="20")
    btn(v-if="isEditPage" size="md") {{$t('UU0006')}}

  template(v-if="status === U3M_STATUS.FAIL")
    p(class="flex items-center text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}} : {{$t('EE0024')}}
      tooltip(placement="top" class="pl-1")
        template(#trigger)
          svg-icon(iconName="info_outline" size="14")
        template(#content)
          div(class="p-5 w-71")
            i18n-t(keypath="EE0023" tag="p")
              template(#email)
                span(class="text-assist-blue") support@frontier.cool
    btn(v-if="isEditPage" size="md" @click="openModalCreate3DMaterial") {{$t('UU0030')}}
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { U3M_STATUS } from '@/utils/constants'
import useAssets from '@/composables/useAssets'

export default {
  name: 'BlockMaterialU3mStatus',
  setup () {
    const route = useRoute()
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const { u3m: { status, zipUrl, u3maUrl } } = material.value
    const isEditPage = computed(() => route.path.includes('edit'))
    const { create3DMaterial } = useAssets()

    const openModalCreate3DMaterial = () => {
      create3DMaterial.func(material.value)
    }

    return {
      material,
      status,
      zipUrl,
      u3maUrl,
      U3M_STATUS,
      isEditPage,
      openModalCreate3DMaterial
    }
  }
}
</script>
