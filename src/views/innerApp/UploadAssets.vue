<template lang="pug">
div(class="relative")
  breadcrumbs(:breadcrumbsList="breadcrumbsList" class="absolute top-7.5 left-7.5")
  div(class="pt-30 pb-30 pl-30.5 border-b border-black-400 flex gap-x-25")
    div(class="w-83.5")
      h3(class="text-h3 text-primary pb-5") {{$t('DD0001')}}
      p(class="text-body1 text-primary line-height-1.6") {{$t('DD0002')}}
    div(class="flex flex-col gap-y-7.5")
      div(class="flex gap-x-7.5")
        h5(class="text-h5 text-primary font-bold whitespace-nowrap") {{$t('DD0003')}}
        div(class="flex flex-col gap-y-2 text-primary")
          p(class="text-body2 line-height-1.6") {{$t('DD0004')}}
          p(class="text-body1 font-bold") {{uploadMaterialEmail}}
          a(class="text-assist-blue underline flex items-center gap-x-1") {{$t('reuse.printBackQRCode')}}
            svg-icon(iconName="info_outline" size="14" class="text-primary")
      div(class="flex gap-x-7.5 text-primary")
        h5(class="text-h5 font-bold whitespace-nowrap") {{$t('DD0005')}}
        p(class="text-body2 line-height-1.6") {{$t('DD0006')}}
  div(class="pt-30 pl-30.5 flex gap-x-25")
    div(class="w-83.5")
      h3(class='text-h3 text-primary pb-5') {{$t('DD0007')}}
      p(class="text-body1 text-primary line-height-1.6") {{$t('DD0008')}}
    div(class='flex flex-col gap-y-8')
      div
        btn(size="md" @click="openFullscreenMaterialUpload") {{$t('reuse.createFabric')}}
      div(class="flex gap-x-7.5")
        btn(size='md' type="secondary") {{$t('reuse.massUpdate')}}
        div
          p(class="text-body2 text-black-900") {{$t('DD0009')}}
          a(class="text-assist-blue underline flex items-center gap-x-1") {{$t('reuse.latestVersionForm')}}
            svg-icon(iconName="info_outline" size="14" class="text-primary")
</template>

<script>
import useNavigation from '@/composables/useNavigation'
import { computed } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default {
  name: 'UploadAssets',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const { location, parsePath } = useNavigation()
    const breadcrumbsList = computed(() => {
      const prefix = location.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
      return [
        {
          name: t('DD0044'),
          path: parsePath(`${prefix}/assets`)
        },
        {
          name: t('DD0045'),
          path: parsePath(`${prefix}/assets/upload`)
        }
      ]
    })

    const uploadMaterialEmail = computed(() => {
      return location.value === 'org'
        ? store.getters['organization/uploadMaterialEmail']
        : store.getters['group/uploadMaterialEmail']
    })

    const openFullscreenMaterialUpload = () => {
      store.dispatch('helper/openFullScreen', {
        component: 'material-upload'
      })
    }

    return {
      breadcrumbsList,
      uploadMaterialEmail,
      openFullscreenMaterialUpload
    }
  }
}
</script>
