<template lang="pug">
div
  div(class="flex items-center pb-3 text-primary")
    h5(class="text-h5 font-bold") {{ $t("RR0132") }}
  div(v-if="status === U3M_STATUS.COMPLETED" class="inline-flex text-body2 text-assist-blue gap-2")
    span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(zipUrl)") {{ $t("EE0081") }}
      svg-icon(iconName="u3m_download" size="20")
    span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(u3maUrl)") {{ $t("EE0082") }}
      svg-icon(iconName="u3m_download" size="20")
  btn(size="md" class="mt-2" @click="handleClick") {{ $t("UU0006") }}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { toRefs } from 'vue'
import { U3M_STATUS } from '@/utils/constants'
import { downloadDataURLFile } from '@/utils/fileOperator'

export default {
  name: 'BlockMaterialExternalU3mStatus',
  props: {
    material: {
      type: Object,
      required: true
    },
    isCanDownloadU3M: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const { status, zipUrl, u3maUrl, baseImgUrl, normalImgUrl, dpi } = toRefs(props.material.u3m)
    const { COMPLETED } = U3M_STATUS

    const downloadU3m = async (url) => {
      await store.dispatch('user/getUser')
      if (!props.isCanDownloadU3M) {
        store.dispatch('helper/openModalConfirm', {
          title: t('II0003'),
          content: t('II0004'),
          primaryText: t('UU0031')
        })
      } else {
        const fileName = url.split('/')[url.split('/').length - 1]
        downloadDataURLFile(url, fileName)
      }
    }

    const handleClick = () => {
      status.value === COMPLETED
        ? openModalViewer()
        : store.dispatch('helper/openModalConfirm', {
          title: t('II0005'),
          content: t('II0006'),
          primaryText: t('UU0031')
        })
    }

    const openModalViewer = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-viewer',
        header: t('UU0006'),
        properties: {
          dpi: dpi?.value,
          baseImgUrl: baseImgUrl?.value,
          normalImgUrl: normalImgUrl?.value
        }
      })
    }

    return {
      status,
      U3M_STATUS,
      zipUrl,
      u3maUrl,
      downloadU3m,
      handleClick
    }
  }
}
</script>
