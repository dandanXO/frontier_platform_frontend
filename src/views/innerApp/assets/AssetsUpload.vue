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
          div(class="flex items-center gap-x-1")
            qr-code-backside-general
              template(#activator="{ generatePdf }")
                span(class='text-assist-blue underline cursor-pointer' @click="generatePdf") {{$t('UU0007')}}
            tooltip(placement='right')
              template(#trigger)
                svg-icon(iconName="info_outline" size="14" class="text-primary")
              template(#content)
                div(class='w-75 p-5')
                  img(:src='require("@/assets/images/print-back-side.png")')
                  p(class='mt-5 text-primary text-body2 line-height-1.6') {{$t('DD0010')}}
      div(class="flex gap-x-7.5 text-primary")
        h5(class="text-h5 font-bold whitespace-nowrap") {{$t('DD0005')}}
        p(class="text-body2 line-height-1.6") {{$t('DD0006')}}
  div(class="pt-30 pl-30.5 flex gap-x-25")
    div(class="w-83.5")
      h3(class='text-h3 text-primary pb-5') {{$t('DD0007')}}
      p(class="text-body1 text-primary line-height-1.6") {{$t('DD0008')}}
    div(class='flex flex-col gap-y-8')
      div
        btn(size="md" @click="goToAssetsMaterialCreate") {{$t('UU0008')}}
      div(class="flex gap-x-7.5")
        btn(size='md' type="secondary") {{$t('UU0009')}}
        div
          p(class="text-body2 text-black-900") {{$t('DD0009')}}
          div(class="flex items-center gap-x-1")
            a(v-if="locale === 'en-US'"
              target="_blank"
              class='text-assist-blue underline cursor-pointer'
              href="https://textile-dev.frontier.cool/Resource/MaterialExportTemplate/MassUploadFromat(英文版).xlsx"
            ) {{$t('UU0010')}}
            a(v-else
              target="_blank"
              class='text-assist-blue underline cursor-pointer'
              href="https://textile-dev.frontier.cool/Resource/MaterialExportTemplate/MassUploadFromat(中文版).xlsx"
            ) {{$t('UU0010')}}
            tooltip(placement='bottom')
              template(#trigger)
                svg-icon(iconName="info_outline" size="14" class="text-primary")
              template(#content)
                p(class='w-75 p-5 text-primary text-body2 line-height-1.6') {{$t('DD0011')}}
</template>

<script>
import useNavigation from '@/composables/useNavigation'
import QrCodeBacksideGeneral from '@/components/qrcode/QrCodeBacksideGeneral'
import { computed } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default {
  name: 'AssetsUpload',
  components: {
    QrCodeBacksideGeneral
  },
  setup () {
    const { t, locale } = useI18n()
    const store = useStore()
    const { parsePath, goToAssetsMaterialCreate } = useNavigation()
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const breadcrumbsList = computed(() => {
      const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
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
      return routeLocation.value === 'org'
        ? store.getters['organization/uploadMaterialEmail']
        : store.getters['group/uploadMaterialEmail']
    })

    return {
      locale,
      breadcrumbsList,
      uploadMaterialEmail,
      goToAssetsMaterialCreate
    }
  }
}
</script>
