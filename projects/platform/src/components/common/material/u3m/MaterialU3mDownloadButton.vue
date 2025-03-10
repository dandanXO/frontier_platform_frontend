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
      ) {{ $t('RR0303') }}
      f-svg-icon(
        iconName="arrow_down"
        :class="[isExpand ? 'text-primary-500' : 'text-grey-600', { '!text-grey-250': disabled }]"
      )
  template(#content="{ collapsePopper }")
    f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
</template>

<script setup lang="ts">
import { U3M_DOWNLOAD_PROP } from '@/utils/constants'
import type { MenuTree } from '@frontier/ui-component'
import { MaterialU3mStatus } from '@frontier/platform-web-sdk'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isMultiple: boolean
  status: MaterialU3mStatus
  hasPhysicalData: boolean
  hasZfab?: boolean
}>()

const emit = defineEmits<{
  (e: 'download', format: U3M_DOWNLOAD_PROP): void
}>()

const { t } = useI18n()

const disabled = computed(() => props.status !== MaterialU3mStatus.COMPLETED)

const menuTree = computed<MenuTree>(() => ({
  blockList: [
    {
      menuList: (() => {
        const menuList = [
          {
            title: t('UU0005'),
            format: U3M_DOWNLOAD_PROP.U3M,
          },
          {
            title: t('UU0058'),
            format: U3M_DOWNLOAD_PROP.U3MA,
          },
          {
            title: t('UU0129'),
            format: U3M_DOWNLOAD_PROP.GLTF,
          },
        ]

        if (props.hasZfab) {
          menuList.push({
            title: t('UU0189'),
            format: U3M_DOWNLOAD_PROP.ZFAB,
          })
        }

        return menuList.map((item) => ({
          title: item.title,
          display: 'block',
          description: (() => {
            if (item.format === U3M_DOWNLOAD_PROP.GLTF) {
              if (props.isMultiple) {
                return t('RR0284')
              }
              return props.hasPhysicalData ? t('RR0285') : t('RR0286')
            }

            if (props.isMultiple) {
              return t('RR0283')
            }
            return props.hasPhysicalData ? t('RR0282') : t('RR0281')
          })(),
          descriptionLineClamp: 2,
          clickHandler: () => {
            emit('download', item.format)
          },
        }))
      })(),
    },
  ],
}))
</script>
