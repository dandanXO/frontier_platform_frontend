<template lang="pug">
f-popper(placement="bottom-start" :disabled="disabled" :offset="[0, -4]")
  template(#trigger="{ isExpand }")
    button(
      :disabled="disabled"
      class="outline-none rounded bg-grey-0 border flex items-center gap-x-2 px-3 py-1.5"
      :class="[isExpand ? 'border-primary-300 shadow-[0_0_0_4px_#E9F8F3]' : 'border-grey-200 hover:bg-grey-50 hover:border-grey-250 disabled:bg-grey-50 disabled:border-grey-200 disabled:cursor-not-allowed']"
    )
      f-svg-icon(
        iconName="download"
        :class="[disabled ? 'text-grey-250' : 'text-grey-900 cursor-pointer']"
      )

      p(
        class="text-body2/1.6"
        :class="[disabled ? 'text-grey-250 cursor-not-allowed' : 'text-grey-800 hover:text-grey-900 cursor-pointer']"
      ) {{ 'Download' }}
      f-svg-icon(
        iconName="arrow_down"
        :class="[isExpand ? 'text-primary-500' : 'text-grey-600', { '!text-grey-250': disabled }]"
      )
  template(#content="{ collapsePopper }")
    f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
</template>

<script setup lang="ts">
import { U3M_STATUS, U3M_DOWNLOAD_PROP } from '@/utils/constants'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useLogSender from '@/composables/useLogSender'
import { downloadDataURLFile } from '@frontier/utils'
import type { DownloadU3mPayload } from '@/types'

const props = withDefaults(
  defineProps<{
    materialId: number
    u3m: MaterialU3m | MaterialCustomU3m
    downloadHandler?: (payload: DownloadU3mPayload) => void
    isMultiple?: boolean
  }>(),
  {
    isMultiple: false,
  }
)

const { t } = useI18n()
const logSender = useLogSender()

const status = computed(() => props.u3m.status)
const disabled = computed(() => status.value !== U3M_STATUS.COMPLETED)

const menuTree = computed<MenuTree>(() => ({
  blockList: [
    {
      menuList: (() => {
        return [
          {
            title: t('UU0005'),
            url: props.u3m.zipUrl!,
            format: U3M_DOWNLOAD_PROP.U3M,
          },
          {
            title: t('UU0058'),
            url: props.u3m.u3maUrl!,
            format: U3M_DOWNLOAD_PROP.U3MA,
          },
          {
            title: t('UU0129'),
            url: props.u3m.gltfUrl!,
            format: U3M_DOWNLOAD_PROP.GLTF,
          },
        ].map((item) => ({
          title: item.title,
          display: 'block',
          description: (() => {
            if (item.format === U3M_DOWNLOAD_PROP.GLTF) {
              if (props.isMultiple) {
                return t('RR0284')
              }
              return props.u3m.hasPhysicalData ? t('RR0285') : t('RR0286')
            }

            if (props.isMultiple) {
              return t('RR0283')
            }
            return props.u3m.hasPhysicalData ? t('RR0282') : t('RR0281')
          })(),
          descriptionLineClamp: 2,
          clickHandler: () => {
            if (props.downloadHandler) {
              props.downloadHandler({
                materialId: props.materialId,
                url: item.url,
                format: item.format,
              })
            } else {
              const fileName =
                item.url.split('/')[item.url.split('/').length - 1]
              downloadDataURLFile(item.url, fileName)
              logSender.createDownloadLog(props.materialId, item.format)
            }
          },
        }))
      })(),
    },
  ],
}))
</script>
